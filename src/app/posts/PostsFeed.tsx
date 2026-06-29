"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Heart,
  MessageCircle,
  Share2,
  MapPin,
  Search,
  PenSquare,
  TrendingUp,
} from "lucide-react";
import type { CommunityPost } from "@/types/blog";

const TAG_COLORS: Record<string, string> = {
  Hyderabad: "bg-blue-100 text-blue-700",
  Bengaluru: "bg-green-100 text-green-700",
  Pune: "bg-purple-100 text-purple-700",
  Chennai: "bg-rose-100 text-rose-700",
  Delhi: "bg-amber-100 text-amber-700",
  Gurgaon: "bg-amber-100 text-amber-700",
  Mumbai: "bg-orange-100 text-orange-700",
  Nellore: "bg-indigo-100 text-indigo-700",
};

function getTagColor(tag: string) {
  return TAG_COLORS[tag] ?? "bg-slate-100 text-slate-600";
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
}

interface PostCardProps {
  post: CommunityPost;
}

function PostCard({ post }: PostCardProps) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);

  const toggleLike = () => {
    setLiked((p) => !p);
    setLikeCount((p) => (liked ? p - 1 : p + 1));
  };

  return (
    <article className="bg-white rounded-2xl border border-slate-100 p-5 hover:border-amber-200 hover:shadow-warm transition-all duration-200">
      {/* ── Author row ── */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          {post.authorAvatar ? (
            <Image
              src={post.authorAvatar}
              alt={post.authorName}
              width={40}
              height={40}
              className="rounded-full ring-2 ring-amber-100"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-bold text-sm">
              {post.authorName[0]}
            </div>
          )}
          <div>
            <div className="font-semibold text-slate-800 text-sm leading-tight">
              {post.authorName}
            </div>
            <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
              <MapPin className="size-3" />
              {post.city}
            </div>
          </div>
        </div>
        <span className="text-xs text-slate-400">{timeAgo(post.createdAt)}</span>
      </div>

      {/* ── Content ── */}
      <p className="text-slate-700 text-sm leading-relaxed mb-4">{post.content}</p>

      {/* ── Tags ── */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {post.tags.map((tag) => (
          <span
            key={tag}
            className={`px-2 py-0.5 rounded-full text-xs font-medium ${getTagColor(tag)}`}
          >
            #{tag}
          </span>
        ))}
      </div>

      {/* ── Actions ── */}
      <div className="flex items-center gap-4 pt-3 border-t border-slate-50">
        <button
          onClick={toggleLike}
          aria-pressed={liked}
          aria-label={liked ? "Unlike post" : "Like post"}
          className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${
            liked ? "text-rose-500" : "text-slate-400 hover:text-rose-500"
          }`}
        >
          <Heart className={`size-4 ${liked ? "fill-rose-500" : ""}`} />
          {likeCount}
        </button>
        <button
          aria-label="Comment on post"
          className="flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-amber-600 transition-colors"
        >
          <MessageCircle className="size-4" />
          {post.comments}
        </button>
        <button
          aria-label="Share post"
          className="ml-auto flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-amber-600 transition-colors"
        >
          <Share2 className="size-4" />
          Share
        </button>
      </div>
    </article>
  );
}

interface PostsFeedProps {
  initialPosts: CommunityPost[];
}

export default function PostsFeed({ initialPosts }: PostsFeedProps) {
  const [query, setQuery] = useState("");

  const filtered = query.trim()
    ? initialPosts.filter(
        (p) =>
          p.content.toLowerCase().includes(query.toLowerCase()) ||
          p.tags.some((t) => t.toLowerCase().includes(query.toLowerCase())) ||
          p.city.toLowerCase().includes(query.toLowerCase())
      )
    : initialPosts;

  const trending = [...initialPosts]
    .sort((a, b) => b.likes + b.comments - (a.likes + a.comments))
    .slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 grid lg:grid-cols-3 gap-8">
      {/* ── Main Feed ── */}
      <div className="lg:col-span-2 space-y-5">
        {/* Search + compose bar */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <input
              type="search"
              id="posts-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search posts by city, topic…"
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400"
              aria-label="Search community posts"
            />
          </div>
          <button
            id="compose-post-btn"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-600 text-white text-sm font-semibold shadow-warm hover:opacity-95 transition-opacity"
            aria-label="Compose a new post"
          >
            <PenSquare className="size-4" />
            <span className="hidden sm:block">Post</span>
          </button>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-400 text-sm">
            No posts match your search.
          </div>
        ) : (
          filtered.map((post) => <PostCard key={post.id} post={post} />)
        )}
      </div>

      {/* ── Sidebar ── */}
      <aside className="space-y-6">
        {/* Trending */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5">
          <h2 className="flex items-center gap-2 text-sm font-bold text-slate-800 mb-4">
            <TrendingUp className="size-4 text-amber-600" />
            Trending Posts
          </h2>
          <div className="space-y-3">
            {trending.map((post, i) => (
              <div key={post.id} className="flex gap-3">
                <span className="text-2xl font-black text-slate-100">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <p className="text-xs text-slate-700 leading-snug line-clamp-2">
                    {post.content}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                    <Heart className="size-3" />
                    {post.likes}
                    <MessageCircle className="size-3" />
                    {post.comments}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Cities */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5">
          <h2 className="text-sm font-bold text-slate-800 mb-4">
            Browse by City
          </h2>
          <div className="flex flex-wrap gap-2">
            {["Hyderabad", "Bengaluru", "Pune", "Chennai", "Delhi", "Nellore"].map(
              (city) => (
                <button
                  key={city}
                  onClick={() => setQuery(city)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    query === city
                      ? "bg-amber-600 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-amber-100 hover:text-amber-700"
                  }`}
                >
                  {city}
                </button>
              )
            )}
          </div>
        </div>

        {/* Blog CTA */}
        <div className="bg-gradient-to-br from-indigo-900 to-indigo-700 rounded-2xl p-5 text-white">
          <h2 className="font-bold text-sm mb-1">Read Our Blog</h2>
          <p className="text-indigo-200 text-xs leading-relaxed mb-3">
            Expert guides, city spotlights, and PG tips from our team.
          </p>
          <Link
            href="/blog"
            className="inline-flex px-4 py-2 rounded-lg bg-amber-500 text-white text-xs font-semibold hover:bg-amber-400 transition-colors"
          >
            Explore Blog →
          </Link>
        </div>
      </aside>
    </div>
  );
}
