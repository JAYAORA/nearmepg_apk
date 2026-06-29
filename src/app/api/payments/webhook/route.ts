import { NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/app/api/_db/firebase-admin";
import {
  sendBookingConfirmationTenant,
  sendBookingNotificationOwner,
} from "@/lib/email";

const bookingRequests = db.collection("booking_requests");
const payments = db.collection("payments");
const authUsers = db.collection("auth_users");

/**
 * POST /api/payments/webhook
 *
 * Razorpay sends events here. Validates the webhook signature,
 * then updates booking + payment status accordingly.
 *
 * Set RAZORPAY_WEBHOOK_SECRET in .env.local
 */
export async function POST(req: Request) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-razorpay-signature") || "";
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET || "";

  // ── Signature verification ───────────────────────────────────────────────
  const expectedSig = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");

  if (expectedSig !== signature) {
    console.warn("Razorpay webhook: invalid signature");
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event = JSON.parse(rawBody);
  const eventType: string = event.event;
  const paymentEntity = event.payload?.payment?.entity;
  const orderId: string = paymentEntity?.order_id || "";

  console.log(`Razorpay webhook: ${eventType}, orderId: ${orderId}`);

  try {
    if (eventType === "payment.captured") {
      await handlePaymentCaptured(orderId, paymentEntity);
    } else if (eventType === "payment.failed") {
      await handlePaymentFailed(orderId, paymentEntity);
    }
    // Other events (refund, dispute, etc.) can be handled here in future

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("Webhook processing error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

async function handlePaymentCaptured(orderId: string, paymentEntity: any) {
  const now = new Date().toISOString();

  // Find booking by gateway order_id
  const bookingSnap = await bookingRequests
    .where("gateway.order_id", "==", orderId)
    .limit(1)
    .get();

  if (bookingSnap.empty) {
    console.warn(`No booking found for orderId: ${orderId}`);
    return;
  }

  const bookingDoc = bookingSnap.docs[0];
  const bookingData = bookingDoc.data();

  // Update booking status
  await bookingDoc.ref.update({
    booking_status: "checked-in",
    payment_status: "successful",
    "gateway.razorpay_payment_id": paymentEntity?.id,
    updated_at: now,
  });

  // Update payment record
  const paymentSnap = await payments
    .where("booking_request_id", "==", bookingDoc.id)
    .limit(1)
    .get();

  if (!paymentSnap.empty) {
    await paymentSnap.docs[0].ref.update({
      status: "successful",
      razorpay_payment_id: paymentEntity?.id,
      updated_at: now,
    });
  }

  // Send confirmation emails
  try {
    const tenantEmail = bookingData.tenant_email;
    const tenantName = bookingData.tenant_name || tenantEmail;
    const propertyName = bookingData.property?.hostelName || "your property";
    const roomName = bookingData.room?.roomName || bookingData.room?.roomId || "your room";
    const bedId = bookingData.room?.bedId;
    const checkIn = bookingData.booking_details?.checkIn || bookingData.checkIn;
    const checkOut = bookingData.booking_details?.checkOut || bookingData.checkOut;
    const amountPaid = bookingData.pricing_breakdown?.finalAmountPaid || 0;

    // Email to tenant
    if (tenantEmail) {
      await sendBookingConfirmationTenant({
        to: tenantEmail,
        tenantName,
        bookingCode: bookingData.booking_code,
        propertyName,
        roomName,
        bedId,
        checkIn,
        checkOut,
        amountPaid,
      });
    }

    // Email to owner — look up owner email from property
    const ownerEmail = bookingData.property?.owner_email;
    if (ownerEmail) {
      // Look up owner name
      const ownerSnap = await authUsers.where("email", "==", ownerEmail).limit(1).get();
      const ownerName = ownerSnap.empty
        ? "Property Owner"
        : ownerSnap.docs[0].data().displayName || "Property Owner";

      await sendBookingNotificationOwner({
        to: ownerEmail,
        ownerName,
        tenantName,
        tenantEmail,
        bookingCode: bookingData.booking_code,
        propertyName,
        roomName,
        checkIn,
        checkOut,
      });
    }
  } catch (emailErr) {
    console.error("Failed to send booking confirmation email:", emailErr);
    // Non-fatal — booking is still confirmed
  }
}

async function handlePaymentFailed(orderId: string, paymentEntity: any) {
  const now = new Date().toISOString();

  const bookingSnap = await bookingRequests
    .where("gateway.order_id", "==", orderId)
    .limit(1)
    .get();

  if (bookingSnap.empty) return;

  await bookingSnap.docs[0].ref.update({
    payment_status: "failed",
    booking_status: "cancelled",
    "gateway.failure_reason": paymentEntity?.error_description || "Payment failed",
    updated_at: now,
  });

  const paymentSnap = await payments
    .where("booking_request_id", "==", bookingSnap.docs[0].id)
    .limit(1)
    .get();

  if (!paymentSnap.empty) {
    await paymentSnap.docs[0].ref.update({
      status: "failed",
      failure_reason: paymentEntity?.error_description,
      updated_at: now,
    });
  }
}
