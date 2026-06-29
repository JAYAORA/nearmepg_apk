import { NextResponse } from "next/server";
import { db } from "@/app/api/_db/firebase-admin";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const ownerEmail = searchParams.get("email");
    const callerRole = (searchParams.get("role") || "").toLowerCase();

    if (!ownerEmail || (callerRole !== "pg_owner" && callerRole !== "hotel_owner")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // 1. Fetch properties owned by this owner
    const [snap1, snap2] = await Promise.all([
      db.collection("hostels").where("owner_email", "==", ownerEmail).get(),
      db.collection("hostels").where("owner_mail", "==", ownerEmail).get()
    ]);
    const propSet = new Set<string>();
    snap1.forEach(doc => propSet.add(doc.id));
    snap2.forEach(doc => propSet.add(doc.id));
    const propertyIds = Array.from(propSet);

    if (propertyIds.length === 0) {
      return NextResponse.json([]);
    }

    // 2. Build live user name map from auth_users (email is the canonical immutable key)
    const authUsersSnap = await db.collection("auth_users").get();
    const userNameMap: Record<string, string> = {};
    authUsersSnap.forEach((doc) => {
      const d = doc.data();
      const liveName = d.displayName || d.name || "";
      if (d.email && liveName) {
        userNameMap[d.email.toLowerCase()] = liveName;
      }
      if (liveName) {
        userNameMap[doc.id] = liveName;
      }
    });

    // Helper: resolve live name using email as canonical key, fall back to uid map
    function resolveName(tenantEmail?: string, tenantName?: string, tenantId?: string): string {
      const emailKey = tenantEmail ? tenantEmail.toLowerCase() : null;
      return (
        (emailKey ? userNameMap[emailKey] : null) ||
        (tenantId ? userNameMap[tenantId] : null) ||
        tenantName ||
        tenantEmail ||
        "Unknown"
      );
    }

    // Helper to chunk arrays
    const chunkArray = (arr: any[], size: number) => {
      const chunks = [];
      for (let i = 0; i < arr.length; i += size) {
        chunks.push(arr.slice(i, i + size));
      }
      return chunks;
    };

    const propertyIdChunks = chunkArray(propertyIds, 30);

    // 3. Fetch bookings/payments for these properties
    const bookingPromises = propertyIdChunks.map(chunk => 
      db.collection("bookings").where("property.hostelId", "in", chunk).get()
    );
    const requestsPromises = propertyIdChunks.map(chunk =>
      db.collection("booking_requests").where("property.hostelId", "in", chunk).get()
    );

    const [bookingsSnaps, requestsSnaps] = await Promise.all([
      Promise.all(bookingPromises),
      Promise.all(requestsPromises)
    ]);

    const bookingsDocs = bookingsSnaps.flatMap(snap => snap.docs);
    const requestsDocs = requestsSnaps.flatMap(snap => snap.docs);

    const paymentsMap = new Map();

    // Map confirmed bookings
    bookingsDocs.forEach((doc) => {
      const data = doc.data();
      paymentsMap.set(doc.id, {
        id: doc.id,
        tenantName: resolveName(data.tenant_email, data.tenant_name, data.tenant_id),
        tenantEmail: data.tenant_email,
        propertyName: data.property?.hostelName,
        roomName: data.room?.roomName || data.room?.roomId,
        amount: data.totalPrice || data.pricing_breakdown?.finalAmountPaid || 0,
        status: data.payment_status || "success",
        bookingStatus: data.status,
        date: data.created_at,
        refundStatus: data.refund_status || null,
        bookingCode: data.booking_code,
      });
    });

    // Merge or add requests (especially for cancelled/refund tracking)
    requestsDocs.forEach((doc) => {
      const data = doc.data();
      if (!paymentsMap.has(doc.id)) {
        paymentsMap.set(doc.id, {
          id: doc.id,
          tenantName: resolveName(data.tenant_email, data.tenant_name, data.tenant_id),
          tenantEmail: data.tenant_email,
          propertyName: data.property?.hostelName,
          roomName: data.room?.roomName || data.room?.roomId,
          amount: data.totalPrice || data.pricing_breakdown?.finalAmountPaid || 0,
          status: data.payment_status || "pending",
          bookingStatus: data.booking_status,
          date: data.created_at,
          refundStatus: data.refund_status || null,
          bookingCode: data.booking_code,
        });
      } else {
        // Update refund status if it exists in the request but not in the confirmed booking
        const existing = paymentsMap.get(doc.id);
        if (data.refund_status) {
          existing.refundStatus = data.refund_status;
          existing.status = data.payment_status || existing.status;
          existing.bookingStatus = data.booking_status || existing.bookingStatus;
        }
        // Always keep tenant name fresh
        existing.tenantName = resolveName(data.tenant_email, existing.tenantName, data.tenant_id);
      }
    });

    const allPayments = Array.from(paymentsMap.values()).sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return NextResponse.json(allPayments);
  } catch (error: any) {
    console.error("GET /api/owner/payments error:", error);
    return NextResponse.json({ error: "Failed to fetch payments" }, { status: 500 });
  }
}
