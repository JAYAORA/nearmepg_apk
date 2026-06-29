import { NextResponse } from "next/server";
import { db } from "@/app/api/_db/firebase-admin";

const bookingRequests = db.collection("booking_requests");
const authUsers = db.collection("auth_users");

function normalize(v: any) {
  return String(v || "").trim().toLowerCase();
}

/**
 * GET /api/bookings
 *
 * Query params:
 *   role        — caller's role (admin | super_admin | pg_owner | hotel_owner | tenant)
 *   userEmail   — caller's email (used to scope pg_owner results)
 *   status      — comma-separated booking_status filter (e.g. "checked-in,pending")
 *   search      — free-text search
 *   propertyId  — filter by hostelId
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const role = normalize(searchParams.get("role"));
    const userEmail = normalize(searchParams.get("userEmail"));
    const statusFilter = normalize(searchParams.get("status"));
    const search = normalize(searchParams.get("search"));
    const propertyId = normalize(searchParams.get("propertyId"));

    // Only allow owner/admin/super_admin to access this endpoint
    const isAdmin = role === "admin" || role === "super_admin";
    const isOwner = role === "pg_owner" || role === "hotel_owner";

    if (!isAdmin && !isOwner) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Build user display name map for enriching tenant_name
    const usersSnap = await authUsers.get();
    const userMap: Record<string, string> = {};
    usersSnap.forEach((doc) => {
      const d = doc.data();
      if (d.email) userMap[d.email.toLowerCase()] = d.displayName || d.name || "";
      userMap[doc.id] = d.displayName || d.name || "";
    });

    // Fetch owner's properties to filter correctly
    let ownerPropertyIds: string[] = [];
    if (isOwner) {
      const dbHostels = db.collection("hostels");
      const [snap1, snap2] = await Promise.all([
        dbHostels.where("owner_email", "==", userEmail).get(),
        dbHostels.where("owner_mail", "==", userEmail).get(),
      ]);
      const propSet = new Set<string>();
      snap1.forEach(doc => propSet.add(doc.id));
      snap2.forEach(doc => propSet.add(doc.id));
      ownerPropertyIds = Array.from(propSet);
    }

    const snapshot = await bookingRequests.get();
    const statuses = statusFilter ? statusFilter.split(",").map(normalize) : [];

    const items = snapshot.docs
      .map((doc) => {
        const data = doc.data() as any;
        // Always resolve tenant_name live from auth_users using email as the
        // canonical key — email is immutable so this is always the right identity.
        // Phone is intentionally NOT overridden here (payments keep the number
        // used at booking time as a record).
        const emailKey = data.tenant_email ? data.tenant_email.toLowerCase() : null;
        const liveName =
          (emailKey ? userMap[emailKey] : null) ||
          userMap[data.tenant_id] ||
          null;
        if (liveName) {
          data.tenant_name = liveName;
        } else if (!data.tenant_name) {
          data.tenant_name = data.tenant_email || "Unknown Tenant";
        }
        return { id: doc.id, ...data };
      })
      // Role-scoped filter
      .filter((item: any) => {
        if (isAdmin) return true;
        // pg_owner / hotel_owner — only see bookings for their properties
        return ownerPropertyIds.includes(item.property?.hostelId);
      })
      // Status filter
      .filter((item: any) => {
        if (!statuses.length) return normalize(item.booking_status) !== "payment_pending";
        return statuses.includes(normalize(item.booking_status));
      })
      // Property filter
      .filter((item: any) => {
        if (!propertyId) return true;
        return normalize(item.property?.hostelId) === propertyId;
      })
      // Full-text search
      .filter((item: any) => {
        if (!search) return true;
        const haystack = [
          item.id,
          item.booking_code,
          item.tenant_name,
          item.tenant_email,
          item.property?.hostelName,
          item.property?.location,
          item.room?.roomName,
          item.room?.roomId,
          item.room?.bedId,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return haystack.includes(search);
      })
      .sort((a: any, b: any) => {
        const aTime = new Date(a.created_at || 0).getTime();
        const bTime = new Date(b.created_at || 0).getTime();
        return bTime - aTime;
      });

    return NextResponse.json(items);
  } catch (error: any) {
    console.error("GET /api/bookings error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}
