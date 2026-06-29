import { NextResponse } from "next/server";
import { db } from "@/app/api/_db/firebase-admin";

const collection = db.collection("hostels");

function stripPrivateFields(doc: Record<string, any>) {
  const { owner_contact, ...rest } = doc;
  return rest;
}

export async function GET() {
  try {
    const snapshot = await collection.where("verified", "==", true).get();
    
    // Bayesian average constants
    const m = 5; // minimum reviews to trust
    const C = 4.0; // mean rating across the platform

    const items = snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .map(stripPrivateFields)
      .sort((a: any, b: any) => {
        const vA = a.reviewCount ?? 0;
        const rA = a.rating ?? 0;
        const scoreA = (vA * rA + m * C) / (vA + m);

        const vB = b.reviewCount ?? 0;
        const rB = b.rating ?? 0;
        const scoreB = (vB * rB + m * C) / (vB + m);

        return scoreB - scoreA;
      })
      .slice(0, 6);

    return NextResponse.json(items);
  } catch (err) {
    console.error("GET /api/properties/featured error:", err);
    return NextResponse.json({ error: "Failed to fetch featured properties" }, { status: 500 });
  }
}
