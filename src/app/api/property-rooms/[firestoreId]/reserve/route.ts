import { NextResponse } from "next/server";
import { db } from "@/app/api/_db/firebase-admin";

const collection = db.collection("property_rooms");
const bookingRequests = db.collection("booking_requests");

export async function POST(req: Request, { params }: { params: Promise<{ firestoreId: string }> }) {
  const firestoreId = (await params).firestoreId;
  try {
    const docRef = collection.doc(firestoreId);
    const docSnap = await docRef.get();
    if (!docSnap.exists) return NextResponse.json({ error: "Room not found" }, { status: 404 });

    const room = docSnap.data()!;
    const now = Date.now();
    const body = await req.json();
    const { reservationToken, checkIn, checkOut } = body;

    // Check if it's a hotel room request (has checkIn and checkOut)
    const isHotelRequest = checkIn && checkOut;

    if (isHotelRequest) {
      // 1. Check existing successful/initiated bookings for overlap
      const bookingsSnap = await bookingRequests
        .where("room.roomId", "==", room.id)
        .where("property.hostelId", "==", room.hostel_slug)
        .get();

      let hasOverlap = false;
      const requestedStart = new Date(checkIn).getTime();
      const requestedEnd = new Date(checkOut).getTime();

      bookingsSnap.forEach((doc) => {
        const data = doc.data();
        const status = data.payment_status;
        const createdAtStr = data.created_at;
        const createdAt = createdAtStr ? new Date(createdAtStr).getTime() : 0;
        
        const isSuccessful = status === "successful" || data.booking_status === "checked-in";
        const isPendingButRecent = status === "initiated" && (now - createdAt < 15 * 60 * 1000);

        if (isSuccessful || isPendingButRecent) {
          const bCheckIn = data.booking_details?.checkIn;
          const bCheckOut = data.booking_details?.checkOut;
          if (bCheckIn && bCheckOut) {
            const bStart = new Date(bCheckIn).getTime();
            const bEnd = new Date(bCheckOut).getTime();
            // Overlap condition: ReqStart < ExistingEnd AND ReqEnd > ExistingStart
            if (requestedStart < bEnd && requestedEnd > bStart) {
              hasOverlap = true;
            }
          }
        }
      });

      if (hasOverlap) {
        return NextResponse.json({ error: "Room is already booked for these dates" }, { status: 409 });
      }

      // 2. Check temporary locks in room document
      const tempLocks: any[] = room.tempLocks || [];
      const validLocks = tempLocks.filter(lock => now - new Date(lock.reservedAt).getTime() < 8 * 60 * 1000);
      
      let lockOverlap = false;
      let ownLockFound = false;
      let existingLock: any = null;

      validLocks.forEach(lock => {
        const lStart = new Date(lock.checkIn).getTime();
        const lEnd = new Date(lock.checkOut).getTime();
        if (requestedStart < lEnd && requestedEnd > lStart) {
          if (lock.reservationToken === reservationToken) {
            ownLockFound = true;
            existingLock = lock;
          } else {
            lockOverlap = true;
          }
        }
      });

      if (lockOverlap) {
        return NextResponse.json({ error: "Room is currently reserved by someone else for these dates" }, { status: 409 });
      }

      if (ownLockFound && existingLock) {
        const reservedUntil = new Date(new Date(existingLock.reservedAt).getTime() + 8 * 60 * 1000).toISOString();
        return NextResponse.json({ success: true, reservedUntil });
      }

      const reservedUntil = new Date(now + 8 * 60 * 1000).toISOString();
      const newLock = {
        checkIn,
        checkOut,
        reservedAt: new Date(now).toISOString(),
        reservationToken: reservationToken || null
      };

      // Add our lock to validLocks
      if (!ownLockFound) {
        validLocks.push(newLock);
      }

      await docRef.update({
        tempLocks: validLocks,
        updatedAt: new Date().toISOString()
      });

      return NextResponse.json({ success: true, reservedUntil });

    } else {
      // Legacy PG flow
      const reservedAt = new Date(now).toISOString();
      let reservedUntil = new Date(now + 8 * 60 * 1000).toISOString();

      if (!room.available) {
        if (room.reservedAt && (now - new Date(room.reservedAt).getTime() < 8 * 60 * 1000)) {
          if (!reservationToken || room.reservationToken !== reservationToken) {
            return NextResponse.json({ error: "Room is currently reserved by someone else" }, { status: 409 });
          } else {
            reservedUntil = new Date(new Date(room.reservedAt).getTime() + 8 * 60 * 1000).toISOString();
            return NextResponse.json({ success: true, reservedUntil });
          }
        } else if (!room.reservedAt) {
          return NextResponse.json({ error: "Room is not available" }, { status: 409 });
        }
      }

      await docRef.update({
        available: false,
        reservedAt,
        reservationToken: reservationToken || null,
        updatedAt: new Date().toISOString()
      });

      return NextResponse.json({ success: true, reservedUntil });
    }

  } catch (err) {
    console.error("POST /api/property-rooms/:id/reserve error:", err);
    return NextResponse.json({ error: "Failed to reserve room" }, { status: 500 });
  }
}
