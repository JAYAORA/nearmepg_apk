import { NextResponse } from "next/server";
import { db } from "@/app/api/_db/firebase-admin";

export async function PATCH(req: Request, { params }: { params: Promise<{ idOrSlug: string, reviewId: string }> }) {
  try {
    const { idOrSlug, reviewId } = await params;
    const body = await req.json();
    const { isHidden, requesterRole } = body;

    const role = (requesterRole || "").toLowerCase();
    if (role !== "admin" && role !== "super_admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (typeof isHidden !== "boolean") {
      return NextResponse.json({ error: "Invalid isHidden value" }, { status: 400 });
    }

    const reviewRef = db.collection("property_reviews").doc(reviewId);
    const reviewSnap = await reviewRef.get();

    if (!reviewSnap.exists) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    // Verify review belongs to property
    const reviewData = reviewSnap.data()!;
    if (reviewData.propertyId !== idOrSlug) {
      return NextResponse.json({ error: "Review does not belong to this property" }, { status: 400 });
    }

    await reviewRef.update({ isHidden });

    return NextResponse.json({ success: true, isHidden });
  } catch (error: any) {
    console.error("PATCH /api/properties/[idOrSlug]/reviews/[reviewId]/toggle error:", error);
    return NextResponse.json({ error: "Failed to toggle review visibility" }, { status: 500 });
  }
}
