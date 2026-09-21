import React from "react";
import { FileText } from "lucide-react";
import { Page } from "../../types";
import { LegalPageWrapper, LegalSection } from "../../components/legal/LegalPageWrapper";

export function TermsOfService({ setPage }: { setPage: (p: Page) => void }) {
  return (
    <LegalPageWrapper
      title="Terms of Service"
      subtitle="Please read these terms carefully before purchasing an event ticket to Inclusiverse through our Razorpay-powered platform."
      icon={<FileText className="w-6 h-6" />}
      setPage={setPage}
    >
      <LegalSection title="1. Acceptance of Terms">
        <p>
          By accessing our website and purchasing a ticket, you confirm that you have read, understood,
          and agree to be bound by these Terms of Service. If you do not agree with any part of
          these terms, please do not proceed with your purchase.
        </p>
      </LegalSection>

      <LegalSection title="2. About Inclusiverse">
        <p>
          Inclusiverse is a student-led initiative operating under Christ University, Lavasa Campus.
          We organize inclusive events and activities for children with disabilities. Ticket proceeds
          collected through this platform are managed by designated student volunteers on behalf of
          Inclusiverse.
        </p>
        <p>
          All ticket sales go directly toward organizing events, procuring materials, and supporting
          the student-led initiatives of Inclusiverse.
        </p>
      </LegalSection>

      <LegalSection title="3. Nature of Tickets">
        <p>
          All ticket purchases made through this platform are <strong>event tickets</strong> for
          Inclusiverse's initiatives. By purchasing, you acknowledge:
        </p>
        <ul className="list-disc ml-5 space-y-1 mt-2">
          <li>Your purchase secures your entry for the designated event.</li>
          <li>
            Tickets are <strong>strictly non-refundable</strong> once processed (see our No Refund
            Policy).
          </li>
          <li>
            Inclusiverse is a student-led initiative; ticket proceeds go toward event operations.
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

      <LegalSection title="5. Use of Revenue">
        <p>Ticket proceeds are used exclusively for Inclusiverse activities including but not limited to:</p>
        <ul className="list-disc ml-5 space-y-1 mt-2">
          <li>Event organization and logistics</li>
          <li>Participant transportation and meals</li>
          <li>Event materials, equipment, and supplies</li>
          <li>Volunteer coordination</li>
        </ul>
        <p className="mt-2">We are committed to transparent and responsible use of all contributions.</p>
      </LegalSection>

      <LegalSection title="6. Attendee Obligations">
        <p>By purchasing a ticket, you confirm that:</p>
        <ul className="list-disc ml-5 space-y-1 mt-2">
          <li>You are at least 18 years of age or have parental consent.</li>
          <li>The payment method used for purchase is from legitimate sources.</li>
          <li>You are not violating any applicable laws by making this purchase.</li>
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
