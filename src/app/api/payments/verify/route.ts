import { NextResponse } from "next/server";
import { db } from "@/app/api/_db/firebase-admin";
import { validateWebhookSignature } from "razorpay/dist/utils/razorpay-utils";

const payments = db.collection("payments");
const bookingRequests = db.collection("booking_requests");

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, paymentId } = body;
    const bodyString = razorpay_order_id + "|" + razorpay_payment_id;

    const isValidSignature = validateWebhookSignature(
      bodyString,
      razorpay_signature,
      process.env.RAZORPAY_KEY_SECRET || "lvuz9dWZgc3jLgiCKyEq2700"
    );

    if (!isValidSignature) {
      return NextResponse.json({ success: false, message: "Invalid signature" }, { status: 400 });
    }

    const now = new Date().toISOString();
    
    const paymentUpdate = {
      status: "success",
      gateway_state: "CAPTURED",
      gateway_response: body,
      updated_at: now,
    };
    await payments.doc(paymentId).set(paymentUpdate, { merge: true });

    const paymentDoc = await payments.doc(paymentId).get();
    if (paymentDoc.exists) {
      const paymentData = paymentDoc.data()!;
      if (paymentData.booking_request_id) {
        await bookingRequests.doc(paymentData.booking_request_id).set(
          {
            payment_status: "success",
            booking_status: "checked-in",
            gateway_response: body,
            updated_at: now,
          },
          { merge: true }
        );
      }

      if (paymentData.room && paymentData.room.roomId) {
        const { roomId, bedId } = paymentData.room;
        const tenantId = paymentData.tenant_id;
        const hostelId = paymentData.property?.hostelId || null;
        
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
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("POST /api/payments/verify error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
