import { NextResponse } from "next/server";
import { db } from "@/app/api/_db/firebase-admin";

const bookingRequests = db.collection("booking_requests");

export async function GET(
  req: Request,
  { params }: { params: Promise<{ idOrSlug: string }> }
) {
  try {
    const idOrSlug = (await params).idOrSlug;

    // Find all successful bookings for this property (hostel)
    // Note: In booking docs, property.hostelId usually stores the slug
    const bookingsSnap = await bookingRequests
      .where("property.hostelId", "==", idOrSlug)
      .get();

    const blockedDatesByRoom: Record<string, { start: string; end: string }[]> = {};
    const now = Date.now();

    bookingsSnap.forEach((doc) => {
      const data = doc.data();
      const status = data.payment_status;
      const createdAtStr = data.created_at;
      const createdAt = createdAtStr ? new Date(createdAtStr).getTime() : 0;
      
      const isSuccessful = status === "successful" || data.booking_status === "checked-in";
      const isPendingButRecent = status === "initiated" && (now - createdAt < 15 * 60 * 1000);

      if (isSuccessful || isPendingButRecent) {
        const checkIn = data.booking_details?.checkIn;
        const checkOut = data.booking_details?.checkOut;
        const roomId = data.room?.roomId;
        
        if (checkIn && checkOut && roomId) {
          if (!blockedDatesByRoom[roomId]) {
            blockedDatesByRoom[roomId] = [];
          }
          blockedDatesByRoom[roomId].push({ start: checkIn, end: checkOut });
        }
      }
    });

    return NextResponse.json({ blockedDatesByRoom });
  } catch (err) {
    console.error("GET /api/properties/:id/blocked-dates error:", err);
    return NextResponse.json({ error: "Failed to fetch property blocked dates" }, { status: 500 });
  }
}
