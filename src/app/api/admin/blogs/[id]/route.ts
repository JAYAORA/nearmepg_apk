import { NextResponse } from "next/server";
import { db } from "@/app/api/_db/firebase-admin";

// PUT update an existing blog or toggle visibility
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { searchParams } = new URL(req.url);
    const callerRole = (searchParams.get("callerRole") || "").toLowerCase();

    if (callerRole !== "admin" && callerRole !== "super_admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();
    
    const docRef = db.collection("blogs").doc(id);
    const doc = await docRef.get();
    
    if (!doc.exists) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    const updates = {
      ...body,
      updatedAt: new Date().toISOString(),
    };
    
    // Prevent overriding the ID
    delete updates.id;

    await docRef.update(updates);

    return NextResponse.json({ success: true, message: "Blog updated successfully" });
  } catch (error: any) {
    console.error("PUT /api/admin/blogs/[id] error:", error);
    return NextResponse.json({ error: "Failed to update blog" }, { status: 500 });
  }
}

// DELETE a blog post
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { searchParams } = new URL(req.url);
    const callerRole = (searchParams.get("callerRole") || "").toLowerCase();

    if (callerRole !== "admin" && callerRole !== "super_admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    await db.collection("blogs").doc(id).delete();

    return NextResponse.json({ success: true, message: "Blog deleted successfully" });
  } catch (error: any) {
    console.error("DELETE /api/admin/blogs/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete blog" }, { status: 500 });
  }
}
