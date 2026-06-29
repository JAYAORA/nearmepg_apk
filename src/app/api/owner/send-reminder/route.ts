import { NextResponse } from "next/server";
import { db } from "@/app/api/_db/firebase-admin";
import { sendRentReminderEmail } from "@/lib/email";
import { createNotification } from "@/app/api/_db/notifications";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { tenantId, ownerId, propertyName, roomName, dueDate, amount } = body;

    if (!tenantId || !ownerId || !dueDate) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    console.log("tenantId: ", tenantId);
    const tenantDoc = await db.collection("users").doc(tenantId).get();
    console.log(tenantDoc);

    if (!tenantDoc.exists) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
    }

    const tenantData = tenantDoc.data()!;
    const tenantEmail = tenantData.email;
    const tenantName = tenantData.name || "Tenant";

    console.log(tenantData);
    console.log(tenantEmail);
    console.log(tenantName);

    if (!tenantEmail) {
      return NextResponse.json(
        { error: "Tenant has no email address" },
        { status: 400 },
      );
    }

    // Send email
    await sendRentReminderEmail({
      to: tenantEmail,
      tenantName,
      propertyName: propertyName || "your property",
      roomName: roomName || "your room",
      dueDate,
      amount,
    });

    // Create In-App Notification
    await createNotification({
      userId: tenantId,
      title: "Rent Reminder",
      message: `Your rent for ${propertyName || "your property"} is due on ${new Date(dueDate).toLocaleDateString("en-IN")}.`,
      type: "warning",
      actionUrl: "/account/bookings",
    });

    return NextResponse.json({
      success: true,
      message: "Reminder sent successfully",
    });
  } catch (error: any) {
    console.error("POST /api/owner/send-reminder error:", error);
    return NextResponse.json(
      { error: "Failed to send reminder" },
      { status: 500 },
    );
  }
}
