import { NextResponse } from "next/server";
import { db } from "@/app/api/_db/firebase-admin";

const authUsers = db.collection("auth_users");
const usersCol = db.collection("users");

/**
 * GET /api/admin/users
 * Query params: role, search
 * Requires caller to be admin or super_admin (validated via query param for now)
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const callerRole = (searchParams.get("callerRole") || "").toLowerCase();
    const roleFilter = (searchParams.get("role") || "").toLowerCase();
    const search = (searchParams.get("search") || "").toLowerCase();

    if (callerRole !== "admin" && callerRole !== "super_admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const snapshot = await authUsers.get();
    let items = snapshot.docs.map((doc) => {
      const data = doc.data();
      const { password, ...safe } = data; // Never expose password
      return { id: doc.id, ...safe };
    });

    if (roleFilter) {
      items = items.filter((u: any) => (u.role || "").toLowerCase() === roleFilter);
    }

    if (search) {
      items = items.filter((u: any) => {
        const haystack = [u.id, u.displayName, u.email, u.phone, u.role]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return haystack.includes(search);
      });
    }

    return NextResponse.json(items);
  } catch (error: any) {
    console.error("GET /api/admin/users error:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

/**
 * POST /api/admin/users
 * Create a user (admin or super_admin can use this to create owners/admins)
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { callerRole, email, password, displayName, role, phone } = body;

    if (callerRole !== "admin" && callerRole !== "super_admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // super_admin can assign any role; admin cannot create other admins
    const allowedRoles =
      callerRole === "super_admin"
        ? ["tenant", "pg_owner", "hotel_owner", "admin", "super_admin"]
        : ["tenant", "pg_owner", "hotel_owner"];

    if (!allowedRoles.includes(role)) {
      return NextResponse.json({ error: "You cannot assign this role" }, { status: 403 });
    }

    const existing = await authUsers.where("email", "==", email).get();
    if (!existing.empty) {
      return NextResponse.json({ error: "Email already exists" }, { status: 400 });
    }

    const docRef = authUsers.doc();
    const newUid = docRef.id;
    const now = new Date();

    await docRef.set({
      email,
      password,
      displayName: displayName || "",
      phone: phone || "",
      role: role || "tenant",
      isActive: true,
      createdAt: now,
      lastLoginAt: null,
    });

    await usersCol.doc(newUid).set({
      email,
      name: displayName || "",
      phone: phone || "",
      role: role || "tenant",
      createdAt: now,
    }, { merge: true });

    return NextResponse.json({ success: true, uid: newUid }, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/admin/users error:", error);
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}
