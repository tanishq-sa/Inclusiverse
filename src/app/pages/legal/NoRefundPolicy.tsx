import React from "react";
import { AlertCircle } from "lucide-react";
import { Page } from "../../types";
import { LegalPageWrapper, LegalSection } from "../../components/legal/LegalPageWrapper";

export function NoRefundPolicy({ setPage }: { setPage: (p: Page) => void }) {
  return (
    <LegalPageWrapper
      title="No Refund Policy"
      subtitle="All event ticket purchases made for Inclusiverse through our Razorpay payment gateway are non-refundable. Please read this policy before contributing."
      icon={<AlertCircle className="w-6 h-6" />}
      setPage={setPage}
    >
      <div className="bg-red-50 border border-red-200 rounded-2xl p-5 flex gap-3">
        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-red-800 text-sm">No Refunds on Tickets</p>
          <p className="text-red-700 text-sm mt-1">
            All ticket purchases for Inclusiverse are strictly non-refundable. By completing your purchase,
            you acknowledge and accept this policy in full.
          </p>
        </div>
      </div>

      <LegalSection title="1. Non-Refundable Nature of Tickets">
        <p>
          Inclusiverse operates as a <strong>student-led initiative</strong>. All
          event ticket payments collected through our Razorpay-powered platform are:
        </p>
        <ul className="list-disc ml-5 space-y-1 mt-2">
          <li>Final purchases for event entry</li>
          <li>Immediately directed toward planned events and operations</li>
          <li>Not exchangeable for goods, services, or any monetary return</li>
          <li>
            <strong>Non-refundable</strong> under all circumstances once payment is successfully
            processed
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="2. Why We Cannot Issue Refunds">
        <p>Our no-refund policy exists because:</p>
        <ul className="list-disc ml-5 space-y-1 mt-2">
          <li>
            <strong>Event planning:</strong> Ticket sales are used to fund the event.
          </li>
          <li>
            <strong>Operational commitments:</strong> Funds are planned and committed to event
            vendors, transportation, and participant support well in advance.
          </li>
          <li>
            <strong>Gateway fees:</strong> Razorpay charges payment processing fees which are
            deducted at the time of transaction and cannot be recovered.
          </li>
          <li>
            <strong>Final purchase:</strong> Tickets are purchases for an event, not refundable goods.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="3. Exceptions">
        <p>
          The only exceptions where we may consider a refund at our <strong>sole discretion</strong>{" "}
          are:
        </p>
        <ul className="list-disc ml-5 space-y-1 mt-2">
          <li>
            Verified duplicate payments (same person, same amount, processed twice within minutes)
          </li>
          <li>
            Payment debited but order/confirmation not received due to a verified technical failure
          </li>
        </ul>
        <p className="mt-2">
          Even in these exceptional cases, any refund is subject to Razorpay's refund timeline
          (typically 5–10 business days) and our internal review process. We do not guarantee a
          refund in any case.
        </p>
      </LegalSection>

      <LegalSection title="4. Chargebacks">
        <p>
          Initiating an unauthorized chargeback or dispute for a valid ticket transaction is a
          violation of these terms. We reserve the right to contest any chargeback with Razorpay and
          your card issuer by providing transaction evidence. Attendees who initiate fraudulent
          chargebacks may be banned from future participation in Inclusiverse events.
        </p>
      </LegalSection>

      <LegalSection title="5. Attendee Acknowledgment">
        <p>By proceeding with a purchase, you explicitly acknowledge that:</p>
        <ul className="list-disc ml-5 space-y-1 mt-2">
          <li>You have read and understood this No Refund Policy.</li>
          <li>Your ticket purchase is final and non-refundable once processed.</li>
          <li>You are purchasing a ticket voluntarily to support Inclusiverse's inclusive initiatives.</li>
          <li>You will not dispute the charge unless a verified technical error has occurred.</li>
        </ul>
      </LegalSection>

      <LegalSection title="6. Contact for Concerns">
        <p>
          If you have concerns before purchasing, please{" "}
          <button
            type="button"
            onClick={() => setPage("contact")}
            className="text-primary underline hover:text-primary/80 cursor-pointer"
          >
            contact us
          </button>{" "}
          before making a payment. We're happy to answer any questions about how your funds will be
          used.
        </p>
      </LegalSection>
    </LegalPageWrapper>
  );
}
