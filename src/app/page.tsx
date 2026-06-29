import Hero from "@/components/home/Hero";
import PopularAreas from "@/components/home/PopularAreas";
import FeaturedProperties from "@/components/home/FeaturedProperties";
import Features from "@/components/home/Features";
import Testimonials from "@/components/home/Testimonials";
import LatestBlogs from "@/components/home/LatestBlogs";

export const metadata = {
  title: "NearMePG - Find Verified PGs Near You",
  description:
    "Discover verified PG accommodations with photos, amenities, reviews, and instant booking.",
  keywords: [
    "near",
    "near me",
    "nearme",
    "Near",
    "Near Me",
    "Nearme",
    "PG",
    "Hostel",
    "Co-living",
    "NearMePG",
    "Student Accommodation",
    "Working Professional PG",
  ],
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <PopularAreas />
      <FeaturedProperties />
      <Features />
      <Testimonials />
      <LatestBlogs />
    </>
  );
}