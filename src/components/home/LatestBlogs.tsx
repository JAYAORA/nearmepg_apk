import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock } from "lucide-react";
import { getFeaturedBlogPosts } from "@/app/api/_db/blog-data";
import { BLOG_CATEGORY_LABELS, type BlogCategory } from "@/types/blog";

const CATEGORY_COLORS: Record<BlogCategory, string> = {
  tips: "bg-blue-100 text-blue-700",
  guides: "bg-emerald-100 text-emerald-700",
  news: "bg-purple-100 text-purple-700",
  coliving: "bg-amber-100 text-amber-700",
  "student-life": "bg-rose-100 text-rose-700",
  "city-guide": "bg-indigo-100 text-indigo-700",
};

export default async function LatestBlogs() {
  const posts = await getFeaturedBlogPosts();
  if (posts.length === 0) return null;

  return (
    <section
      className="w-full md:max-w-7xl mx-auto px-4 sm:px-6 py-16"
      aria-labelledby="latest-blogs-heading"
    >
      {/* Header */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <div className="text-xs font-bold uppercase tracking-widest text-amber-700 mb-2">
            From the Blog
          </div>
          <h2
            id="latest-blogs-heading"
            className="font-display text-3xl md:text-4xl font-bold text-slate-900"
          >
            Tips & Guides for PG Living
          </h2>
        </div>
        <Link
          href="/blog"
          className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-amber-700 hover:underline"
          aria-label="View all blog articles"
        >
          View all <ArrowRight className="size-4" />
        </Link>
      </div>

      {/* Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {posts.map((post, i) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className="group rounded-2xl overflow-hidden border border-slate-100 shadow-soft hover:shadow-warm hover:-translate-y-0.5 transition-all duration-300 flex flex-col bg-white"
            aria-label={`Read: ${post.title}`}
          >
            {/* Cover */}
            <div className="relative h-48 overflow-hidden">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span
                className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold ${CATEGORY_COLORS[post.category]}`}
              >
                {BLOG_CATEGORY_LABELS[post.category]}
              </span>
            </div>

            {/* Body */}
            <div className="p-5 flex flex-col flex-1">
              <h3 className="font-bold text-slate-900 leading-snug mb-2 group-hover:text-amber-600 transition-colors line-clamp-2">
                {post.title}
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed line-clamp-2 flex-1">
                {post.excerpt}
              </p>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {post.author.avatar && (
                    <Image
                      src={post.author.avatar}
                      alt={post.author.name}
                      width={24}
                      height={24}
                      className="rounded-full"
                    />
                  )}
                  <span className="text-xs text-slate-500">{post.author.name}</span>
                </div>
                <span className="flex items-center gap-1 text-xs text-slate-400">
                  <Clock className="size-3" />
                  {post.readingTime} min
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Mobile "view all" */}
      <div className="mt-8 text-center sm:hidden">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1 text-sm font-semibold text-amber-700 hover:underline"
        >
          View all articles <ArrowRight className="size-4" />
        </Link>
      </div>
    </section>
  );
}
