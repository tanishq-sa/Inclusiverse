import React from "react";
import { FileText } from "lucide-react";
import { Page } from "../../types";
import { LegalPageWrapper, LegalSection } from "../../components/legal/LegalPageWrapper";

export function TermsOfService({ setPage }: { setPage: (p: Page) => void }) {
  return (
    <LegalPageWrapper
      title="Terms of Service"
      subtitle="Please read these terms carefully before making a donation to Inclusiverse through our Razorpay-powered crowdfunding platform."
      icon={<FileText className="w-6 h-6" />}
      setPage={setPage}
    >
      <LegalSection title="1. Acceptance of Terms">
        <p>
          By accessing our website and making a donation, you confirm that you have read, understood,
          and agree to be bound by these Terms of Service. If you do not agree with any part of
          these terms, please do not proceed with your donation.
        </p>
      </LegalSection>

      <LegalSection title="2. About Inclusiverse">
        <p>
          Inclusiverse is a student-led initiative operating under Christ University, Lavasa Campus.
          We organize inclusive events and activities for children with disabilities. Donations
          collected through this platform are managed by designated student volunteers on behalf of
          Inclusiverse.
        </p>
        <p>
          All funds raised go directly toward organizing events, procuring materials, and supporting
          participants in our inclusive programs.
        </p>
      </LegalSection>

      <LegalSection title="3. Nature of Donations">
        <p>
          All contributions made through this platform are <strong>voluntary donations</strong> to
          support Inclusiverse's crowdfunding initiatives. Donations are not purchases of goods or
          services. By donating, you acknowledge:
        </p>
        <ul className="list-disc ml-5 space-y-1 mt-2">
          <li>Your contribution is a voluntary gift to support Inclusiverse's mission.</li>
          <li>
            Donations are <strong>strictly non-refundable</strong> once processed (see our No Refund
            Policy).
          </li>
          <li>You will receive no goods, services, equity, or reward in exchange for your donation.</li>
          <li>
            Inclusiverse is not a registered NGO or charitable trust; donations may not be
            tax-deductible.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="4. Payment Processing">
        <p>
          All payments are processed securely through <strong>Razorpay</strong>, a third-party
          payment gateway. By making a payment, you also agree to Razorpay's Terms of Service and
          Privacy Policy available at{" "}
          <a
            href="https://razorpay.com/terms"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline"
          >
            razorpay.com/terms
          </a>
          .
        </p>
        <p>
          We accept UPI, Credit/Debit Cards, Net Banking, and Wallets. All transactions are
          encrypted and secured by Razorpay's infrastructure.
        </p>
      </LegalSection>

      <LegalSection title="5. Use of Funds">
        <p>Donated funds are used exclusively for Inclusiverse activities including but not limited to:</p>
        <ul className="list-disc ml-5 space-y-1 mt-2">
          <li>Event organization and logistics</li>
          <li>Participant transportation and meals</li>
          <li>Event materials, equipment, and supplies</li>
          <li>Volunteer coordination</li>
        </ul>
        <p className="mt-2">We are committed to transparent and responsible use of all contributions.</p>
      </LegalSection>

      <LegalSection title="6. Donor Obligations">
        <p>By donating, you confirm that:</p>
        <ul className="list-disc ml-5 space-y-1 mt-2">
          <li>You are at least 18 years of age or have parental consent.</li>
          <li>The funds used for donation are from legitimate sources.</li>
          <li>You are not violating any applicable laws by making this donation.</li>
        </ul>
      </LegalSection>

      <LegalSection title="7. Changes to Terms">
        <p>
          Inclusiverse reserves the right to modify these Terms of Service at any time. Continued use
          of the platform after changes constitutes acceptance of the revised terms. We encourage you
          to review this page periodically.
        </p>
      </LegalSection>

      <LegalSection title="8. Contact">
        <p>
          For any questions regarding these terms, please{" "}
          <button
            type="button"
            onClick={() => setPage("contact")}
            className="text-primary underline hover:text-primary/80 cursor-pointer"
          >
            contact us
          </button>
          .
        </p>
      </LegalSection>
    </LegalPageWrapper>
  );
}
