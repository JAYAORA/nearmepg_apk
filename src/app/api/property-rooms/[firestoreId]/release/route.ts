import { NextResponse } from "next/server";
import { db } from "@/app/api/_db/firebase-admin";

const collection = db.collection("property_rooms");

export async function POST(req: Request, { params }: { params: Promise<{ firestoreId: string }> }) {
  const firestoreId = (await params).firestoreId;
  try {
    const docRef = collection.doc(firestoreId);
    const docSnap = await docRef.get();
    if (!docSnap.exists) return NextResponse.json({ error: "Room not found" }, { status: 404 });

    const room = docSnap.data()!;
    if (!room.available && room.reservedAt) {
      await docRef.update({
        available: true,
        reservedAt: null,
        updatedAt: new Date().toISOString()
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("POST /api/property-rooms/:id/release error:", err);
    return NextResponse.json({ error: "Failed to release room" }, { status: 500 });
  }
}
