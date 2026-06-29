import type { Metadata } from "next";
import LegalPageLayout from "@/components/layout/LegalPageLayout";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about NearMePG — India's most trusted PG discovery and booking platform, operated by JAYAORA Solutions & Management.",
  alternates: { canonical: "https://nearmepg.com/about" },
  openGraph: {
    title: "About NearMePG",
    description:
      "NearMePG is India's most trusted platform for students and working professionals to find verified PG accommodations.",
    type: "website",
  },
};

export default function AboutPage() {
  return (
    <main className="container mx-auto px-4 py-10 max-w-4xl">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-gray-600 flex flex-row gap-1 items-center">
        <a href="/" className="hover:text-blue-800 transition-colors">
          Home
        </a>
        <span className="mx-1">›</span>
        <span className="text-foreground">About Us</span>
      </nav>

      <h1 className="font-display text-3xl md:text-4xl font-extrabold text-foreground mb-4">
        About NearMePG
      </h1>

      <p className="text-lg text-foreground/80 leading-relaxed mb-10 max-w-2xl">
        India&rsquo;s most trusted PG booking platform for students and
        professionals — connecting you with verified accommodations near your
        college, office, or destination.
      </p>

      {/* Stats strip */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-12">
        {[
          { value: "10+", label: "Cities" },
          { value: "500+", label: "PGs Listed" },
          { value: "1000+", label: "Happy Tenants" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-card border border-border rounded-xl p-6 text-center"
          >
            <div className="text-3xl font-extrabold text-foreground">
              {stat.value}
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Mission */}
      <section className="mb-10 space-y-4">
        <h2 className="text-2xl font-bold text-foreground">Our Mission</h2>
        <p className="text-foreground/80 leading-relaxed">
          NearMePG is a technology-enabled platform designed to make finding and
          booking paying guest accommodations simple, transparent, and safe. We
          connect tenants and PG owners through a verified, real-time inventory
          system — so you always know what you&rsquo;re booking before you book
          it.
        </p>
        <p className="text-foreground/80 leading-relaxed">
          From bed-level availability views to secure token-based reservations,
          every feature on NearMePG is built with one goal: giving tenants
          peace of mind and PG owners the tools they need to manage their
          properties efficiently.
        </p>
      </section>

      {/* Company */}
      <section className="mb-10 space-y-4">
        <h2 className="text-2xl font-bold text-foreground">The Company</h2>
        <p className="text-foreground/80 leading-relaxed">
          NearMePG is a product of{" "}
          <a
            href="https://www.jayaora.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-700 font-semibold hover:underline"
          >
            JAYAORA Solutions &amp; Management
          </a>
          , a company incorporated under the laws of India, headquartered in
          Nellore, Andhra Pradesh. We are committed to building digital
          infrastructure that empowers both property owners and tenants across
          India.
        </p>
      </section>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "NearMePG",
            url: "https://nearmepg.com",
            logo: "https://nearmepg.com/favicon.ico",
            description:
              "India's most trusted PG booking platform for students and professionals.",
            address: {
              "@type": "PostalAddress",
              addressLocality: "Nellore",
              addressRegion: "Andhra Pradesh",
              addressCountry: "IN",
            },
            contactPoint: {
              "@type": "ContactPoint",
              email: "support@nearmepg.com",
              contactType: "customer support",
            },
            parentOrganization: {
              "@type": "Organization",
              name: "JAYAORA Solutions and Management",
              url: "https://www.jayaora.com/",
            },
          }),
        }}
      />
    </main>
  );
}
