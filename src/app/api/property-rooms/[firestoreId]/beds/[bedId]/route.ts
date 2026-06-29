import { NextResponse } from "next/server";
import { db } from "@/app/api/_db/firebase-admin";

const collection = db.collection("property_rooms");

export async function PUT(req: Request, { params }: { params: Promise<{ firestoreId: string; bedId: string }> }) {
  const { firestoreId, bedId } = await params;
  try {
    const docRef = collection.doc(firestoreId);
    const docSnap = await docRef.get();
    if (!docSnap.exists) return NextResponse.json({ error: "Room not found" }, { status: 404 });

    const roomData = docSnap.data()!;
    const beds = [...(roomData.beds ?? [])];
    const idx = beds.findIndex((b: any) => String(b.id) === String(bedId));
    if (idx === -1) return NextResponse.json({ error: "Bed not found" }, { status: 404 });

    const body = await req.json();
    const allowed: any = {};
    if (body.label !== undefined) allowed.label = body.label;
    if (body.yaw !== undefined) allowed.yaw = Number(body.yaw);
    if (body.pitch !== undefined) allowed.pitch = Number(body.pitch);
    if (body.status !== undefined) allowed.status = body.status;

    beds[idx] = { ...beds[idx], ...allowed };
    await docRef.update({ beds, updatedAt: new Date().toISOString() });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("PUT /api/property-rooms/:id/beds/:bedId error:", err);
    return NextResponse.json({ error: err.message ?? "Failed to update bed" }, { status: err.statusCode ?? 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ firestoreId: string; bedId: string }> }) {
  const { firestoreId, bedId } = await params;
  try {
    const docRef = collection.doc(firestoreId);
    const docSnap = await docRef.get();
    if (!docSnap.exists) return NextResponse.json({ error: "Room not found" }, { status: 404 });

    const roomData = docSnap.data()!;
    const beds = [...(roomData.beds ?? [])];
    const idx = beds.findIndex((b: any) => String(b.id) === String(bedId));
    if (idx === -1) return NextResponse.json({ error: "Bed not found" }, { status: 404 });

    if (beds[idx].status === "occupied" || beds[idx].status === "reserved") {
      return NextResponse.json({
        error: `Cannot delete a ${beds[idx].status} bed`,
      }, { status: 409 });
    }

    beds.splice(idx, 1);
    await docRef.update({ beds, updatedAt: new Date().toISOString() });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("DELETE /api/property-rooms/:id/beds/:bedId error:", err);
    return NextResponse.json({ error: err.message ?? "Failed to delete bed" }, { status: err.statusCode ?? 500 });
  }
}
