import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

import { AuthProvider } from "@/data/auth-context";
import { Header } from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://nearmepg.com"),

  title: {
    default: "NearMePG — Find Verified PGs & Stays Near You",
    template: "%s | NearMePG",
  },

  description:
    "India's most trusted PG & Stay booking platform for students and working professionals. Discover verified PGs, hostels, and co-living spaces with real-time bed-level availability.",

  keywords: [
    "PG near me",
    "paying guest accommodation",
    "PG booking",
    "verified PG India",
    "student accommodation India",
    "co-living spaces",
    "NearMePG",
    "hostel booking",
    "hotel booking",
    "hotels near me",
    "hotel near me",
    "hotels",
    "hotel",
    "stay booking",
    "stays near me",
    "stays",
    "stay",
    "room booking",
    "rooms near me",
    "rooms",
    "room",
  ],

  openGraph: {
    title: "NearMePG — Find Verified PGs & Stays Near You",
    description:
      "India's most trusted PG booking platform. Real-time bed availability, token-based reservations, verified listings.",
    siteName: "NearMePG",
    type: "website",
    url: "https://nearmepg.com",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "NearMePG — Find Verified PGs Near You",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "NearMePG — Find Verified PGs Near You",
    description:
      "India's most trusted PG booking platform. Real-time bed availability, token-based reservations.",
    images: ["/twitter-image"],
  },

  manifest: "/manifest.webmanifest",

  alternates: {
    canonical: "https://nearmepg.com",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
        inter.variable
      )}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <AuthProvider>
          <Header />
          {children}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
