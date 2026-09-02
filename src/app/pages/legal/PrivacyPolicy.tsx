import React from "react";
import { CheckCircle2 } from "lucide-react";
import { Page } from "../../types";
import { LegalPageWrapper, LegalSection } from "../../components/legal/LegalPageWrapper";

export function PrivacyPolicy({ setPage }: { setPage: (p: Page) => void }) {
  return (
    <LegalPageWrapper
      title="Privacy Policy"
      subtitle="Your privacy matters to us. This policy explains how Inclusiverse collects, uses, and protects your information when you donate through our platform."
      icon={<CheckCircle2 className="w-6 h-6" />}
      setPage={setPage}
    >
      <LegalSection title="1. Information We Collect">
        <p>When you make a donation through Razorpay, the following information may be collected:</p>
        <ul className="list-disc ml-5 space-y-1 mt-2">
          <li>
            <strong>Personal details:</strong> Name, email address, phone number (optional, entered in
            Razorpay checkout)
          </li>
          <li>
            <strong>Transaction data:</strong> Payment amount, transaction ID, payment method used
          </li>
          <li>
            <strong>Technical data:</strong> Browser type, device information, IP address (collected
            automatically)
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="2. How We Use Your Information">
        <p>The information collected is used solely for:</p>
        <ul className="list-disc ml-5 space-y-1 mt-2">
          <li>Processing and confirming your donation</li>
          <li>Sending transaction receipts (via Razorpay)</li>
          <li>Communicating updates about Inclusiverse (only if you opt in)</li>
          <li>Internal reporting and fund reconciliation</li>
        </ul>
        <p className="mt-2">
          We do <strong>not</strong> sell, rent, or share your personal information with third
          parties for marketing purposes.
        </p>
      </LegalSection>

      <LegalSection title="3. Razorpay's Role">
        <p>
          Payment information (card numbers, UPI IDs, bank details) is processed directly by
          Razorpay and is never stored on our servers. Razorpay is PCI-DSS compliant. Please review{" "}
          <a
            href="https://razorpay.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline"
          >
            Razorpay's Privacy Policy
          </a>{" "}
          for details on how they handle your payment data.
        </p>
      </LegalSection>

      <LegalSection title="4. Data Security">
        <p>
          We implement reasonable administrative and technical safeguards to protect your data.
          However, no internet transmission is 100% secure. We encourage donors to use secure
          networks when making payments.
        </p>
      </LegalSection>

      <LegalSection title="5. Data Retention">
        <p>
          Transaction records are retained for accounting and compliance purposes for a minimum of 3
          years. Personal information is retained only as long as necessary for the purposes
          described above.
        </p>
      </LegalSection>

      <LegalSection title="6. Your Rights">
        <p>You have the right to:</p>
        <ul className="list-disc ml-5 space-y-1 mt-2">
          <li>Request access to the personal data we hold about you</li>
          <li>Request correction of inaccurate information</li>
          <li>Request deletion of your data (subject to legal obligations)</li>
        </ul>
        <p className="mt-2">
          To exercise these rights, please{" "}
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

      <LegalSection title="7. Cookies">
        <p>
          Our website may use minimal cookies for basic functionality (e.g., remembering
          accessibility preferences). We do not use tracking or advertising cookies. Razorpay's
          checkout may use cookies governed by their own policy.
        </p>
      </LegalSection>

      <LegalSection title="8. Changes to This Policy">
        <p>
          We may update this Privacy Policy from time to time. Changes will be posted on this page
          with an updated revision date.
        </p>
      </LegalSection>
    </LegalPageWrapper>
  );
}
