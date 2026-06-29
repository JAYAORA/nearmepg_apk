import { NextResponse } from "next/server";
import { db } from "@/app/api/_db/firebase-admin";

const collection = db.collection("property_rooms");

export async function POST(req: Request, { params }: { params: Promise<{ firestoreId: string; bedId: string }> }) {
  const { firestoreId, bedId } = await params;
  try {
    const docRef = collection.doc(firestoreId);
    const docSnap = await docRef.get();
    if (!docSnap.exists) return NextResponse.json({ error: "Room not found" }, { status: 404 });

    const roomData = docSnap.data()!;
    const beds = [...(roomData.beds ?? [])];
    const idx = beds.findIndex((b: any) => String(b.id) === String(bedId));
    if (idx === -1) return NextResponse.json({ error: "Bed not found" }, { status: 404 });

    const now = Date.now();
    const bed = beds[idx];
    const body = await req.json();
    const { reservationToken } = body;

    if (bed.status === "occupied") {
      return NextResponse.json({ error: "Bed is already occupied" }, { status: 409 });
    }

    const reservedAt = new Date(now).toISOString();
    let reservedUntil = new Date(now + 8 * 60 * 1000).toISOString();

    if (bed.status === "reserved") {
      if (bed.reservedAt && (now - new Date(bed.reservedAt).getTime() < 8 * 60 * 1000)) {
        if (!reservationToken || bed.reservationToken !== reservationToken) {
          return NextResponse.json({ error: "Bed is currently reserved by someone else" }, { status: 409 });
        } else {
          reservedUntil = new Date(new Date(bed.reservedAt).getTime() + 8 * 60 * 1000).toISOString();
          return NextResponse.json({ success: true, reservedUntil });
        }
      }
    }

    beds[idx] = {
      ...bed,
      status: "reserved",
      reservedAt,
      reservationToken: reservationToken || null
    };

    await docRef.update({ beds, updatedAt: new Date().toISOString() });
    return NextResponse.json({ success: true, reservedUntil });
  } catch (err) {
    console.error("POST /api/property-rooms/:id/beds/:bedId/reserve error:", err);
    return NextResponse.json({ error: "Failed to reserve bed" }, { status: 500 });
  }
}
