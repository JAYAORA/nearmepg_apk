import { NextResponse } from "next/server";
import { db } from "@/app/api/_db/firebase-admin";

/**
 * POST /api/account/verify-kyc
 * Simulates a Surepass / DigiLocker verification process.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { uid, aadhaarNumber } = body;

    if (!uid || !aadhaarNumber) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Simulate an API delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simulate some simple validation (must be 12 digits)
    if (!/^\d{12}$/.test(aadhaarNumber.replace(/\s+/g, ""))) {
      return NextResponse.json({ error: "Invalid Aadhaar format. Must be 12 digits." }, { status: 400 });
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
      tx.update(authUserRef, { aadhaarVerified: true });
      if (userSnap.exists) {
        tx.update(userRef, { aadhaarVerified: true });
      }
    });

    return NextResponse.json({ success: true, message: "KYC Verified Successfully via DigiLocker" });
  } catch (error: any) {
    console.error("POST /api/account/verify-kyc error:", error);
    return NextResponse.json({ error: error.message || "Verification failed" }, { status: 500 });
  }
}
