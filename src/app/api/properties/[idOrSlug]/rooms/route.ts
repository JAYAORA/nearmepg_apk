import { NextResponse } from "next/server";
import { db } from "@/app/api/_db/firebase-admin";

const collection = db.collection("hostels");
const roomsCollection = db.collection("property_rooms");

export async function GET(req: Request, { params }: { params: Promise<{ idOrSlug: string }> }) {
  const idOrSlug = (await params).idOrSlug;

  try {
    let slug = idOrSlug;
    if (!idOrSlug.includes("-") || idOrSlug.length < 10) {
      const docSnap = await collection.doc(idOrSlug).get();
      if (docSnap.exists) slug = docSnap.data()?.slug ?? idOrSlug;
    }

    const snapshot = await roomsCollection.get();
    const rooms = snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .filter((r: any) => r.hostel_slug === slug);

    const now = Date.now();
    rooms.forEach((room: any) => {
      if (room.beds) {
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
          roomsCollection.doc(room.id).update({ beds: room.beds }).catch((e) => console.error("Lazy expire update failed:", e));
        }
      }
    });

    return NextResponse.json({ rooms });
  } catch (err) {
    console.error("GET /api/properties/[idOrSlug]/rooms error:", err);
    return NextResponse.json({ error: "Failed to fetch rooms" }, { status: 500 });
  }
}
