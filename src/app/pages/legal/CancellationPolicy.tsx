import React from "react";
import { AlertCircle } from "lucide-react";
import { Page } from "../../types";
import { LegalPageWrapper, LegalSection } from "../../components/legal/LegalPageWrapper";

export function CancellationPolicy({ setPage }: { setPage: (p: Page) => void }) {
  return (
    <LegalPageWrapper
      title="Cancellation Policy"
      subtitle="Important information about donation cancellations for Inclusiverse's crowdfunding initiative processed via Razorpay."
      icon={<AlertCircle className="w-6 h-6" />}
      setPage={setPage}
    >
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex gap-3">
        <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-amber-800 text-sm">Important Notice</p>
          <p className="text-amber-700 text-sm mt-1">
            Donations to Inclusiverse are final and cannot be cancelled once the payment is
            initiated and confirmed. Please review your donation amount carefully before
            proceeding.
          </p>
        </div>
      </div>

      <LegalSection title="1. Pre-Payment Cancellation">
        <p>
          You may cancel or exit the Razorpay payment window at any time <strong>before</strong>{" "}
          confirming your payment. Simply close the Razorpay checkout or click "Cancel." No amount
          will be charged if the payment is not completed.
        </p>
      </LegalSection>

      <LegalSection title="2. Post-Payment Cancellation">
        <p>
          Once a donation payment is <strong>successfully processed</strong> through Razorpay, it is
          considered final and <strong>cannot be cancelled</strong>. This is because:
        </p>
        <ul className="list-disc ml-5 space-y-1 mt-2">
          <li>
            Donations are immediately allocated toward Inclusiverse's event planning and operations.
          </li>
          <li>Crowdfunding contributions are voluntary gifts with no obligation of return.</li>
          <li>Processing and gateway fees incurred are non-recoverable.</li>
        </ul>
      </LegalSection>

      <LegalSection title="3. Failed Transactions">
        <p>
          If your payment fails or is declined but an amount has been debited from your account,
          please note:
        </p>
        <ul className="list-disc ml-5 space-y-1 mt-2">
          <li>
            Failed transaction reversals are handled automatically by Razorpay and your bank,
            typically within 5–7 business days.
          </li>
          <li>
            You will not be charged for failed transactions that do not result in a successful
            payment confirmation.
          </li>
          <li>
            If you face any issues, please{" "}
            <button
              type="button"
              onClick={() => setPage("contact")}
              className="text-primary underline hover:text-primary/80 cursor-pointer"
            >
              contact us
            </button>{" "}
            immediately with your transaction details.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="4. Duplicate Payments">
        <p>
          If you accidentally make a duplicate donation, please contact us within 48 hours with both
          transaction IDs. We will review the case on a goodwill basis and may issue a refund for the
          duplicate amount at our sole discretion, subject to Razorpay's refund capabilities.
        </p>
      </LegalSection>

      <LegalSection title="5. Technical Errors">
        <p>
          In case of technical errors where payment is deducted but not confirmed on our end, please
          reach out to us with your payment reference number. We will investigate with Razorpay and
          resolve the issue promptly.
        </p>
      </LegalSection>
    </LegalPageWrapper>
  );
}
