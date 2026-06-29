import { NextResponse } from "next/server";
import { db } from "@/app/api/_db/firebase-admin";
import { propertySchema } from "@/schemas/property.schema";

const collection = db.collection("hostels");

function stripPrivateFields(doc: Record<string, any>) {
  const { owner_contact, ...rest } = doc;
  return rest;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    const allParam = searchParams.get("all"); // admin flag

    const snapshot = await collection.get();
    let items: any[] = snapshot.docs.map((doc) => ({ id: doc.id, ...(doc.data() as any) }));

    if (email) {
      // Owner: filter to their properties only
      items = items.filter((p: any) => p.owner_mail === email);
    }

    // Fetch auth_users to enrich owner details
    const authUsersSnap = await db.collection("auth_users").get();
    const userMap = new Map();
    authUsersSnap.docs.forEach((doc) => {
      const d = doc.data();
      if (d.email) {
        userMap.set(d.email, { 
          name: d.displayName || d.name || "Property Owner", 
          phone: d.phone 
        });
      }
    });

    items = items.map((p: any) => {
      let enriched = { ...p };
      if (enriched.owner_mail) {
        const ownerDetails = userMap.get(enriched.owner_mail);
        if (ownerDetails) {
          enriched.owner_name = ownerDetails.name;
          if (ownerDetails.phone) {
            enriched.owner_contact = ownerDetails.phone;
          }
        } else {
          enriched.owner_name = "Property Owner";
        }
      } else {
        enriched.owner_name = "Property Owner";
      }

      // Public listing: strip private fields and filter unverified
      if (!email && !allParam) {
        if (!enriched.verified) return null;
        return stripPrivateFields(enriched);
      }
      return enriched;
    }).filter(Boolean);

    return NextResponse.json(items);
  } catch (err) {
    console.error("GET /api/properties error:", err);
    return NextResponse.json({ error: "Failed to fetch properties" }, { status: 500 });
  }
}


export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = propertySchema.safeParse(body);

    if (!parsed.success) {
      const firstError = parsed.error.issues[0];
      return NextResponse.json({ error: firstError.message, field: firstError.path.join(".") }, { status: 400 });
    }

    const data = parsed.data;

    if (data.owner_mail) {
      const ownerSnap = await db.collection("auth_users").where("email", "==", data.owner_mail).get();
      if (!ownerSnap.empty) {
        const ownerData = ownerSnap.docs[0].data();
        if (ownerData.account_status === "pending_approval") {
          return NextResponse.json({ error: "Your account is pending admin approval. You cannot add properties yet." }, { status: 403 });
        }
      }
    }

    const existing = await collection.where("slug", "==", data.slug).get();
    if (!existing.empty) {
      return NextResponse.json({ error: "A property with this slug already exists" }, { status: 409 });
    }

    const now = new Date().toISOString();
    const docRef = await collection.add({ ...data, createdAt: now, updatedAt: now });

    return NextResponse.json({ id: docRef.id, slug: data.slug }, { status: 201 });
  } catch (err: any) {
    console.error("POST /api/properties error:", err);
    return NextResponse.json({ error: err?.message || "Failed to create property" }, { status: 500 });
  }
}
