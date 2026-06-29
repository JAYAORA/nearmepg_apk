import { NextResponse } from "next/server";
import { db } from "@/app/api/_db/firebase-admin";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const usersRef = db.collection("users");
    const userQuery = await usersRef.where("email", "==", email.toLowerCase().trim()).limit(1).get();

    if (userQuery.empty) {
      return NextResponse.json({ exists: false }, { status: 200 });
    }

    const userData = userQuery.docs[0].data();

    return NextResponse.json({ 
      exists: true, 
      name: userData.displayName || userData.name || "Unknown Name",
      role: userData.role || "tenant"
    }, { status: 200 });
  } catch (error: any) {
    console.error("GET /api/admin/users/verify error:", error);
    return NextResponse.json({ error: "Failed to verify user" }, { status: 500 });
  }
}
