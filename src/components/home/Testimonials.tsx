import Image from "next/image";
import { Star, Quote } from "lucide-react";
import { getTestimonials } from "@/app/api/_db/blog-data";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`size-3.5 ${
            i < rating ? "fill-amber-400 text-amber-400" : "text-slate-200"
          }`}
        />
      ))}
    </div>
  );
}

export default async function Testimonials() {
  const testimonials = await getTestimonials();

  return (
    <section className="py-20 px-4 bg-linear-to-b from-white to-slate-50" aria-labelledby="testimonials-heading">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-block text-xs font-bold uppercase tracking-widest text-amber-700 mb-3">
            What Tenants Say
          </div>
          <h2 id="testimonials-heading" className="font-display text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Trusted by Thousands Across India
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto leading-relaxed">
            Real reviews from students and professionals who found their perfect
            PG through NearMePG.
          </p>

          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-6 mt-8">
            {[
              { value: "10,000+", label: "Happy Tenants" },
              { value: "4.8★", label: "Avg. Rating" },
              { value: "500+", label: "Verified PGs" },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <div className="text-2xl font-black text-slate-900">{value}</div>
                <div className="text-xs text-slate-500 mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <div
              key={t.id}
              className={`group relative bg-white rounded-2xl p-6 border border-slate-100 shadow-soft hover:shadow-warm hover:-translate-y-0.5 transition-all duration-300 ${
                i === 0 ? "md:col-span-2 lg:col-span-1" : ""
              }`}
            >
              {/* Quote icon */}
              <Quote className="size-8 text-amber-100 absolute top-5 right-5" />

              {/* Stars */}
              <StarRating rating={t.rating} />

              {/* Review */}
              <p className="mt-4 text-slate-600 text-sm leading-relaxed">
                &ldquo;{t.review}&rdquo;
              </p>

              {/* PG name */}
              {t.pgName && (
                <div className="mt-3 text-xs text-amber-700 font-medium bg-amber-50 rounded-lg px-2.5 py-1 inline-block">
                  {t.pgName}
                </div>
              )}

              {/* Author */}
              <div className="mt-5 pt-4 border-t border-slate-50 flex items-center gap-3">
                {t.avatar ? (
                  <Image
                    src={t.avatar}
                    alt={t.name}
                    width={40}
                    height={40}
                    className="rounded-full ring-2 ring-amber-100 shrink-0"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-bold text-sm shrink-0">
                    {t.name[0]}
                  </div>
                )}
                <div>
                  <div className="text-sm font-semibold text-slate-800 leading-tight">
                    {t.name}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    {t.occupation} · {t.city}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
