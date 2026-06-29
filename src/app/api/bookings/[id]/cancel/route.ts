import { NextResponse } from "next/server";
import { db } from "@/app/api/_db/firebase-admin";
import { sendBookingCancelledEmail } from "@/lib/email";
import { createNotification } from "@/app/api/_db/notifications";

const bookingRequests = db.collection("booking_requests");
const propertyRooms = db.collection("property_rooms");
const users = db.collection("users");
const authUsers = db.collection("auth_users");

/**
 * POST /api/bookings/[id]/cancel
 *
 * Body: { cancelledBy: "tenant" | "owner", reason?: string }
 *
 * - Tenants can only cancel their own `pending` bookings
 * - Owners can reject `pending` bookings for their properties
 * - Refund: marked as "pending_owner_action" — owner manually marks it done
 */
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { cancelledBy, reason, requesterId } = body;

    if (!cancelledBy) {
      return NextResponse.json({ error: "cancelledBy is required" }, { status: 400 });
    }

    const docRef = bookingRequests.doc(id);
    const bookingDoc = await docRef.get();

    if (!bookingDoc.exists) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    const bookingData = bookingDoc.data()!;
    const status = (bookingData.booking_status || "").toLowerCase();

    // Only pending bookings can be cancelled
    if (status !== "pending") {
      return NextResponse.json(
        { error: `Cannot cancel a booking with status "${status}". Only pending bookings can be cancelled.` },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();
    const { roomId, bedId } = bookingData.room || {};
    const tenantId = bookingData.tenant_id;

    // Pre-fetch room doc reference for the transaction
    let roomDocRef: FirebaseFirestore.DocumentReference | null = null;
    if (roomId) {
      const roomSnap = await propertyRooms.where("id", "==", roomId).limit(1).get();
      if (!roomSnap.empty) roomDocRef = roomSnap.docs[0].ref;
    }

    // Firestore transaction: all reads first, then all writes
    await db.runTransaction(async (tx) => {
      // ── READS ───────────────────────────────────────────────────────────
      const bookingTxDoc = await tx.get(docRef);
      const roomTxDoc = roomDocRef ? await tx.get(roomDocRef) : null;
      const userDocRef = tenantId ? users.doc(tenantId) : null;
      const userTxDoc = userDocRef ? await tx.get(userDocRef) : null;

      // ── WRITES ──────────────────────────────────────────────────────────

      // 1. Cancel booking
      if (bookingTxDoc.exists) {
        tx.update(docRef, {
          booking_status: "cancelled",
          payment_status: "refund_pending_owner",
          cancellation: {
            cancelledBy,
            reason: reason || "No reason provided",
            cancelledAt: now,
          },
          // Refund simulation — owner needs to confirm offline
          refund_status: "pending_owner_action",
          updated_at: now,
        });
      }

      // 2. Free room/bed if it was reserved
      if (roomTxDoc && roomTxDoc.exists) {
        const roomData = roomTxDoc.data()!;
        if (bedId) {
          const beds: any[] = roomData.beds || [];
          const bedIdx = beds.findIndex((b: any) => String(b.id) === String(bedId));
          if (bedIdx !== -1 && beds[bedIdx].status === "reserved") {
            beds[bedIdx].status = "available";
            beds[bedIdx].tenant_id = null;
            beds[bedIdx].reservedAt = null;
          }
          tx.update(roomDocRef!, { beds, updatedAt: now });
        } else if (!roomData.available && roomData.tenant_id === tenantId) {
          tx.update(roomDocRef!, {
            available: true,
            tenant_id: null,
            reservedAt: null,
            updatedAt: now,
          });
        }
      }

      // 3. Clear user's pending room assignment if still pending
      if (userTxDoc && userTxDoc.exists) {
        tx.update(userDocRef!, {
          currentRoom: null,
          hostelId: null,
        });
      }
    });

    // Send cancellation emails (non-fatal)
    try {
      const tenantEmail = bookingData.tenant_email;
      const tenantName = bookingData.tenant_name || tenantEmail;
      const propertyName = bookingData.property?.hostelName || "the property";
      const bookingCode = bookingData.booking_code;
      const ownerEmail = bookingData.property?.owner_email;

      if (tenantEmail) {
        await sendBookingCancelledEmail({
          to: tenantEmail,
          recipientName: tenantName,
          bookingCode,
          propertyName,
          reason,
          cancelledBy,
        });
      }

      if (ownerEmail && ownerEmail !== tenantEmail) {
        const ownerSnap = await authUsers.where("email", "==", ownerEmail).limit(1).get();
        const ownerName = ownerSnap.empty ? "Property Owner" : ownerSnap.docs[0].data().displayName || "Property Owner";
        await sendBookingCancelledEmail({
          to: ownerEmail,
          recipientName: ownerName,
          bookingCode,
          propertyName,
          reason,
          cancelledBy,
        });
      }

      // Notifications
      if (tenantId) {
        await createNotification({
          userId: tenantId,
          title: "Booking Cancelled",
          message: `Your booking ${bookingCode} at ${propertyName} was cancelled.`,
          type: "warning",
          actionUrl: "/account/bookings",
        });
      }

      if (bookingData.property?.owner_id && bookingData.property.owner_id !== tenantId) {
        await createNotification({
          userId: bookingData.property.owner_id,
          title: "Booking Cancelled",
          message: `Booking ${bookingCode} by ${tenantName} was cancelled.`,
          type: "warning",
          actionUrl: "/owner/tenants",
        });
      }
    } catch (emailErr) {
      console.error("Cancel email failed (non-fatal):", emailErr);
    }

    return NextResponse.json({
      success: true,
      message: "Booking cancelled. If a refund is applicable, the owner will process it.",
      refund_status: "pending_owner_action",
    });
  } catch (err: any) {
    console.error("POST /api/bookings/[id]/cancel error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to cancel booking" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/bookings/[id]/cancel
 * Owner marks refund as processed (offline cash / bank transfer)
 * Body: { refundMethod?: string, refundNote?: string }
 */
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { refundMethod, refundNote } = body;

    const docRef = bookingRequests.doc(id);
    const bookingDoc = await docRef.get();

    if (!bookingDoc.exists) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    await docRef.update({
      refund_status: "refunded",
      payment_status: "refunded",
      "refund_details.method": refundMethod || "offline",
      "refund_details.note": refundNote || "",
      "refund_details.processedAt": new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, message: "Refund marked as processed." });
  } catch (err: any) {
    console.error("PATCH /api/bookings/[id]/cancel error:", err);
    return NextResponse.json({ error: err.message || "Failed" }, { status: 500 });
  }
}
