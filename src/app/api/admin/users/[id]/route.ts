import { NextResponse } from "next/server";
import { db } from "@/app/api/_db/firebase-admin";
import { sendOwnerApprovedEmail } from "@/lib/email";
import { createNotification } from "@/app/api/_db/notifications";

const authUsers = db.collection("auth_users");
const usersCol = db.collection("users");

/**
 * PUT /api/admin/users/[id]
 * Update role, displayName, phone, isActive for a user
 */
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { callerRole, role, displayName, phone, isActive, account_status } = body;

    if (callerRole !== "admin" && callerRole !== "super_admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const docRef = authUsers.doc(id);
    const docSnap = await docRef.get();
    if (!docSnap.exists) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userData = docSnap.data()!;

    // Admins cannot promote others to admin/super_admin
    if (role && (role === "admin" || role === "super_admin") && callerRole !== "super_admin") {
      return NextResponse.json({ error: "Only super_admin can assign admin roles" }, { status: 403 });
    }

    // Admins cannot modify admin/super_admin users (except super_admin)
    if ((userData.role === "admin" || userData.role === "super_admin") && callerRole !== "super_admin") {
      return NextResponse.json({ error: "Only super_admin can modify admin accounts" }, { status: 403 });
    }

    const updates: Record<string, any> = {};
    if (role !== undefined) updates.role = role;
    if (displayName !== undefined) updates.displayName = displayName;
    if (phone !== undefined) updates.phone = phone;
    if (isActive !== undefined) updates.isActive = isActive;
    if (account_status !== undefined) updates.account_status = account_status;

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }

    await docRef.update(updates);

    // Sync to users collection
    const userUpdates: Record<string, any> = {};
    if (role !== undefined) userUpdates.role = role;
    if (displayName !== undefined) userUpdates.name = displayName;
    if (phone !== undefined) userUpdates.phone = phone;

    if (Object.keys(userUpdates).length > 0) {
      const userDocRef = usersCol.doc(id);
      const userDoc = await userDocRef.get();
      if (userDoc.exists) await userDocRef.update(userUpdates);
    }

    // Send email if approving
    if (account_status === "active" && userData.account_status === "pending_approval") {
      try {
        await sendOwnerApprovedEmail({
          to: userData.email,
          name: userData.displayName || "Owner",
        });
        await createNotification({
          userId: id,
          title: "Account Approved",
          message: "Your owner account has been approved. You can now list properties.",
          type: "success",
          actionUrl: "/owner",
        });
      } catch (err) {
        console.error("Failed to send owner approved email/notification:", err);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("PUT /api/admin/users/[id] error:", error);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}
