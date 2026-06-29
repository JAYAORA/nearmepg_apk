import { NextResponse } from "next/server";
import { db } from "@/app/api/_db/firebase-admin";

/**
 * GET /api/account/profile
 * Fetches the user's profile from auth_users.
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const uid = searchParams.get("uid");

    if (!uid) {
      return NextResponse.json({ error: "Missing user ID" }, { status: 400 });
    }

    const doc = await db.collection("auth_users").doc(uid).get();
    if (!doc.exists) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const data = doc.data()!;
    delete data.password;

    return NextResponse.json({ id: doc.id, ...data });
  } catch (error: any) {
    console.error("GET /api/account/profile error:", error);
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}

/**
 * PUT /api/account/profile
 * Updates the user's profile information in both auth_users and users collections.
 * They share the exact same document ID (uid).
 */
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { uid, displayName, phone, altPhone, gender, address, dob } = body;

    if (!uid) {
      return NextResponse.json({ error: "Missing user ID" }, { status: 400 });
    }

    const updates: Record<string, any> = {};
    if (displayName !== undefined) updates.displayName = displayName;
    if (phone !== undefined) updates.phone = phone;
    if (altPhone !== undefined) updates.altPhone = altPhone;
    if (gender !== undefined) updates.gender = gender;
    if (address !== undefined) updates.address = address;
    if (dob !== undefined) updates.dob = dob;

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }

    const authUserRef = db.collection("auth_users").doc(uid);
    const userRef = db.collection("users").doc(uid);

    await db.runTransaction(async (tx) => {
      // 1. All Reads
      const authSnap = await tx.get(authUserRef);
      if (!authSnap.exists) {
        throw new Error("User not found");
      }
      const userSnap = await tx.get(userRef);

      // 2. All Writes
      tx.update(authUserRef, updates);

      if (userSnap.exists) {
        // map displayName -> name for users collection
        const userColUpdates = { ...updates };
        if (userColUpdates.displayName !== undefined) {
          userColUpdates.name = userColUpdates.displayName;
          delete userColUpdates.displayName;
        }
        tx.update(userRef, userColUpdates);
      }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("PUT /api/account/profile error:", error);
    return NextResponse.json({ error: error.message || "Failed to update profile" }, { status: 500 });
  }
}
