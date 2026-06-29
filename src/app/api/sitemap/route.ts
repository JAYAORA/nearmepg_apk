import { db } from "@/app/api/_db/firebase-admin";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://nearmepg.com";

export async function GET() {
  try {
    const propertiesSnap = await db.collection("properties")
      .where("verified", "==", true)
      .where("isArchived", "==", false)
      .get();

    const properties = propertiesSnap.docs.map(doc => {
      const data = doc.data();
      return {
        slug: data.slug,
        updatedAt: data.updatedAt || data.createdAt,
        images: Array.isArray(data.images) && data.images.length > 0 ? data.images : (data.thumbnail ? [data.thumbnail] : [])
      };
    });

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n`;

    // Static pages
    const staticPages = [
      { url: "", priority: "1.0", changefreq: "daily" },
      { url: "/search", priority: "0.9", changefreq: "hourly" },
      { url: "/blog", priority: "0.7", changefreq: "weekly" },
    ];

    for (const page of staticPages) {
      xml += `  <url>\n`;
      xml += `    <loc>${BASE_URL}${page.url}</loc>\n`;
      xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
      xml += `    <priority>${page.priority}</priority>\n`;
      xml += `  </url>\n`;
    }

    // Property pages
    for (const prop of properties) {
      xml += `  <url>\n`;
      xml += `    <loc>${BASE_URL}/properties/${prop.slug}</loc>\n`;
      if (prop.updatedAt) {
        let dateObj = prop.updatedAt;
        if (dateObj.toDate) dateObj = dateObj.toDate();
        if (dateObj instanceof Date && !isNaN(dateObj.getTime())) {
          xml += `    <lastmod>${dateObj.toISOString()}</lastmod>\n`;
        }
      }
      xml += `    <changefreq>daily</changefreq>\n`;
      xml += `    <priority>0.8</priority>\n`;

      // Images
      if (Array.isArray(prop.images)) {
        for (const img of prop.images) {
          if (img) {
            xml += `    <image:image>\n`;
            const cleanImg = img.replace(/&/g, "&amp;");
            xml += `      <image:loc>${cleanImg}</image:loc>\n`;
            xml += `    </image:image>\n`;
          }
        }
      }
      xml += `  </url>\n`;
    }

    xml += `</urlset>`;

    return new Response(xml, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate",
      },
    });
  } catch (error) {
    console.error("Failed to generate sitemap:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
