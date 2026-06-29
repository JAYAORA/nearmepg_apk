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

    if (beds[idx].status === "reserved") {
      beds[idx] = {
        ...beds[idx],
        status: "available",
        reservedAt: null
      };
      await docRef.update({ beds, updatedAt: new Date().toISOString() });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("POST /api/property-rooms/:id/beds/:bedId/release error:", err);
    return NextResponse.json({ error: "Failed to release bed" }, { status: 500 });
  }
}
