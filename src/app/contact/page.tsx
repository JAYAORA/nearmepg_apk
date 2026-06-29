import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with the NearMePG team for support, property listing inquiries, or any questions.",
  alternates: { canonical: "https://nearmepg.com/contact" },
};

export default function ContactPage() {
  return (
    <main className="container mx-auto px-4 py-10 max-w-2xl">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-gray-600 flex flex-row gap-1 items-center">
        <a href="/" className="hover:text-blue-800 transition-colors">
          Home
        </a>
        <span className="mx-1">›</span>
        <span className="text-foreground">Contact Us</span>
      </nav>

      <h1 className="font-display text-3xl md:text-4xl font-extrabold text-foreground mb-2">
        Contact Us
      </h1>
      <p className="text-muted-foreground mb-10">
        We&rsquo;re here to help. Reach out to us for any support, listing
        queries, or general feedback.
      </p>

      {/* Quick contact info */}
      <div className="bg-card border border-border rounded-xl p-6 mb-10 space-y-3">
        <div className="flex items-center gap-3">
          <span className="text-lg">📧</span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Email
            </p>
            <a
              href="mailto:support@nearmepg.com"
              className="text-blue-700 hover:underline font-medium"
            >
              support@nearmepg.com
            </a>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-lg">📍</span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Office
            </p>
            <p className="text-foreground/80">
              Nellore, Andhra Pradesh, India
            </p>
          </div>
        </div>
      </div>

      {/* Contact form */}
      <form
        action="mailto:support@nearmepg.com"
        method="post"
        encType="text/plain"
        className="space-y-5"
      >
        <div>
          <label
            htmlFor="contact-name"
            className="block text-sm font-semibold text-foreground mb-1.5"
          >
            Your Name
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            required
            placeholder="Ravi Kumar"
            className="w-full border border-border rounded-lg px-4 py-2.5 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label
            htmlFor="contact-email"
            className="block text-sm font-semibold text-foreground mb-1.5"
          >
            Email Address
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            placeholder="you@example.com"
            className="w-full border border-border rounded-lg px-4 py-2.5 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label
            htmlFor="contact-subject"
            className="block text-sm font-semibold text-foreground mb-1.5"
          >
            Subject
          </label>
          <input
            id="contact-subject"
            name="subject"
            type="text"
            placeholder="Booking query / Listing inquiry / Other"
            className="w-full border border-border rounded-lg px-4 py-2.5 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label
            htmlFor="contact-message"
            className="block text-sm font-semibold text-foreground mb-1.5"
          >
            Message
          </label>
          <textarea
            id="contact-message"
            name="message"
            required
            rows={5}
            placeholder="How can we help you?"
            className="w-full border border-border rounded-lg px-4 py-2.5 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 transition-colors text-white font-semibold py-3 rounded-lg text-sm"
        >
          Send Message
        </button>
      </form>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ContactPage",
            name: "NearMePG – Contact Us",
            url: "https://nearmepg.com/contact",
            description:
              "Contact NearMePG for support, PG listing queries, or general feedback.",
          }),
        }}
      />
    </main>
  );
}
