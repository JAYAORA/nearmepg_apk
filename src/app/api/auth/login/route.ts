import { NextResponse } from "next/server";
import { db } from "@/app/api/_db/firebase-admin";
import { loginSchema } from "@/schemas/auth.schema";

const TOKEN_EXPIRES_IN_SEC = 3600;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const { email, password } = parsed.data;

    const snapshot = await db.collection("auth_users").where("email", "==", email).get();
    if (snapshot.empty) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const authDoc = snapshot.docs[0];
    const userData = authDoc.data();

    // Basic email/password check
    if (userData.password !== password) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    if (userData.isActive === false) {
      return NextResponse.json({ error: "Account disabled" }, { status: 403 });
    }

    await authDoc.ref.update({ lastLoginAt: new Date() });

    return NextResponse.json({
      uid: authDoc.id,
      email: userData.email,
      displayName: userData.displayName || "",
      phone: userData.phone || "",
      role: userData.role || "tenant",
      aadhaarVerified: userData.aadhaarVerified || false,
      idToken: authDoc.id, // Using doc id as pseudo token
      expiresIn: TOKEN_EXPIRES_IN_SEC,
    });
  } catch (error: any) {
    console.error("Login API error:", error);
    return NextResponse.json({ error: "Login system failed" }, { status: 500 });
  }
}
