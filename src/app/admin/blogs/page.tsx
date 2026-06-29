"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Edit, Eye, EyeOff, Trash2, Loader2, FileText, Home, Star, Search } from "lucide-react";
import { useAuth, useIsAdmin } from "@/data/auth-context";
import { BlogPost } from "@/types/blog";
import { format } from "date-fns";

export default function AdminBlogsPage() {
  const { user, isAuthenticated } = useAuth();
  const isAdmin = useIsAdmin();

  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/blogs?callerRole=${user?.role}`);
      if (!res.ok) throw new Error("Failed to fetch blogs");
      const data = await res.json();
      setBlogs(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      fetchBlogs();
    } else if (isAuthenticated && !isAdmin) {
      setLoading(false);
      setError("Unauthorized access");
    }
  }, [isAuthenticated, isAdmin, user]);

  const toggleVisibility = async (blog: any) => {
    try {
      const res = await fetch(`/api/admin/blogs/${blog.id}?callerRole=${user?.role}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isHidden: !blog.isHidden }),
      });
      if (!res.ok) throw new Error("Failed to update visibility");
      
      // Update local state
      setBlogs(blogs.map(b => b.id === blog.id ? { ...b, isHidden: !b.isHidden } : b));
    } catch (err: any) {
      alert(err.message);
    }
  };

  const toggleFeatured = async (blog: any) => {
    try {
      const res = await fetch(`/api/admin/blogs/${blog.id}?callerRole=${user?.role}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFeatured: !blog.isFeatured }),
      });
      if (!res.ok) throw new Error("Failed to update featured status");
      
      // Update local state
      setBlogs(blogs.map(b => b.id === blog.id ? { ...b, isFeatured: !b.isFeatured } : b));
    } catch (err: any) {
      alert(err.message);
    }
  };

  const deleteBlog = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog post permanently?")) return;
    
    try {
      const res = await fetch(`/api/admin/blogs/${id}?callerRole=${user?.role}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Failed to delete blog");
      
      setBlogs(blogs.filter(b => b.id !== id));
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (!isAuthenticated || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-6 w-6 animate-spin text-amber-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center text-rose-500 font-semibold">{error}</div>
      </div>
    );
  }

  return (
    <main className="md:max-w-10/12 md:mx-auto w-full px-5 sm:px-6 py-8 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <nav className="flex items-center gap-1.5 text-sm text-slate-500 mb-2">
            <Link href="/" className="hover:text-amber-600 transition-colors">
              <Home className="h-3.5 w-3.5" />
            </Link>
            <span>/</span>
            <Link href="/admin/dashboard" className="hover:text-amber-600 transition-colors">
              Admin
            </Link>
            <span>/</span>
            <span className="text-slate-800 font-medium">Blogs</span>
          </nav>
          <h1 className="font-display text-3xl font-bold text-slate-900 tracking-tight">
            Blog Management
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Create, edit, and hide articles on your platform.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search blogs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-slate-900 text-sm bg-white"
            />
          </div>
          <Link
            href="/admin/blogs/new"
            className="inline-flex justify-center items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-5 py-2.5 rounded-xl font-semibold shadow-sm transition-colors text-sm whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            Create New Post
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-sm font-semibold text-slate-500">
                <th className="py-4 px-6 font-medium">Post Title</th>
                <th className="py-4 px-6 font-medium">Author</th>
                <th className="py-4 px-6 font-medium">Category</th>
                <th className="py-4 px-6 font-medium">Published</th>
                <th className="py-4 px-6 font-medium text-center">Featured</th>
                <th className="py-4 px-6 font-medium text-center">Visibility</th>
                <th className="py-4 px-6 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {blogs.filter(b => b.title.toLowerCase().includes(searchQuery.toLowerCase()) || b.slug.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    <FileText className="h-12 w-12 mx-auto text-slate-300 mb-3" />
                    No blog posts found.
                  </td>
                </tr>
              ) : (
                blogs.filter(b => b.title.toLowerCase().includes(searchQuery.toLowerCase()) || b.slug.toLowerCase().includes(searchQuery.toLowerCase())).map((blog) => (
                  <tr key={blog.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-semibold text-slate-900 line-clamp-1">{blog.title}</div>
                      <div className="text-xs text-slate-400 mt-1">/{blog.slug}</div>
                    </td>
                    <td className="py-4 px-6 text-slate-600">
                      {blog.author?.name || "Unknown"}
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                        {blog.category}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-500">
                      {blog.publishedAt ? format(new Date(blog.publishedAt), "MMM d, yyyy") : "N/A"}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <button
                        onClick={() => toggleFeatured(blog)}
                        className={`inline-flex items-center justify-center w-8 h-8 rounded-full transition-colors ${
                          blog.isFeatured
                            ? "bg-amber-100 text-amber-500 hover:bg-amber-200"
                            : "bg-slate-100 text-slate-400 hover:bg-slate-200"
                        }`}
                        title={blog.isFeatured ? "Unmark as Featured" : "Mark as Featured"}
                      >
                        <Star className={`w-4 h-4 ${blog.isFeatured ? "fill-amber-500" : ""}`} />
                      </button>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <button
                        onClick={() => toggleVisibility(blog)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${
                          blog.isHidden
                            ? "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100"
                            : "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                        }`}
                      >
                        {blog.isHidden ? (
                          <><EyeOff className="w-3.5 h-3.5" /> Hidden</>
                        ) : (
                          <><Eye className="w-3.5 h-3.5" /> Public</>
                        )}
                      </button>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/blogs/${blog.id}/edit`}
                          className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => deleteBlog(blog.id)}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
