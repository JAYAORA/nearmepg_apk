import type { Metadata } from "next";
import LegalPageLayout from "@/components/layout/LegalPageLayout";

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy",
  description:
    "Understand the refund and cancellation terms for bookings made through NearMePG.com.",
  alternates: { canonical: "https://nearmepg.com/refund-policy" },
};

const sections = [
  { id: "applicability", title: "Applicability of Policy" },
  { id: "booking-token", title: "Booking Request and Token Payment" },
  { id: "owner-acceptance", title: "Acceptance or Rejection by PG Owner" },
  {
    id: "booking-confirmation",
    title: "Booking Confirmation and Non-Refundable Token",
  },
  { id: "user-cancellation", title: "User Cancellation Before Allocation" },
  { id: "refund-processing", title: "Refund Processing Timeline" },
  {
    id: "platform-determination",
    title: "Platform Determination and Chargeback Restrictions",
  },
];

export default function RefundPolicyPage() {
  return (
    <LegalPageLayout
      title="Refund &amp; Cancellation Policy"
      lastUpdated="March 6, 2026"
      sections={sections}
    >
      <section id="applicability">
        <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mb-4">
          Applicability of Policy
        </h2>
        <p className="text-foreground/80 leading-relaxed">
          This Refund and Cancellation Policy applies to all booking
          transactions conducted on{" "}
          <a
            href="https://nearmepg.com"
            className="text-blue-700 font-semibold"
          >
            https://nearmepg.com
          </a>{" "}
          (the &ldquo;Platform&rdquo;), which is owned and operated by JAYAORA
          Solutions and Management (&ldquo;Company&rdquo;, &ldquo;we&rdquo;,
          &ldquo;us&rdquo;, or &ldquo;our&rdquo;). By initiating a booking on
          the Platform, users acknowledge and agree to be bound by the terms set
          forth herein.
        </p>
      </section>

      <section id="booking-token">
        <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mb-4">
          Booking Request and Token Payment
        </h2>
        <p className="text-foreground/80 leading-relaxed">
          The Platform enables users to place booking requests for Paying Guest
          (PG) accommodations by selecting a specific bed and paying a token
          amount. The token amount is collected by the Company for the purpose
          of initiating the booking request and facilitating communication with
          the respective PG owner. The token amount is not transferred to the PG
          owner at the time of payment and does not constitute full rent or a
          security deposit unless otherwise expressly stated.
        </p>
      </section>

      <section id="owner-acceptance">
        <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mb-4">
          Acceptance or Rejection by PG Owner
        </h2>
        <p className="text-foreground/80 leading-relaxed">
          All booking requests placed through the Platform are subject to
          acceptance or rejection by the respective PG owner. Where the PG owner
          declines or rejects the booking request, the service shall be deemed
          unfulfilled, and the user shall be eligible for a refund of the token
          amount. In such cases, the refund shall be processed to the original
          payment method used by the user, in accordance with the timelines
          prescribed by the applicable payment gateway and banking partners.
        </p>
      </section>

      <section id="booking-confirmation">
        <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mb-4">
          Booking Confirmation and Non-Refundable Token
        </h2>
        <p className="text-foreground/80 leading-relaxed">
          Where the PG owner allocates or accepts the selected bed, the booking
          shall be deemed confirmed and the service shall be considered
          successfully rendered. Upon allocation of the bed by the PG owner, the
          token amount shall become strictly non-refundable, and no cancellation
          or refund request shall be entertained thereafter. Users expressly
          acknowledge that once allocation occurs, the transaction is treated as
          a completed digital facilitation service.
        </p>
      </section>

      <section id="user-cancellation">
        <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mb-4">
          User Cancellation Before Allocation
        </h2>
        <p className="text-foreground/80 leading-relaxed">
          Users may cancel a booking request only prior to the allocation of the
          bed by the PG owner. Any cancellation initiated after allocation shall
          not be eligible for a refund. Refunds for user-initiated cancellations
          before allocation, if any, shall be processed solely at the discretion
          of the Company and subject to verification of booking status through
          Platform records.
        </p>
      </section>

      <section id="refund-processing">
        <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mb-4">
          Refund Processing Timeline
        </h2>
        <p className="text-foreground/80 leading-relaxed">
          Approved refunds, where applicable under this Policy, shall be
          processed using the same payment instrument originally used for the
          transaction. Refund processing timelines may vary and typically require
          three (3) to five (5) business days or such other period as determined
          by the payment gateway, issuing bank, or financial institution.
        </p>
      </section>

      <section id="platform-determination">
        <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mb-4">
          Platform Determination and Chargeback Restrictions
        </h2>
        <p className="text-foreground/80 leading-relaxed">
          All determinations relating to booking status, allocation, cancellation
          eligibility, and refunds shall be made based on system logs,
          transaction records, and booking confirmations maintained by the
          Platform. The Company reserves the right to deny refund requests that
          do not comply with this Policy or where the service has been
          successfully completed. Users agree not to initiate chargebacks or
          payment disputes for transactions that are non-refundable under this
          Policy, except as required under applicable law.
        </p>
      </section>
    </LegalPageLayout>
  );
}
