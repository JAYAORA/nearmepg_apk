import { NextResponse } from "next/server";
import { db } from "@/app/api/_db/firebase-admin";

const authUsers = db.collection("auth_users");
const usersCol = db.collection("users");

/**
 * POST /api/admin/seed-test-users
 *
 * Creates one test account for each role if it doesn't already exist.
 * Protected by a hard-coded SEED_SECRET query param so it can't be
 * accidentally triggered in production.
 *
 * Call once: POST /api/admin/seed-test-users?secret=nearmepg-dev-seed
 */

const SEED_SECRET = "nearmepg-dev-seed";

const TEST_USERS = [
  {
    email: "tenant@test.nearmepg.com",
    password: "Tenant@123",
    displayName: "Test Tenant",
    role: "tenant",
    phone: "9000000001",
  },
  {
    email: "pgowner@test.nearmepg.com",
    password: "PgOwner@123",
    displayName: "Test PG Owner",
    role: "pg_owner",
    phone: "9000000002",
  },
  {
    email: "hotelowner@test.nearmepg.com",
    password: "Hotel@123",
    displayName: "Test Hotel Owner",
    role: "hotel_owner",
    phone: "9000000003",
  },
  {
    email: "admin@test.nearmepg.com",
    password: "Admin@123",
    displayName: "Test Admin",
    role: "admin",
    phone: "9000000004",
  },
  {
    email: "superadmin@test.nearmepg.com",
    password: "SuperAdmin@123",
    displayName: "Test Super Admin",
    role: "super_admin",
    phone: "9000000005",
  },
];

export async function POST(req: Request) {
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get("secret");

  if (secret !== SEED_SECRET) {
    return NextResponse.json({ error: "Forbidden — wrong secret" }, { status: 403 });
  }

  const results: { email: string; role: string; status: string; uid?: string }[] = [];

  for (const u of TEST_USERS) {
    try {
      // Skip if already exists
      const existing = await authUsers.where("email", "==", u.email).get();
      if (!existing.empty) {
        results.push({ email: u.email, role: u.role, status: "already_exists", uid: existing.docs[0].id });
        continue;
      }

      const docRef = authUsers.doc();
      const now = new Date();

      await docRef.set({
        email: u.email,
        password: u.password,
        displayName: u.displayName,
        phone: u.phone,
        role: u.role,
        isActive: true,
        aadhaarVerified: true,
        createdAt: now,
        lastLoginAt: null,
      });

      await usersCol.doc(docRef.id).set({
        email: u.email,
        name: u.displayName,
        phone: u.phone,
        role: u.role,
        aadhaarVerified: true,
        createdAt: now,
      });

      results.push({ email: u.email, role: u.role, status: "created", uid: docRef.id });
    } catch (err: any) {
      results.push({ email: u.email, role: u.role, status: `error: ${err.message}` });
    }
  }

  return NextResponse.json({ success: true, results, credentials: TEST_USERS.map(u => ({
    email: u.email,
    password: u.password,
    role: u.role,
  })) });
}
