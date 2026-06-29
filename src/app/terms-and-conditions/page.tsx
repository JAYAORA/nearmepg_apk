import { redirect } from "next/navigation";

/**
 * Canonical URL for Terms & Conditions is /terms-and-conditions.
 * This route exists as a convenience alias for the old client-app URL pattern.
 */
export default function TermsAndConditionsCanonicalPage() {
  // All content lives in /terms-conditions — redirect permanently
  redirect("/terms-conditions");
}
