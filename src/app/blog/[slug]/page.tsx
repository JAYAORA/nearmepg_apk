import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Clock, Calendar, ArrowLeft, Tag } from "lucide-react";
import { getBlogPostBySlug, getBlogPosts } from "@/app/api/_db/blog-data";
import { BLOG_CATEGORY_LABELS, type BlogCategory } from "@/types/blog";
import { AvatarFallback } from "@/components/blog/AvatarFallback";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `https://nearmepg.com/blog/${slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      url: `https://nearmepg.com/blog/${slug}`,
      images: [{ url: post.coverImage, width: 800, height: 450, alt: post.title }],
      publishedTime: post.publishedAt,
      authors: [post.author.name],
      tags: post.tags,
    },
  };
}

const CATEGORY_COLORS: Record<BlogCategory, string> = {
  tips: "bg-blue-100 text-blue-700",
  guides: "bg-emerald-100 text-emerald-700",
  news: "bg-purple-100 text-purple-700",
  coliving: "bg-amber-100 text-amber-700",
  "student-life": "bg-rose-100 text-rose-700",
  "city-guide": "bg-indigo-100 text-indigo-700",
};

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) notFound();

  const allPosts = await getBlogPosts();
  const related = allPosts
    .filter((p) => p.slug !== slug && p.category === post.category)
    .slice(0, 3);

  return (
    <main className="min-h-screen bg-white">
      {/* ── Cover Image ── */}
      <div className="relative w-full h-72 md:h-96">
        <Image
          src={post.coverImage}
          alt={post.title}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 max-w-3xl mx-auto px-4 sm:px-6 pb-8">
          <span
            className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold mb-3 ${CATEGORY_COLORS[post.category]}`}
          >
            {BLOG_CATEGORY_LABELS[post.category]}
          </span>
          <h1 className="text-white text-2xl md:text-4xl font-bold leading-tight">
            {post.title}
          </h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        {/* ── Breadcrumb ── */}
        <nav className="mb-6 text-sm text-slate-500 flex items-center gap-1.5">
          <Link href="/" className="hover:text-amber-600 transition-colors">Home</Link>
          <span>›</span>
          <Link href="/blog" className="hover:text-amber-600 transition-colors">Blog</Link>
          <span>›</span>
          <span className="text-slate-800 line-clamp-1">{post.title}</span>
        </nav>

        {/* ── Meta ── */}
        <div className="flex flex-wrap items-center gap-4 mb-8 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-2">
            {post.author.avatar ? (
              <Image
                src={post.author.avatar}
                alt={post.author.name}
                width={40}
                height={40}
                className="rounded-full"
              />
            ) : (
              <AvatarFallback name={post.author.name} size="lg" />
            )}
            <div>
              <div className="text-sm font-semibold text-slate-800">{post.author.name}</div>
              {post.author.role && (
                <div className="text-xs text-slate-400">{post.author.role}</div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-400 ml-auto">
            <span className="flex items-center gap-1">
              <Calendar className="size-3" />
              {new Date(post.publishedAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="size-3" />
              {post.readingTime} min read
            </span>
          </div>
        </div>

        {/* ── Excerpt ── */}
        <p className="text-lg text-slate-600 leading-relaxed mb-8 font-medium">
          {post.excerpt}
        </p>

        {/* ── Content ── */}
        {post.content ? (
          <article
            className="text-slate-700 leading-relaxed space-y-4 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-slate-900 [&_h2]:mt-8 [&_h2]:mb-3 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-slate-800 [&_h3]:mt-6 [&_h3]:mb-2 [&_p]:text-slate-600 [&_p]:leading-relaxed [&_a]:text-amber-600 [&_a]:no-underline hover:[&_a]:underline [&_img]:rounded-xl [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        ) : (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-amber-800 text-sm">
            Full article content will be loaded from the API.
          </div>
        )}

        {/* ── Tags ── */}
        <div className="mt-10 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium"
            >
              <Tag className="size-3" />
              {tag}
            </span>
          ))}
        </div>

        {/* ── Back ── */}
        <div className="mt-12">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-semibold text-amber-700 hover:text-amber-800 transition-colors"
          >
            <ArrowLeft className="size-4" /> Back to Blog
          </Link>
        </div>

        {/* ── Related Posts ── */}
        {related.length > 0 && (
          <section className="mt-16 pt-10 border-t border-slate-100" aria-labelledby="related-heading">
            <h2 id="related-heading" className="text-xs font-bold uppercase tracking-widest text-amber-700 mb-6">
              Related Articles
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {related.map((rp) => (
                <Link
                  key={rp.id}
                  href={`/blog/${rp.slug}`}
                  className="group flex gap-3 p-4 rounded-xl border border-slate-100 hover:border-amber-200 hover:bg-amber-50/40 transition-all"
                >
                  <div className="relative w-20 h-16 flex-shrink-0 rounded-lg overflow-hidden">
                    <Image
                      src={rp.coverImage}
                      alt={rp.title}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-slate-800 group-hover:text-amber-600 transition-colors line-clamp-2 leading-snug">
                      {rp.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">{rp.readingTime} min read</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* ── JSON-LD ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            description: post.excerpt,
            image: post.coverImage,
            datePublished: post.publishedAt,
            author: {
              "@type": "Person",
              name: post.author.name,
            },
            publisher: {
              "@type": "Organization",
              name: "NearMePG",
              url: "https://nearmepg.com",
            },
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": `https://nearmepg.com/blog/${post.slug}`,
            },
            keywords: post.tags.join(", "),
          }),
        }}
      />
    </main>
  );
}
