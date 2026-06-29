import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { db } from "@/app/api/_db/firebase-admin";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_SfqD1lkH1e4oRa",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "lvuz9dWZgc3jLgiCKyEq2700",
});

const payments = db.collection("payments");
const bookingRequests = db.collection("booking_requests");

function safeRound(value: any) {
  const number = Number(value || 0);
  if (!Number.isFinite(number)) return 0;
  return Math.round(number);
}

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

    if (!body?.tenantId) return NextResponse.json({ error: "Missing tenantId" }, { status: 400 });
    if (!body?.property?.hostelId || !body?.property?.hostelName) return NextResponse.json({ error: "Missing property details" }, { status: 400 });
    if (!body?.room?.roomId) return NextResponse.json({ error: "Missing room details" }, { status: 400 });
    if (!body?.pricingBreakdown?.finalAmountPaid) return NextResponse.json({ error: "Missing payment amount" }, { status: 400 });

    // ── KYC verification guard ───────────────────────────────────────────────
    // Prevent unverified users from initiating a booking/payment
    const userDoc = await db.collection("auth_users").doc(body.tenantId).get();
    if (!userDoc.exists || userDoc.data()?.aadhaarVerified !== true) {
      return NextResponse.json(
        { error: "KYC verification is required to make a booking. Please verify your Aadhaar in your profile." },
        { status: 403 }
      );
    }
    // ── End KYC guard ────────────────────────────────────────────────────────

    // ── Property verification guard ──────────────────────────────────────────
    const propertyDoc = await db.collection("hostels").doc(body.property.hostelId).get();
    if (!propertyDoc.exists || propertyDoc.data()?.verified === false) {
      return NextResponse.json(
        { error: "Cannot book an unverified property. Please wait for the admin to approve this listing." },
        { status: 403 }
      );
    }
    // ── End Property verification guard ──────────────────────────────────────

    // ── Booking conflict guard ───────────────────────────────────────────────
    // Block if tenant has an active booking whose checkout is after the new check-in
    const newCheckIn = body?.bookingDetails?.checkIn
      ? new Date(body.bookingDetails.checkIn)
      : new Date();

    const activeSnap = await bookingRequests
      .where("tenant_id", "==", body.tenantId)
      .get();

    for (const doc of activeSnap.docs) {
      const data = doc.data();
      const status = (data.booking_status || "").toLowerCase();
      if (status !== "checked-in" && status !== "pending") continue;

      // Get the checkout date from the booking document
      const existingCheckOut =
        data.checkOut ||
        data.booking_details?.checkOut ||
        data.booking_details?.actualEndDate ||
        null;

      if (!existingCheckOut) continue; // No checkout date — can't validate, skip

      const existingCheckOutDate = new Date(existingCheckOut);
      // Conflict: new check-in is before existing checkout
      if (newCheckIn < existingCheckOutDate) {
        const formattedDate = existingCheckOutDate.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
        const propertyName = data.property?.hostelName || "your current property";
        return NextResponse.json(
          {
            error: `You already have an active booking at ${propertyName}. You can only make a new booking after your checkout date: ${formattedDate}.`,
            activeBookingCheckout: existingCheckOut,
          },
          { status: 409 }
        );
      }
    }
    // ── End conflict guard ───────────────────────────────────────────────────

    const now = new Date().toISOString();
    const bookingRequestRef = bookingRequests.doc();
    const paymentRef = payments.doc();

    const bookingCode = `BR-${Date.now().toString(36).toUpperCase()}-${randomUUID().slice(0, 6).toUpperCase()}`;
    const amount = safeRound(body.pricingBreakdown.finalAmountPaid);
    const paymentType = body?.paymentConfig?.type || "full";
    const facilitatorUserId = body.facilitatedByUserId || body.ownerId || body.tenantId;

    const baseBooking = {
      booking_code: bookingCode,
      tenant_id: body.tenantId,
      tenant_email: body.tenantEmail || "",
      facilitator_user_id: facilitatorUserId,
      facilitated_by_role: body.facilitatedBy || "TENANT",
      property: body.property,
      room: body.room,
      booking_details: body.bookingDetails,
      coupon: body.coupon || null,
      payment_config: body.paymentConfig || null,
      pricing_breakdown: body.pricingBreakdown,
      currency: body.currency || "INR",
      amount_payable: amount,
      payment_status: "initiated",
      booking_status: "payment_pending",
      created_at: now,
      updated_at: now,
    };

    const basePayment = {
      booking_request_id: bookingRequestRef.id,
      booking_code: bookingCode,
      tenant_id: body.tenantId,
      tenant_email: body.tenantEmail || "",
      facilitator_user_id: facilitatorUserId,
      property: body.property,
      room: body.room,
      amount,
      currency: body.currency || "INR",
      status: "initiated",
      method: "PhonePe",
      payment_type: paymentType,
      coupon_code: body?.coupon?.code || null,
      created_at: now,
      updated_at: now,
    };

    let gatewayPayload: any = null;
    let gatewayError: any = null;

    try {
      const options = {
        amount: amount * 100, // paise
        currency: body.currency || "INR",
        receipt: paymentRef.id,
      };
      const order = await razorpay.orders.create(options);
      
      gatewayPayload = {
        merchantOrderId: order.id,
        state: "CREATED",
        amount: order.amount,
        currency: order.currency
      };
    } catch (error: any) {
      gatewayError = error?.message || "Payment gateway initiation failed";
    }

    const bookingPayload = {
      ...baseBooking,
      gateway: gatewayPayload
        ? {
            provider: "razorpay",
            order_id: gatewayPayload.merchantOrderId,
            state: gatewayPayload.state,
          }
        : {
            provider: "razorpay",
            order_id: paymentRef.id,
            state: "INITIATED_LOCALLY",
            error: gatewayError,
          },
    };

    const paymentPayload: any = {
      ...basePayment,
      method: "Razorpay",
      gateway_order_id: gatewayPayload?.merchantOrderId || paymentRef.id,
      gateway_state: gatewayPayload?.state || "INITIATED_LOCALLY",
    };
    paymentPayload.search_text = buildSearchText({
      ...paymentPayload,
      booking_code: bookingCode,
      tenant_email: bookingPayload.tenant_email,
    });

    await bookingRequestRef.set(bookingPayload);
    await paymentRef.set(paymentPayload);

    return NextResponse.json({
      success: true,
      bookingRequest: {
        id: bookingRequestRef.id,
        ...bookingPayload,
      },
      payment: {
        id: paymentRef.id,
        ...paymentPayload,
      },
      gatewayWarning: gatewayError,
    }, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/payments/initiate error:", error);
    return NextResponse.json({ error: error?.message || "Failed to create booking payment" }, { status: 500 });
  }
}
