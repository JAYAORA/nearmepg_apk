import { NextResponse } from "next/server";
import { db } from "@/app/api/_db/firebase-admin";

const collection = db.collection("property_rooms");
const bookingRequests = db.collection("booking_requests");

export async function GET(
  req: Request,
  { params }: { params: Promise<{ firestoreId: string }> }
) {
  try {
    const firestoreId = (await params).firestoreId;
    
    // First, get the room to know its friendly ID and hostel slug
    const docRef = collection.doc(firestoreId);
    const docSnap = await docRef.get();
    if (!docSnap.exists) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }
    
    const room = docSnap.data()!;
    const roomId = room.id;
    const hostelSlug = room.hostel_slug;

    // Find all successful bookings for this room
    // Note: payment_status might be 'successful', 'initiated' (if we want to block pending ones temporarily)
    // We'll block 'successful' and 'checked-in' bookings.
    // Also include 'initiated' if they are less than 15 mins old to prevent race conditions.
    const bookingsSnap = await bookingRequests
      .where("room.roomId", "==", roomId)
      .where("property.hostelId", "==", hostelSlug)
      .get();

    const blockedDates: { start: string; end: string }[] = [];
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
        if (checkIn && checkOut) {
          blockedDates.push({ start: checkIn, end: checkOut });
        }
      }
    });

    return NextResponse.json({ blockedDates });
  } catch (err) {
    console.error("GET /api/property-rooms/:id/blocked-dates error:", err);
    return NextResponse.json({ error: "Failed to fetch blocked dates" }, { status: 500 });
  }
}
