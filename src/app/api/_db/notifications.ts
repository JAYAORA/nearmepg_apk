import { db } from "@/app/api/_db/firebase-admin";

export async function createNotification(opts: {
  userId: string;
  title: string;
  message: string;
  type?: "info" | "success" | "warning" | "error";
  actionUrl?: string;
}) {
  try {
    const notifRef = db.collection("notifications").doc();
    await notifRef.set({
      userId: opts.userId,
      title: opts.title,
      message: opts.message,
      type: opts.type || "info",
      actionUrl: opts.actionUrl || null,
      read: false,
      createdAt: new Date(),
    });
  } catch (error) {
    console.error("Failed to create notification:", error);
  }
}
