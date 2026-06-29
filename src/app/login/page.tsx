import type { Metadata } from "next";
import LoginPage from "./LoginPage";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your NearMePG account to manage bookings, saved properties, and more.",
  alternates: { canonical: "https://nearmepg.com/login" },
  robots: { index: false, follow: false },
};

export default function Page() {
  return <LoginPage />;
}
