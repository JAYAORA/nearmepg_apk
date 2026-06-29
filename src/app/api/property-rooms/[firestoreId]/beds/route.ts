import { NextResponse } from "next/server";
import { db } from "@/app/api/_db/firebase-admin";
import { bedSchema } from "@/schemas/room.schema";

const collection = db.collection("property_rooms");

function assertNoOccupied(roomData: any, message?: string) {
  const occupied = (roomData.beds ?? []).some((b: any) => b.status === "occupied");
  if (occupied) {
    const err: any = new Error(
      message ?? "Cannot modify room: one or more beds are currently occupied."
    );
    err.statusCode = 409;
    throw err;
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ firestoreId: string }> }) {
  const firestoreId = (await params).firestoreId;
  try {
    const docRef = collection.doc(firestoreId);
    const docSnap = await docRef.get();
    if (!docSnap.exists) return NextResponse.json({ error: "Room not found" }, { status: 404 });

    assertNoOccupied(docSnap.data(), "Cannot add beds to a room with occupied beds.");

    const roomData = docSnap.data()!;
    const beds = roomData.beds ?? [];

    const body = await req.json();
    const parsed = bedSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }

    const exists = beds.some((b: any) => String(b.id) === String(parsed.data.id));
    if (exists) {
      return NextResponse.json({ error: `Bed id "${parsed.data.id}" already exists in this room` }, { status: 409 });
    }

    beds.push(parsed.data);
    await docRef.update({ beds, updatedAt: new Date().toISOString() });

    return NextResponse.json({ success: true, bedId: parsed.data.id }, { status: 201 });
  } catch (err: any) {
    console.error("POST /api/property-rooms/:id/beds error:", err);
    return NextResponse.json({ error: err.message ?? "Failed to add bed" }, { status: err.statusCode ?? 500 });
  }
}
