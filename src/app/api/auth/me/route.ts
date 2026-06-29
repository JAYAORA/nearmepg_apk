import { NextResponse } from "next/server";
import { db } from "@/app/api/_db/firebase-admin";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const uid = body?.uid; // We use body uid for now since basic auth sends it
    
    if (!uid) {
      return NextResponse.json({ error: "No UID provided" }, { status: 401 });
    }

    const doc = await db.collection("auth_users").doc(uid).get();
    const data = doc.exists ? doc.data() : {};
    
    return NextResponse.json({
      uid: uid,
      email: data?.email,
      displayName: data?.displayName || "",
      role: data?.role || "tenant",
    });
  } catch (error) {
    console.error("Me API error:", error);
    return NextResponse.json({ error: "Fetch failed" }, { status: 500 });
  }
}
