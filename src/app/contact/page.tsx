"use client";

import { useState } from "react";
import toast from "react-hot-toast";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validateForm = () => {
    if (formData.name.trim().length < 2) {
      toast.error("Name must be at least 2 characters long.");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address.");
      return false;
    }
    if (formData.message.trim().length < 10) {
      toast.error("Message must be at least 10 characters long.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send message.");
      }

      toast.success("Message sent successfully! We will get back to you soon.");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error: any) {
      toast.error(error.message || "An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="contact-name"
            className="block text-sm font-semibold text-foreground mb-1.5"
          >
            Your Name <span className="text-red-500">*</span>
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="Ravi Kumar"
            className="w-full border border-border rounded-lg px-4 py-2.5 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label
            htmlFor="contact-email"
            className="block text-sm font-semibold text-foreground mb-1.5"
          >
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
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
            value={formData.subject}
            onChange={handleChange}
            placeholder="Booking query / Listing inquiry / Other"
            className="w-full border border-border rounded-lg px-4 py-2.5 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label
            htmlFor="contact-message"
            className="block text-sm font-semibold text-foreground mb-1.5"
          >
            Message <span className="text-red-500">*</span>
          </label>
          <textarea
            id="contact-message"
            name="message"
            required
            rows={5}
            value={formData.message}
            onChange={handleChange}
            placeholder="How can we help you?"
            className="w-full border border-border rounded-lg px-4 py-2.5 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-colors text-white font-semibold py-3 rounded-lg text-sm flex justify-center items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
              Sending...
            </>
          ) : (
            "Send Message"
          )}
        </button>
      </form>

      {/* JSON-LD - Added via dangerouslySetInnerHTML directly inside a script tag */}
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
