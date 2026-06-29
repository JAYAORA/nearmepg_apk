import {
  ShieldCheck,
  BadgeIndianRupee,
  CalendarCheck,
} from "lucide-react";

const features = [
  {
    title: "Verified Properties",
    description:
      "Every property is manually verified before being listed.",
    icon: ShieldCheck,
  },
  {
    title: "Transparent Pricing",
    description:
      "No hidden charges. What you see is what you pay.",
    icon: BadgeIndianRupee,
  },
  {
    title: "Instant Booking",
    description:
      "Reserve rooms and beds without lengthy paperwork.",
    icon: CalendarCheck,
  },
];

export default function WhyNearMePG() {
  return (
    <section className="bg-slate-50 py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold">
            Why Choose NearMePG
          </h2>

          <p className="text-slate-500 mt-4">
            Built for students, professionals,
            travelers and property owners.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-white rounded-3xl p-8 border border-slate-200"
            >
              <feature.icon className="h-10 w-10 text-amber-500 mb-6" />

              <h3 className="font-bold text-xl">
                {feature.title}
              </h3>

              <p className="text-slate-500 mt-3">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}