import { NextResponse } from "next/server";
import { db } from "@/app/api/_db/firebase-admin";
import { registerSchema } from "@/schemas/auth.schema";
import { sendWelcomeEmail } from "@/lib/email";

const TOKEN_EXPIRES_IN_SEC = 3600;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const { name, email, phone, password, role } = parsed.data;

    const authUsersRef = db.collection("auth_users");
    const usersRef = db.collection("users");

    const existing = await authUsersRef.where("email", "==", email).get();
    if (!existing.empty) {
      return NextResponse.json({ error: "An account with this email already exists" }, { status: 400 });
    }

    const docRef = authUsersRef.doc();
    const newUid = docRef.id;

    const actualRole = role || "tenant";
    const accountStatus = actualRole === "pg_owner" ? "pending_approval" : "active";

    await docRef.set({
      email,
      password, // Basic auth
      displayName: name,
      phone: phone || "",
      altPhone: "",
      role: actualRole,
      account_status: accountStatus,
      gender: "",
      address: "",
      dob: null,
      isActive: true,
      aadhaarVerified: false,
      createdAt: new Date(),
      lastLoginAt: new Date(),
    });

    await usersRef.doc(newUid).set({
      email,
      name,
      phone: phone || "",
      altPhone: "",
      role: actualRole,
      account_status: accountStatus,
      gender: "",
      address: "",
      aadhaarVerified: false,
      dob: null,
      createdAt: new Date(),
    });

    // Send the welcome email
    await sendWelcomeEmail({
      to: email,
      recipientName: name,
    }).catch(err => {
      // Catch errors so the user still registers successfully even if email fails
      console.error("Failed to send welcome email:", err);
    });

    return NextResponse.json(
      {
        uid: newUid,
        email,
        displayName: name,
        role: actualRole,
        account_status: accountStatus,
        aadhaarVerified: false,
        idToken: newUid,
        expiresIn: TOKEN_EXPIRES_IN_SEC,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Register API error:", error);
    return NextResponse.json({ error: "Register failed" }, { status: 500 });
  }
}
