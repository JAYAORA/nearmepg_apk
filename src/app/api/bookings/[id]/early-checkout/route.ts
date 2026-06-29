import { NextResponse } from "next/server";
import { db } from "@/app/api/_db/firebase-admin";
import { sendEarlyCheckoutEmail } from "@/lib/email";
import { createNotification } from "@/app/api/_db/notifications";

const bookingRequests = db.collection("booking_requests");
const propertyRooms = db.collection("property_rooms");
const users = db.collection("users");

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { actualCheckoutDate, reason } = body;

    const docRef = bookingRequests.doc(id);
    const bookingDoc = await docRef.get();

    if (!bookingDoc.exists) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    const bookingData = bookingDoc.data()!;
    const now = new Date().toISOString();
    const checkoutDate = actualCheckoutDate || now;

    const { roomId, bedId } = bookingData.room || {};
    const tenantId = bookingData.tenant_id;

    // Pre-fetch the room document reference OUTSIDE the transaction
    // (Firestore requires the collection query to happen outside, only doc reads inside)
    let roomDocRef: FirebaseFirestore.DocumentReference | null = null;
    if (roomId) {
      const roomSnap = await propertyRooms.where("id", "==", roomId).limit(1).get();
      if (!roomSnap.empty) {
        roomDocRef = roomSnap.docs[0].ref;
      }
    }

    // Firestore rule: ALL reads must come before ALL writes in a transaction
    await db.runTransaction(async (tx) => {
      // ── PHASE 1: READS ONLY ──────────────────────────────────────────────
      const bookingTxDoc = await tx.get(docRef);
      const roomTxDoc = roomDocRef ? await tx.get(roomDocRef) : null;
      const userDocRef = tenantId ? users.doc(tenantId) : null;
      const userTxDoc = userDocRef ? await tx.get(userDocRef) : null;

      // ── PHASE 2: WRITES ONLY ─────────────────────────────────────────────

      // 1. Update booking status
      if (bookingTxDoc.exists) {
        tx.update(docRef, {
          booking_status: "checked-out",
          "booking_details.actualEndDate": checkoutDate,
          "booking_details.earlyCheckoutReason": reason || "Tenant vacated early",
          "booking_details.checkoutProcessedAt": now,
          updated_at: now,
        });
      }

      // 2. Free the room or bed
      if (roomTxDoc && roomTxDoc.exists) {
        const roomData = roomTxDoc.data()!;
        if (bedId) {
          // PG bed: mark as available, clear tenant
          const beds: any[] = roomData.beds || [];
          const bedIdx = beds.findIndex((b: any) => String(b.id) === String(bedId));
          if (bedIdx !== -1) {
            beds[bedIdx].status = "available";
            beds[bedIdx].tenant_id = null;
            beds[bedIdx].reservedAt = null;
          }
          tx.update(roomDocRef!, { beds, updatedAt: now });
        } else {
          // Hotel room: mark whole room as available
          tx.update(roomDocRef!, {
            available: true,
            tenant_id: null,
            reservedAt: null,
            updatedAt: now,
          });
        }
      }

      // 3. Clear user profile
      if (userTxDoc && userTxDoc.exists) {
        const updates: Record<string, any> = {
          currentRoom: null,
          hostelId: null,
        };
        if (bedId) updates.currentBed = null;
        tx.update(userDocRef!, updates);
      }
    });

    // ── NOTIFICATIONS (Non-fatal) ──────────────────────────────────────────
    try {
      const tenantEmail = bookingData.tenant_email;
      const tenantName = bookingData.tenant_name || tenantEmail;
      const propertyName = bookingData.property?.hostelName || "the property";
      const bookingCode = bookingData.booking_code;

      if (tenantEmail) {
        await sendEarlyCheckoutEmail({
          to: tenantEmail,
          recipientName: tenantName,
          bookingCode,
          propertyName,
          actualCheckoutDate: checkoutDate,
        });
      }

      if (tenantId) {
        await createNotification({
          userId: tenantId,
          title: "Checkout Processed",
          message: `Your early checkout for ${propertyName} was successful.`,
          type: "info",
          actionUrl: "/account/bookings",
        });
      }
    } catch (notifErr) {
      console.error("Failed to send checkout notifications:", notifErr);
    }

    return NextResponse.json({
      success: true,
      message: "Early checkout processed. Room/bed freed and user profile cleared.",
      id,
    });
  } catch (error: any) {
    console.error("PATCH /api/bookings/[id]/early-checkout error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to process early checkout" },
      { status: 500 }
    );
  }
}
