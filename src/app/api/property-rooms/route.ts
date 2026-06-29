import { NextResponse } from "next/server";
import { db } from "@/app/api/_db/firebase-admin";
import { roomSchema } from "@/schemas/room.schema";

const collection = db.collection("property_rooms");
const hostelCollection = db.collection("hostels");

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");

  if (!slug) {
    return NextResponse.json({ error: "slug query param is required" }, { status: 400 });
  }

  try {
    const snapshot = await collection.where("hostel_slug", "==", slug).get();
    const rooms = snapshot.docs.map((doc) => ({ firestoreId: doc.id, ...doc.data() }));

    const now = Date.now();
    const updates: Promise<any>[] = [];
    rooms.forEach((room: any) => {
      if (!room.beds) return;
      let dirty = false;
      room.beds.forEach((bed: any) => {
        if (bed.status === "reserved" && bed.reservedAt) {
          if (now - new Date(bed.reservedAt).getTime() > 8 * 60 * 1000) {
            bed.status = "available";
            bed.reservedAt = null;
            dirty = true;
          }
        }
      });
      if (dirty) {
        updates.push(collection.doc(room.firestoreId).update({ beds: room.beds }).catch(() => {}));
      }
    });
    if (updates.length) await Promise.all(updates);

    return NextResponse.json({ rooms });
  } catch (err) {
    console.error("GET /api/property-rooms error:", err);
    return NextResponse.json({ error: "Failed to fetch rooms" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = roomSchema.safeParse(body);
    if (!parsed.success) {
      const first = parsed.error.issues[0];
      return NextResponse.json({ error: first.message, field: first.path.join(".") }, { status: 400 });
    }

    const data = parsed.data;

    const hostelSnap = await hostelCollection.where("slug", "==", data.hostel_slug).get();
    if (hostelSnap.empty) {
      return NextResponse.json({ error: `Property with slug "${data.hostel_slug}" not found` }, { status: 404 });
    }

    const existingRoomSnap = await collection
      .where("hostel_slug", "==", data.hostel_slug)
      .where("id", "==", data.id)
      .get();
    if (!existingRoomSnap.empty) {
      return NextResponse.json({ error: `Room id "${data.id}" already exists for this property` }, { status: 409 });
    }

    const now = new Date().toISOString();
    const docRef = await collection.add({ ...data, createdAt: now, updatedAt: now });

    return NextResponse.json({ firestoreId: docRef.id, id: data.id, hostel_slug: data.hostel_slug }, { status: 201 });
  } catch (err: any) {
    console.error("POST /api/property-rooms error:", err);
    return NextResponse.json({ error: err.message ?? "Failed to create room" }, { status: err.statusCode ?? 500 });
  }
}
