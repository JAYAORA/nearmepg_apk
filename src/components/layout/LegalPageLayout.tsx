import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface Section {
  id: string;
  title: string;
}

interface LegalPageLayoutProps {
  title: string;
  lastUpdated: string;
  sections: Section[];
  children: React.ReactNode;
}

export default function LegalPageLayout({
  title,
  lastUpdated,
  sections,
  children,
}: LegalPageLayoutProps) {
  return (
    <main className="container mx-auto px-4 py-10 max-w-4xl">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-gray-600 flex flex-row gap-1 items-center">
        <Link href="/" className="hover:text-blue-800 transition-colors">
          Home
        </Link>
        <ChevronRight size={16} className="shrink-0" />
        <span className="text-foreground">{title}</span>
      </nav>

      <h1 className="font-display text-3xl md:text-4xl font-extrabold text-foreground mb-2">
        {title}
      </h1>
      <p className="text-muted-foreground text-sm mb-8">
        Last Updated: {lastUpdated}
      </p>

      {/* Quick Navigation */}
      {sections.length > 0 && (
        <div className="bg-card border border-border rounded-xl p-5 mb-10">
          <h2 className="font-display font-bold text-foreground text-sm mb-3 uppercase tracking-wide">
            Quick Navigation
          </h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
            {sections.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="text-sm text-muted-foreground hover:text-blue-700 transition-colors block py-0.5"
                >
                  {s.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Content */}
      <div className="legal-content space-y-8 px-4">{children}</div>

      {/* Back to top */}
      <div className="mt-12 pt-6 border-t border-border text-center">
        <a
          href="#"
          className="text-sm text-blue-700 hover:underline"
        >
          ↑ Back to top
        </a>
      </div>
    </main>
  );
}
