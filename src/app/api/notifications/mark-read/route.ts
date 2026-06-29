import { NextResponse } from "next/server";
import { db } from "@/app/api/_db/firebase-admin";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const snapshot = await db.collection("notifications")
      .where("userId", "==", userId)
      .where("read", "==", false)
      .get();

    if (snapshot.empty) {
      return NextResponse.json({ success: true });
    }

    const batch = db.batch();
    snapshot.docs.forEach(doc => {
      batch.update(doc.ref, { read: true });
    });

    await batch.commit();

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("POST /api/notifications/mark-read error:", error);
    return NextResponse.json({ error: "Failed to mark notifications as read" }, { status: 500 });
  }
}
