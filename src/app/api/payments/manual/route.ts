import { NextResponse } from "next/server";
import { db } from "@/app/api/_db/firebase-admin";

const payments = db.collection("payments");
const bookingRequests = db.collection("booking_requests");

function buildSearchText(payload: any) {
  return [
    payload.booking_code,
    payload.tenant_email,
    payload.property?.hostelName,
    payload.property?.hostelId,
    payload.property?.location,
    payload.room?.roomName,
    payload.room?.roomId,
    payload.room?.bedId,
    payload.payment_type,
    payload.method,
    payload.status,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      bookingRequestId,
      amount,
      method,
      month,
      year,
      paymentDate,
      transactionId,
      comments,
      userId,
    } = body;

    if (!bookingRequestId || !amount || !method || !month || !year || !paymentDate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const bookingDoc = await bookingRequests.doc(bookingRequestId).get();
    if (!bookingDoc.exists) {
      return NextResponse.json({ error: "Booking request not found" }, { status: 404 });
    }

    const bookingData = bookingDoc.data()!;
    const now = new Date().toISOString();
    const paymentRef = payments.doc();
    
    const paymentPayload: any = {
      booking_request_id: bookingRequestId,
      booking_code: bookingData.booking_code,
      tenant_id: bookingData.tenant_id,
      tenant_email: bookingData.tenant_email || "",
      facilitator_user_id: bookingData.facilitator_user_id,
      property: bookingData.property,
      room: bookingData.room,
      amount: Number(amount),
      currency: "INR",
      status: "success",
      method: method, // "Cash", "Bank Transfer", "UPI"
      payment_type: "manual_rent",
      rent_month: month,
      rent_year: year,
      payment_date: paymentDate,
      transaction_id: transactionId || null,
      comments: comments || "",
      created_at: now,
      updated_at: now,
    };

    paymentPayload.search_text = buildSearchText({
      ...paymentPayload,
      tenant_email: bookingData.tenant_email,
    });

    await paymentRef.set(paymentPayload);

    const paidMonths = bookingData.paid_months || [];
    const monthKey = `${year}-${String(month).padStart(2, "0")}`;
    if (!paidMonths.includes(monthKey)) {
      paidMonths.push(monthKey);
    }

    await bookingRequests.doc(bookingRequestId).set(
      {
        paid_months: paidMonths,
        booking_status: "checked-in",
        updated_at: now,
      },
      { merge: true }
    );

    if (bookingData.room && bookingData.room.roomId) {
      const { roomId, bedId } = bookingData.room;
      const tenantId = bookingData.tenant_id;
      const hostelId = bookingData.property?.hostelId || null;
      
      const roomsRef = db.collection("property_rooms");
      const usersRef = db.collection("users");
      
      const querySnapshot = await roomsRef.where("id", "==", roomId).limit(1).get();
      if (!querySnapshot.empty) {
        const roomDocRef = querySnapshot.docs[0].ref;
        
        await db.runTransaction(async (transaction) => {
           const roomDoc = await transaction.get(roomDocRef);
           
           if (roomDoc.exists) {
              const roomData = roomDoc.data()!;
              if (bedId) {
                const beds = roomData.beds || [];
                const bedIndex = beds.findIndex((b: any) => String(b.id) === String(bedId));
                if (bedIndex !== -1) {
                   beds[bedIndex].status = "occupied";
                   beds[bedIndex].reservedAt = null;
                   beds[bedIndex].tenant_id = tenantId;
                   transaction.update(roomDocRef, { beds });
                }
              } else {
                transaction.update(roomDocRef, { 
                  available: false, 
                  reservedAt: null,
                  tenant_id: tenantId 
                });
              }
           }
           
           if (tenantId) {
             const userDocRef = usersRef.doc(tenantId);
             const profileUpdate: any = {
               role: "tenant",
               currentRoom: roomId,
               hostelId: hostelId,
               assignedAt: now
             };
             if (bedId) profileUpdate.currentBed = bedId;
             transaction.set(userDocRef, profileUpdate, { merge: true });
           }
        });
      }
    }

    return NextResponse.json({
      success: true,
      payment: {
        id: paymentRef.id,
        ...paymentPayload,
      },
      paid_months: paidMonths,
    }, { status: 201 });
  } catch (error: any) {
    console.error("Error recording manual payment:", error);
    return NextResponse.json({ error: error?.message || "Failed to record manual payment" }, { status: 500 });
  }
}
