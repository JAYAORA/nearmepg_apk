import type {
  BlogPost,
  BlogAuthor,
  CommunityPost,
  Testimonial,
} from "@/types/blog";

// ─── Authors ──────────────────────────────────────────────────────────────────

const AUTHORS: BlogAuthor[] = [
  {
    id: "author-1",
    name: "Priya Sharma",
    role: "Content Lead",
    avatar: "https://i.pravatar.cc/80?img=47",
  },
  {
    id: "author-2",
    name: "Rahul Gupta",
    role: "Housing Analyst",
    avatar: "https://i.pravatar.cc/80?img=12",
  },
  {
    id: "author-3",
    name: "Ananya Reddy",
    role: "Community Manager",
    avatar: "https://i.pravatar.cc/80?img=56",
  },
];

// ─── Blog Posts ───────────────────────────────────────────────────────────────

export const BLOG_POSTS: BlogPost[] = [
  {
    id: "blog-1",
    slug: "how-to-choose-the-right-pg",
    title: "How to Choose the Right PG: A Complete Checklist for First-Timers",
    excerpt:
      "Moving into a PG for the first time? We break down everything you need to check — from safety to food quality — so you don't regret your decision.",
    coverImage:
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&q=80",
    category: "guides",
    tags: ["PG tips", "first time", "checklist"],
    author: AUTHORS[0],
    publishedAt: "2026-05-20T09:00:00Z",
    readingTime: 6,
    isFeatured: true,
    content: `<h2>What to look for in your first PG</h2>
<p>Finding the right paying guest accommodation can be overwhelming. Here's a comprehensive checklist to help you navigate the process:</p>
<h3>1. Location & Connectivity</h3>
<p>Check how far the PG is from your college or workplace. Ideally, it should be within 2–5 km or have easy access to public transport.</p>
<h3>2. Safety & Security</h3>
<p>Look for CCTV cameras, a secure entrance, and good lighting in common areas. Ask about the warden's availability.</p>
<h3>3. Room & Amenities</h3>
<p>Inspect the room personally. Check for bed quality, storage space, ventilation, and whether WiFi is reliable. On NearMePG, you can view bed-level photos before booking.</p>
<h3>4. Food Quality</h3>
<p>If meals are included, taste the food and check the menu. Ask current residents for honest feedback.</p>
<h3>5. Contract Terms</h3>
<p>Read the agreement carefully. Note the notice period, security deposit amount, and rules about guests and curfews.</p>
<h2>Final Tips</h2>
<p>Always visit in person before paying any advance. Use platforms like NearMePG to read verified reviews from real tenants who've stayed at the property.</p>`,
  },
  {
    id: "blog-2",
    slug: "best-areas-to-live-in-hyderabad",
    title: "Best Areas to Live in Hyderabad for IT Professionals in 2026",
    excerpt:
      "From Gachibowli to Madhapur, discover the top neighbourhoods in Hyderabad that offer great PGs, connectivity, and lifestyle for tech workers.",
    coverImage:
      "https://images.unsplash.com/photo-1609030264004-b3c5b0e38fcb?w=800&q=80",
    category: "city-guide",
    tags: ["Hyderabad", "IT hub", "city guide"],
    author: AUTHORS[1],
    publishedAt: "2026-05-15T08:00:00Z",
    readingTime: 8,
    isFeatured: true,
    content: `<h2>Hyderabad's Best IT-Friendly Neighbourhoods</h2>
<p>Hyderabad has rapidly become one of India's top tech hubs. Here's where IT professionals prefer to stay:</p>
<h3>Gachibowli</h3>
<p>Home to major tech parks like DLF Cybercity, Gachibowli offers excellent infrastructure and plenty of PG options ranging from ₹7,000–₹15,000/month.</p>
<h3>Madhapur (HITEC City)</h3>
<p>The epicentre of Hyderabad's IT industry. Coliving spaces here cater specifically to young professionals with premium amenities.</p>
<h3>Kondapur</h3>
<p>A quieter residential alternative to Madhapur with better food options and slightly lower rents.</p>`,
  },
  {
    id: "blog-3",
    slug: "student-life-pg-survival-guide",
    title: "The Ultimate PG Survival Guide for College Students",
    excerpt:
      "Away from home for the first time? Here's how to make the most of your PG life — from cooking basics to making friends in a new city.",
    coverImage:
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80",
    category: "student-life",
    tags: ["student", "college", "survival guide"],
    author: AUTHORS[2],
    publishedAt: "2026-05-10T07:30:00Z",
    readingTime: 5,
    content: `<h2>Thriving in Your First PG as a Student</h2>
<p>College life in a new city can be exciting and daunting. Here's how to settle in quickly:</p>
<h3>Building Your Network</h3>
<p>Your PG mates can be your greatest resource — share notes, commute together, and explore the city as a group.</p>
<h3>Managing Your Budget</h3>
<p>Track your monthly expenses carefully. Typical PG costs include rent, food, WiFi, and laundry. Set aside an emergency fund.</p>`,
  },
  {
    id: "blog-4",
    slug: "coliving-vs-traditional-pg",
    title: "Coliving vs Traditional PG: Which is Right for You in 2026?",
    excerpt:
      "The coliving trend is reshaping urban accommodation. We compare costs, amenities, community, and flexibility to help you decide.",
    coverImage:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
    category: "coliving",
    tags: ["coliving", "PG comparison", "lifestyle"],
    author: AUTHORS[0],
    publishedAt: "2026-05-05T10:00:00Z",
    readingTime: 7,
    isFeatured: true,
    content: `<h2>Traditional PG vs Coliving: A Breakdown</h2>
<p>Both options have their merits depending on your budget, lifestyle, and priorities.</p>
<h3>Cost</h3>
<p>Traditional PGs are generally more affordable (₹5,000–₹12,000/month) while coliving spaces charge premium rates (₹10,000–₹25,000/month) but include more services.</p>
<h3>Community</h3>
<p>Coliving spaces actively curate community events and create networking opportunities. Traditional PGs offer more privacy.</p>`,
  },
  {
    id: "blog-5",
    slug: "tips-for-pg-owners-to-attract-tenants",
    title: "5 Proven Ways PG Owners Can Attract More Tenants Online",
    excerpt:
      "Running a PG? Learn how high-quality photos, transparent pricing, and quick responses can dramatically increase your bookings.",
    coverImage:
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
    category: "tips",
    tags: ["PG owner", "landlord tips", "listing"],
    author: AUTHORS[1],
    publishedAt: "2026-04-28T09:00:00Z",
    readingTime: 4,
    content: `<h2>Maximising Your PG Occupancy</h2>
<p>The competition for tenants is fierce. Here's how to stand out:</p>
<h3>1. Professional Photos</h3>
<p>Properties with high-quality photos get 3x more inquiries. Use natural lighting and photograph all rooms and common areas.</p>
<h3>2. Transparent Pricing</h3>
<p>Hidden charges are the #1 reason tenants leave negative reviews. List all costs upfront.</p>`,
  },
  {
    id: "blog-6",
    slug: "safety-checklist-for-women-in-pg",
    title: "Safety Checklist Every Woman Should Ask Before Booking a PG",
    excerpt:
      "Safety is non-negotiable. Here are the 10 questions every woman should ask a PG owner before signing the agreement.",
    coverImage:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80",
    category: "guides",
    tags: ["women safety", "checklist", "PG guide"],
    author: AUTHORS[2],
    publishedAt: "2026-04-20T08:00:00Z",
    readingTime: 5,
    content: `<h2>Essential Safety Questions for Women</h2>
<p>When choosing a women's PG, safety should be your top priority. Ask these questions:</p>
<h3>Security Infrastructure</h3>
<p>Is there 24/7 CCTV coverage? Are there female wardens on-site? What are the entry protocols for guests?</p>`,
  },
];

// ─── Community Posts ──────────────────────────────────────────────────────────

export const COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: "post-1",
    authorName: "Kiran V.",
    authorAvatar: "https://i.pravatar.cc/60?img=22",
    city: "Hyderabad",
    content:
      "Just shifted to a PG in Gachibowli and honestly NearMePG made it SO easy. The room matched the photos exactly 🙌 Anyone else staying near Cybercity?",
    likes: 48,
    comments: 12,
    tags: ["Hyderabad", "Gachibowli"],
    createdAt: "2026-05-28T14:30:00Z",
  },
  {
    id: "post-2",
    authorName: "Sneha M.",
    authorAvatar: "https://i.pravatar.cc/60?img=44",
    city: "Bengaluru",
    content:
      "Tip for freshers in Bangalore: avoid PGs that don't show bed-level availability. Found my spot through NearMePG and could literally choose which bed I wanted. Game changer 😍",
    likes: 72,
    comments: 19,
    tags: ["Bengaluru", "fresher tips"],
    createdAt: "2026-05-25T11:00:00Z",
  },
  {
    id: "post-3",
    authorName: "Arjun T.",
    authorAvatar: "https://i.pravatar.cc/60?img=15",
    city: "Pune",
    content:
      "Anyone know good PGs near Hinjewadi Phase 2? Looking for a shared room with decent WiFi. Budget around ₹8k/month.",
    likes: 15,
    comments: 31,
    tags: ["Pune", "Hinjewadi", "looking"],
    createdAt: "2026-05-22T09:15:00Z",
  },
  {
    id: "post-4",
    authorName: "Meera K.",
    authorAvatar: "https://i.pravatar.cc/60?img=38",
    city: "Chennai",
    content:
      "Finally found a women-only PG with proper security and a nice warden 🙏 The token booking feature saved me from losing the room while I was still negotiating. Highly recommend NearMePG!",
    likes: 93,
    comments: 24,
    tags: ["Chennai", "women PG", "safety"],
    createdAt: "2026-05-20T16:45:00Z",
  },
  {
    id: "post-5",
    authorName: "Rohan S.",
    authorAvatar: "https://i.pravatar.cc/60?img=8",
    city: "Delhi",
    content:
      "Moving from Mumbai to Delhi next month for a new job. What are the best areas for PGs near Connaught Place or Gurgaon? Any recommendations?",
    likes: 28,
    comments: 47,
    tags: ["Delhi", "Gurgaon", "relocation"],
    createdAt: "2026-05-18T10:30:00Z",
  },
  {
    id: "post-6",
    authorName: "Divya P.",
    authorAvatar: "https://i.pravatar.cc/60?img=52",
    city: "Nellore",
    content:
      "My PG owner listed on NearMePG and now she's fully booked 2 months in advance! Told her about the platform and it completely changed her business. Great platform for owners too!",
    likes: 61,
    comments: 8,
    tags: ["Nellore", "owner experience"],
    createdAt: "2026-05-15T13:00:00Z",
  },
];

// ─── Testimonials ─────────────────────────────────────────────────────────────

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "t-1",
    name: "Aditya Nair",
    avatar: "https://i.pravatar.cc/80?img=11",
    city: "Hyderabad",
    occupation: "Software Engineer",
    rating: 5,
    pgName: "Sunrise Coliving, Gachibowli",
    review:
      "NearMePG saved me weeks of searching. I booked a PG in Gachibowli within 2 days of relocating for my new job. The bed-level availability photos meant there were zero surprises on arrival.",
  },
  {
    id: "t-2",
    name: "Lakshmi Priya",
    avatar: "https://i.pravatar.cc/80?img=49",
    city: "Bengaluru",
    occupation: "MBA Student, IIM Bangalore",
    rating: 5,
    pgName: "GreenLeaf PG, Koramangala",
    review:
    "As a woman moving to Bengaluru alone, safety was my top concern. NearMePG's verified listings and transparent reviews gave me the confidence to book without visiting first. The PG matched every photo!",
  },
  {
    id: "t-3",
    name: "Vivek Sharma",
    avatar: "https://i.pravatar.cc/80?img=7",
    city: "Pune",
    occupation: "Data Analyst",
    rating: 5,
    pgName: "MySpace PG, Hinjewadi",
    review:
      "The token booking feature is brilliant — I reserved my bed while my company was still processing my joining date. No more losing rooms to other candidates. Absolutely love the platform.",
  },
  {
    id: "t-4",
    name: "Pavithra Reddy",
    avatar: "https://i.pravatar.cc/80?img=41",
    city: "Nellore",
    occupation: "MBBS Student",
    rating: 5,
    pgName: "Comfort Stay PG, Nellore",
    review:
      "Found my PG near the medical college in less than an hour. The pricing was exactly what was listed — no hidden charges, no last-minute surprises. My parents were relieved!",
  },
  {
    id: "t-5",
    name: "Roshan Mehta",
    avatar: "https://i.pravatar.cc/80?img=3",
    city: "Delhi",
    occupation: "Marketing Executive",
    rating: 4,
    pgName: "Capital PG, Dwarka",
    review:
      "Moved from Rajasthan to Delhi and was clueless about the neighbourhoods. The city guides on NearMePG were incredibly helpful. Booked a great PG in Dwarka that's close to both metro and my office.",
  },
  {
    id: "t-6",
    name: "Anusree Pillai",
    avatar: "https://i.pravatar.cc/80?img=58",
    city: "Chennai",
    occupation: "UI/UX Designer",
    rating: 5,
    pgName: "SkyView Residency, Velachery",
    review:
      "I've used 3 different PG platforms and NearMePG is the only one that feels genuinely honest. Real photos, real reviews, transparent pricing. I renewed my lease for a second year because I trust the platform.",
  },
];

import { db } from "@/app/api/_db/firebase-admin";

export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const snapshot = await db.collection("blogs").get();
    const posts = snapshot.docs
      .map(doc => doc.data() as BlogPost)
      .filter(post => post.isHidden !== true)
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    return posts;
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return [];
  }
}

export async function getBlogPostBySlug(
  slug: string
): Promise<BlogPost | undefined> {
  try {
    const snapshot = await db.collection("blogs").doc(slug).get();
    if (!snapshot.exists) return undefined;
    
    const post = snapshot.data() as BlogPost;
    if (post.isHidden) return undefined;
    return post;
  } catch (error) {
    console.error("Error fetching blog by slug:", error);
    return undefined;
  }
}

export async function getFeaturedBlogPosts(): Promise<BlogPost[]> {
  try {
    const snapshot = await db.collection("blogs").get();
    const posts = snapshot.docs
      .map(doc => doc.data() as BlogPost)
      .filter(post => post.isHidden !== true && post.isFeatured === true)
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    return posts.slice(0, 3);
  } catch (error) {
    console.error("Error fetching featured blogs:", error);
    return [];
  }
}

export async function getCommunityPosts(): Promise<CommunityPost[]> {
  return COMMUNITY_POSTS;
}

export async function getTestimonials(): Promise<Testimonial[]> {
  return TESTIMONIALS;
}
