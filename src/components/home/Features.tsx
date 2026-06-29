import { BedDouble, ShieldCheck, Users } from "lucide-react";

export default function Features() {
  const items = [
    {
      icon: BedDouble,
      title: "Bed-level booking",
      desc: "Pick the exact bed you want in a shared PG — no surprises on arrival.",
    },
    {
      icon: ShieldCheck,
      title: "Verified properties",
      desc: "Every listing is vetted in person. We don't take shortcuts on safety.",
    },
    {
      icon: Users,
      title: "Built for communities",
      desc: "Whether it's coliving or a quiet women's PG, you'll find your kind of people.",
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
      <div className="bg-cream rounded-[2rem] p-10 md:p-14 grid md:grid-cols-3 gap-8">
        {items.map(({ icon: Icon, title, desc }) => (
          <div key={title}>
            <div className="inline-flex size-12 rounded-2xl bg-amber-600 text-white items-center justify-center shadow-warm">
              <Icon className="size-5" />
            </div>
            <div className="mt-4 font-display font-bold text-lg text-slate-800">
              {title}
            </div>
            <div className="mt-2 text-sm text-slate-500 leading-relaxed">
              {desc}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
