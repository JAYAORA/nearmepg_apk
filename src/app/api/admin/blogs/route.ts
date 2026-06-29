import { NextResponse } from "next/server";
import { db } from "@/app/api/_db/firebase-admin";

// GET all blogs for admin dashboard
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const callerRole = (searchParams.get("callerRole") || "").toLowerCase();

    if (callerRole !== "admin" && callerRole !== "super_admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const snapshot = await db.collection("blogs").get();
    const blogs = snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .sort((a: any, b: any) => new Date(b.publishedAt || 0).getTime() - new Date(a.publishedAt || 0).getTime());

    return NextResponse.json(blogs);
  } catch (error: any) {
    console.error("GET /api/admin/blogs error:", error);
    return NextResponse.json({ error: "Failed to fetch blogs" }, { status: 500 });
  }
}

// POST create a new blog
export async function POST(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const callerRole = (searchParams.get("callerRole") || "").toLowerCase();

    if (callerRole !== "admin" && callerRole !== "super_admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { slug, title, excerpt, content, coverImage, category, tags, author, publishedAt, readingTime, isFeatured } = body;

    if (!slug || !title || !content || !author) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newBlog = {
      id: slug, // Using slug as ID for easier routing
      slug,
      title,
      excerpt: excerpt || "",
      content,
      coverImage: coverImage || "",
      category: category || "guides",
      tags: tags || [],
      author,
      publishedAt: publishedAt || new Date().toISOString(),
      readingTime: readingTime || 5,
      isFeatured: isFeatured || false,
      isHidden: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await db.collection("blogs").doc(slug).set(newBlog);

    return NextResponse.json({ success: true, blog: newBlog });
  } catch (error: any) {
    console.error("POST /api/admin/blogs error:", error);
    return NextResponse.json({ error: "Failed to create blog" }, { status: 500 });
  }
}
