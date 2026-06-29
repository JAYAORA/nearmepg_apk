import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { db } from "@/app/api/_db/firebase-admin";

const collection = db.collection("property_rooms");

export async function POST(req: Request, { params }: { params: Promise<{ firestoreId: string }> }) {
  const firestoreId = (await params).firestoreId;
  try {
    const body = await req.json();
    const { 
      bedId, tenantEmail, propertyId, propertyName,
      checkIn, checkOut, paymentMethod, paymentAmount, paymentDate, upiId
    } = body;
    
    if (!tenantEmail) {
      return NextResponse.json({ error: "Tenant email is required" }, { status: 400 });
    }

    const docRef = collection.doc(firestoreId);
    
    const docSnap = await docRef.get();
    if (!docSnap.exists) return NextResponse.json({ error: "Room not found" }, { status: 404 });
    const roomData = docSnap.data()!;

    const usersRef = db.collection("users");
    const userQuery = await usersRef.where("email", "==", tenantEmail.toLowerCase().trim()).limit(1).get();
    if (userQuery.empty) {
      return NextResponse.json({ error: "No registered user found with that email. The tenant must create an account first." }, { status: 404 });
    }
    const userDoc = userQuery.docs[0];
    const userData = userDoc.data();
    const tenantId = userDoc.id;

    const now = new Date().toISOString();

    // ── Booking conflict guard ───────────────────────────────────────────────
    const newCheckIn = checkIn ? new Date(checkIn) : new Date();

    const bookingRequestsRef = db.collection("booking_requests");
    const activeSnap = await bookingRequestsRef.where("tenant_id", "==", tenantId).get();

    for (const doc of activeSnap.docs) {
      const data = doc.data();
      const status = (data.booking_status || "").toLowerCase();
      if (status !== "checked-in" && status !== "pending") continue;

      const existingCheckOut =
        data.checkOut ||
        data.booking_details?.checkOut ||
        data.booking_details?.actualEndDate ||
        null;

      if (!existingCheckOut) continue; // No checkout date — can't validate, skip

      const existingCheckOutDate = new Date(existingCheckOut);
      if (newCheckIn < existingCheckOutDate) {
        const formattedDate = existingCheckOutDate.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
        const propertyName = data.property?.hostelName || "their current property";
        return NextResponse.json(
          {
            error: `Tenant already has an active booking at ${propertyName}. New booking must be after their checkout date: ${formattedDate}.`,
          },
          { status: 409 }
        );
      }
    }
    // ── End conflict guard ───────────────────────────────────────────────────

    await db.runTransaction(async (transaction) => {
      const roomTxDoc = await transaction.get(docRef);
      if (!roomTxDoc.exists) throw new Error("Room not found");
      const currentRoomData = roomTxDoc.data()!;

      if (bedId) {
        const beds = currentRoomData.beds || [];
        const bedIndex = beds.findIndex((b: any) => String(b.id) === String(bedId));
        if (bedIndex === -1) throw new Error("Bed not found");
        beds[bedIndex].status = "occupied";
        beds[bedIndex].reservedAt = null;
        beds[bedIndex].tenant_id = tenantId;
        transaction.update(docRef, { beds, updatedAt: now });
      } else {
        transaction.update(docRef, { 
          available: false, 
          reservedAt: null,
          tenant_id: tenantId,
          updatedAt: now
        });
      }

      const profileUpdate: any = {
        role: "tenant",
        currentRoom: currentRoomData.id,
        hostelId: propertyId,
        assignedAt: now
      };
      if (bedId) profileUpdate.currentBed = bedId;
      transaction.set(usersRef.doc(tenantId), profileUpdate, { merge: true });

      const bookingRef = bookingRequestsRef.doc();
      const bookingCode = `BR-M-${Date.now().toString(36).toUpperCase()}-${randomUUID().slice(0, 6).toUpperCase()}`;

      const propertyDoc = await transaction.get(db.collection("properties").doc(propertyId));
      let ownerEmail = "";
      if (propertyDoc.exists) {
        const propData = propertyDoc.data()!;
        ownerEmail = propData.owner_mail || propData.owner_email || "";
      }

      transaction.set(bookingRef, {
        booking_code: bookingCode,
        tenant_id: tenantId,
        tenant_name: userData.displayName || userData.name || "Unknown Tenant",
        tenant_email: tenantEmail,
        property: {
          hostelId: propertyId,
          hostelName: propertyName,
          owner_email: ownerEmail,
        },
        room: {
          roomId: currentRoomData.id,
          roomName: currentRoomData.name || currentRoomData.id,
          bedId: bedId || null
        },
        booking_status: "checked-in",
        payment_status: paymentAmount > 0 ? "successful" : "manual",
        checkIn: checkIn || now,
        checkOut: checkOut || null,
        pricing_breakdown: {
          finalAmountPaid: paymentAmount || 0,
        },
        payment_config: {
          type: "full", // Defaulting to full since it's manual
        },
        created_at: now,
        updated_at: now,
        assigned_by: "admin" // Track that it was manual
      });

      // Also create payment doc if amount > 0
      if (paymentAmount > 0) {
        const paymentsRef = db.collection("payments");
        const paymentRef = paymentsRef.doc();
        transaction.set(paymentRef, {
          booking_request_id: bookingRef.id,
          booking_code: bookingCode,
          tenant_id: tenantId,
          tenant_email: tenantEmail,
          property: {
            hostelId: propertyId,
            hostelName: propertyName,
          },
          room: {
            roomId: currentRoomData.id,
            roomName: currentRoomData.name || currentRoomData.id,
            bedId: bedId || null
          },
          amount: paymentAmount,
          currency: "INR",
          status: "successful", // manually confirmed
          method: paymentMethod || "manual",
          payment_type: "full",
          upi_id: upiId || null,
          payment_date: paymentDate || now,
          created_at: now,
          updated_at: now,
          search_text: [bookingCode, tenantEmail, propertyId, propertyName, paymentMethod].filter(Boolean).join(" ").toLowerCase()
        });
      }
    });

    return NextResponse.json({ success: true, message: "Tenant assigned successfully" });
  } catch (err: any) {
    console.error("POST /api/property-rooms/:id/assign error:", err);
    return NextResponse.json({ error: err.message || "Failed to assign tenant" }, { status: 500 });
  }
}
