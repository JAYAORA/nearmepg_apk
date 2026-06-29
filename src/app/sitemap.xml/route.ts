import { NextResponse } from "next/server";
import { getProperties } from "@/lib/api";
import { getBlogPosts } from "@/app/api/_db/blog-data";
import type { PropertyCardProps } from "@/types/property";

const BASE_URL = "https://nearmepg.com";
const NOW = new Date().toISOString();

function escapeXml(unsafe: string) {
  if (!unsafe) return "";
  return unsafe.replace(/[<>&'"]/g, function (c) {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

function generateSiteMap(
  staticRoutes: any[],
  blogPosts: any[],
  properties: PropertyCardProps[]
) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  ${staticRoutes
    .map((route) => {
      return `
    <url>
      <loc>${escapeXml(route.url)}</loc>
      <lastmod>${route.lastModified}</lastmod>
      <changefreq>${route.changeFrequency}</changefreq>
      <priority>${route.priority}</priority>
    </url>`;
    })
    .join("")}
  ${blogPosts
    .map((post) => {
      return `
    <url>
      <loc>${escapeXml(BASE_URL + "/blog/" + post.slug)}</loc>
      <lastmod>${post.publishedAt}</lastmod>
      <changefreq>monthly</changefreq>
      <priority>0.7</priority>
    </url>`;
    })
    .join("")}
  ${properties
    .map((property) => {
      let imageTags = "";
      if (property.thumbnail) {
        imageTags = `
      <image:image>
        <image:loc>${escapeXml(property.thumbnail)}</image:loc>
        <image:title>${escapeXml(property.name)}</image:title>
      </image:image>`;
      }
      return `
    <url>
      <loc>${escapeXml(BASE_URL + "/properties/" + property.slug)}</loc>
      <lastmod>${NOW}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.8</priority>${imageTags}
    </url>`;
    })
    .join("")}
</urlset>`;
}

export async function GET() {
  const staticRoutes = [
    {
      url: BASE_URL,
      lastModified: NOW,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/search`,
      lastModified: NOW,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: NOW,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: NOW,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/privacy-policy`,
      lastModified: NOW,
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${BASE_URL}/terms-conditions`,
      lastModified: NOW,
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${BASE_URL}/refund-policy`,
      lastModified: NOW,
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: NOW,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/posts`,
      lastModified: NOW,
      changeFrequency: "daily",
      priority: 0.7,
    },
  ];

  let properties: PropertyCardProps[] = [];
  try {
    properties = await getProperties();
  } catch (error) {
    // Backend unavailable at build time — sitemap will only include static routes.
  }

  const blogPosts = await getBlogPosts();

  const xml = generateSiteMap(staticRoutes, blogPosts, properties);

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
