import type { Metadata } from "next";
import Link from "next/link";
import { Users, MessageSquare, TrendingUp } from "lucide-react";
import { getCommunityPosts } from "@/app/api/_db/blog-data";
import PostsFeed from "./PostsFeed";

export const metadata: Metadata = {
  title: "Community Posts — PG Experiences & Housing Discussions",
  description:
    "Join India's growing PG community. Share your housing experiences, ask questions, and help fellow tenants find the perfect paying guest accommodation.",
  alternates: { canonical: "https://nearmepg.com/posts" },
  openGraph: {
    title: "NearMePG Community — Share PG Experiences",
    description:
      "Ask questions, share reviews, and connect with thousands of students and professionals finding PGs across India.",
    type: "website",
    url: "https://nearmepg.com/posts",
  },
};

export default async function PostsPage() {
  const posts = await getCommunityPosts();

  const stats = [
    { icon: Users, label: "Community Members", value: "12,000+" },
    { icon: MessageSquare, label: "Posts Shared", value: "4,500+" },
    { icon: TrendingUp, label: "Cities Active", value: "25+" },
  ];

  return (
    <main className="min-h-screen bg-slate-50">
      {/* ── Hero ── */}
      <section className="bg-gradient-to-br from-amber-600 via-orange-600 to-rose-600 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 border border-white/30 text-white text-xs font-semibold uppercase tracking-widest mb-6">
            Community
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            Real Stories from Real Tenants
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto leading-relaxed">
            Ask questions, share your PG experience, discover tips from fellow students
            and professionals finding their perfect home away from home.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto mt-10">
            {stats.map(({ icon: Icon, label, value }) => (
              <div key={label} className="bg-white/15 backdrop-blur-sm rounded-xl p-3">
                <Icon className="size-5 mx-auto mb-1 text-white/80" />
                <div className="text-xl font-bold">{value}</div>
                <div className="text-xs text-white/70 leading-tight">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Breadcrumb ── */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 text-sm text-slate-500 flex items-center gap-1.5">
        <Link href="/" className="hover:text-amber-600 transition-colors">Home</Link>
        <span>›</span>
        <span className="text-slate-800">Community Posts</span>
      </nav>

      {/* ── Feed (client component) ── */}
      <PostsFeed initialPosts={posts} />

      {/* ── JSON-LD ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "DiscussionForumPosting",
            name: "NearMePG Community",
            url: "https://nearmepg.com/posts",
            description:
              "Community forum for PG seekers and tenants across India to share experiences and tips.",
          }),
        }}
      />
    </main>
  );
}
