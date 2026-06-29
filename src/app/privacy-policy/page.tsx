import type { Metadata } from "next";
import LegalPageLayout from "@/components/layout/LegalPageLayout";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Learn how NearMePG.com collects, uses, stores, and protects your personal data in compliance with Indian data protection laws including the DPDP Act 2023.",
  alternates: { canonical: "https://nearmepg.com/privacy-policy" },
  openGraph: {
    title: "Privacy Policy | NearMePG",
    description:
      "How NearMePG.com collects, processes, and protects your personal data under Indian law.",
    type: "website",
    url: "https://nearmepg.com/privacy-policy",
  },
};

const sections = [
  { id: "introduction", title: "Introduction" },
  { id: "scope", title: "Scope & Applicability" },
  { id: "definitions", title: "Definitions" },
  { id: "data-fiduciary", title: "Data Fiduciary Details" },
  { id: "categories", title: "Categories of Personal Data Collected" },
  {
    id: "sensitive-data",
    title: "Sensitive & Government ID Data (Including Aadhaar)",
  },
  { id: "methods", title: "Methods of Data Collection" },
  { id: "purpose", title: "Purpose Limitation & Processing Objectives" },
  { id: "legal-basis", title: "Legal Basis for Processing" },
  { id: "consent", title: "Consent Management Framework" },
  {
    id: "account-kyc",
    title: "Account Registration & Identity Verification (KYC)",
  },
  {
    id: "booking-data",
    title: "Booking, Inventory & Transaction Data Processing",
  },
  { id: "financial-data", title: "Payments & Financial Data Handling" },
  { id: "automated", title: "Automated Decision-Making & Profiling" },
  {
    id: "marketing",
    title: "Marketing Communications & Behavioral Advertising",
  },
  { id: "cookies", title: "Cookies, Tracking Technologies & Analytics" },
  { id: "data-sharing", title: "Data Sharing & Disclosure Framework" },
  { id: "third-party", title: "Third-Party Processors & Vendor Management" },
  { id: "cross-border", title: "Cross-Border Data Transfers & Safeguards" },
  { id: "retention", title: "Data Retention & Data Minimization Policy" },
  { id: "security", title: "Data Security & Technical Safeguards" },
  { id: "access-controls", title: "Organizational & Access Controls" },
  { id: "user-rights", title: "User Rights & Data Principal Rights" },
  { id: "withdrawal", title: "Withdrawal of Consent & Account Deactivation" },
  {
    id: "children",
    title: "Children's Data & Age Restriction Policy (18+ Only)",
  },
  { id: "breach", title: "Data Breach Response & Incident Notification" },
  { id: "policy-updates", title: "Policy Updates & Version Control" },
  {
    id: "grievance-officer",
    title: "Grievance Officer & Regulatory Contact Mechanism",
  },
];

export default function PrivacyPolicyPage() {
  return (
    <LegalPageLayout
          title="Privacy Policy"
          lastUpdated="March 4, 2026"
          sections={sections}
        >
          <section id="introduction">
            <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mb-4">
              Introduction
            </h2>
            <p className="text-foreground/80 leading-relaxed mb-4">
              This Privacy Policy ("Policy") describes how NearMePG.com ("Platform",
              "Website", "we", "us", or "our"), owned and operated by Jayaora
              Solutions and Management, a company incorporated under the laws of
              India, collects, uses, stores, processes, shares, and protects
              personal data of users who access or use the Platform.
            </p>
            <p className="text-foreground/80 leading-relaxed mb-4">
              This Policy applies to all individuals and entities who access,
              browse, register on, or otherwise use the Platform, including users,
              guest users, and property owners, and governs the processing of
              personal data in connection with services offered through the
              Platform.
            </p>
            <p className="text-foreground/80 leading-relaxed mb-4">
              This Privacy Policy is published in accordance with the provisions of
              the Information Technology Act, 2000 and the rules made thereunder,
              including the Information Technology (Reasonable Security Practices
              and Procedures and Sensitive Personal Data or Information) Rules,
              2011, and is further aligned with the principles of the Digital
              Personal Data Protection Act, 2023, to the extent applicable.
            </p>
            <p className="text-foreground/80 leading-relaxed mb-4">
              By accessing or using the Platform, you acknowledge that you have read
              and understood this Privacy Policy and acknowledge to the collection
              and processing of your personal data in accordance with this Policy
              and applicable law. If you do not agree with the terms of this Privacy
              Policy, you must not access or use the Platform.
            </p>
            <p className="text-foreground/80 leading-relaxed">
              This Policy should be read in conjunction with the Terms & Conditions
              and any other policies published on the Platform. In the event of any
              inconsistency between this Policy and applicable law, the provisions
              of applicable law shall prevail.
            </p>
          </section>
    
          <section id="scope">
            <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mb-4">
              Scope & Applicability
            </h2>
            <p className="text-foreground/80 leading-relaxed mb-4">
              This Privacy Policy applies to the collection, processing, storage,
              use, disclosure, and protection of personal data of all individuals
              and entities who access or use the NearMePG.com Platform, whether as
              registered users, guest users, property owners, or any other persons
              interacting with the Platform.
            </p>
            <p className="text-foreground/80 leading-relaxed mb-3">
              This Policy governs personal data processed through:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-foreground/80 leading-relaxed mb-4">
              <li>The NearMePG.com website and related web pages;</li>
              <li>
                Any mobile website, web-based interface, or digital service operated
                by the Company;
              </li>
              <li>
                Communications, transactions, and interactions conducted through the
                Platform;
              </li>
              <li>
                Services, features, tools, and functionalities made available by the
                Platform from time to time.
              </li>
            </ul>
            <p className="text-foreground/80 leading-relaxed mb-4">
              This Privacy Policy applies only to personal data collected directly
              by or on behalf of the Platform in the course of providing its
              services. It does not apply to information collected by third-party
              websites, applications, payment gateways, or service providers that
              may be linked to or integrated with the Platform, which are governed
              by their respective privacy policies and terms.
            </p>
            <p className="text-foreground/80 leading-relaxed mb-4">
              The Platform may facilitate interactions and transactions between
              users and independent property owners. Personal data shared by users
              directly with such third parties shall be governed by the privacy
              practices of those parties, and the Company shall not be responsible
              for the collection, use, or disclosure of such data beyond the scope
              of the Platform's services.
            </p>
            <p className="text-foreground/80 leading-relaxed mb-4">
              This Policy applies to personal data processed within the territory of
              India and to data processed outside India, where such processing
              relates to services offered through the Platform and is subject to
              applicable Indian laws.
            </p>
            <p className="text-foreground/80 leading-relaxed mb-4">
              Nothing contained in this Policy shall limit or override any statutory
              rights, obligations, or remedies available under applicable law. In
              the event of any inconsistency between this Policy and applicable law,
              the provisions of applicable law shall prevail.
            </p>
            <p className="text-foreground/80 leading-relaxed">
              This Policy does not apply to information that has been anonymized or
              aggregated such that it no longer identifies an individual.
            </p>
          </section>
    
          <section id="definitions">
            <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mb-4">
              Definitions
            </h2>
            <p className="text-foreground/80 leading-relaxed mb-4">
              For the purposes of this Privacy Policy, unless the context otherwise
              requires, the following terms shall have the meanings assigned to them
              below:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-foreground/80 leading-relaxed">
              <li>
                <strong>"Company"</strong> means Jayaora Solutions and Management, a
                company incorporated under the laws of India, and the owner and
                operator of the Platform.
              </li>
              <li>
                <strong>"Platform"</strong> means the website NearMePG.com,
                including any related mobile site, web application, digital
                interface, or service operated by the Company.
              </li>
              <li>
                <strong>"User"</strong>, <strong>"You"</strong>, or{" "}
                <strong>"Your"</strong> means any natural or legal person who
                accesses, browses, registers on, or uses the Platform, whether as a
                registered user, guest user, property owner, or otherwise.
              </li>
              <li>
                <strong>"Personal Data"</strong> means any data or information that
                relates to an identified or identifiable individual, as defined
                under applicable Indian data protection laws, including but not
                limited to the Digital Personal Data Protection Act, 2023.
              </li>
              <li>
                <strong>"Sensitive Personal Data or Information"</strong> means such
                personal data as may be classified as sensitive under the
                Information Technology (Reasonable Security Practices and Procedures
                and Sensitive Personal Data or Information) Rules, 2011, as amended
                from time to time.
              </li>
              <li>
                <strong>"Processing"</strong> means any operation or set of
                operations performed on personal data, whether or not by automated
                means, including collection, recording, storage, organization, use,
                disclosure, sharing, transfer, or deletion.
              </li>
              <li>
                <strong>"Third Party"</strong> means any individual, entity, or
                organization other than the User and the Company, including service
                providers, payment gateways, analytics providers, and property
                owners, as applicable.
              </li>
              <li>
                <strong>"Services"</strong> means the services, features, tools, and
                functionalities offered through the Platform from time to time.
              </li>
              <li>
                <strong>"Applicable Law"</strong> means all laws, statutes, rules,
                regulations, guidelines, and governmental notifications in force in
                India, including the Information Technology Act, 2000 and the
                Digital Personal Data Protection Act, 2023, as amended from time to
                time.
              </li>
            </ul>
          </section>
    
          <section id="data-fiduciary">
            <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mb-4">
              Data Fiduciary Details
            </h2>
            <p className="text-foreground/80 leading-relaxed mb-4">
              For the purposes of applicable Indian data protection laws, including
              the Digital Personal Data Protection Act, 2023, Jayaora Solutions and
              Management shall be the Data Fiduciary in respect of the personal data
              processed through the Platform.
            </p>
            <p className="text-foreground/80 leading-relaxed mb-3">
              The details of the Data Fiduciary are as follows:
            </p>
            <div className="bg-secondary/50 rounded-lg p-4 space-y-1 text-foreground/80 text-sm mb-4">
              <p>
                <strong>Name of the Data Fiduciary:</strong> Jayaora Solutions and
                Management
              </p>
              <p>
                <strong>Platform Name:</strong> NearMePG.com
              </p>
              <p>
                <strong>Registered Office:</strong> Nellore, Andhra Pradesh, India
              </p>
              <p>
                <strong>Nature of Business:</strong> Digital platform facilitating
                listing and discovery of paying guest accommodations and related
                services
              </p>
              <p>
                <strong>Contact Email for Data Protection Queries:</strong>{" "}
                support@nearmepg.com
              </p>
            </div>
            <p className="text-foreground/80 leading-relaxed mb-4">
              The Data Fiduciary determines the purpose and means of processing
              personal data collected through the Platform and is responsible for
              ensuring that such processing is carried out in accordance with this
              Privacy Policy and applicable law.
            </p>
            <p className="text-foreground/80 leading-relaxed mb-4">
              Any communication, grievance, or request relating to the processing of
              personal data under this Privacy Policy may be addressed to the Data
              Fiduciary using the contact details provided in the "Grievance
              Redressal" or "Contact Us" section of this Policy.
            </p>
            <p className="text-foreground/80 leading-relaxed">
              Nothing contained in this section shall be construed as creating any
              additional obligations beyond those prescribed under applicable law.
            </p>
          </section>
    
          <section id="categories">
            <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mb-4">
              Categories of Personal Data Collected
            </h2>
            <p className="text-foreground/80 leading-relaxed mb-4">
              The Platform may collect and process the following categories of
              personal data from users in the course of providing its services. The
              categories listed below are indicative and may vary depending on the
              nature of the user's interaction with the Platform.
            </p>
    
            <h3 className="font-display font-semibold text-foreground text-lg mt-4 mb-2">
              Identity and Contact Information
            </h3>
            <p className="text-foreground/80 leading-relaxed mb-4">
              Information provided by users during registration or use of the
              Platform, including but not limited to name, mobile number, email
              address, gender, age, and profile details.
            </p>
    
            <h3 className="font-display font-semibold text-foreground text-lg mt-4 mb-2">
              Account and Usage Information
            </h3>
            <p className="text-foreground/80 leading-relaxed mb-4">
              Information relating to a user's account and activity on the Platform,
              such as login credentials (in encrypted form), preferences, search
              history, interactions, communications, and transaction-related
              records.
            </p>
    
            <h3 className="font-display font-semibold text-foreground text-lg mt-4 mb-2">
              Property and Accommodation Information
            </h3>
            <p className="text-foreground/80 leading-relaxed mb-4">
              Information provided by property owners or managers, including
              property details, location, availability, pricing, images, and related
              descriptions necessary for listing and offering accommodation services
              on the Platform.
            </p>
    
            <h3 className="font-display font-semibold text-foreground text-lg mt-4 mb-2">
              Payment and Transaction Information
            </h3>
            <p className="text-foreground/80 leading-relaxed mb-4">
              Limited information relating to payments made through the Platform,
              such as transaction identifiers, payment status, and timestamps. The
              Platform does not have access to such financial credentials at any
              stage of the payment process.
            </p>
    
            <h3 className="font-display font-semibold text-foreground text-lg mt-4 mb-2">
              Device and Technical Information
            </h3>
            <p className="text-foreground/80 leading-relaxed mb-4">
              Technical data such as IP address, browser type, device identifiers,
              operating system, and log information, collected automatically for
              security, analytics, and platform functionality purposes.
            </p>
    
            <h3 className="font-display font-semibold text-foreground text-lg mt-4 mb-2">
              Communication Information
            </h3>
            <p className="text-foreground/80 leading-relaxed mb-4">
              Information contained in communications between users and the
              Platform, including customer support queries, emails, messages, and
              feedback.
            </p>
    
            <h3 className="font-display font-semibold text-foreground text-lg mt-4 mb-2">
              Information Required by Law
            </h3>
            <p className="text-foreground/80 leading-relaxed mb-4">
              Any personal data collected or retained to comply with applicable
              legal obligations, lawful requests, court orders, or government
              directives.
            </p>
    
            <p className="text-foreground/80 leading-relaxed">
              The Platform shall collect only such personal data as is necessary for
              the purposes for which it is processed and in accordance with
              applicable law.
            </p>
          </section>
    
          <section id="sensitive-data">
            <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mb-4">
              Sensitive & Government ID Data (Including Aadhaar)
            </h2>
            <p className="text-foreground/80 leading-relaxed mb-4">
              The Platform does not require users to provide Aadhaar numbers,
              biometric information, or any other data classified as sensitive
              personal data under applicable Indian law for the purpose of accessing
              or using the Platform, unless such collection is expressly required by
              law or regulatory authority.
            </p>
            <p className="text-foreground/80 leading-relaxed mb-4">
              Where government-issued identification documents (such as Aadhaar) are
              voluntarily provided by users for verification, compliance, or lawful
              purposes, such information shall be collected and processed strictly
              in accordance with applicable law and only to the extent necessary for
              the stated purpose.
            </p>
            <p className="text-foreground/80 leading-relaxed mb-4">
              The Platform shall not use Aadhaar numbers as a condition for
              providing services, nor shall it store Aadhaar numbers or biometric
              information unless mandated by law. Where Aadhaar-based verification
              is carried out, it shall be done in compliance with the Aadhaar
              (Targeted Delivery of Financial and Other Subsidies, Benefits and
              Services) Act, 2016, and applicable regulations issued thereunder.
            </p>
            <p className="text-foreground/80 leading-relaxed mb-4">
              Sensitive personal data, if collected, shall be protected using
              reasonable security practices and procedures as required under
              applicable law and shall not be disclosed to any third party except
              where such disclosure is required by law or with the explicit consent
              of the user.
            </p>
            <p className="text-foreground/80 leading-relaxed">
              Nothing contained in this section shall be construed as creating any
              obligation on the Platform to collect or retain sensitive personal
              data beyond what is required under applicable law.
            </p>
          </section>
    
          <section id="methods">
            <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mb-4">
              Methods of Data Collection
            </h2>
            <p className="text-foreground/80 leading-relaxed mb-4">
              The Platform may collect personal data through the following lawful
              and reasonable methods in the course of providing its services:
            </p>
    
            <h3 className="font-display font-semibold text-foreground text-lg mt-4 mb-2">
              Data Provided Directly by Users
            </h3>
            <p className="text-foreground/80 leading-relaxed mb-4">
              Personal data voluntarily provided by users while accessing,
              registering on, or using the Platform, including during account
              creation, property listing, communication, customer support
              interactions, and submission of forms or requests.
            </p>
    
            <h3 className="font-display font-semibold text-foreground text-lg mt-4 mb-2">
              Data Collected Automatically
            </h3>
            <p className="text-foreground/80 leading-relaxed mb-4">
              Certain personal data may be collected automatically when users access
              or use the Platform, including technical and usage information such as
              IP address, device identifiers, browser type, operating system, access
              logs, and interaction data, collected through cookies, log files, and
              similar technologies.
            </p>
    
            <h3 className="font-display font-semibold text-foreground text-lg mt-4 mb-2">
              Data Collected Through Transactions
            </h3>
            <p className="text-foreground/80 leading-relaxed mb-4">
              Personal data generated in the course of transactions or service usage
              on the Platform, including booking-related information, transaction
              records, and service history.
            </p>
    
            <h3 className="font-display font-semibold text-foreground text-lg mt-4 mb-2">
              Data Received from Third Parties
            </h3>
            <p className="text-foreground/80 leading-relaxed mb-4">
              Personal data may be received from authorized third-party service
              providers, such as payment gateway operators, analytics service
              providers, communication service providers, or verification service
              providers, to the extent necessary for providing services and in
              accordance with applicable law.
            </p>
    
            <h3 className="font-display font-semibold text-foreground text-lg mt-4 mb-2">
              Data Collected for Legal or Compliance Purposes
            </h3>
            <p className="text-foreground/80 leading-relaxed mb-4">
              Personal data collected or retained pursuant to legal obligations,
              lawful requests, court orders, or regulatory requirements imposed on
              the Platform under applicable law.
            </p>
    
            <p className="text-foreground/80 leading-relaxed">
              All personal data shall be collected by lawful means, for specified
              purposes, and in a fair and transparent manner, consistent with
              applicable data protection laws.
            </p>
          </section>
    
          <section id="purpose">
            <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mb-4">
              Purpose Limitation & Processing Objectives
            </h2>
            <p className="text-foreground/80 leading-relaxed mb-4">
              The Platform shall collect and process personal data solely for lawful
              purposes that are clear, specific, and directly related to the
              functioning of the Platform and the provision of its services.
              Personal data shall not be processed in a manner that is incompatible
              with the purposes for which it is collected, except as permitted under
              applicable law.
            </p>
            <p className="text-foreground/80 leading-relaxed mb-3">
              Personal data may be collected and processed for the following
              purposes:
            </p>
    
            <h3 className="font-display font-semibold text-foreground text-lg mt-4 mb-2">
              Provision of Services
            </h3>
            <p className="text-foreground/80 leading-relaxed mb-4">
              To enable users to access, register on, and use the Platform,
              including facilitating property listings, searches, bookings,
              communications, and related services.
            </p>
    
            <h3 className="font-display font-semibold text-foreground text-lg mt-4 mb-2">
              Account Management
            </h3>
            <p className="text-foreground/80 leading-relaxed mb-4">
              To create, maintain, and manage user accounts, authenticate users,
              verify information, and provide customer support and assistance.
            </p>
    
            <h3 className="font-display font-semibold text-foreground text-lg mt-4 mb-2">
              Transaction Processing
            </h3>
            <p className="text-foreground/80 leading-relaxed mb-4">
              To facilitate payments, confirmations, refunds, and record-keeping
              related to transactions conducted through the Platform, in
              coordination with authorized third-party payment service providers.
            </p>
    
            <h3 className="font-display font-semibold text-foreground text-lg mt-4 mb-2">
              Platform Functionality and Improvement
            </h3>
            <p className="text-foreground/80 leading-relaxed mb-4">
              To operate, maintain, analyze, and improve the Platform's features,
              performance, security, and user experience.
            </p>
    
            <h3 className="font-display font-semibold text-foreground text-lg mt-4 mb-2">
              Communication
            </h3>
            <p className="text-foreground/80 leading-relaxed mb-4">
              To communicate with users regarding service-related matters, updates,
              notices, confirmations, support requests, and important information
              relating to the Platform.
            </p>
    
            <h3 className="font-display font-semibold text-foreground text-lg mt-4 mb-2">
              Security and Fraud Prevention
            </h3>
            <p className="text-foreground/80 leading-relaxed mb-4">
              To detect, prevent, investigate, and respond to fraud, unauthorized
              access, misuse of the Platform, or other unlawful activities,
              including enforcement of Terms & Conditions.
            </p>
    
            <h3 className="font-display font-semibold text-foreground text-lg mt-4 mb-2">
              Legal and Regulatory Compliance
            </h3>
            <p className="text-foreground/80 leading-relaxed mb-4">
              To comply with applicable laws, regulations, legal processes,
              governmental requests, court orders, or regulatory requirements,
              including enforcement of Terms & Conditions.
            </p>
    
            <p className="text-foreground/80 leading-relaxed">
              Personal data shall be retained and processed only for as long as is
              necessary to fulfill the purposes for which it is collected, unless a
              longer retention period is required or permitted under applicable law.
            </p>
          </section>
    
          <section id="legal-basis">
            <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mb-4">
              Legal Basis for Processing
            </h2>
            <p className="text-foreground/80 leading-relaxed mb-4">
              The Platform shall collect and process personal data only where there
              is a lawful basis to do so in accordance with applicable Indian law,
              including the Digital Personal Data Protection Act, 2023.
            </p>
            <p className="text-foreground/80 leading-relaxed mb-3">
              Personal data may be processed on the basis of one or more of the
              following lawful grounds:
            </p>
    
            <h3 className="font-display font-semibold text-foreground text-lg mt-4 mb-2">
              Consent of the Data Principal
            </h3>
            <p className="text-foreground/80 leading-relaxed mb-4">
              Personal data may be processed where the user has provided free,
              specific, informed, unconditional, and unambiguous consent for such
              processing, either expressly or through clear affirmative action, in
              accordance with applicable law.
            </p>
    
            <h3 className="font-display font-semibold text-foreground text-lg mt-4 mb-2">
              Performance of a Contract
            </h3>
            <p className="text-foreground/80 leading-relaxed mb-4">
              Personal data may be processed where such processing is necessary for
              the performance of a contract to which the user is a party, or for
              taking steps at the request of the user prior to entering into a
              contract, including the provision of services through the Platform.
            </p>
    
            <h3 className="font-display font-semibold text-foreground text-lg mt-4 mb-2">
              Compliance with Legal Obligations
            </h3>
            <p className="text-foreground/80 leading-relaxed mb-4">
              Personal data may be processed where such processing is necessary to
              comply with applicable laws, regulations, legal processes, court
              orders, or lawful governmental requests.
            </p>
    
            <h3 className="font-display font-semibold text-foreground text-lg mt-4 mb-2">
              Legitimate Uses Permitted by Law
            </h3>
            <p className="text-foreground/80 leading-relaxed mb-4">
              Personal data may be processed for such legitimate uses as may be
              permitted under applicable law, including purposes related to
              security, fraud prevention, network and information security, or
              protection of the rights and safety of the Platform and its users.
            </p>
    
            <p className="text-foreground/80 leading-relaxed mb-4">
              Where consent is relied upon as the legal basis for processing, users
              shall have the right to withdraw such consent in accordance with
              applicable law, subject to the consequences of such withdrawal on the
              availability of services.
            </p>
            <p className="text-foreground/80 leading-relaxed">
              Nothing contained in this section shall be construed as permitting the
              processing of personal data in a manner inconsistent with applicable
              law.
            </p>
          </section>
    
          <section id="consent">
            <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mb-4">
              Consent Management Framework
            </h2>
            <p className="text-foreground/80 leading-relaxed mb-4">
              Where required under applicable law, the Platform shall obtain the
              consent of users prior to the collection and processing of their
              personal data. Such consent shall be free, specific, informed,
              unconditional, and unambiguous, and shall be obtained through clear
              affirmative action by the user.
            </p>
            <p className="text-foreground/80 leading-relaxed mb-4">
              Consent may be obtained through the Platform's registration process,
              service usage workflows, forms, checkboxes, or other appropriate
              digital mechanisms that clearly indicate the purpose of data
              processing.
            </p>
            <p className="text-foreground/80 leading-relaxed mb-4">
              Users shall have the right to withdraw their consent at any time, in
              accordance with applicable law. Withdrawal of consent shall not affect
              the lawfulness of processing carried out prior to such withdrawal.
              Upon withdrawal of consent, the Platform may restrict or discontinue
              access to certain services where such processing is necessary for the
              provision of those services.
            </p>
            <p className="text-foreground/80 leading-relaxed mb-4">
              The Platform shall make reasonable efforts to ensure that users are
              able to access, review, and manage their consent preferences through
              available mechanisms on the Platform or by contacting the Platform
              through the designated grievance or contact channels.
            </p>
            <p className="text-foreground/80 leading-relaxed mb-4">
              Where personal data is processed on grounds other than consent, such
              processing shall be carried out strictly in accordance with applicable
              law and shall not require user consent where such consent is not
              mandated.
            </p>
            <p className="text-foreground/80 leading-relaxed mb-4">
              Nothing contained in this section shall be construed as obligating the
              Platform to provide services where the processing of personal data is
              no longer legally permissible due to withdrawal of consent.
            </p>
            <p className="text-foreground/80 leading-relaxed">
              Consent shall be recorded and logged in accordance with applicable
              law, where required.
            </p>
          </section>
    
          <section id="account-kyc">
            <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mb-4">
              Account Registration & Identity Verification (KYC)
            </h2>
            <p className="text-foreground/80 leading-relaxed mb-4">
              To access certain features or services on the Platform, users may be
              required to create an account by providing accurate, current, and
              complete information as requested during the registration process.
            </p>
            <p className="text-foreground/80 leading-relaxed mb-3">
              The Platform may undertake identity verification or know-your-customer
              (KYC) procedures where necessary to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-foreground/80 leading-relaxed mb-4">
              <li>ensure the authenticity of users and property owners;</li>
              <li>prevent fraud, misuse, or unauthorized access;</li>
              <li>
                comply with applicable laws, regulations, or lawful directives; or
              </li>
              <li>
                protect the rights, safety, and integrity of the Platform and its
                users.
              </li>
            </ul>
            <p className="text-foreground/80 leading-relaxed mb-4">
              Any identity verification or KYC process shall be conducted in
              accordance with applicable law and shall be limited to the minimum
              information reasonably required for such purpose. The Platform does
              not mandate Aadhaar-based verification for account registration unless
              required by law and shall not deny services solely on the basis of
              non-submission of Aadhaar information.
            </p>
            <p className="text-foreground/80 leading-relaxed mb-4">
              Where KYC or verification services are facilitated through authorized
              third-party service providers, such processing shall be governed by
              applicable law and the privacy practices of such service providers.
              The Platform shall not be responsible for the independent data
              handling practices of such third parties beyond the scope of its
              contractual obligations.
            </p>
            <p className="text-foreground/80 leading-relaxed mb-4">
              Users are responsible for ensuring that the information provided
              during registration and verification is accurate and up to date. The
              Platform shall not be liable for any consequences arising from
              inaccurate or misleading information provided by users.
            </p>
            <p className="text-foreground/80 leading-relaxed">
              Nothing contained in this section shall be construed as imposing any
              obligation on the Platform to conduct KYC in circumstances where such
              verification is not required under applicable law or business
              necessity.
            </p>
          </section>
    
          <section id="booking-data">
            <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mb-4">
              Booking, Inventory & Transaction Data Processing
            </h2>
            <p className="text-foreground/80 leading-relaxed mb-4">
              The Platform processes certain personal data in connection with
              bookings, inventory management, and transactions facilitated through
              the Platform in order to enable the provision of its services.
            </p>
    
            <h3 className="font-display font-semibold text-foreground text-lg mt-4 mb-2">
              Booking and Accommodation Data
            </h3>
            <p className="text-foreground/80 leading-relaxed mb-4">
              Personal data may be processed to facilitate accommodation searches,
              booking requests, confirmations, modifications, cancellations, and
              related communications between users and property owners.
            </p>
    
            <h3 className="font-display font-semibold text-foreground text-lg mt-4 mb-2">
              Inventory and Availability Management
            </h3>
            <p className="text-foreground/80 leading-relaxed mb-4">
              Information relating to property listings, room availability, pricing,
              occupancy status, and related operational details may be processed to
              ensure accurate display and management of inventory on the Platform.
            </p>
    
            <h3 className="font-display font-semibold text-foreground text-lg mt-4 mb-2">
              Transaction Records
            </h3>
            <p className="text-foreground/80 leading-relaxed mb-4">
              The Platform may process and retain records of transactions conducted
              through the Platform, including booking identifiers, transaction
              status, timestamps, and related references, for operational,
              accounting, audit, dispute resolution, and legal compliance purposes.
            </p>
    
            <h3 className="font-display font-semibold text-foreground text-lg mt-4 mb-2">
              Payment Processing
            </h3>
            <p className="text-foreground/80 leading-relaxed mb-4">
              Payments initiated through the Platform are processed through
              authorized third-party payment gateway service providers. The Platform
              does not store or process users' card details, UPI credentials, bank
              account information, or other sensitive financial data. Such
              information is handled directly by the respective payment service
              providers in accordance with their terms and privacy policies.
            </p>
    
            <h3 className="font-display font-semibold text-foreground text-lg mt-4 mb-2">
              Data Sharing with Property Owners
            </h3>
            <p className="text-foreground/80 leading-relaxed mb-4">
              Relevant booking and user information may be shared with property
              owners or managers solely to the extent necessary to fulfil bookings,
              provide accommodation services, and manage related communications.
            </p>
    
            <p className="text-foreground/80 leading-relaxed mb-4">
              All booking, inventory, and transaction data shall be processed only
              for the purposes stated in this section and in accordance with
              applicable law. The Platform shall not use such data for purposes
              unrelated to service delivery, except where required or permitted by
              law.
            </p>
            <p className="text-foreground/80 leading-relaxed">
              Property owners act as independent data recipients and are responsible
              for their own data handling practices.
            </p>
          </section>
    
          <section id="financial-data">
            <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mb-4">
              Payments & Financial Data Handling
            </h2>
            <p className="text-foreground/80 leading-relaxed mb-4">
              The Platform facilitates payment transactions for services offered
              through the Platform by integrating with authorized third-party
              payment gateway service providers.
            </p>
            <p className="text-foreground/80 leading-relaxed mb-4">
              All payment transactions initiated through the Platform are processed
              directly by such third-party payment gateway providers in accordance
              with their respective terms, conditions, and privacy policies. The
              Platform does not collect, store, process, or retain users' debit card
              details, credit card details, UPI credentials, bank account numbers,
              CVV, PINs, or other sensitive financial information.
            </p>
            <p className="text-foreground/80 leading-relaxed mb-4">
              The Platform may receive limited transaction-related information from
              payment gateway service providers, such as transaction reference
              numbers, payment status, timestamps, and confirmation details, solely
              for the purposes of record-keeping, reconciliation, customer support,
              dispute resolution, and legal compliance.
            </p>
            <p className="text-foreground/80 leading-relaxed mb-4">
              The Platform shall not be responsible or liable for any payment
              failures, delays, reversals, technical errors, chargebacks, or
              unauthorized transactions arising from banking networks, payment
              gateway systems, or circumstances beyond the Platform's reasonable
              control.
            </p>
            <p className="text-foreground/80 leading-relaxed mb-4">
              Users are advised to review the terms and privacy policies of the
              respective payment gateway service providers before initiating any
              payment transactions through the Platform.
            </p>
            <p className="text-foreground/80 leading-relaxed">
              Nothing contained in this section shall be construed as creating any
              obligation on the Platform to store or process financial data beyond
              what is required for lawful and operational purposes.
            </p>
          </section>
    
          <section id="automated">
            <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mb-4">
              Automated Decision-Making & Profiling
            </h2>
            <p className="text-foreground/80 leading-relaxed mb-4">
              The Platform does not engage in automated decision-making or profiling
              that produces legal effects or similarly significant consequences for
              users.
            </p>
            <p className="text-foreground/80 leading-relaxed mb-4">
              Certain automated processes may be used to support the functioning of
              the Platform, such as sorting, filtering, ranking, or displaying
              listings, search results, recommendations, or availability based on
              user preferences, activity, or location. Such processes are intended
              solely to improve user experience and operational efficiency and do
              not involve decisions that affect users' legal rights.
            </p>
            <p className="text-foreground/80 leading-relaxed mb-4">
              Any automated processing used by the Platform shall be subject to
              reasonable safeguards and shall not be used to make decisions relating
              to eligibility, denial of services, or other outcomes that have legal
              or material impact on users without appropriate human involvement,
              where required by applicable law.
            </p>
            <p className="text-foreground/80 leading-relaxed">
              Nothing contained in this section shall be construed as creating any
              obligation on the Platform to implement or disclose automated
              decision-making systems beyond what is required under applicable law.
            </p>
          </section>
    
          <section id="marketing">
            <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mb-4">
              Marketing Communications & Behavioral Advertising
            </h2>
            <p className="text-foreground/80 leading-relaxed mb-4">
              The Platform may communicate with users for service-related and
              informational purposes, including notifications, confirmations,
              updates, and support communications necessary for the operation of the
              Platform.
            </p>
            <p className="text-foreground/80 leading-relaxed mb-4">
              Marketing or promotional communications, if any, shall be sent only in
              accordance with applicable law and based on user consent where such
              consent is required. Users shall have the option to opt out of
              receiving non-essential marketing communications through available
              mechanisms or by contacting the Platform through the designated
              channels.
            </p>
            <p className="text-foreground/80 leading-relaxed mb-4">
              The Platform does not engage in intrusive behavioral advertising or
              profiling that tracks users across third-party websites for targeted
              advertising purposes. Any analytics or usage data collected is used
              primarily to understand platform performance and improve services and
              user experience.
            </p>
            <p className="text-foreground/80 leading-relaxed mb-4">
              Where third-party advertising or analytics tools are used, such tools
              shall operate in accordance with their respective privacy policies,
              and the Platform shall not control the independent data collection
              practices of such third parties.
            </p>
            <p className="text-foreground/80 leading-relaxed mb-4">
              Nothing contained in this section shall be construed as obligating the
              Platform to provide marketing communications or as limiting the
              Platform's ability to send mandatory service-related communications.
            </p>
            <p className="text-foreground/80 leading-relaxed">
              Transactional and service communications are mandatory and cannot be
              opted out of.
            </p>
          </section>
    
          <section id="cookies">
            <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mb-4">
              Cookies, Tracking Technologies & Analytics
            </h2>
            <p className="text-foreground/80 leading-relaxed mb-4">
              The Platform uses cookies and similar tracking technologies to ensure
              proper functioning of the website, enhance user experience, maintain
              security, and analyze platform performance.
            </p>
            <p className="text-foreground/80 leading-relaxed mb-4">
              Cookies are small data files stored on a user's device that help the
              Platform recognize returning users, retain preferences, and enable
              core functionalities such as session management, authentication, and
              fraud prevention. Certain cookies are strictly necessary for the
              operation of the Platform and cannot be disabled without affecting
              functionality.
            </p>
            <p className="text-foreground/80 leading-relaxed mb-4">
              The Platform may also use analytics tools to collect aggregated and
              anonymized information relating to user interactions, device type,
              browser information, operating system, access time, and usage
              patterns. Such data is used solely for internal analysis, performance
              monitoring, service improvement, and security purposes and is not used
              to identify individual users.
            </p>
            <p className="text-foreground/80 leading-relaxed mb-4">
              The Platform does not use cookies or tracking technologies for
              cross-site behavioral advertising or for tracking users across
              third-party websites for targeted advertising purposes.
            </p>
            <p className="text-foreground/80 leading-relaxed mb-4">
              Users may manage or disable cookies through their browser settings.
              However, disabling cookies may limit access to certain features or
              functionalities of the Platform. The Platform shall not be responsible
              for any loss of functionality resulting from user-controlled cookie
              restrictions.
            </p>
            <p className="text-foreground/80 leading-relaxed mb-4">
              Where third-party analytics or technology service providers are used,
              such providers may place their own cookies in accordance with their
              respective privacy policies. The Platform does not control and shall
              not be responsible for the independent data collection practices of
              such third parties.
            </p>
            <p className="text-foreground/80 leading-relaxed">
              By continuing to use the Platform, users consent to the use of cookies
              as described herein, where required by law.
            </p>
          </section>
    
          <section id="data-sharing">
            <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mb-4">
              Data Sharing & Disclosure Framework
            </h2>
            <p className="text-foreground/80 leading-relaxed mb-4">
              The Platform may share or disclose personal data of Users and PG
              Owners strictly on a need-to-know basis and only to the extent
              necessary for the operation, facilitation, security, and compliance of
              the Platform, in accordance with applicable Indian laws.
            </p>
            <p className="text-foreground/80 leading-relaxed mb-3">
              Personal data may be shared with the following categories of
              recipients:
            </p>
    
            <h3 className="font-display font-semibold text-foreground text-lg mt-4 mb-2">
              PG Owners / Users
            </h3>
            <p className="text-foreground/80 leading-relaxed mb-4">
              Limited personal information may be shared between Users and PG Owners
              solely for the purpose of facilitating bookings, confirmations,
              check-in, communication, and resolution of stay-related matters.
            </p>
    
            <h3 className="font-display font-semibold text-foreground text-lg mt-4 mb-2">
              Service Providers
            </h3>
            <p className="text-foreground/80 leading-relaxed mb-4">
              Third-party service providers engaged by the Platform, including
              payment gateways, banking partners, cloud service providers, analytics
              vendors, communication service providers, customer support tools, and
              technology infrastructure partners, strictly for performing services
              on behalf of the Platform and subject to contractual confidentiality
              and data protection obligations.
            </p>
    
            <h3 className="font-display font-semibold text-foreground text-lg mt-4 mb-2">
              Legal, Regulatory & Government Authorities
            </h3>
            <p className="text-foreground/80 leading-relaxed mb-4">
              Where disclosure is required under applicable laws, court orders,
              governmental requests, law enforcement requirements, statutory
              obligations, or regulatory proceedings.
            </p>
    
            <h3 className="font-display font-semibold text-foreground text-lg mt-4 mb-2">
              Business Transfers
            </h3>
            <p className="text-foreground/80 leading-relaxed mb-4">
              In the event of a merger, acquisition, restructuring, sale of assets,
              or transfer of business operations, personal data may be transferred
              to the acquiring or successor entity, subject to applicable legal
              safeguards and continuity of data protection obligations.
            </p>
    
            <p className="text-foreground/80 leading-relaxed mb-4">
              The Platform does not sell, rent, trade, or commercially exploit
              personal data of Users or PG Owners to third parties for marketing or
              advertising purposes.
            </p>
            <p className="text-foreground/80 leading-relaxed">
              All data sharing is carried out in compliance with reasonable security
              practices and is limited to the minimum data necessary to achieve the
              specified purpose. The Platform requires its service providers and
              partners to implement appropriate technical and organizational
              safeguards to protect shared data.
            </p>
          </section>
    
          <section id="third-party">
            <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mb-4">
              Third-Party Processors & Vendor Management
            </h2>
            <p className="text-foreground/80 leading-relaxed mb-4">
              The Platform may engage third-party processors, vendors, contractors,
              or service providers ("Third-Party Processors") to perform specific
              functions necessary for the operation, maintenance, security, and
              improvement of the Platform.
            </p>
            <p className="text-foreground/80 leading-relaxed mb-4">
              Such Third-Party Processors may include, without limitation, payment
              gateway providers, banking partners, cloud hosting providers, data
              storage vendors, analytics service providers, customer support tools,
              communication service providers, identity verification services, and
              technical infrastructure partners.
            </p>
            <p className="text-foreground/80 leading-relaxed mb-4">
              The Platform ensures that Third-Party Processors are engaged only for
              clearly defined and lawful purposes and are provided access to
              personal data strictly on a need-to-know basis and to the minimum
              extent required for performance of their contracted services.
            </p>
            <p className="text-foreground/80 leading-relaxed mb-3">
              All Third-Party Processors are contractually bound through written
              agreements to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-foreground/80 leading-relaxed mb-4">
              <li>
                process personal data only in accordance with documented
                instructions of the Platform;
              </li>
              <li>maintain confidentiality of personal data;</li>
              <li>
                implement reasonable security safeguards and industry-standard data
                protection measures;
              </li>
              <li>
                refrain from unauthorized disclosure, secondary use, or commercial
                exploitation of personal data; and
              </li>
              <li>
                comply with applicable data protection laws and regulatory
                requirements.
              </li>
            </ul>
            <p className="text-foreground/80 leading-relaxed mb-4">
              The Platform does not permit Third-Party Processors to retain, use, or
              disclose personal data for their own purposes, including marketing,
              profiling, or analytics unrelated to the Platform's services, unless
              expressly required by law.
            </p>
            <p className="text-foreground/80 leading-relaxed mb-4">
              While the Platform undertakes reasonable due diligence and contractual
              safeguards when appointing Third-Party Processors, it shall not be
              liable for acts, omissions, or data handling practices of such
              Third-Party Processors beyond the extent mandated under applicable
              law.
            </p>
            <p className="text-foreground/80 leading-relaxed">
              Where required under applicable law, the Platform may audit, review,
              or seek compliance assurances from Third-Party Processors to ensure
              adherence to contractual and legal obligations.
            </p>
          </section>
    
          <section id="cross-border">
            <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mb-4">
              Cross-Border Data Transfers & Safeguards
            </h2>
            <p className="text-foreground/80 leading-relaxed mb-4">
              The Platform primarily stores and processes personal data within the
              territory of India. However, in limited circumstances, certain
              personal data may be transferred to, stored in, or processed in
              jurisdictions outside India where such transfer is necessary for the
              provision of services, technical operations, regulatory compliance, or
              engagement of Third-Party Processors.
            </p>
            <p className="text-foreground/80 leading-relaxed mb-4">
              Cross-border transfers of personal data, where undertaken, shall be
              conducted strictly in accordance with applicable Indian laws, rules,
              and regulatory requirements, including the Information Technology Act,
              2000, the applicable rules thereunder, and any data protection
              legislation or governmental notifications in force from time to time.
            </p>
            <p className="text-foreground/80 leading-relaxed mb-3">
              The Platform shall ensure that any cross-border data transfer is
              subject to appropriate safeguards, which may include one or more of
              the following:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-foreground/80 leading-relaxed mb-4">
              <li>
                transfer to jurisdictions recognized or permitted by the Government
                of India;
              </li>
              <li>
                execution of contractual arrangements imposing data protection,
                confidentiality, and security obligations on the recipient;
              </li>
              <li>
                implementation of technical and organizational measures to protect
                personal data against unauthorized access, misuse, or disclosure;
                and
              </li>
              <li>
                limitation of transferred data to the minimum extent necessary for
                the specified purpose.
              </li>
            </ul>
            <p className="text-foreground/80 leading-relaxed mb-4">
              Sensitive personal data and government-issued identification
              information shall not be transferred outside India unless such
              transfer is expressly permitted under applicable law or required for
              lawful purposes, and subject to enhanced safeguards.
            </p>
            <p className="text-foreground/80 leading-relaxed mb-4">
              The Platform shall not sell or commercially exploit personal data
              through cross-border transfers. Any overseas processing shall be
              incidental to service delivery and shall not alter the purpose for
              which the data was originally collected.
            </p>
            <p className="text-foreground/80 leading-relaxed mb-4">
              Users acknowledge that, where legally permitted, cross-border data
              transfers may occur as part of Platform operations. Continued use of
              the Platform constitutes acceptance of such transfers subject to the
              safeguards described herein.
            </p>
            <p className="text-foreground/80 leading-relaxed">
              The Platform shall take reasonable steps to ensure that foreign
              recipients of personal data do not further transfer such data in a
              manner inconsistent with this Privacy Policy or applicable Indian law.
            </p>
          </section>
    
          <section id="retention">
            <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mb-4">
              Data Retention & Data Minimization Policy
            </h2>
            <p className="text-foreground/80 leading-relaxed mb-4">
              The Platform follows the principles of data minimization and limited
              retention and collects, processes, and retains personal data only to
              the extent necessary to fulfill lawful purposes connected with the
              operation of the Platform.
            </p>
            <p className="text-foreground/80 leading-relaxed mb-3">
              Personal data shall be retained only for as long as it is required to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-foreground/80 leading-relaxed mb-4">
              <li>provide services requested by Users or PG Owners;</li>
              <li>
                fulfill contractual obligations arising from bookings, payments, or
                account usage;
              </li>
              <li>
                comply with applicable legal, regulatory, tax, accounting, or
                reporting requirements;
              </li>
              <li>
                resolve disputes, enforce agreements, or protect legal rights; and
              </li>
              <li>prevent fraud, misuse, or security incidents.</li>
            </ul>
            <p className="text-foreground/80 leading-relaxed mb-4">
              The duration of retention may vary depending on the nature of the
              data, the purpose for which it was collected, and applicable statutory
              requirements. Where retention periods are prescribed under applicable
              law, such data shall be retained for the minimum period mandated and
              securely deleted thereafter.
            </p>
            <p className="text-foreground/80 leading-relaxed mb-4">
              Upon fulfillment of the applicable retention purpose, personal data
              shall be securely deleted, anonymized, or irreversibly de-identified
              using reasonable technical and organizational measures, unless
              continued retention is required by law or necessary for establishment,
              exercise, or defense of legal claims.
            </p>
            <p className="text-foreground/80 leading-relaxed mb-4">
              The Platform does not retain personal data indefinitely and does not
              store personal data merely for speculative or future use. Access to
              retained data is restricted to authorized personnel strictly on a
              need-to-know basis.
            </p>
            <p className="text-foreground/80 leading-relaxed mb-4">
              Users may request deletion or deactivation of their account in
              accordance with applicable law. Such requests shall be processed
              subject to legal retention obligations, pending disputes, outstanding
              payments, fraud prevention requirements, or regulatory compliance.
            </p>
            <p className="text-foreground/80 leading-relaxed">
              The Platform periodically reviews data retention practices to ensure
              continued compliance with evolving legal requirements, operational
              necessity, and data protection best practices.
            </p>
          </section>
    
          <section id="security">
            <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mb-4">
              Data Security & Technical Safeguards
            </h2>
            <p className="text-foreground/80 leading-relaxed mb-4">
              The Platform implements reasonable and appropriate technical and
              organizational security measures to protect personal data against
              unauthorized access, disclosure, alteration, loss, destruction, or
              misuse, in accordance with applicable laws and industry-recognized
              security practices.
            </p>
            <p className="text-foreground/80 leading-relaxed mb-3">
              Such security measures include, where appropriate:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-foreground/80 leading-relaxed mb-4">
              <li>
                secure server infrastructure and controlled access environments;
              </li>
              <li>
                encryption of data in transit using industry-standard protocols;
              </li>
              <li>
                access controls, authentication mechanisms, and role-based
                authorization to limit data access to authorized personnel only;
              </li>
              <li>
                regular monitoring of systems for potential vulnerabilities,
                security incidents, or unauthorized activity;
              </li>
              <li>
                implementation of internal data handling policies and
                confidentiality obligations for employees, contractors, and service
                providers; and
              </li>
              <li>
                reasonable safeguards to protect systems against malware,
                unauthorized intrusion, and cyber threats.
              </li>
            </ul>
            <p className="text-foreground/80 leading-relaxed mb-4">
              The Platform restricts access to personal data strictly on a
              need-to-know basis and ensures that individuals with authorized access
              are subject to confidentiality obligations and appropriate training.
            </p>
            <p className="text-foreground/80 leading-relaxed mb-4">
              While the Platform undertakes reasonable efforts to safeguard personal
              data, no method of electronic transmission or digital storage is
              completely secure. Accordingly, the Company does not guarantee
              absolute security and shall not be held liable for security breaches
              resulting from factors beyond its reasonable control, including
              advanced cyberattacks, third-party system vulnerabilities, or force
              majeure events.
            </p>
            <p className="text-foreground/80 leading-relaxed mb-4">
              In the event of a suspected or actual data security incident, the
              Platform shall take reasonable steps to investigate, mitigate, and
              contain the incident in accordance with applicable law and internal
              incident response procedures.
            </p>
            <p className="text-foreground/80 leading-relaxed mb-4">
              Users acknowledge that they are responsible for maintaining the
              confidentiality of their account credentials and for taking reasonable
              precautions to protect their own devices and access details. The
              Platform shall not be liable for data compromise arising from user
              negligence, credential sharing, or insecure personal devices.
            </p>
            <p className="text-foreground/80 leading-relaxed">
              Security measures are reviewed periodically and may be updated to
              reflect changes in technology, legal requirements, risk environment,
              or operational practices.
            </p>
          </section>
    
          <section id="access-controls">
            <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mb-4">
              Organizational & Access Controls
            </h2>
            <p className="text-foreground/80 leading-relaxed mb-4">
              The Platform maintains appropriate organizational measures and
              internal governance controls to ensure that personal data is accessed,
              processed, and handled only by authorized persons and strictly for
              legitimate business purposes consistent with this Privacy Policy and
              applicable law.
            </p>
            <p className="text-foreground/80 leading-relaxed mb-4">
              Access to personal data is granted on a role-based and need-to-know
              basis, taking into account job responsibilities, operational
              necessity, and risk assessment. Employees, contractors, and service
              providers are permitted access only to the extent required to perform
              their assigned duties.
            </p>
            <p className="text-foreground/80 leading-relaxed mb-3">
              The Platform implements internal controls which may include:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-foreground/80 leading-relaxed mb-4">
              <li>
                defined access authorization procedures and approval mechanisms;
              </li>
              <li>
                segregation of duties to reduce risk of unauthorized or excessive
                access;
              </li>
              <li>
                confidentiality obligations incorporated into employment contracts,
                service agreements, or non-disclosure arrangements;
              </li>
              <li>
                periodic review and revocation of access rights upon role change,
                termination, or cessation of engagement;
              </li>
              <li>
                internal policies governing acceptable use, data handling, and
                information security practices.
              </li>
            </ul>
            <p className="text-foreground/80 leading-relaxed mb-4">
              Personnel with access to personal data are provided reasonable
              awareness and training regarding data protection obligations,
              confidentiality requirements, and secure handling practices
              appropriate to their role.
            </p>
            <p className="text-foreground/80 leading-relaxed mb-4">
              The Platform may conduct internal audits, monitoring, or access
              reviews to assess compliance with its data protection framework and to
              identify potential risks or policy deviations. Such reviews are
              conducted in a proportionate manner and for legitimate operational,
              security, or compliance purposes.
            </p>
            <p className="text-foreground/80 leading-relaxed mb-4">
              Any breach of organizational policies, unauthorized access, or misuse
              of personal data by personnel may result in disciplinary action,
              contractual remedies, termination of engagement, and/or legal action
              in accordance with applicable law.
            </p>
            <p className="text-foreground/80 leading-relaxed">
              Organizational and access control measures are periodically reviewed
              and updated to reflect changes in legal requirements, operational
              structure, risk exposure, and industry best practices.
            </p>
          </section>
    
          <section id="user-rights">
            <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mb-4">
              User Rights & Data Principal Rights
            </h2>
            <p className="text-foreground/80 leading-relaxed mb-4">
              In accordance with applicable data protection laws in India, including
              the Digital Personal Data Protection Act, 2023, individuals whose
              personal data is processed by the Platform ("Data Principals") are
              entitled to exercise certain rights, subject to applicable legal
              limitations and verification requirements.
            </p>
            <p className="text-foreground/80 leading-relaxed mb-3">
              Subject to law, Data Principals may have the right to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-foreground/80 leading-relaxed">
              <li>
                obtain confirmation as to whether their personal data is being
                processed by the Platform;
              </li>
              <li>
                access a summary of personal data processed by the Platform and
                information relating to processing purposes;
              </li>
              <li>
                request correction, completion, or updating of inaccurate or
                incomplete personal data;
              </li>
              <li>
                request erasure of personal data that is no longer required for the
                stated purpose or where consent has been withdrawn, subject to
                lawful retention obligations;
              </li>
              <li>
                withdraw consent for processing of personal data, where processing
                is based on consent, without affecting the lawfulness of processing
                carried out prior to such withdrawal;
              </li>
              <li>
                seek redressal of grievances relating to processing of personal
                data;
              </li>
            </ul>
          </section>
    
          <section id="withdrawal">
            <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mb-4">
              Withdrawal of Consent & Account Deactivation
            </h2>
            <p className="text-foreground/80 leading-relaxed mb-4">
              Where the processing of personal data by the Platform is based on the
              consent of the User or PG Owner, such individual may withdraw consent
              at any time in accordance with applicable law. Withdrawal of consent
              shall not affect the lawfulness of processing carried out prior to
              such withdrawal.
            </p>
            <p className="text-foreground/80 leading-relaxed mb-4">
              Requests for withdrawal of consent or deactivation of an account may
              be submitted through the contact mechanisms or account settings made
              available on the Platform. The Platform may require reasonable
              verification of identity before processing such requests to prevent
              unauthorized actions.
            </p>
            <p className="text-foreground/80 leading-relaxed mb-3">
              Upon receipt of a valid withdrawal or deactivation request, the
              Platform shall:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-foreground/80 leading-relaxed mb-4">
              <li>
                discontinue processing of personal data for purposes that rely
                solely on consent, to the extent permitted under applicable law;
              </li>
              <li>
                deactivate the relevant account, subject to fulfillment of legal,
                contractual, or regulatory obligations.
              </li>
            </ul>
            <p className="text-foreground/80 leading-relaxed mb-3">
              Notwithstanding withdrawal of consent or account deactivation, the
              Platform may retain and continue to process personal data where such
              retention or processing is:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-foreground/80 leading-relaxed mb-4">
              <li>
                required to comply with applicable law, regulation, or court order;
              </li>
              <li>
                necessary for accounting, tax, audit, or statutory reporting
                purposes;
              </li>
              <li>
                required for establishment, exercise, or defense of legal claims;
              </li>
              <li>
                necessary for fraud prevention, misuse detection, security, or risk
                management; or
              </li>
              <li>
                connected to unresolved disputes, chargebacks, or outstanding
                financial obligations.
              </li>
            </ul>
            <p className="text-foreground/80 leading-relaxed mb-4">
              Account deactivation does not automatically result in deletion of all
              personal data, and certain information may remain retained in
              accordance with the Platform's Data Retention & Data Minimization
              Policy.
            </p>
            <p className="text-foreground/80 leading-relaxed mb-4">
              Users acknowledge that withdrawal of consent or deactivation of an
              account may result in limited or complete inability to access certain
              features or services of the Platform and may affect ongoing or future
              transactions.
            </p>
            <p className="text-foreground/80 leading-relaxed mb-4">
              The Platform shall process withdrawal and deactivation requests within
              a reasonable timeframe, subject to operational feasibility and
              applicable legal requirements.
            </p>
            <p className="text-foreground/80 leading-relaxed">
              Nothing in this Section shall limit statutory exemptions or override
              obligations imposed on the Company under applicable law.
            </p>
          </section>
    
          <section id="children">
            <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mb-4">
              Children's Data & Age Restriction Policy (18+ Only)
            </h2>
            <p className="text-foreground/80 leading-relaxed mb-4">
              The Platform is intended solely for use by individuals who are
              eighteen (18) years of age or older. The Company does not knowingly
              collect, process, or store personal data of children, as defined under
              applicable Indian law.
            </p>
            <p className="text-foreground/80 leading-relaxed mb-4">
              By accessing or using the Platform, Users represent and warrant that
              they are at least eighteen (18) years of age and are legally competent
              to enter into binding contracts under applicable law.
            </p>
            <p className="text-foreground/80 leading-relaxed mb-4">
              In the event that personal data of a child is inadvertently collected
              or processed due to misrepresentation of age or otherwise, the Company
              shall take reasonable steps to delete or anonymize such data upon
              becoming aware of the same, subject to applicable legal requirements.
            </p>
            <p className="text-foreground/80 leading-relaxed mb-4">
              The Platform does not permit the creation of accounts by children, nor
              does it knowingly engage in targeted advertising, behavioral
              profiling, or marketing communications directed at children.
            </p>
            <p className="text-foreground/80 leading-relaxed mb-4">
              Where a minor accesses the Platform under the supervision of a parent
              or legal guardian, such access shall be deemed to be at the sole
              responsibility of the parent or guardian. The Company shall not be
              liable for any misuse of the Platform by minors in violation of this
              Policy.
            </p>
            <p className="text-foreground/80 leading-relaxed mb-4">
              The Company reserves the right to suspend or terminate any account
              found to be associated with a minor or created using false age
              information, without prior notice, and without incurring liability.
            </p>
            <p className="text-foreground/80 leading-relaxed">
              Nothing in this Section shall limit or override obligations imposed on
              the Company under applicable child protection or data protection laws.
            </p>
          </section>
    
          <section id="breach">
            <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mb-4">
              Data Breach Response & Incident Notification
            </h2>
            <p className="text-foreground/80 leading-relaxed mb-4">
              The Platform maintains reasonable procedures to identify, assess,
              investigate, and respond to suspected or actual personal data
              breaches, security incidents, or unauthorized access events affecting
              personal data processed by the Company.
            </p>
            <p className="text-foreground/80 leading-relaxed mb-3">
              In the event of a personal data breach, the Company shall take
              reasonable and proportionate steps to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-foreground/80 leading-relaxed mb-4">
              <li>contain, mitigate, and remediate the incident;</li>
              <li>
                assess the nature, scope, and potential impact of the breach; and
              </li>
              <li>prevent recurrence through appropriate corrective measures.</li>
            </ul>
            <p className="text-foreground/80 leading-relaxed mb-3">
              Where a personal data breach is likely to cause significant harm to
              Data Principals, or where notification is required under applicable
              law, the Company shall notify:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-foreground/80 leading-relaxed mb-4">
              <li>the relevant regulatory or governmental authority, and/or</li>
              <li>affected Data Principals,</li>
            </ul>
            <p className="text-foreground/80 leading-relaxed mb-4">
              within such time and manner as prescribed under applicable law.
            </p>
            <p className="text-foreground/80 leading-relaxed">
              Breach notifications, where issued, may include information reasonably
              available to the Company at the time, such as the nature of the
              breach, categories of data affected, potential consequences, and
              measures taken or proposed to address the breach. The Company reserves
              the right to supplement or update notifications as further information
              becomes available. <br />
              <br />
              The Company shall not be required to notify Data Principals where the
              breach is unlikely to result in significant harm, or where
              notification is otherwise exempted under applicable law, regulatory
              guidance, or directions of competent authorities. <br />
              <br />
              The Company shall maintain internal records of material security
              incidents and data breaches in accordance with legal and compliance
              requirements. <br />
              <br />
              Nothing in this Section shall be construed as an admission of fault or
              liability by the Company, and the Company shall not be responsible for
              breaches arising from events beyond its reasonable control, including
              sophisticated cyberattacks, third-party system failures, or force
              majeure events. <br />
              <br />
              Users acknowledge that electronic systems carry inherent security
              risks and that absolute security cannot be guaranteed.
            </p>
          </section>
    
          <section id="policy-updates">
            <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mb-4">
              Policy Updates & Version Control
            </h2>
    
            <p className="text-foreground/80 leading-relaxed mb-4">
              The Company reserves the right to modify, amend, update, or revise
              this Privacy Policy from time to time to reflect changes in legal
              requirements, business practices, technological developments, or
              operational needs.
            </p>
    
            <p className="text-foreground/80 leading-relaxed mb-4">
              Any material changes to this Privacy Policy shall be communicated to
              users through reasonable means, which may include publication of the
              updated policy on the Platform, notifications within the Platform, or
              other appropriate communication channels, as required under applicable
              law.
            </p>
    
            <p className="text-foreground/80 leading-relaxed mb-4">
              The revised Privacy Policy shall become effective from the date of
              publication or such other date as expressly stated therein. Continued
              access to or use of the Platform or Services after the effective date
              of the updated Privacy Policy shall constitute acceptance of such
              changes, to the extent permitted under applicable law.
            </p>
    
            <p className="text-foreground/80 leading-relaxed mb-4">
              The Company shall maintain the most current version of this Privacy
              Policy on the Platform and may, at its discretion, maintain an
              internal or public record of prior versions for reference and
              compliance purposes.
            </p>
    
            <p className="text-foreground/80 leading-relaxed">
              Nothing contained in this Section shall limit any rights of Data
              Principals under applicable data protection laws, nor shall updates to
              this Privacy Policy operate retrospectively to reduce lawful
              protections applicable at the time personal data was collected, except
              where permitted by law.
            </p>
          </section>
    
          <section id="grievance-officer">
            <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mb-4">
              Grievance Officer & Regulatory Contact Mechanism
            </h2>
    
            <p className="text-foreground/80 leading-relaxed mb-4">
              In accordance with applicable provisions of the Information Technology
              Act, 2000, the Information Technology (Intermediary Guidelines and
              Digital Media Ethics Code) Rules, 2021, and the Digital Personal Data
              Protection Act, 2023, the Company has designated a Grievance Officer
              to address user complaints, concerns, or grievances relating to the
              processing of personal data, Platform usage, or alleged violations of
              this Privacy Policy.
            </p>
    
            <p className="text-foreground/80 leading-relaxed mb-3">
              The Grievance Officer shall be responsible for:
            </p>
    
            <ul className="list-disc pl-6 space-y-2 text-foreground/80 leading-relaxed mb-4">
              <li>
                acknowledging receipt of grievances submitted by users or Data
                Principals;
              </li>
              <li>
                reviewing and investigating such grievances in a fair and reasonable
                manner;
              </li>
              <li>
                resolving grievances within the timelines prescribed under
                applicable law; and
              </li>
              <li>
                maintaining records of grievances and actions taken, as required by
                law.
              </li>
            </ul>
    
            <p className="text-foreground/80 leading-relaxed mb-4">
              Users may submit grievances or communications relating to privacy,
              data protection, or Platform-related concerns using the contact
              details provided on the Platform. The Company shall make reasonable
              efforts to acknowledge and address grievances in a timely manner,
              subject to the nature of the complaint and applicable legal
              requirements.
            </p>
    
            <p className="text-foreground/80 leading-relaxed mb-4">
              Where a user is not satisfied with the resolution provided by the
              Company, or where required under applicable law, the user may escalate
              the grievance to the appropriate regulatory or statutory authority in
              accordance with the procedures prescribed under applicable law.
            </p>
    
            <p className="text-foreground/80 leading-relaxed mb-4">
              Nothing in this Section shall be construed as limiting the Company's
              right to seek additional information for grievance resolution, nor
              shall it prevent the Company from rejecting frivolous, malicious, or
              legally untenable complaints in accordance with applicable law.
            </p>
    
            <p className="text-foreground/80 leading-relaxed">
              The designation of a Grievance Officer does not constitute an
              admission of liability, and the Company's obligations under this
              Section shall be subject to force majeure events, lawful governmental
              directions, and circumstances beyond the Company's reasonable control.
            </p>
          </section>
    
          <section className="border-t border-border pt-6">
            <p className="text-foreground/80 leading-relaxed">
              <strong>Contact Email:</strong> support@nearmepg.com
              <br />
              <br />
              <strong>Registered Office:</strong> Nellore, Andhra Pradesh, India
            </p>
          </section>
        </LegalPageLayout>
  );
}
