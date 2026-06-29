"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { BLOG_CATEGORY_LABELS, BlogCategory } from "@/types/blog";

interface BlogFormProps {
  initialData?: any;
  isEdit?: boolean;
  callerRole?: string;
}

export default function BlogForm({ initialData, isEdit, callerRole }: BlogFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    excerpt: initialData?.excerpt || "",
    content: initialData?.content || "",
    coverImage: initialData?.coverImage || "",
    category: initialData?.category || "guides",
    tags: initialData?.tags?.join(", ") || "",
    authorName: initialData?.author?.name || "",
    authorAvatar: initialData?.author?.avatar || "",
    authorRole: initialData?.author?.role || "",
    isFeatured: initialData?.isFeatured || false,
    readingTime: initialData?.readingTime || 5,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const generateSlug = () => {
    if (!formData.title) return;
    const slug = formData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    setFormData(prev => ({ ...prev, slug }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      title: formData.title,
      slug: formData.slug,
      excerpt: formData.excerpt,
      content: formData.content,
      coverImage: formData.coverImage,
      category: formData.category,
      tags: formData.tags.split(",").map((t: string) => t.trim()).filter(Boolean),
      author: {
        id: formData.authorName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        name: formData.authorName,
        avatar: formData.authorAvatar,
        role: formData.authorRole,
      },
      isFeatured: formData.isFeatured,
      readingTime: Number(formData.readingTime) || 5,
      callerRole,
    };

    try {
      const url = isEdit ? `/api/admin/blogs/${initialData.id}?callerRole=${callerRole}` : `/api/admin/blogs?callerRole=${callerRole}`;
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save blog post");

      router.push("/admin/blogs");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 space-y-8">
      {error && (
        <div className="bg-rose-50 text-rose-600 p-4 rounded-xl text-sm font-medium border border-rose-100">
          {error}
        </div>
      )}

      {/* Basic Info */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900 border-b pb-2">Basic Info</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-sm font-semibold text-slate-700">Post Title *</label>
            <input
              required
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              onBlur={!isEdit && !formData.slug ? generateSlug : undefined}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-slate-900"
              placeholder="e.g. 5 Tips for First Time PG Seekers"
            />
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <label className="text-sm font-semibold text-slate-700">URL Slug *</label>
            <div className="flex gap-2">
              <input
                required
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                disabled={isEdit}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-slate-900 disabled:bg-slate-50 disabled:text-slate-500"
                placeholder="e.g. 5-tips-first-time-pg"
              />
              {!isEdit && (
                <button
                  type="button"
                  onClick={generateSlug}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors text-sm font-medium whitespace-nowrap"
                >
                  Generate
                </button>
              )}
            </div>
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <label className="text-sm font-semibold text-slate-700">Excerpt / Short Description *</label>
            <textarea
              required
              name="excerpt"
              value={formData.excerpt}
              onChange={handleChange}
              rows={2}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-slate-900 resize-none"
              placeholder="A short summary of the blog post..."
            />
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <label className="text-sm font-semibold text-slate-700">Cover Image URL</label>
            <input
              type="url"
              name="coverImage"
              value={formData.coverImage}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-slate-900"
              placeholder="https://example.com/image.jpg"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900 border-b pb-2">Content</h3>
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-700">Full HTML Content *</label>
          <textarea
            required
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows={15}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-slate-900 font-mono text-sm"
            placeholder="<h2>Section Title</h2><p>Your content here...</p>"
          />
        </div>
      </div>

      {/* Meta & Taxonomy */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900 border-b pb-2">Meta & Taxonomy</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">Category *</label>
            <select
              required
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-slate-900 bg-white"
            >
              {Object.entries(BLOG_CATEGORY_LABELS).map(([val, label]) => (
                <option key={val} value={val}>{label}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">Tags (comma separated)</label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-slate-900"
              placeholder="e.g. Tips, PG, Student Life"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">Estimated Reading Time (min)</label>
            <input
              type="number"
              name="readingTime"
              min="1"
              value={formData.readingTime}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-slate-900"
              placeholder="e.g. 5"
            />
          </div>

          <div className="space-y-1.5 md:col-span-1 flex items-center gap-3 pt-8">
            <input
              type="checkbox"
              id="isFeatured"
              name="isFeatured"
              checked={formData.isFeatured}
              onChange={handleChange}
              className="w-5 h-5 rounded border-slate-300 text-amber-500 focus:ring-amber-500"
            />
            <label htmlFor="isFeatured" className="text-sm font-semibold text-slate-700 cursor-pointer">
              Mark as Featured Post (Shows on homepage / top of blog)
            </label>
          </div>
        </div>
      </div>

      {/* Author */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900 border-b pb-2">Author Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">Author Name *</label>
            <input
              required
              type="text"
              name="authorName"
              value={formData.authorName}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-slate-900"
              placeholder="e.g. Priya Sharma"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">Author Role</label>
            <input
              type="text"
              name="authorRole"
              value={formData.authorRole}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-slate-900"
              placeholder="e.g. Content Lead"
            />
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <label className="text-sm font-semibold text-slate-700">Author Avatar URL (Optional)</label>
            <input
              type="url"
              name="authorAvatar"
              value={formData.authorAvatar}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-slate-900"
              placeholder="https://example.com/avatar.jpg"
            />
            <p className="text-xs text-slate-500 mt-1">If left blank, it will automatically use the first letter of the author's name.</p>
          </div>
        </div>
      </div>

      <div className="pt-6 border-t flex items-center justify-end gap-3">
        <Link
          href="/admin/blogs"
          className="px-5 py-2.5 rounded-xl text-slate-600 font-semibold hover:bg-slate-100 transition-colors text-sm"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-6 py-2.5 rounded-xl font-semibold shadow-sm transition-colors text-sm disabled:opacity-70"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {isEdit ? "Update Blog Post" : "Publish Blog Post"}
        </button>
      </div>
    </form>
  );
}
