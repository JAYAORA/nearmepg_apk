import type { Metadata } from "next";
import SignupPage from "./SignupPage";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Join NearMePG — create your free account to book PGs, hotels, and co-living spaces across India.",
  alternates: { canonical: "https://nearmepg.com/signup" },
  robots: { index: false, follow: false },
};

export default function Page() {
  return <SignupPage />;
}
