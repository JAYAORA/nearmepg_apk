import {
  Search,
  Building2,
  CreditCard,
  House,
} from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Search",
    desc: "Find PGs, hotels and coliving spaces.",
  },
  {
    icon: Building2,
    title: "Compare",
    desc: "Compare amenities, pricing and reviews.",
  },
  {
    icon: CreditCard,
    title: "Book",
    desc: "Reserve your room instantly online.",
  },
  {
    icon: House,
    title: "Move In",
    desc: "Check in and start your stay.",
  },
];

export default function HowItWorks() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-20">
      <div className="text-center mb-14">
        <h2 className="text-4xl font-bold">
          How It Works
        </h2>
      </div>

      <div className="grid md:grid-cols-4 gap-8">
        {steps.map((step, index) => (
          <div
            key={step.title}
            className="relative text-center"
          >
            <div className="mx-auto w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center">
              <step.icon className="h-8 w-8 text-amber-600" />
            </div>

            <div className="mt-4 font-bold">
              {index + 1}. {step.title}
            </div>

            <p className="text-sm text-slate-500 mt-2">
              {step.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}