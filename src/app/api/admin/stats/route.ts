import { NextResponse } from "next/server";
import { db } from "@/app/api/_db/firebase-admin";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const callerRole = (searchParams.get("callerRole") || "").toLowerCase();

    if (callerRole !== "admin" && callerRole !== "super_admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // 1. Fetch Users
    const authUsersSnap = await db.collection("auth_users").get();
    let totalUsers = 0;
    let pendingOwners = 0;

    authUsersSnap.docs.forEach((doc) => {
      const data = doc.data();
      totalUsers++;
      if (data.role === "pg_owner" && data.account_status === "pending_approval") {
        pendingOwners++;
      }
    });

    // 2. Fetch Properties
    const propertiesSnap = await db.collection("hostels").get();
    const totalProperties = propertiesSnap.docs.length;

    // 3. Fetch Bookings & Revenue
    const bookingsSnap = await db.collection("bookings").get();
    let totalBookings = 0;
    let activeBookings = 0;
    let totalRevenue = 0;

    bookingsSnap.docs.forEach((doc) => {
      const data = doc.data();
      totalBookings++;
      
      if (data.status === "checked-in" || data.status === "confirmed") {
        activeBookings++;
      }

      if (data.status !== "cancelled" && data.status !== "pending") {
        totalRevenue += data.totalPrice || 0;
      }
    });

    return NextResponse.json({
      totalUsers,
      pendingOwners,
      totalProperties,
      totalBookings,
      activeBookings,
      totalRevenue,
    });
  } catch (error: any) {
    console.error("GET /api/admin/stats error:", error);
    return NextResponse.json({ error: "Failed to fetch admin stats" }, { status: 500 });
  }
}
