import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock, Tag, Search } from "lucide-react";
import { getBlogPosts } from "@/app/api/_db/blog-data";
import { BLOG_CATEGORY_LABELS, type BlogCategory } from "@/types/blog";
import { AvatarFallback } from "@/components/blog/AvatarFallback";
import BlogSearch from "@/components/blog/BlogSearch";

export const metadata: Metadata = {
  title: "Blog — PG Tips, City Guides & Housing Insights",
  description:
    "Read expert guides on finding the perfect PG, city living tips, student accommodation advice, and coliving insights from the NearMePG team.",
  alternates: { canonical: "https://nearmepg.com/blog" },
  openGraph: {
    title: "NearMePG Blog — PG Tips, City Guides & Housing Insights",
    description:
      "Expert guides on PG accommodation, city living, student life, and housing trends in India.",
    type: "website",
    url: "https://nearmepg.com/blog",
  },
};

const CATEGORY_COLORS: Record<BlogCategory, string> = {
  tips: "bg-blue-100 text-blue-700",
  guides: "bg-emerald-100 text-emerald-700",
  news: "bg-purple-100 text-purple-700",
  coliving: "bg-amber-100 text-amber-700",
  "student-life": "bg-rose-100 text-rose-700",
  "city-guide": "bg-indigo-100 text-indigo-700",
};

export default async function BlogPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const searchQuery = q?.toLowerCase() || "";

  let posts = await getBlogPosts();
  
  if (searchQuery) {
    posts = posts.filter(p => 
      p.title.toLowerCase().includes(searchQuery) || 
      p.excerpt.toLowerCase().includes(searchQuery) ||
      p.tags.some(t => t.toLowerCase().includes(searchQuery))
    );
  }

  const featured = posts.filter((p) => p.isFeatured);
  const recent = posts.filter((p) => !p.isFeatured);

  return (
    <main className="min-h-screen bg-white">
      {/* ── Hero ── */}
      <section className="bg-linear-to-br from-slate-900 via-slate-800 to-indigo-950 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-semibold uppercase tracking-widest mb-6">
            NearMePG Blog
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            Insights for Smarter{" "}
            <span className="text-amber-400">PG Living</span>
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto leading-relaxed">
            Expert guides, city spotlights, student life advice, and the latest
            trends in PG and coliving accommodation across India.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        {/* ── Breadcrumb & Search ── */}
        <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <nav className="text-sm text-slate-500 flex items-center gap-1.5">
            <Link href="/" className="hover:text-amber-600 transition-colors">Home</Link>
            <span>›</span>
            <span className="text-slate-800">Blog</span>
          </nav>
          
          <div className="w-full md:w-auto flex-1 max-w-md ml-auto">
            <BlogSearch />
          </div>
        </div>

        {searchQuery && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-slate-800">
              Search results for "{q}"
            </h2>
            <p className="text-slate-500 text-sm mt-1">Found {posts.length} articles</p>
          </div>
        )}

        {/* ── Featured Posts ── */}
        {featured.length > 0 && !searchQuery && (
          <section className="mb-16" aria-labelledby="featured-heading">
            <h2 id="featured-heading" className="text-xs font-bold uppercase tracking-widest text-amber-700 mb-6">
              Featured Stories
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.map((post, i) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className={`group rounded-2xl overflow-hidden border border-slate-100 shadow-soft hover:shadow-warm transition-all duration-300 flex flex-col ${
                    i === 0 ? "md:col-span-2 lg:col-span-2" : ""
                  }`}
                  aria-label={`Read: ${post.title}`}
                >
                  <div className={`relative overflow-hidden ${i === 0 ? "h-72" : "h-52"}`}>
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      sizes={i === 0 ? "(max-width: 768px) 100vw, 66vw" : "33vw"}
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
                    <span
                      className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold ${CATEGORY_COLORS[post.category]}`}
                    >
                      {BLOG_CATEGORY_LABELS[post.category]}
                    </span>
                  </div>
                  <div className="p-5 flex flex-col flex-1 bg-white">
                    <h3 className="font-bold text-slate-900 text-lg leading-snug mb-2 group-hover:text-amber-600 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-sm text-slate-500 leading-relaxed line-clamp-2 flex-1">
                      {post.excerpt}
                    </p>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {post.author.avatar ? (
                          <Image
                            src={post.author.avatar}
                            alt={post.author.name}
                            width={28}
                            height={28}
                            className="rounded-full"
                          />
                        ) : (
                          <AvatarFallback name={post.author.name} size="md" />
                        )}
                        <span className="text-xs text-slate-500 font-medium">
                          {post.author.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-slate-400">
                        <Clock className="size-3" />
                        {post.readingTime} min read
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ── All Posts ── */}
        {recent.length > 0 ? (
          <section aria-labelledby="all-posts-heading">
            <h2 id="all-posts-heading" className="text-xs font-bold uppercase tracking-widest text-amber-700 mb-6">
              {searchQuery ? "Search Results" : "All Articles"}
            </h2>
            <div className="grid gap-6">
            {recent.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group flex flex-col md:flex-row gap-5 p-5 rounded-2xl border border-slate-100 hover:border-amber-200 hover:bg-amber-50/40 transition-all duration-200"
                aria-label={`Read: ${post.title}`}
              >
                <div className="relative w-full h-48 md:h-24 md:w-32 shrink-0 rounded-xl overflow-hidden">
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    sizes="128px"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${CATEGORY_COLORS[post.category]}`}
                    >
                      {BLOG_CATEGORY_LABELS[post.category]}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-slate-400">
                      <Clock className="size-3" />
                      {post.readingTime} min
                    </div>
                  </div>
                  <h3 className="font-bold text-slate-900 leading-snug mb-1 group-hover:text-amber-600 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-sm text-slate-500 line-clamp-2 flex-1">
                    {post.excerpt}
                  </p>
                  <div className="mt-2 flex items-center gap-1.5">
                    {post.author.avatar ? (
                      <Image
                        src={post.author.avatar}
                        alt={post.author.name}
                        width={20}
                        height={20}
                        className="rounded-full"
                      />
                    ) : (
                      <AvatarFallback name={post.author.name} size="sm" />
                    )}
                    <span className="text-xs text-slate-400">
                      {post.author.name} ·{" "}
                      {new Date(post.publishedAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
                <div className="shrink-0 hidden md:flex items-center text-slate-300 group-hover:text-amber-500 transition-colors">
                  <ArrowRight className="size-5" />
                </div>
              </Link>
            ))}
          </div>
        </section>
        ) : (
          <div className="py-20 text-center">
            <Search className="h-12 w-12 text-slate-200 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-800 mb-2">No articles found</h3>
            <p className="text-slate-500">We couldn't find any articles matching your search.</p>
            {searchQuery && (
              <Link href="/blog" className="inline-block mt-6 text-amber-600 font-medium hover:text-amber-700">
                Clear search and see all articles &rarr;
              </Link>
            )}
          </div>
        )}
      </div>

      {/* ── JSON-LD ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            name: "NearMePG Blog",
            url: "https://nearmepg.com/blog",
            description:
              "Expert guides on PG accommodation, city living, student life, and housing trends in India.",
            publisher: {
              "@type": "Organization",
              name: "NearMePG",
              url: "https://nearmepg.com",
            },
            blogPost: posts.slice(0, 5).map((p) => ({
              "@type": "BlogPosting",
              headline: p.title,
              url: `https://nearmepg.com/blog/${p.slug}`,
              datePublished: p.publishedAt,
              author: { "@type": "Person", name: p.author.name },
            })),
          }),
        }}
      />
    </main>
  );
}
