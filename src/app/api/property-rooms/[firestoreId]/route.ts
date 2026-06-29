import { NextResponse } from "next/server";
import { db } from "@/app/api/_db/firebase-admin";
import { roomUpdateSchema } from "@/schemas/room.schema";

const collection = db.collection("property_rooms");

export async function GET(req: Request, { params }: { params: Promise<{ firestoreId: string }> }) {
  const firestoreId = (await params).firestoreId;
  try {
    const doc = await collection.doc(firestoreId).get();
    if (!doc.exists) return NextResponse.json({ error: "Room not found" }, { status: 404 });
    const data = doc.data()!;

    // Enrich with tenant email and active booking ID
    const activeBookingsSnap = await db.collection("booking_requests")
      .where("room.roomId", "==", data.id)
      .where("booking_status", "in", ["checked-in", "pending"])
      .get();
    
    const activeBookingsByBed: Record<string, { bookingId: string, email: string }> = {};
    let roomLevelBooking: any = null;

    activeBookingsSnap.forEach(b => {
      const bData = b.data();
      const bedId = bData.room?.bedId;
      if (bedId) {
        activeBookingsByBed[String(bedId)] = { bookingId: b.id, email: bData.tenant_email };
      } else {
        roomLevelBooking = { bookingId: b.id, email: bData.tenant_email };
      }
    });

    if (data.beds && Array.isArray(data.beds)) {
      data.beds = data.beds.map((bed: any) => {
        const bookingInfo = activeBookingsByBed[String(bed.id)];
        if (bookingInfo) {
          return { ...bed, tenantEmail: bookingInfo.email, bookingId: bookingInfo.bookingId };
        }
        return bed;
      });
    }

    if (roomLevelBooking) {
      data.roomTenantEmail = roomLevelBooking.email;
      data.roomBookingId = roomLevelBooking.bookingId;
    }

    return NextResponse.json({ firestoreId: doc.id, ...data });
  } catch (err) {
    console.error("GET /api/property-rooms/:id error:", err);
    return NextResponse.json({ error: "Failed to fetch room" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ firestoreId: string }> }) {
  const firestoreId = (await params).firestoreId;
  try {
    const docRef = collection.doc(firestoreId);
    const docSnap = await docRef.get();
    if (!docSnap.exists) return NextResponse.json({ error: "Room not found" }, { status: 404 });

    const body = await req.json();
    const parsed = roomUpdateSchema.safeParse(body);
    if (!parsed.success) {
      const first = parsed.error.issues[0];
      return NextResponse.json({ error: first.message, field: first.path.join(".") }, { status: 400 });
    }

    await docRef.set(
      { ...parsed.data, updatedAt: new Date().toISOString() },
      { merge: true }
    );

    return NextResponse.json({ success: true, firestoreId });
  } catch (err: any) {
    console.error("PUT /api/property-rooms/:id error:", err);
    return NextResponse.json({ error: err.message ?? "Failed to update room" }, { status: err.statusCode ?? 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ firestoreId: string }> }) {
  const firestoreId = (await params).firestoreId;
  try {
    const docRef = collection.doc(firestoreId);
    const docSnap = await docRef.get();
    if (!docSnap.exists) return NextResponse.json({ error: "Room not found" }, { status: 404 });

    const beds = docSnap.data()?.beds ?? [];
    const blocked = beds.some((b: any) => b.status === "occupied" || b.status === "reserved");
    if (blocked) {
      return NextResponse.json({
        error: "Cannot delete room with occupied or reserved beds",
      }, { status: 409 });
    }

    await docRef.delete();
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("DELETE /api/property-rooms/:id error:", err);
    return NextResponse.json({ error: err.message ?? "Failed to delete room" }, { status: err.statusCode ?? 500 });
  }
}
