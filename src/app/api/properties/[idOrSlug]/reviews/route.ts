import { NextResponse } from "next/server";
import { db } from "@/app/api/_db/firebase-admin";

export async function POST(req: Request, { params }: { params: Promise<{ idOrSlug: string }> }) {
  try {
    const { idOrSlug: id } = await params;
    const body = await req.json();
    const { userId, userName, rating, comment, bookingId } = body;

    if (!userId || !rating || !bookingId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Invalid rating" }, { status: 400 });
    }

    const reviewRef = db.collection("property_reviews").doc();
    const propertyRef = db.collection("hostels").doc(id);

    await db.runTransaction(async (tx) => {
      // 1. All Reads
      const propSnap = await tx.get(propertyRef);
      if (!propSnap.exists) {
        throw new Error("Property not found");
      }

      // 2. All Writes
      const propData = propSnap.data()!;
      const currentRating = propData.rating || propData.averageRating || 0;
      const currentCount = propData.reviewCount || propData.reviews || 0;

      const newCount = currentCount + 1;
      const newRating = ((currentRating * currentCount) + rating) / newCount;

      tx.set(reviewRef, {
        propertyId: id,
        bookingId,
        userId,
        userName: userName || "Anonymous",
        rating,
        comment: comment || "",
        createdAt: new Date(),
      });

      tx.update(propertyRef, {
        rating: newRating,
        reviewCount: newCount,
      });

      // Optionally mark the booking so we don't prompt for review again
      const bookingRef = db.collection("booking_requests").doc(bookingId);
      tx.update(bookingRef, { hasReviewed: true });
    });

    return NextResponse.json({ success: true, message: "Review submitted successfully" });
  } catch (error: any) {
    console.error("POST /api/properties/[idOrSlug]/reviews error:", error);
    return NextResponse.json({ error: error.message || "Failed to submit review" }, { status: 500 });
  }
}

export async function GET(req: Request, { params }: { params: Promise<{ idOrSlug: string }> }) {
  try {
    const { idOrSlug: id } = await params;
    const snapshot = await db.collection("property_reviews")
      .where("propertyId", "==", id)
      .limit(50)
      .get();

    const reviews = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate().toISOString() || new Date().toISOString()
      };
    });

    reviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json(reviews);
  } catch (error: any) {
    console.error("GET /api/properties/[idOrSlug]/reviews error:", error);
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}
