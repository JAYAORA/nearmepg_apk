import { NextResponse } from "next/server";
import { db } from "@/app/api/_db/firebase-admin";

function sortByCreatedAt(arr: any[], direction: "asc" | "desc" = "desc") {
  return arr.sort((a, b) => {
    const aTime = a.created_at ? new Date(a.created_at).getTime() : 0;
    const bTime = b.created_at ? new Date(b.created_at).getTime() : 0;
    return direction === "desc" ? bTime - aTime : aTime - bTime;
  });
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const tenantId = searchParams.get("tenantId");
  const email = searchParams.get("email");

  if (!tenantId && !email) {
    return NextResponse.json({ error: "tenantId or email is required" }, { status: 400 });
  }

  try {
    const bookingRequestsRef = db.collection("booking_requests");
    const paymentsRef = db.collection("payments");

    // --- Fetch bookings (no orderBy to avoid composite index requirement) ---
    let bookingsSnap: FirebaseFirestore.QuerySnapshot;
    if (tenantId) {
      bookingsSnap = await bookingRequestsRef.where("tenant_id", "==", tenantId).get();
    } else {
      bookingsSnap = await bookingRequestsRef.where("tenant_email", "==", email!).get();
    }

    const bookings = sortByCreatedAt(
      bookingsSnap.docs
        .map((doc) => ({ id: doc.id, ...(doc.data() as any) }))
        .filter((b: any) => b.booking_status !== "payment_pending")
    );

    // --- Fetch payments (no orderBy to avoid composite index requirement) ---
    const bookingIds = bookings.map((b: any) => b.id);
    let payments: any[] = [];

    if (bookingIds.length > 0) {
      // Firestore "in" is limited to 30 items per query
      const chunks: string[][] = [];
      for (let i = 0; i < bookingIds.length; i += 30) {
        chunks.push(bookingIds.slice(i, i + 30));
      }
      const paymentSnapshots = await Promise.all(
        chunks.map((chunk) =>
          paymentsRef.where("booking_request_id", "in", chunk).get()
        )
      );
      payments = sortByCreatedAt(
        paymentSnapshots.flatMap((snap) =>
          snap.docs.map((doc) => ({ id: doc.id, ...(doc.data() as any) }))
        )
      );
    }

    return NextResponse.json({ bookings, payments });
  } catch (err: any) {
    console.error("GET /api/account/bookings error:", err);
    return NextResponse.json({ error: err.message || "Failed to fetch bookings" }, { status: 500 });
  }
}
