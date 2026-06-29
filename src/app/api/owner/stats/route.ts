import { NextResponse } from "next/server";
import { db } from "@/app/api/_db/firebase-admin";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const ownerEmail = searchParams.get("email");
    const callerRole = (searchParams.get("role") || "").toLowerCase();

    if (!ownerEmail || (callerRole !== "pg_owner" && callerRole !== "hotel_owner")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // 1. Fetch properties owned by this owner
    const [snap1, snap2] = await Promise.all([
      db.collection("hostels").where("owner_email", "==", ownerEmail).get(),
      db.collection("hostels").where("owner_mail", "==", ownerEmail).get()
    ]);
    const propSet = new Map<string, any>();
    snap1.forEach(doc => propSet.set(doc.id, { id: doc.id, ...doc.data() }));
    snap2.forEach(doc => propSet.set(doc.id, { id: doc.id, ...doc.data() }));
    const properties = Array.from(propSet.values());
    const propertyIds = Array.from(propSet.keys());

    if (propertyIds.length === 0) {
      return NextResponse.json({
        totalRevenue: 0,
        occupancyRate: 0,
        propertyStats: [],
        upcomingEvents: [],
      });
    }

    // 2. Build live user name map from auth_users (email is the canonical immutable key)
    const authUsersSnap = await db.collection("auth_users").get();
    const userNameMap: Record<string, string> = {};
    authUsersSnap.forEach((doc) => {
      const d = doc.data();
      const liveName = d.displayName || d.name || "";
      if (d.email && liveName) {
        userNameMap[d.email.toLowerCase()] = liveName;
      }
      if (liveName) {
        userNameMap[doc.id] = liveName;
      }
    });

    // Helper: resolve live name using email as canonical key
    function resolveName(tenantEmail?: string, tenantName?: string, tenantId?: string): string {
      const emailKey = tenantEmail ? tenantEmail.toLowerCase() : null;
      return (
        (emailKey ? userNameMap[emailKey] : null) ||
        (tenantId ? userNameMap[tenantId] : null) ||
        tenantName ||
        tenantEmail ||
        "Unknown Tenant"
      );
    }

    // Helper to chunk arrays
    const chunkArray = (arr: any[], size: number) => {
      const chunks = [];
      for (let i = 0; i < arr.length; i += size) {
        chunks.push(arr.slice(i, i + size));
      }
      return chunks;
    };

    const propertyIdChunks = chunkArray(propertyIds, 30);

    // 3. Fetch all bookings for these properties
    const bookingPromises = propertyIdChunks.map(chunk => 
      db.collection("bookings").where("property.hostelId", "in", chunk).get()
    );
    const bookingsSnaps = await Promise.all(bookingPromises);
    const bookingsDocs = bookingsSnaps.flatMap(snap => snap.docs);
    
    let totalRevenue = 0;
    const propertyRevenue: Record<string, { name: string; revenue: number }> = {};
    const upcomingEvents: any[] = [];
    
    const now = new Date();
    const twoWeeksFromNow = new Date();
    twoWeeksFromNow.setDate(now.getDate() + 14);

    properties.forEach(p => {
      propertyRevenue[p.id] = { name: (p as any).name, revenue: 0 };
    });

    bookingsDocs.forEach((doc) => {
      const data = doc.data();
      
      // Revenue calculation
      if (data.status !== "cancelled" && data.status !== "pending") {
        const amount = Number(data.totalPrice || 0);
        totalRevenue += amount;
        if (data.property?.hostelId && propertyRevenue[data.property.hostelId]) {
          propertyRevenue[data.property.hostelId].revenue += amount;
        }
      }

      // Upcoming Check-ins / Check-outs (within 14 days)
      if (data.status === "checked-in" || data.status === "confirmed") {
        const inDate = data.checkIn ? new Date(data.checkIn) : null;
        const outDate = data.checkOut ? new Date(data.checkOut) : null;

        if (inDate && inDate >= now && inDate <= twoWeeksFromNow) {
          upcomingEvents.push({
            id: doc.id,
            type: "check-in",
            date: data.checkIn,
            tenantName: resolveName(data.tenant_email, data.tenant_name, data.tenant_id),
            property: data.property?.hostelName,
            room: data.room?.roomName || data.room?.roomId,
          });
        }
        
        if (outDate && outDate >= now && outDate <= twoWeeksFromNow) {
          upcomingEvents.push({
            id: doc.id,
            type: "check-out",
            date: data.checkOut,
            tenantName: resolveName(data.tenant_email, data.tenant_name, data.tenant_id),
            property: data.property?.hostelName,
            room: data.room?.roomName || data.room?.roomId,
          });
        }
      }
    });

    // 4. Fetch occupancy rate
    const roomsPromises = propertyIdChunks.map(chunk => 
      db.collection("property_rooms").where("hostelId", "in", chunk).get()
    );
    const roomsSnaps = await Promise.all(roomsPromises);
    const roomsDocs = roomsSnaps.flatMap(snap => snap.docs);
    
    let totalCapacity = 0;
    let occupiedCount = 0;

    roomsDocs.forEach(doc => {
      const room = doc.data();
      const beds = room.beds || [];
      
      if (beds.length > 0) {
        totalCapacity += beds.length;
        occupiedCount += beds.filter((b: any) => b.status === "occupied" || b.status === "reserved").length;
      } else {
        totalCapacity += 1;
        if (!room.available) {
          occupiedCount += 1;
        }
      }
    });

    const occupancyRate = totalCapacity === 0 ? 0 : Math.round((occupiedCount / totalCapacity) * 100);

    // Sort upcoming events by date
    upcomingEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return NextResponse.json({
      totalRevenue,
      occupancyRate,
      propertyStats: Object.values(propertyRevenue),
      upcomingEvents: upcomingEvents.slice(0, 10), // Limit to top 10
    });
  } catch (error: any) {
    console.error("GET /api/owner/stats error:", error);
    return NextResponse.json({ error: "Failed to fetch owner stats" }, { status: 500 });
  }
}
