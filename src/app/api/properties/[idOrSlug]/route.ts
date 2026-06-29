import { NextResponse } from "next/server";
import { db } from "@/app/api/_db/firebase-admin";
import { propertyUpdateSchema } from "@/schemas/property.schema";

const collection = db.collection("hostels");
const roomsCollection = db.collection("property_rooms");

function stripPrivateFields(doc: Record<string, any>) {
  // We no longer strip owner_contact so users can copy the owner's phone number
  // Keep owner_name as well if it's there
  return doc;
}

export async function GET(req: Request, { params }: { params: Promise<{ idOrSlug: string }> }) {
  const idOrSlug = (await params).idOrSlug;

  try {
    const snapshot = await collection.get();
    const items: any[] = snapshot.docs.map((doc) => ({ id: doc.id, ...(doc.data() as any) }));

    const property = items.find((p: any) => p.id === idOrSlug || p.slug === idOrSlug);

    if (!property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 });
    }

    let owner_name = "Property Owner";
    let owner_contact = property.owner_contact;
    if (property.owner_mail) {
      const ownerSnap = await db.collection("auth_users").where("email", "==", property.owner_mail).get();
      if (!ownerSnap.empty) {
        const ownerData = ownerSnap.docs[0].data();
        owner_name = ownerData.displayName || ownerData.name || "Property Owner";
        if (ownerData.phone) {
          owner_contact = ownerData.phone;
        }
      }
    }

    return NextResponse.json(stripPrivateFields({ ...property, owner_name, owner_contact }));
  } catch (err) {
    console.error("GET /api/properties/[idOrSlug] error:", err);
    return NextResponse.json({ error: "Failed to fetch property" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ idOrSlug: string }> }) {
  const id = (await params).idOrSlug;

  try {
    const docRef = collection.doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 });
    }

    const body = await req.json();
    const parsed = propertyUpdateSchema.safeParse(body);
    if (!parsed.success) {
      const firstError = parsed.error.issues[0];
      return NextResponse.json({ error: firstError.message, field: firstError.path.join(".") }, { status: 400 });
    }

    const data = parsed.data;

    if (data.slug && data.slug !== docSnap.data()?.slug) {
      const slugCheck = await collection.where("slug", "==", data.slug).get();
      if (!slugCheck.empty) {
        return NextResponse.json({ error: "A property with this slug already exists" }, { status: 409 });
      }
    }

    await docRef.set({ ...data, updatedAt: new Date().toISOString() }, { merge: true });

    return NextResponse.json({ success: true, id });
  } catch (err: any) {
    console.error("PUT /api/properties/[idOrSlug] error:", err);
    return NextResponse.json({ error: err?.message || "Failed to update property" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ idOrSlug: string }> }) {
  const id = (await params).idOrSlug;

  try {
    const docRef = collection.doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 });
    }

    const slug = docSnap.data()?.slug;

    if (slug) {
      const roomsSnap = await db.collection("hostels").where("hostel_slug", "==", slug).get(); // legacy rooms collection is actually property_rooms
      const newRoomsSnap = await roomsCollection.where("hostel_slug", "==", slug).get();
      
      const newOccupiedRoom = newRoomsSnap.docs.find((rDoc) => {
        const beds = rDoc.data().beds ?? [];
        return beds.some((b: any) => b.status === "occupied");
      });

      if (newOccupiedRoom) {
        return NextResponse.json({
          error: "Cannot delete property: one or more rooms have occupied beds",
        }, { status: 409 });
      }
    }

    await docRef.delete();
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("DELETE /api/properties/[idOrSlug] error:", err);
    return NextResponse.json({ error: err?.message || "Failed to delete property" }, { status: 500 });
  }
}
