import type { Metadata } from "next";
import LegalPageLayout from "@/components/layout/LegalPageLayout";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "Read the Terms & Conditions governing your use of NearMePG.com — India's trusted PG booking platform operated by JAYAORA Solutions & Management.",
  alternates: { canonical: "https://nearmepg.com/terms-and-conditions" },
  openGraph: {
    title: "Terms & Conditions | NearMePG",
    description:
      "Read the Terms & Conditions governing your use of NearMePG.com.",
    type: "website",
    url: "https://nearmepg.com/terms-and-conditions",
  },
};

const sections = [
  { id: "introduction", title: "Introduction & Acceptance of Terms" },
  { id: "definitions", title: "Definitions" },
  { id: "about", title: "About NearMePG Platform" },
  { id: "eligibility", title: "Eligibility to Use the Platform" },
  { id: "user-accounts", title: "User Accounts (Guests / Customers)" },
  { id: "pg-owner-accounts", title: "PG Owner Accounts" },
  { id: "platform-role", title: "Platform Role & Intermediary Disclaimer" },
  {
    id: "listings",
    title: "Property Listings, Inventory & Information Accuracy",
  },
  {
    id: "search-discovery",
    title: "Search, Discovery & Real-Time Availability",
  },
  { id: "token-booking", title: "Token-Based Booking System" },
  {
    id: "booking-confirmation",
    title: "Booking Confirmation & Bed Allocation",
  },
  { id: "pricing", title: "Pricing, Fees & Platform Charges" },
  { id: "payments", title: "Payments, Settlements & Payment Gateway" },
  { id: "cancellations", title: "Cancellations, Refunds & Forfeiture" },
  { id: "offers", title: "Offers, Discounts & Promotional Rules" },
  {
    id: "user-responsibilities",
    title: "User Responsibilities & Prohibited Activities",
  },
  {
    id: "pg-owner-responsibilities",
    title: "PG Owner Responsibilities & Compliance Obligations",
  },
  {
    id: "checkin",
    title: "Check-in, Stay, Identity Verification & House Rules",
  },
  { id: "disputes", title: "Disputes Between Users and PG Owners" },
  {
    id: "platform-limitations",
    title: "Platform Limitations, Technical Disclaimers & No Liability",
  },
  {
    id: "intellectual-property",
    title: "Intellectual Property, Database Rights & Trade Secrets",
  },
  { id: "data-privacy", title: "Data Privacy & Personal Information" },
  {
    id: "third-party",
    title: "Third-Party Services, Integrations & External Links",
  },
  {
    id: "suspension",
    title: "Suspension, Restriction & Termination of Accounts",
  },
  { id: "force-majeure", title: "Force Majeure" },
  { id: "limitation-liability", title: "Limitation of Liability" },
  { id: "indemnity", title: "Indemnity" },
  {
    id: "governing-law",
    title: "Governing Law, Jurisdiction & Dispute Resolution",
  },
  { id: "amendments", title: "Amendments & Modifications to Terms" },
  { id: "contact", title: "Contact Information & Official Notices" },
];

export default function TermsAndConditionsPage() {
  return (
    <LegalPageLayout
      title="Terms & Conditions"
      lastUpdated="March 4, 2026"
      sections={sections}
    >
      <section id="introduction">
        <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mb-4">
          Introduction & Acceptance of Terms
        </h2>
        <p className="text-foreground/80 leading-relaxed mb-4">
          Welcome to Nearmepg.com ("Platform", "Website", "we", "us", or "our").
          Nearmepg.com is owned and operated by Jayaora Solutions and
          Management, a company incorporated under the laws of India.
        </p>
        <p className="text-foreground/80 leading-relaxed mb-4">
          These Terms and Conditions ("Terms") govern your access to and use of
          the Nearmepg Platform, including but not limited to browsing,
          searching, registering, booking, making payments, or otherwise using
          any services made available through the Platform.
        </p>
        <p className="text-foreground/80 leading-relaxed mb-4">
          By accessing, visiting, registering on, or using the Platform in any
          manner, whether as a guest user, registered user, or property owner,
          you acknowledge that you have read, understood, and agreed to be bound
          by these Terms, along with our Privacy Policy and any other policies
          or guidelines referenced herein.
        </p>
        <p className="text-foreground/80 leading-relaxed mb-4">
          If you do not agree to these Terms, you must not access or use the
          Platform.
        </p>
        <p className="text-foreground/80 leading-relaxed mb-4">
          These Terms constitute a legally binding agreement between you and
          Jayaora Solutions and Management, in accordance with the provisions of
          the Indian Contract Act, 1872, the Information Technology Act, 2000,
          and other applicable laws in force in India.
        </p>
        <p className="text-foreground/80 leading-relaxed">
          We reserve the right to modify, amend, or update these Terms at any
          time. Any changes shall be effective immediately upon being posted on
          the Platform. Your continued use of the Platform after such changes
          constitutes your acceptance of the revised Terms.
        </p>
      </section>

      <section id="definitions">
        <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mb-4">
          Definitions
        </h2>
        <p className="text-foreground/80 leading-relaxed mb-4">
          For the purposes of these Terms and Conditions, unless the context
          otherwise requires, the following terms shall have the meanings
          assigned to them below:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-foreground/80 leading-relaxed">
          <li>
            <strong>"Platform"</strong> means the website Nearmepg.com,
            including its web pages, mobile applications (if any), software,
            features, content, and services made available by Jayaora Solutions
            and Management.
          </li>
          <li>
            <strong>"Company"</strong> means Jayaora Solutions and Management, a
            company incorporated under the laws of India, which owns and
            operates the Platform.
          </li>
          <li>
            <strong>"User"</strong> or <strong>"Customer"</strong> means any
            individual who accesses, browses, registers on, or uses the Platform
            for the purpose of searching, viewing, booking, or reserving
            accommodation, whether as a registered user or a guest user.
          </li>
          <li>
            <strong>"Guest User"</strong> means a User who accesses or uses the
            Platform without creating a registered account.
          </li>
          <li>
            <strong>"Registered User"</strong> means a User who has created an
            account on the Platform using valid credentials.
          </li>
          <li>
            <strong>"PG Owner"</strong> or <strong>"Property Owner"</strong>{" "}
            means any individual or entity who lists, manages, or offers paying
            guest accommodation, rooms, or beds on the Platform.
          </li>
          <li>
            <strong>"Property"</strong> means any paying guest accommodation,
            building, or premises listed by a PG Owner on the Platform.
          </li>
          <li>
            <strong>"Room"</strong> means a defined living space within a
            Property, which may contain one or more beds.
          </li>
          <li>
            <strong>"Bed"</strong> means an individual sleeping unit within a
            Room that may be offered for booking or reservation through the
            Platform.
          </li>
          <li>
            <strong>"Token"</strong> means a non-refundable or conditionally
            refundable amount paid by a User to temporarily reserve a specific
            bed or accommodation on the Platform for a limited duration, subject
            to the terms specified at the time of booking.
          </li>
          <li>
            <strong>"Booking"</strong> means a confirmed or provisional
            reservation made by a User for a bed or accommodation through the
            Platform, whether secured by payment of a Token or otherwise.
          </li>
          <li>
            <strong>"Monthly Rent"</strong> means the recurring accommodation
            charges payable by a User to a PG Owner for continued occupancy of a
            bed or accommodation, excluding any Token amount, platform fees, or
            other charges.
          </li>
          <li>
            <strong>"Payment Gateway"</strong> means a third-party payment
            service provider engaged by the Company to facilitate online
            payments, collections, settlements, or payouts on the Platform.
          </li>
          <li>
            <strong>"Platform Fees"</strong> means any service charges,
            convenience fees, commissions, or other amounts charged by the
            Platform for facilitating bookings, payments, or related services.
          </li>
          <li>
            <strong>"Services"</strong> means all features, functionalities,
            tools, and services provided by the Platform, including search,
            discovery, booking, token reservation, payment facilitation, and
            account management.
          </li>
          <li>
            <strong>"Applicable Law"</strong> means all laws, statutes, rules,
            regulations, notifications, and guidelines applicable within the
            territory of India.
          </li>
        </ul>
      </section>

      <section id="about">
        <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mb-4">
          About Nearmepg Platform
        </h2>
        <p className="text-foreground/80 leading-relaxed mb-4">
          Nearmepg.com is a technology-enabled platform owned and operated by
          Jayaora Solutions and Management, designed to facilitate the
          discovery, listing, and booking of paying guest accommodations, rooms,
          and beds offered by independent PG owners.
        </p>
        <p className="text-foreground/80 leading-relaxed mb-4">
          The Platform acts solely as an intermediary that enables
          communication, discovery, and transaction facilitation between Users
          and PG Owners. Nearmepg does not own, operate, manage, or control any
          properties listed on the Platform, nor does it provide accommodation
          services directly.
        </p>
        <p className="text-foreground/80 leading-relaxed mb-4">
          All property listings, descriptions, images, pricing, availability,
          amenities, house rules, and related information are provided by PG
          Owners and are displayed on the Platform for informational purposes.
          While the Company endeavours to maintain accuracy, Nearmepg does not
          warrant or guarantee the completeness, accuracy, or reliability of
          such information.
        </p>
        <p className="text-foreground/80 leading-relaxed mb-4">
          The Platform may offer features such as token-based reservations,
          bed-level availability indicators, booking facilitation, and payment
          processing tools to assist Users and PG Owners. However, the final
          responsibility for providing accommodation, granting possession,
          enforcing house rules, and delivering services rests solely with the
          respective PG Owner.
        </p>
        <p className="text-foreground/80 leading-relaxed mb-4">
          Nearmepg does not guarantee the availability of any property, room, or
          bed, nor does it guarantee uninterrupted or error-free operation of
          the Platform. The Company shall not be responsible for any acts,
          omissions, disputes, deficiencies, or misconduct arising out of
          interactions between Users and PG Owners.
        </p>
        <p className="text-foreground/80 leading-relaxed">
          Any booking, payment, or reservation made through the Platform
          constitutes a contractual arrangement directly between the User and
          the PG Owner, subject to the applicable terms disclosed on the
          Platform.
        </p>
      </section>

      <section id="eligibility">
        <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mb-4">
          Eligibility to Use the Platform
        </h2>
        <p className="text-foreground/80 leading-relaxed mb-4">
          Access to and use of the Nearmepg Platform is available only to
          individuals and entities who are legally capable of entering into
          binding contracts under applicable Indian laws.
        </p>
        <p className="text-foreground/80 leading-relaxed mb-3">
          By using the Platform, you represent and warrant that:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-foreground/80 leading-relaxed mb-4">
          <li>You are at least eighteen (18) years of age;</li>
          <li>
            You are competent to contract under the provisions of the Indian
            Contract Act, 1872;
          </li>
          <li>You are using the Platform for lawful purposes only; and</li>
          <li>
            All information provided by you while accessing or using the
            Platform is true, accurate, and complete.
          </li>
        </ul>
        <p className="text-foreground/80 leading-relaxed mb-4">
          Minors below the age of eighteen (18) years are not permitted to
          register or use the Platform independently. Any use of the Platform by
          a minor shall be under the supervision and responsibility of a parent
          or legal guardian, who shall be deemed to have accepted these Terms on
          behalf of the minor.
        </p>
        <p className="text-foreground/80 leading-relaxed mb-4">
          PG Owners or entities listing properties on the Platform represent and
          warrant that they have the legal authority, rights, and permissions to
          list, manage, and offer the respective properties for accommodation
          and to receive payments in accordance with applicable laws.
        </p>
        <p className="text-foreground/80 leading-relaxed">
          The Company reserves the right to suspend, restrict, or terminate
          access to the Platform at its sole discretion if it is found that a
          User or PG Owner does not meet the eligibility requirements or has
          provided false, misleading, or incomplete information.
        </p>
      </section>

      <section id="user-accounts">
        <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mb-4">
          User Accounts (Guests / Customers)
        </h2>
        <p className="text-foreground/80 leading-relaxed mb-4">
          To access certain features of the Nearmepg Platform, including booking
          and payment services, Users may be required to create an account by
          providing accurate and complete information as requested during the
          registration process.
        </p>
        <p className="text-foreground/80 leading-relaxed mb-4">
          Users are responsible for maintaining the confidentiality of their
          account credentials, including login details, passwords, and one-time
          passwords (OTPs). Any activity carried out through a User's account
          shall be deemed to have been performed by the User, and the Company
          shall not be liable for any loss or damage arising from unauthorized
          access resulting from the User's failure to safeguard such
          credentials.
        </p>
        <p className="text-foreground/80 leading-relaxed mb-4">
          Users agree to promptly update their account information to ensure
          that it remains accurate, current, and complete. The Company shall not
          be responsible for any consequences arising from inaccurate or
          outdated information provided by the User.
        </p>
        <p className="text-foreground/80 leading-relaxed mb-4">
          Guest Users may be permitted to browse the Platform and access limited
          features without creating an account. However, certain services,
          including booking, token payments, and communication with PG Owners,
          may require account registration.
        </p>
        <p className="text-foreground/80 leading-relaxed mb-4">
          The Company reserves the right to verify User information at any time
          and to suspend, restrict, or terminate User accounts if it is found
          that the information provided is false, misleading, incomplete, or if
          the User has violated these Terms or any applicable laws.
        </p>
        <p className="text-foreground/80 leading-relaxed">
          Users agree not to create multiple accounts for fraudulent,
          misleading, or abusive purposes and not to impersonate any other
          person or entity while using the Platform.
        </p>
      </section>

      <section id="pg-owner-accounts">
        <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mb-4">
          PG Owner Accounts
        </h2>
        <p className="text-foreground/80 leading-relaxed mb-4">
          PG owners, property owners, managers, or authorized representatives
          ("PG Owners") may register on the Nearmepg Platform to list, manage,
          and offer accommodation services to Users.
        </p>
        <p className="text-foreground/80 leading-relaxed mb-4">
          By creating a PG Owner account, the PG Owner represents and warrants
          that they are the lawful owner of the property or have valid
          authorization to list and manage the property on the Platform. The
          Company does not independently verify ownership documents unless
          required by law and shall not be responsible for disputes relating to
          property ownership or authorization.
        </p>
        <p className="text-foreground/80 leading-relaxed mb-4">
          PG Owners are responsible for providing accurate, complete, and
          up-to-date information regarding their identity, property details,
          room configurations, bed availability, pricing, amenities, and bank
          account information for payment settlements. The Company shall not be
          liable for losses arising from incorrect or incomplete information
          submitted by PG Owners.
        </p>
        <p className="text-foreground/80 leading-relaxed mb-4">
          PG Owners agree that all listings, availability updates, pricing, and
          inventory status provided through the Platform are truthful and
          reflect real-time conditions. Any misrepresentation, overbooking, or
          misleading information may result in suspension or termination of the
          PG Owner account at the sole discretion of the Company.
        </p>
        <p className="text-foreground/80 leading-relaxed mb-4">
          PG Owners are solely responsible for complying with all applicable
          local, state, and central laws, including but not limited to municipal
          regulations, fire safety norms, housing laws, tax obligations, and
          labor laws related to their property operations.
        </p>
        <p className="text-foreground/80 leading-relaxed mb-4">
          The Platform acts solely as a technology intermediary and does not
          own, operate, manage, or control any PG properties listed. Any
          agreement for accommodation is entered directly between the PG Owner
          and the User, and the Company shall not be a party to such agreements.
        </p>
        <p className="text-foreground/80 leading-relaxed">
          The Company reserves the right to verify PG Owner accounts, request
          documentation, suspend listings, withhold settlements, or terminate
          accounts in cases of suspected fraud, legal non-compliance, policy
          violations, or risks to Users or the Platform.
        </p>
      </section>

      <section id="platform-role">
        <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mb-4">
          Platform Role & Intermediary Disclaimer
        </h2>
        <p className="text-foreground/80 leading-relaxed mb-4">
          Nearmepg is a technology platform owned and operated by Jayaora
          Solutions and Management ("Company") that facilitates the discovery,
          listing, booking, and management of paying guest ("PG")
          accommodations. The Company acts solely as an intermediary as defined
          under Section 2(1)(w) of the Information Technology Act, 2000 and the
          applicable rules thereunder.
        </p>
        <p className="text-foreground/80 leading-relaxed mb-4">
          The Company does not own, lease, operate, manage, control, or
          supervise any PG accommodation listed on the Platform. All
          accommodation services are provided exclusively by PG Owners, and any
          contractual arrangement for stay, rent, or related services is entered
          into directly between the User and the PG Owner.
        </p>
        <p className="text-foreground/80 leading-relaxed mb-4">
          The Company does not guarantee the quality, safety, legality,
          suitability, availability, or condition of any property, room, bed, or
          service listed on the Platform. Information displayed on the Platform
          is based on details provided by PG Owners, and the Company does not
          independently verify such information unless required by applicable
          law.
        </p>
        <p className="text-foreground/80 leading-relaxed mb-4">
          The Platform enables features such as digital token booking,
          availability visibility, inventory management, payment facilitation,
          and communication tools solely to improve transaction efficiency and
          transparency. The use of such features does not create any agency,
          partnership, joint venture, employment, or fiduciary relationship
          between the Company and any PG Owner.
        </p>
        <p className="text-foreground/80 leading-relaxed mb-3">
          The Company shall not be responsible or liable for:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-foreground/80 leading-relaxed mb-4">
          <li>
            Any disputes, disagreements, or claims arising between Users and PG
            Owners
          </li>
          <li>
            Property conditions, amenities, safety, hygiene, or conduct at the
            accommodation
          </li>
          <li>
            Cancellation, denial of entry, eviction, or changes in accommodation
            terms
          </li>
          <li>
            Loss, damage, injury, theft, or inconvenience suffered at the
            property
          </li>
        </ul>
        <p className="text-foreground/80 leading-relaxed mb-4">
          The Company's role is limited to providing a secure and functional
          digital platform and facilitating payments in accordance with
          applicable laws. Payment processing does not imply ownership or
          control over the accommodation services.
        </p>
        <p className="text-foreground/80 leading-relaxed mb-4">
          The Company reserves the right to remove or disable access to any
          listing, content, or account that violates applicable laws, these
          Terms, or poses a risk to Users or the Platform, without prior notice.
        </p>
        <p className="text-foreground/80 leading-relaxed">
          Nothing contained herein shall be construed to create any liability on
          the Company beyond that of a technology intermediary under Indian law.
        </p>
      </section>

      <section id="listings">
        <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mb-4">
          Property Listings, Inventory & Information Accuracy
        </h2>
        <p className="text-foreground/80 leading-relaxed mb-4">
          All property listings, descriptions, room details, bed configurations,
          pricing information, availability status, amenities, house rules,
          photographs, virtual representations, and related materials displayed
          on the Platform are provided by the respective PG Owner. The Company
          does not independently verify ownership, legality, habitability,
          regulatory compliance, or accuracy of such listings unless
          specifically required under applicable law.
        </p>
        <p className="text-foreground/80 leading-relaxed mb-4">
          Each PG Owner represents and warrants that all information submitted
          to the Platform is true, accurate, complete, and not misleading. The
          PG Owner further undertakes to update inventory status, pricing, and
          property details promptly to reflect actual availability. Any
          misrepresentation, concealment of material facts, or submission of
          false information shall constitute a material breach of these Terms.
        </p>
        <p className="text-foreground/80 leading-relaxed mb-4">
          Inventory displayed on the Platform, including bed-level or room-level
          availability, is managed through automated systems based on inputs
          provided by the PG Owner. While the Company endeavors to maintain
          updated information, it does not guarantee uninterrupted
          synchronization or absolute accuracy of real-time availability
          indicators. Displayed availability shall not constitute a confirmed
          booking unless validated in accordance with the Booking Confirmation &
          Bed Allocation section.
        </p>
        <p className="text-foreground/80 leading-relaxed mb-4">
          The Company does not warrant the suitability, condition, safety,
          legality, or regulatory compliance of any listed property. Users are
          advised to independently evaluate property details prior to completing
          a booking.
        </p>
        <p className="text-foreground/80 leading-relaxed mb-4">
          The Company reserves the right, at its sole discretion, to review,
          suspend, modify, or remove listings found to be misleading,
          non-compliant, fraudulent, or in violation of these Terms or
          applicable law.
        </p>
        <p className="text-foreground/80 leading-relaxed">
          In accordance with the intermediary framework under the Information
          Technology Act, 2000, the Company functions solely as a technology
          facilitator and shall not be deemed the publisher, owner, or guarantor
          of listings created by PG Owners.
        </p>
      </section>

      <section id="search-discovery">
        <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mb-4">
          Search, Discovery & Real-Time Availability
        </h2>
        <p className="text-foreground/80 leading-relaxed mb-4">
          The Platform provides automated search and filtering tools enabling
          Users to discover properties based on criteria such as location,
          price, room type, occupancy, amenities, and availability. Search
          results are generated algorithmically and may be influenced by
          filters, user inputs, system parameters, and operational factors. The
          Company does not guarantee that search results will be exhaustive or
          ranked in any particular order.
        </p>
        <p className="text-foreground/80 leading-relaxed mb-4">
          Availability indicators described as real-time or live are generated
          through system-based synchronization mechanisms dependent upon PG
          Owner inputs and technical infrastructure. The Company does not
          guarantee continuous synchronization or error-free display and shall
          not be liable for temporary inconsistencies arising from concurrent
          booking attempts, network delays, system maintenance, or technical
          interruptions.
        </p>
        <p className="text-foreground/80 leading-relaxed mb-4">
          Displayed availability does not create contractual rights and shall
          not be deemed confirmation of reservation unless validated through the
          formal confirmation process described in the Booking Confirmation &
          Bed Allocation section.
        </p>
        <p className="text-foreground/80 leading-relaxed">
          Where the Platform provides temporary hold functionality during the
          token process, such hold shall be time-bound and conditional. A
          temporary hold does not create tenancy rights, possession rights, or
          enforceable accommodation claims.
        </p>
      </section>

      <section id="token-booking">
        <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mb-4">
          Token-Based Booking System
        </h2>
        <p className="text-foreground/80 leading-relaxed mb-4">
          The Platform may permit Users to pay a predefined token amount to
          express intent to reserve a specific bed or accommodation. Payment of
          a token constitutes a conditional reservation request and does not
          create tenancy, leasehold interest, possession rights, or final
          confirmation of stay.
        </p>
        <p className="text-foreground/80 leading-relaxed mb-4">
          The token amount may be adjusted against rent, treated as a
          reservation fee, refunded, partially refunded, or forfeited in
          accordance with the applicable cancellation policy disclosed at the
          time of payment.
        </p>
        <p className="text-foreground/80 leading-relaxed mb-4">
          Token validity shall be limited to the duration specified during the
          booking process. If confirmation requirements are not completed within
          such duration, the temporary reservation may expire and the inventory
          may be released.
        </p>
        <p className="text-foreground/80 leading-relaxed mb-4">
          In the event of simultaneous booking attempts, allocation shall be
          determined based on automated system validation and transaction
          processing sequence. The Company shall not be liable for unsuccessful
          holds resulting from technical errors, network delays, or payment
          failures.
        </p>
        <p className="text-foreground/80 leading-relaxed">
          Payment of a token alone shall not create a landlord-tenant
          relationship between the User and the PG Owner.
        </p>
      </section>

      <section id="booking-confirmation">
        <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mb-4">
          Booking Confirmation & Bed Allocation
        </h2>
        <p className="text-foreground/80 leading-relaxed mb-4">
          A booking shall be deemed confirmed only upon successful payment
          processing, acceptance or validation by the PG Owner where applicable,
          and issuance of system-generated confirmation.
        </p>
        <p className="text-foreground/80 leading-relaxed mb-4">
          Upon confirmation, the accommodation arrangement shall constitute a
          contractual relationship directly between the User and the PG Owner.
          The Company is not a party to such accommodation agreement and does
          not assume responsibility for on-ground service delivery.
        </p>
        <p className="text-foreground/80 leading-relaxed mb-4">
          Where a booking relates to a specific bed within a shared room, the PG
          Owner may reassign the User to another bed within the same category or
          equivalent accommodation if operationally required, provided pricing
          and category remain substantially similar.
        </p>
        <p className="text-foreground/80 leading-relaxed">
          Confirmation remains subject to completion of check-in formalities,
          including identity verification and compliance with property rules.
        </p>
      </section>

      <section id="pricing">
        <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mb-4">
          Pricing, Fees & Platform Charges
        </h2>
        <p className="text-foreground/80 leading-relaxed mb-4">
          All accommodation pricing is determined by the respective PG Owner.
          The Company does not regulate pricing except where expressly stated.
        </p>
        <p className="text-foreground/80 leading-relaxed mb-4">
          The Company may charge service fees to Users and/or commissions or
          subscription fees to PG Owners for providing access to the Platform
          and related services. Applicable charges shall be disclosed prior to
          payment.
        </p>
        <p className="text-foreground/80 leading-relaxed mb-4">
          Pricing may be modified by PG Owners at their discretion for future
          bookings and shall not affect confirmed reservations unless mutually
          agreed.
        </p>
        <p className="text-foreground/80 leading-relaxed">
          Certain charges, including security deposits or utility adjustments,
          may be payable directly to the PG Owner. The Company shall not be
          liable for disputes arising from off-platform payments.
        </p>
      </section>

      <section id="payments">
        <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mb-4">
          Payments, Settlements & Payment Gateway
        </h2>
        <p className="text-foreground/80 leading-relaxed mb-4">
          The Platform may facilitate online payments through authorized
          third-party payment gateway service providers. The Company is not a
          banking institution, financial intermediary, or escrow agent and does
          not provide escrow services. All payment transactions are processed
          through regulated payment service providers in accordance with
          applicable law and regulatory guidelines.
        </p>
        <p className="text-foreground/80 leading-relaxed mb-4">
          Token payments and other booking-related payments processed through
          the Platform are subject to authorization by the User's bank or
          payment provider. A booking request shall not be considered valid
          unless payment is successfully authorized and processed. The Company
          shall not be liable for payment failures resulting from banking
          issues, gateway downtime, technical interruptions, fraud detection
          systems, or network errors.
        </p>
        <p className="text-foreground/80 leading-relaxed mb-4">
          Where monthly rent payment functionality is enabled on the Platform,
          the Company acts solely as a payment collection facilitator on behalf
          of the PG Owner. The underlying rental obligation remains between the
          User and the PG Owner. The Company does not guarantee enforcement of
          rental payments, tenancy continuation, or recovery of dues.
        </p>
        <p className="text-foreground/80 leading-relaxed mb-4">
          Payments collected through the Platform may be subject to validation
          checks, fraud review, deduction of applicable service fees, and
          internal settlement cycles before being remitted to the PG Owner.
          Settlement timelines are indicative and may vary due to banking
          processes, regulatory requirements, or payment gateway delays.
        </p>
        <p className="text-foreground/80 leading-relaxed mb-4">
          The Company reserves the right to withhold, delay, adjust, or reverse
          settlements in cases involving suspected fraud, chargebacks, disputes,
          violation of Terms, or regulatory inquiries. In the event of a
          chargeback or reversal initiated by a financial institution, the
          corresponding amount may be recovered from future settlements payable
          to the PG Owner.
        </p>
        <p className="text-foreground/80 leading-relaxed mb-4">
          The Company shall not be liable for losses arising from payment system
          failures beyond its reasonable control. All payment handling shall be
          conducted in compliance with applicable regulations issued by
          competent authorities, including guidelines issued by the Reserve Bank
          of India where applicable.
        </p>
        <p className="text-foreground/80 leading-relaxed">
          Payments on the Platform are processed through authorized third-party
          payment gateway service providers, including PhonePe. The Company does
          not store, process, or retain users' card details, UPI IDs, bank
          account information, or other sensitive payment credentials. All
          payment transactions are subject to the terms, conditions, and privacy
          policies of the respective payment service providers. The Company
          shall not be responsible or liable for payment failures, transaction
          delays, technical errors, reversals, or chargebacks arising from the
          payment gateway, banking systems, or network issues beyond the
          Company's reasonable control.
        </p>
      </section>

      <section id="cancellations">
        <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mb-4">
          Cancellations, Refunds & Forfeiture
        </h2>
        <p className="text-foreground/80 leading-relaxed mb-4">
          Cancellation of a reservation prior to booking confirmation shall be
          governed by the applicable cancellation terms displayed at the time of
          payment. Refund eligibility may be subject to deduction of payment
          gateway charges, administrative fees, or processing costs where
          disclosed.
        </p>
        <p className="text-foreground/80 leading-relaxed mb-4">
          Cancellation of a confirmed booking shall be governed strictly by the
          cancellation policy applicable to the specific property at the time of
          booking. Such policy may provide for full refund, partial refund, or
          non-refundable treatment. The User is responsible for reviewing such
          policy prior to completing payment.
        </p>
        <p className="text-foreground/80 leading-relaxed mb-4">
          Token amounts may be forfeited in circumstances including failure to
          complete check-in within the specified time, failure to provide
          required documentation, violation of disclosed conditions, or no-show
          without prior notice, subject to the applicable property policy.
        </p>
        <p className="text-foreground/80 leading-relaxed mb-4">
          In the event a PG Owner cancels a confirmed booking due to operational
          issues, regulatory constraints, safety concerns, or unforeseen
          circumstances, refunds of amounts processed through the Platform shall
          be handled in accordance with internal procedures. The Company shall
          not be liable for relocation costs, consequential damages, or
          alternative accommodation expenses.
        </p>
        <p className="text-foreground/80 leading-relaxed mb-4">
          The Company reserves the right to cancel or suspend bookings where
          fraud, payment irregularities, technical errors, or violations of
          these Terms are identified. Refunds, where applicable, shall be
          processed after review.
        </p>
        <p className="text-foreground/80 leading-relaxed mb-4">
          Refund processing timelines depend upon banking systems and payment
          gateway cycles. The Company does not guarantee specific credit
          timelines once a refund has been initiated.
        </p>
        <p className="text-foreground/80 leading-relaxed">
          The Company shall not be responsible for refund disputes relating to
          payments made directly between the User and the PG Owner outside the
          Platform.
        </p>
      </section>

      <section id="offers">
        <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mb-4">
          Offers, Discounts & Promotional Rules
        </h2>
        <p className="text-foreground/80 leading-relaxed mb-4">
          The Company may introduce promotional campaigns, discounts, referral
          benefits, cashback schemes, coupon codes, or limited-time pricing at
          its discretion. All promotional offers are conditional and subject to
          specific terms disclosed at the time of the campaign.
        </p>
        <p className="text-foreground/80 leading-relaxed mb-4">
          Promotional eligibility may depend upon criteria including booking
          value, validity period, first-time usage status, property
          applicability, or non-combinability with other offers. Failure to
          satisfy eligibility conditions may result in reversal of promotional
          benefits.
        </p>
        <p className="text-foreground/80 leading-relaxed mb-4">
          All promotions are time-bound and may be modified, suspended, or
          withdrawn without prior notice. The Company does not guarantee
          continuation of any promotional campaign.
        </p>
        <p className="text-foreground/80 leading-relaxed mb-4">
          Promotional benefits are non-transferable and may not be exchanged for
          cash unless expressly stated. Misuse of promotional codes, creation of
          multiple accounts for abuse, or fraudulent referral activity may
          result in cancellation of benefits and suspension of accounts.
        </p>
        <p className="text-foreground/80 leading-relaxed mb-4">
          In the event of pricing errors, technical glitches, or unintended
          discount display, the Company reserves the right to cancel or correct
          the affected transaction.
        </p>
        <p className="text-foreground/80 leading-relaxed">
          Promotional pricing does not constitute a guarantee of lowest market
          rate or permanent pricing structure.
        </p>
      </section>

      <section id="user-responsibilities">
        <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mb-4">
          User Responsibilities & Prohibited Activities
        </h2>
        <p className="text-foreground/80 leading-relaxed mb-4">
          Users agree to use the Platform solely for lawful purposes and in
          compliance with applicable laws. Users shall provide accurate
          information and maintain confidentiality of account credentials.
        </p>
        <p className="text-foreground/80 leading-relaxed mb-4">
          Users shall not engage in fraudulent activities, submit false
          information, create multiple accounts for misuse of benefits, attempt
          unauthorized access to systems, interfere with Platform functionality,
          initiate fraudulent chargebacks, or introduce malicious software.
        </p>
        <p className="text-foreground/80 leading-relaxed mb-4">
          Users shall not scrape, extract, copy, reproduce, or commercially
          exploit listing data, inventory structures, algorithms, or proprietary
          information of the Platform. Reverse engineering or attempts to derive
          source code are strictly prohibited.
        </p>
        <p className="text-foreground/80 leading-relaxed mb-4">
          Users shall not use the Platform to identify PG Owners and complete
          transactions outside the Platform for the purpose of avoiding service
          fees.
        </p>
        <p className="text-foreground/80 leading-relaxed mb-4">
          Users shall not utilize booked accommodations for unlawful purposes,
          commercial misuse, storage of illegal substances, or activities
          violating local laws.
        </p>
        <p className="text-foreground/80 leading-relaxed">
          Violation of this Section may result in suspension, termination,
          forfeiture of payments, withholding of refunds, and initiation of
          legal proceedings.
        </p>
      </section>

      <section id="pg-owner-responsibilities">
        <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mb-4">
          PG Owner Responsibilities & Compliance Obligations
        </h2>
        <p className="text-foreground/80 leading-relaxed mb-4">
          Each PG Owner represents that it possesses lawful authority to list
          and rent the property and that listing does not violate any
          contractual or statutory obligation.
        </p>
        <p className="text-foreground/80 leading-relaxed mb-4">
          PG Owners are solely responsible for compliance with municipal
          regulations, zoning laws, fire safety norms, health standards, police
          verification requirements, tax obligations, and all applicable
          regulatory frameworks.
        </p>
        <p className="text-foreground/80 leading-relaxed mb-4">
          PG Owners must ensure that property descriptions, pricing, amenities,
          and inventory status are accurate and not misleading. Repeated
          inaccuracies or misrepresentation may result in suspension or
          termination.
        </p>
        <p className="text-foreground/80 leading-relaxed mb-4">
          PG Owners are responsible for habitability, maintenance, safety
          conditions, and provision of advertised amenities. The Company does
          not conduct physical inspection unless expressly stated.
        </p>
        <p className="text-foreground/80 leading-relaxed mb-4">
          PG Owners shall conduct identity verification of tenants and maintain
          required records in accordance with applicable law.
        </p>
        <p className="text-foreground/80 leading-relaxed mb-4">
          The Company may deduct service fees, adjust settlements for
          chargebacks, and withhold funds in cases of disputes, fraud, or
          violation of Terms.
        </p>
        <p className="text-foreground/80 leading-relaxed">
          PG Owners agree to indemnify the Company against regulatory penalties,
          consumer complaints, injury claims, tax disputes, or damages arising
          from their conduct or non-compliance.
        </p>
      </section>

      <section id="checkin">
        <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mb-4">
          Check-in, Stay, Identity Verification & House Rules
        </h2>
        <p className="text-foreground/80 leading-relaxed mb-4">
          Check-in at the property shall be subject to successful booking
          confirmation and fulfillment of all requirements prescribed by the
          respective PG Owner, including but not limited to submission of valid
          government-issued identification, completion of registration
          formalities, and payment of any applicable security deposit or
          charges. The PG Owner reserves the right to deny check-in where such
          requirements are not satisfied or where material discrepancies are
          identified.
        </p>
        <p className="text-foreground/80 leading-relaxed mb-4">
          The responsibility for physical identity verification, maintenance of
          guest records, and compliance with applicable police verification or
          local authority reporting requirements shall rest solely with the PG
          Owner. The Company operates solely as a technology intermediary and
          does not conduct on-ground verification or assume regulatory reporting
          obligations.
        </p>
        <p className="text-foreground/80 leading-relaxed mb-4">
          Users agree to comply with all house rules, property policies, and
          operational guidelines imposed by the PG Owner, including rules
          relating to visitor access, curfew, conduct standards, cleanliness,
          noise control, and prohibited activities. Any violation of house rules
          may result in warning, penalties, eviction, forfeiture of token
          amounts, or adjustment of security deposit, subject to applicable
          policies and law.
        </p>
        <p className="text-foreground/80 leading-relaxed mb-4">
          Accommodation arranged through the Platform shall not, by itself,
          create a landlord-tenant relationship unless a separate written
          agreement is executed between the User and the PG Owner. The Platform
          does not guarantee permanent residency, tenancy protection, or
          occupancy rights beyond the confirmed booking period. Any tenancy
          rights, if created, shall arise exclusively between the User and the
          PG Owner.
        </p>
        <p className="text-foreground/80 leading-relaxed mb-4">
          Security deposits, where applicable, shall be governed by the PG
          Owner's disclosed policy. The Company shall not be responsible for
          disputes concerning deposit deductions.
        </p>
        <p className="text-foreground/80 leading-relaxed mb-4">
          Users are solely responsible for safeguarding their personal
          belongings during their stay. The Company shall not be liable for
          theft, loss, damage to personal property, or personal injury occurring
          at the premises. Safety and maintenance of the property remain the
          responsibility of the PG Owner.
        </p>
        <p className="text-foreground/80 leading-relaxed mb-4">
          The PG Owner may terminate a stay in cases of non-payment, violation
          of house rules, illegal activity, or conduct posing risk to persons or
          property, subject to applicable law. The Platform shall not intervene
          in physical enforcement matters, eviction proceedings, or on-ground
          disputes between the parties.
        </p>
        <p className="text-foreground/80 leading-relaxed">
          The Company may cooperate with law enforcement authorities or
          governmental agencies where legally required and may disclose
          account-related information pursuant to lawful requests.
        </p>
      </section>

      <section id="disputes">
        <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mb-4">
          Disputes Between Users and PG Owners
        </h2>
        <p className="text-foreground/80 leading-relaxed mb-4">
          Any dispute arising between a User and a PG Owner in relation to
          booking, accommodation, pricing, amenities, conduct, security deposit,
          damages, cancellation, or any on-ground matter shall be resolved
          directly between the User and the PG Owner.
        </p>
        <p className="text-foreground/80 leading-relaxed mb-4">
          The Company operates solely as a technology intermediary facilitating
          connection between Users and PG Owners and shall not be deemed a party
          to the accommodation arrangement. Accordingly, the Company shall not
          be responsible for adjudicating disputes, determining liability, or
          enforcing settlement between the parties.
        </p>
        <p className="text-foreground/80 leading-relaxed mb-4">
          The Platform may, at its sole discretion, provide communication tools
          or limited assistance to facilitate resolution of disputes; however,
          such facilitation shall not constitute mediation, arbitration, or
          legal determination of rights and obligations.
        </p>
        <p className="text-foreground/80 leading-relaxed mb-4">
          The Company shall not be liable for any claims, losses, damages,
          injuries, deficiencies of service, contractual breaches, eviction
          actions, deposit deductions, property damage, or personal injury
          arising out of or in connection with the accommodation arrangement
          between the User and the PG Owner.
        </p>
        <p className="text-foreground/80 leading-relaxed mb-4">
          Users and PG Owners acknowledge that any legal claim relating to
          accommodation services shall be brought directly against the relevant
          party responsible for such services and not against the Company,
          except where liability arises directly from the Company's own
          independent acts or statutory obligations.
        </p>
        <p className="text-foreground/80 leading-relaxed mb-4">
          Nothing in this Section shall restrict either party from pursuing
          remedies available under applicable law, including proceedings before
          competent courts or consumer dispute redressal authorities, in
          accordance with governing law provisions set forth in these Terms.
        </p>
        <p className="text-foreground/80 leading-relaxed">
          The Company reserves the right to suspend or terminate accounts of
          Users or PG Owners involved in repeated or serious disputes, fraud,
          misconduct, or violations of these Terms, without assuming
          responsibility for the underlying dispute.
        </p>
      </section>

      <section id="platform-limitations">
        <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mb-4">
          Platform Limitations, Technical Disclaimers & No Liability
        </h2>
        <p className="text-foreground/80 leading-relaxed mb-4">
          The Platform is provided on an "as is" and "as available" basis
          without warranties of any kind, whether express or implied, except as
          may be required under applicable law. The Company does not guarantee
          uninterrupted access, continuous availability, error-free operation,
          or complete accuracy of the Platform's functionality.
        </p>
        <p className="text-foreground/80 leading-relaxed mb-4">
          The Company does not warrant that the Platform will be free from
          technical errors, system interruptions, delays, data loss,
          unauthorized access, cyber threats, or other digital vulnerabilities.
          Users acknowledge that internet-based services are inherently subject
          to operational risks beyond the Company's reasonable control.
        </p>
        <p className="text-foreground/80 leading-relaxed mb-4">
          The Company shall not be liable for losses arising from temporary
          suspension of services due to maintenance, upgrades, server failures,
          network disruptions, force majeure events, third-party service
          provider failures, or regulatory restrictions.
        </p>
        <p className="text-foreground/80 leading-relaxed mb-4">
          The Company does not guarantee the accuracy, completeness,
          reliability, or timeliness of property listings, availability
          indicators, pricing information, or other content provided by PG
          Owners. Users rely on such information at their own discretion.
        </p>
        <p className="text-foreground/80 leading-relaxed mb-4">
          The Company shall not be liable for any indirect, incidental,
          consequential, special, exemplary, or punitive damages, including but
          not limited to loss of profits, loss of opportunity, business
          interruption, reputational harm, or data loss arising out of or in
          connection with use of the Platform.
        </p>
        <p className="text-foreground/80 leading-relaxed mb-4">
          Without prejudice to statutory rights that cannot be excluded under
          applicable law, the aggregate liability of the Company, if any,
          arising out of a specific transaction shall be limited to the amount
          of service fees actually received by the Company in relation to that
          transaction.
        </p>
        <p className="text-foreground/80 leading-relaxed mb-4">
          The Company shall not be responsible for actions, omissions,
          misconduct, negligence, regulatory violations, or contractual breaches
          committed by Users or PG Owners.
        </p>
        <p className="text-foreground/80 leading-relaxed mb-4">
          Users acknowledge that the Company functions as an intermediary under
          the framework of the Information Technology Act, 2000 and shall be
          entitled to safe harbour protections to the extent provided therein.
        </p>
        <p className="text-foreground/80 leading-relaxed">
          Nothing in these Terms shall exclude liability where such exclusion is
          prohibited under applicable law; however, to the maximum extent
          permitted by law, all other liabilities are expressly disclaimed.
        </p>
      </section>

      <section id="intellectual-property">
        <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mb-4">
          Intellectual Property, Database Rights & Trade Secrets
        </h2>
        <p className="text-foreground/80 leading-relaxed mb-4">
          All intellectual property rights in and relating to the Platform,
          including but not limited to software, source code, object code, user
          interface design, layout, workflow architecture, booking logic,
          bed-level inventory structure, database compilation, graphics, logos,
          text, audiovisual material, algorithms, domain name, and proprietary
          technology, are and shall remain the exclusive property of the Company
          or its lawful licensors.
        </p>
        <p className="text-foreground/80 leading-relaxed mb-4">
          The compilation, arrangement, structure, and organization of property
          listings, inventory management systems, search functionality, and
          booking architecture constitute original works protected under
          applicable intellectual property laws. Unauthorized reproduction,
          extraction, adaptation, redistribution, republication, or commercial
          exploitation of any substantial part of the Platform's database or
          structured system is strictly prohibited.
        </p>
        <p className="text-foreground/80 leading-relaxed mb-4">
          Users and PG Owners are granted a limited, non-exclusive,
          non-transferable, revocable license to access and use the Platform
          solely for its intended purpose in accordance with these Terms. No
          ownership rights are transferred by virtue of such access.
        </p>
        <p className="text-foreground/80 leading-relaxed mb-4">
          Any attempt to copy, replicate, reverse engineer, decompile,
          disassemble, derive source code, imitate workflow logic, mirror
          database structures, recreate inventory architecture, or develop
          derivative platforms based substantially on the Platform's proprietary
          system shall constitute infringement of intellectual property rights
          and may result in civil and criminal proceedings.
        </p>
        <p className="text-foreground/80 leading-relaxed mb-4">
          All trademarks, service marks, logos, and brand identifiers associated
          with the Platform are the exclusive property of the Company.
          Unauthorized use of the Platform's trade name, branding elements, or
          domain name in a manner likely to cause confusion, dilution, or
          misrepresentation is strictly prohibited.
        </p>
        <p className="text-foreground/80 leading-relaxed mb-4">
          Any feedback, suggestions, enhancement ideas, or recommendations
          submitted by Users or PG Owners regarding the Platform may be used by
          the Company without restriction, obligation, or compensation, and
          shall not create any proprietary interest in favor of the submitting
          party.
        </p>
        <p className="text-foreground/80 leading-relaxed mb-4">
          Proprietary systems, business methods, algorithms, pricing logic, user
          analytics, operational models, and database structures of the Platform
          constitute confidential trade secrets. Users and PG Owners agree not
          to disclose, misuse, or commercially exploit such proprietary
          information.
        </p>
        <p className="text-foreground/80 leading-relaxed mb-4">
          The Company reserves the right to initiate legal proceedings,
          including claims for injunction, damages, account suspension, and
          recovery of losses, in the event of intellectual property infringement
          or unauthorized commercial replication of the Platform's systems.
        </p>
        <p className="text-foreground/80 leading-relaxed">
          Nothing in these Terms shall be construed as granting any implied
          license or right to use the Company's intellectual property beyond the
          limited access expressly permitted herein.
        </p>
      </section>

      <section id="data-privacy">
        <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mb-4">
          Data Privacy & Personal Information (Privacy Policy)
        </h2>
        <p className="text-foreground/80 leading-relaxed mb-4">
          The Company collects, processes, stores, and uses personal information
          of Users and PG Owners for the purpose of providing and improving the
          Platform, facilitating bookings, enabling communication between
          parties, processing payments, ensuring security, complying with legal
          obligations, and preventing fraud.
        </p>
        <p className="text-foreground/80 leading-relaxed mb-4">
          Personal information may include, without limitation, name, contact
          details, identification documents, payment-related information,
          transaction history, communication records, device information, and
          usage data. Collection and processing of such data shall be conducted
          in accordance with applicable data protection laws.
        </p>
        <p className="text-foreground/80 leading-relaxed mb-4">
          By accessing or using the Platform, Users and PG Owners consent to the
          collection and processing of their personal data for lawful purposes
          connected with the operation of the Platform, subject to applicable
          legal safeguards.
        </p>
        <p className="text-foreground/80 leading-relaxed mb-4">
          The Company implements reasonable technical and organizational
          measures to protect personal data against unauthorized access, misuse,
          alteration, or disclosure. However, no digital system can guarantee
          absolute security, and the Company shall not be liable for breaches
          resulting from circumstances beyond its reasonable control, including
          cyberattacks, third-party vulnerabilities, or force majeure events.
        </p>
        <p className="text-foreground/80 leading-relaxed mb-4">
          The Company may share personal information with third-party service
          providers, including payment gateways, hosting providers, analytics
          partners, and regulatory authorities, strictly on a need-to-know basis
          and in compliance with applicable law.
        </p>
        <p className="text-foreground/80 leading-relaxed mb-4">
          PG Owners are independently responsible for handling personal
          information of Users obtained through the Platform and shall comply
          with applicable privacy and data protection requirements. The Company
          shall not be liable for misuse of personal data by PG Owners.
        </p>
        <p className="text-foreground/80 leading-relaxed mb-4">
          The Platform may use cookies, tracking technologies, and analytical
          tools to enhance user experience and monitor system performance.
          Continued use of the Platform constitutes consent to such usage unless
          disabled by the User through browser or device settings.
        </p>
        <p className="text-foreground/80 leading-relaxed mb-4">
          The Company may retain personal information for as long as necessary
          to fulfill contractual obligations, comply with legal requirements,
          resolve disputes, and enforce these Terms.
        </p>
        <p className="text-foreground/80 leading-relaxed mb-4">
          Users and PG Owners may have rights under applicable data protection
          laws to access, correct, update, or request deletion of their personal
          data, subject to legal limitations and verification requirements.
        </p>
        <p className="text-foreground/80 leading-relaxed">
          The Company may update its privacy practices from time to time to
          reflect regulatory changes or operational improvements. Continued use
          of the Platform after such updates shall constitute acceptance of the
          revised practices.
        </p>
      </section>

      <section id="third-party">
        <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mb-4">
          Third-Party Services, Integrations & External Links
        </h2>
        <p className="text-foreground/80 leading-relaxed mb-4">
          The Platform may integrate with or rely upon third-party service
          providers for functionality including but not limited to payment
          processing, hosting infrastructure, analytics, identity verification
          tools, communication systems, mapping services, and technical
          infrastructure. Such third-party services operate independently of the
          Company.
        </p>
        <p className="text-foreground/80 leading-relaxed mb-4">
          The Company does not control and shall not be responsible for the
          performance, availability, accuracy, security practices, or
          operational continuity of any third-party service provider. Use of
          such services may be subject to separate terms and privacy policies
          imposed by the respective third parties.
        </p>
        <p className="text-foreground/80 leading-relaxed mb-4">
          The Platform may contain links to external websites or resources for
          user convenience. The Company does not endorse, monitor, or assume
          responsibility for the content, policies, practices, or reliability of
          any external websites. Access to such external links is undertaken at
          the User's own risk.
        </p>
        <p className="text-foreground/80 leading-relaxed mb-4">
          The Company shall not be liable for losses, damages, service
          interruptions, data breaches, transaction failures, or disputes
          arising from actions or omissions of third-party service providers.
        </p>
        <p className="text-foreground/80 leading-relaxed mb-4">
          Where payment transactions are processed through authorized payment
          gateway providers regulated under applicable law and oversight of the
          Reserve Bank of India, the Company's role remains limited to
          facilitation and does not extend to banking or escrow functions.
        </p>
        <p className="text-foreground/80 leading-relaxed mb-4">
          The Company may replace, discontinue, or modify third-party
          integrations at its discretion without prior notice, provided such
          changes are consistent with operational requirements and applicable
          law.
        </p>
        <p className="text-foreground/80 leading-relaxed">
          Users and PG Owners acknowledge that certain functionalities of the
          Platform may depend on third-party systems and that temporary
          disruptions beyond the Company's reasonable control shall not
          constitute breach of these Terms.
        </p>
      </section>

      <section id="suspension">
        <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mb-4">
          Suspension, Restriction & Termination of Accounts
        </h2>
        <p className="text-foreground/80 leading-relaxed mb-4">
          The Company reserves the right, at its sole discretion, to suspend,
          restrict, deactivate, or terminate the account of any User or PG Owner
          in the event of violation of these Terms, suspected fraud,
          misrepresentation, regulatory non-compliance, chargeback abuse, misuse
          of promotional benefits, unlawful conduct, or any activity that may
          harm the integrity, security, or reputation of the Platform.
        </p>
        <p className="text-foreground/80 leading-relaxed mb-4">
          Suspension or restriction may include temporary disabling of login
          access, removal of listings, withholding of settlements, cancellation
          of bookings, limitation of features, or blocking of transactions
          pending investigation.
        </p>
        <p className="text-foreground/80 leading-relaxed mb-4">
          The Company may take immediate action without prior notice where such
          action is necessary to prevent fraud, protect other users, comply with
          legal obligations, respond to regulatory directions, or mitigate
          security risks.
        </p>
        <p className="text-foreground/80 leading-relaxed mb-4">
          Termination of an account shall not affect rights or obligations
          accrued prior to the date of termination, including payment
          obligations, indemnity commitments, dispute resolution provisions, or
          intellectual property protections.
        </p>
        <p className="text-foreground/80 leading-relaxed mb-4">
          In cases involving financial disputes, fraud investigations, or
          chargebacks, the Company may withhold pending settlements or refunds
          until resolution of the matter.
        </p>
        <p className="text-foreground/80 leading-relaxed mb-4">
          Users and PG Owners may request voluntary account deactivation by
          submitting a formal request through the designated contact channel;
          however, such deactivation shall not extinguish outstanding
          liabilities or ongoing obligations.
        </p>
        <p className="text-foreground/80 leading-relaxed mb-4">
          The Company shall not be liable for losses, damages, business
          interruption, reputational harm, or opportunity costs arising from
          lawful suspension or termination carried out in accordance with these
          Terms.
        </p>
        <p className="text-foreground/80 leading-relaxed">
          Repeated violations or serious misconduct may result in permanent
          removal from the Platform and prohibition from future registration.
        </p>
      </section>

      <section id="force-majeure">
        <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mb-4">
          Force Majeure
        </h2>
        <p className="text-foreground/80 leading-relaxed mb-4">
          The Company shall not be liable for any failure, delay, interruption,
          or deficiency in performance of its obligations under these Terms if
          such failure or delay arises from events beyond its reasonable
          control, including but not limited to acts of God, natural disasters,
          floods, earthquakes, fire, epidemics, pandemics, war, civil unrest,
          governmental actions, regulatory restrictions, strikes, labor
          disputes, power failures, internet disruptions, cyberattacks, server
          outages, or failure of third-party service providers.
        </p>
        <p className="text-foreground/80 leading-relaxed mb-4">
          During the continuance of a force majeure event, the affected
          obligations of the Company shall be suspended for the duration of such
          event without constituting breach of these Terms.
        </p>
        <p className="text-foreground/80 leading-relaxed mb-4">
          The Company shall make reasonable efforts to restore services
          following cessation of the force majeure event; however, the Company
          does not guarantee restoration within a specific timeframe.
        </p>
        <p className="text-foreground/80 leading-relaxed mb-4">
          Force majeure events affecting PG Owners, including regulatory
          closures, local authority restrictions, or operational disruptions,
          shall not create liability upon the Company for booking cancellations,
          relocation costs, or associated losses.
        </p>
        <p className="text-foreground/80 leading-relaxed">
          Nothing in this Section shall relieve any party of payment obligations
          already due prior to the occurrence of the force majeure event, unless
          otherwise required under applicable law.
        </p>
      </section>

      <section id="limitation-liability">
        <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mb-4">
          Limitation of Liability
        </h2>
        <p className="text-foreground/80 leading-relaxed mb-4">
          To the maximum extent permitted under applicable law, the Company
          shall not be liable for any indirect, incidental, consequential,
          special, exemplary, or punitive damages, including but not limited to
          loss of profits, loss of business opportunity, loss of goodwill, loss
          of anticipated savings, data loss, reputational harm, or business
          interruption arising out of or in connection with the use of, or
          inability to use, the Platform.
        </p>
        <p className="text-foreground/80 leading-relaxed mb-4">
          The Company shall not be liable for any acts, omissions, negligence,
          misconduct, regulatory violations, contractual breaches, personal
          injury, property damage, or service deficiencies attributable to Users
          or PG Owners.
        </p>
        <p className="text-foreground/80 leading-relaxed mb-4">
          Without prejudice to statutory rights that cannot be excluded under
          applicable law, the aggregate liability of the Company arising out of
          any single transaction or series of related transactions shall not
          exceed the total service fees actually received by the Company in
          connection with the specific booking giving rise to the claim.
        </p>
        <p className="text-foreground/80 leading-relaxed mb-4">
          The limitations set forth in this Section shall apply whether the
          claim arises in contract, tort, negligence, strict liability,
          statutory liability, or otherwise, and shall survive termination of
          these Terms.
        </p>
        <p className="text-foreground/80 leading-relaxed mb-4">
          Nothing in these Terms shall exclude or limit liability where such
          exclusion is expressly prohibited under applicable law; however, in
          all other respects, liability is expressly limited as stated herein.
        </p>
        <p className="text-foreground/80 leading-relaxed">
          Users and PG Owners acknowledge that the pricing structure and service
          fees charged by the Company are determined in reliance upon the
          limitations of liability set forth in these Terms, and that such
          limitations form an essential basis of the contractual arrangement.
        </p>
      </section>

      <section id="indemnity">
        <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mb-4">
          Indemnity
        </h2>
        <p className="text-foreground/80 leading-relaxed mb-4">
          Users and PG Owners agree to indemnify, defend, and hold harmless the
          Company, its directors, officers, employees, affiliates, agents, and
          representatives from and against any and all claims, demands, actions,
          proceedings, losses, damages, liabilities, penalties, fines, costs,
          and expenses, including reasonable legal fees, arising out of or in
          connection with their use of the Platform.
        </p>
        <p className="text-foreground/80 leading-relaxed mb-4">
          Without limiting the generality of the foregoing, such indemnity shall
          extend to claims arising from breach of these Terms, violation of
          applicable laws or regulations, misrepresentation of information,
          infringement of intellectual property rights, fraudulent conduct,
          regulatory non-compliance, negligence, personal injury, property
          damage, chargebacks, payment disputes, or misuse of personal data.
        </p>
        <p className="text-foreground/80 leading-relaxed mb-4">
          PG Owners specifically agree to indemnify the Company against claims
          arising from accommodation services, including but not limited to
          habitability issues, safety violations, fire incidents, municipal
          penalties, tenant disputes, deposit disputes, discrimination claims,
          and non-compliance with local authority requirements.
        </p>
        <p className="text-foreground/80 leading-relaxed mb-4">
          Users agree to indemnify the Company against claims arising from
          misuse of accommodation, unlawful conduct, damage to property,
          chargeback abuse, submission of false information, or violation of
          house rules.
        </p>
        <p className="text-foreground/80 leading-relaxed mb-4">
          The Company reserves the right to assume exclusive control of the
          defense of any matter subject to indemnification, and the indemnifying
          party shall cooperate fully in such defense at its own expense.
        </p>
        <p className="text-foreground/80 leading-relaxed">
          The indemnity obligations under this Section shall survive suspension,
          termination, or expiration of these Terms.
        </p>
      </section>

      <section id="governing-law">
        <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mb-4">
          Governing Law, Jurisdiction & Dispute Resolution
        </h2>
        <p className="text-foreground/80 leading-relaxed mb-4">
          These Terms shall be governed by and construed in accordance with the
          laws of India, without regard to conflict of law principles.
        </p>
        <p className="text-foreground/80 leading-relaxed mb-4">
          Any dispute, controversy, or claim arising out of or in connection
          with these Terms, including interpretation, validity, breach, or
          termination, shall first be attempted to be resolved amicably through
          mutual discussions between the parties within a period of thirty (30)
          days from the date of written notice of dispute.
        </p>
        <p className="text-foreground/80 leading-relaxed mb-4">
          In the event the dispute is not resolved amicably within the
          prescribed period, such dispute shall be referred to and finally
          resolved by arbitration in accordance with the provisions of the
          Arbitration and Conciliation Act, 1996.
        </p>
        <p className="text-foreground/80 leading-relaxed mb-4">
          The arbitration shall be conducted by a sole arbitrator appointed by
          the Company. The seat and venue of arbitration shall be at the
          registered office location of the Company. The arbitration proceedings
          shall be conducted in the English language.
        </p>
        <p className="text-foreground/80 leading-relaxed mb-4">
          The arbitral award shall be final and binding upon the parties and may
          be enforced in any court of competent jurisdiction.
        </p>
        <p className="text-foreground/80 leading-relaxed mb-4">
          Subject to the arbitration provisions above, the courts having
          jurisdiction over the registered office location of the Company shall
          have exclusive jurisdiction in respect of matters not subject to
          arbitration or for enforcement of arbitral awards.
        </p>
        <p className="text-foreground/80 leading-relaxed mb-4">
          Nothing in this Section shall prevent the Company from seeking interim
          or injunctive relief before a court of competent jurisdiction to
          protect its intellectual property rights, confidential information, or
          proprietary interests.
        </p>
        <p className="text-foreground/80 leading-relaxed">
          Users and PG Owners agree that any claim arising from use of the
          Platform must be initiated within one (1) year from the date the cause
          of action arises, failing which such claim shall be deemed barred to
          the extent permitted under applicable law.
        </p>
      </section>

      <section id="amendments">
        <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mb-4">
          Amendments & Modifications to Terms
        </h2>
        <p className="text-foreground/80 leading-relaxed mb-4">
          The Company reserves the right to amend, modify, update, revise, or
          replace these Terms & Conditions, in whole or in part, at any time, to
          reflect changes in legal requirements, business practices, Platform
          features, operational needs, or regulatory obligations.
        </p>
        <p className="text-foreground/80 leading-relaxed mb-4">
          Any such amendments or modifications shall be effective upon being
          published on the Platform or communicated through such means as the
          Company may deem appropriate under applicable law. Users are
          encouraged to review these Terms periodically to remain informed of
          any changes.
        </p>
        <p className="text-foreground/80 leading-relaxed mb-4">
          Continued access to or use of the Platform after the effective date of
          any amendment or modification shall constitute the User's acceptance
          of the revised Terms, to the extent permitted under applicable law.
        </p>
        <p className="text-foreground/80 leading-relaxed mb-4">
          Where amendments materially affect user rights or obligations and
          where required by applicable law, the Company shall provide reasonable
          prior notice before such changes take effect.
        </p>
        <p className="text-foreground/80 leading-relaxed mb-4">
          No amendment or modification shall operate retrospectively to
          adversely affect rights that have accrued prior to the effective date
          of such change, except where such retrospective application is
          expressly required or permitted under applicable law.
        </p>
        <p className="text-foreground/80 leading-relaxed mb-4">
          If any User does not agree to the amended Terms, such User must
          discontinue access to and use of the Platform. Continued use of the
          Platform following the effective date of amendments shall be deemed
          conclusive acceptance of the updated Terms.
        </p>
        <p className="text-foreground/80 leading-relaxed">
          Nothing in this Section shall limit or override statutory rights,
          remedies, or protections available to Users under applicable Indian
          law.
        </p>
      </section>

      <section id="contact">
        <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mb-4">
          Contact Information & Official Notices
        </h2>
        <p className="text-foreground/80 leading-relaxed mb-4">
          For any queries, grievances, legal notices, or communication relating
          to these Terms, Users and PG Owners may contact the Company through
          the official contact details published on the Platform.
        </p>
        <p className="text-foreground/80 leading-relaxed mb-4">
          Any legal notice intended for the Company shall be sent to its
          registered office address or designated official email address as
          published on the Platform, and shall be deemed received upon
          acknowledgment or as per applicable law governing electronic
          communications.
        </p>
        <p className="text-foreground/80 leading-relaxed mb-4">
          The Company may send notices to Users and PG Owners through registered
          email address, in-app notification, SMS, or other electronic means
          provided during registration. Such electronic communication shall
          constitute valid and sufficient notice.
        </p>
        <p className="text-foreground/80 leading-relaxed mb-4">
          Grievance redressal mechanisms, where applicable under law, shall be
          handled in accordance with statutory requirements and may include
          appointment of a designated grievance officer whose contact details
          shall be displayed on the Platform as required.
        </p>
        <div className="bg-secondary/50 rounded-lg p-4 space-y-1 text-foreground/80 text-sm">
          <p>
            <strong>Contact Email:</strong> support@nearmepg.com
          </p>
          <p>
            <strong>Registered Office:</strong> Nellore, Andhra Pradesh, India
          </p>
        </div>
      </section>
    </LegalPageLayout>
  );
}
