import Link from "next/link";

const filters = [
  "Men's PG",
  "Women's PG",
  "Co-Living",
  "Hotels",
  "AC Rooms",
  "Near Metro",
  "Students",
  "Professionals",
];

export default function QuickFilters() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex flex-wrap gap-3">
        {filters.map((filter) => (
          <Link
            key={filter}
            href={`/search?q=${encodeURIComponent(filter)}`}
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-900 hover:text-white transition"
          >
            {filter}
          </Link>
        ))}
      </div>
    </section>
  );
}