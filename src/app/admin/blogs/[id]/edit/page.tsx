"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useAuth, useIsAdmin } from "@/data/auth-context";
import BlogForm from "../../BlogForm";

export default function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const { user, isAuthenticated } = useAuth();
  const isAdmin = useIsAdmin();
  
  const resolvedParams = use(params);
  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) return;
    if (!isAdmin) {
      setLoading(false);
      return;
    }

    const fetchBlog = async () => {
      try {
        const res = await fetch(`/api/admin/blogs?callerRole=${user?.role}`);
        const data = await res.json();
        const found = data.find((b: any) => b.id === resolvedParams.id);
        if (!found) throw new Error("Blog not found");
        setBlog(found);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [isAuthenticated, isAdmin, resolvedParams.id, user]);

  if (!isAuthenticated || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-6 w-6 animate-spin text-amber-500" />
      </div>
    );
  }

  if (!isAdmin || error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center text-rose-500 font-semibold">
          {error || "Unauthorized access"}
        </div>
      </div>
    );
  }

  return (
    <main className="md:max-w-4xl md:mx-auto w-full px-5 sm:px-6 py-8 pb-20">
      <div className="mb-8">
        <Link
          href="/admin/blogs"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-amber-600 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Blogs
        </Link>
        <h1 className="font-display text-3xl font-bold text-slate-900 tracking-tight">
          Edit Blog Post
        </h1>
      </div>

      <BlogForm initialData={blog} isEdit callerRole={user?.role} />
    </main>
  );
}
