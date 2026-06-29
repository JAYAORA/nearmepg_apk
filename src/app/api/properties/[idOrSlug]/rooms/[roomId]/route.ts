import { NextResponse } from "next/server";
import { db } from "@/app/api/_db/firebase-admin";

const roomsCollection = db.collection("property_rooms");

export async function PUT(req: Request, { params }: { params: Promise<{ idOrSlug: string; roomId: string }> }) {
  const roomId = (await params).roomId;

  try {
    const querySnapshot = await roomsCollection.where("id", "==", roomId).limit(1).get();

    if (querySnapshot.empty) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    const roomDoc = querySnapshot.docs[0];
    const body = await req.json();

    const roomUpdate = {
      ...body,
      price: Number(body.price),
      sharing: Number(body.sharing),
      updatedAt: new Date().toISOString(),
    };

    await roomDoc.ref.set(roomUpdate, { merge: true });

    return NextResponse.json({ success: true, message: "Room updated successfully" });
  } catch (err: any) {
    console.error("PUT /api/properties/:propertyId/rooms/:roomId error:", err);
    return NextResponse.json({ error: err?.message || "Failed to update room" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ idOrSlug: string; roomId: string }> }) {
  const roomId = (await params).roomId;

  try {
    const querySnapshot = await roomsCollection.where("id", "==", roomId).limit(1).get();

    if (querySnapshot.empty) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    const roomDoc = querySnapshot.docs[0];
    const beds = roomDoc.data().beds ?? [];

    const blocked = beds.some((b: any) => b.status === "occupied" || b.status === "reserved");
    if (blocked) {
      return NextResponse.json({
        error: "Cannot delete room with occupied or reserved beds",
      }, { status: 409 });
    }

    await roomDoc.ref.delete();
    return NextResponse.json({ success: true, message: "Room deleted successfully" });
  } catch (err: any) {
    console.error("DELETE /api/properties/:propertyId/rooms/:roomId error:", err);
    return NextResponse.json({ error: err?.message || "Failed to delete room" }, { status: 500 });
  }
}
