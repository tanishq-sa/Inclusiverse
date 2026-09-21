import React, { useState } from "react";
import {
  Film,
  Calendar,
  Clock,
  MapPin,
  UserPlus,
  Trash2,
  IndianRupee,
  CheckCircle2,
  Loader2,
  AlertCircle,
  ChevronRight,
  Users,
  Ticket,
} from "lucide-react";
import { m, AnimatePresence } from "motion/react";
import { useTicketPricing } from "../hooks/useTicketPricing";
import { Page } from "../types";

// ─── Types ─────────────────────────────────────────────────────────────────────
interface AttendeeForm {
  name: string;
  regNo: string;
  email: string;
}

interface FormErrors {
  name?: string;
  regNo?: string;
  email?: string;
}

const CHRIST_EMAIL_REGEX = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.christuniversity\.in$/i;
const REG_NO_REGEX = /^\d{8}$/;
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";
const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID || "";

// ─── Validation ────────────────────────────────────────────────────────────────
function validateAttendee(a: AttendeeForm): FormErrors {
  const errors: FormErrors = {};
  if (!a.name.trim()) errors.name = "Name is required";
  if (!REG_NO_REGEX.test(a.regNo)) errors.regNo = "Registration number must be exactly 8 digits";
  if (!CHRIST_EMAIL_REGEX.test(a.email)) errors.email = "Must be a valid @christuniversity.in email";
  return errors;
}

// ─── Sub-components ────────────────────────────────────────────────────────────
function AttendeeCard({
  attendee,
  index,
  onChange,
  onRemove,
  errors,
  isPrimary,
}: {
  attendee: AttendeeForm;
  index: number;
  onChange: (field: keyof AttendeeForm, value: string) => void;
  onRemove?: () => void;
  errors: FormErrors;
  isPrimary: boolean;
}) {
  return (
    <m.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12, scale: 0.97 }}
      transition={{ duration: 0.25 }}
      className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden"
    >
      {/* Card header */}
      <div className="flex items-center justify-between px-5 py-3 bg-surface border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-xs font-bold text-primary">{index + 1}</span>
          </div>
          <span className="text-sm font-semibold text-text-main">
            {isPrimary ? "Your Details (Primary)" : `Person ${index + 1}`}
          </span>
          {isPrimary && (
            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-semibold">
              Main Contact
            </span>
          )}
        </div>
        {!isPrimary && onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-lg hover:bg-red-50 cursor-pointer"
            aria-label="Remove attendee"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5">
        {/* Name */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
            Full Name
          </label>
          <input
            type="text"
            value={attendee.name}
            onChange={(e) => onChange("name", e.target.value)}
            placeholder="e.g. Arjun Sharma"
            className={`w-full rounded-xl border px-3.5 py-2.5 text-sm text-text-main placeholder:text-gray-400 outline-none transition-all focus:ring-2 focus:ring-primary/30 focus:border-primary ${errors.name ? "border-red-400 bg-red-50" : "border-gray-200 bg-white"
              }`}
          />
          {errors.name && (
            <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {errors.name}
            </p>
          )}
        </div>

        {/* Registration Number */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
            Registration No.
          </label>
          <input
            type="text"
            value={attendee.regNo}
            onChange={(e) => onChange("regNo", e.target.value.replace(/\D/g, "").slice(0, 8))}
            placeholder="8-digit number"
            maxLength={8}
            className={`w-full rounded-xl border px-3.5 py-2.5 text-sm text-text-main placeholder:text-gray-400 outline-none transition-all focus:ring-2 focus:ring-primary/30 focus:border-primary font-mono tracking-widest ${errors.regNo ? "border-red-400 bg-red-50" : "border-gray-200 bg-white"
              }`}
          />
          {errors.regNo && (
            <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {errors.regNo}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
            Christ Email ID
          </label>
          <input
            type="email"
            value={attendee.email}
            onChange={(e) => onChange("email", e.target.value)}
            placeholder="you@bcah.christuniversity.in"
            className={`w-full rounded-xl border px-3.5 py-2.5 text-sm text-text-main placeholder:text-gray-400 outline-none transition-all focus:ring-2 focus:ring-primary/30 focus:border-primary ${errors.email ? "border-red-400 bg-red-50" : "border-gray-200 bg-white"
              }`}
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {errors.email}
            </p>
          )}
        </div>
      </div>
    </m.div>
  );
}

// ─── Success Screen ────────────────────────────────────────────────────────────
function SuccessScreen({
  bookingId,
  primaryName,
  total,
  attendeeCount,
  setPage,
}: {
  bookingId: string;
  primaryName: string;
  total: number;
  attendeeCount: number;
  setPage: (p: Page) => void;
}) {
  return (
    <m.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="max-w-lg mx-auto text-center py-20 px-4"
    >
      <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
        <CheckCircle2 className="w-10 h-10 text-green-600" />
      </div>
      <h2 className="text-3xl font-display font-bold text-text-main mb-2">You're In! 🎬</h2>
      <p className="text-gray-500 mb-6 text-base leading-relaxed">
        Hi <strong>{primaryName}</strong>, your booking for{" "}
        <strong>{attendeeCount} {attendeeCount === 1 ? "person" : "people"}</strong> is confirmed.
        A confirmation email has been sent to your Christ email.
      </p>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6 text-left space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500 font-medium">Booking ID</span>
          <span className="font-mono font-bold text-primary text-base tracking-widest">{bookingId}</span>
        </div>
        <div className="flex justify-between items-center border-t border-gray-100 pt-4">
          <span className="text-sm text-gray-500 font-medium">Total Paid</span>
          <span className="font-bold text-text-main text-lg">₹{total}</span>
        </div>
        <div className="flex justify-between items-center border-t border-gray-100 pt-4">
          <span className="text-sm text-gray-500 font-medium">Event</span>
          <span className="text-sm font-semibold text-text-main">Chhichhore · 1 Oct · 9PM</span>
        </div>
        <div className="flex justify-between items-center border-t border-gray-100 pt-4">
          <span className="text-sm text-gray-500 font-medium">Venue</span>
          <span className="text-sm font-semibold text-text-main">Actinity Hub</span>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 text-left">
        <p className="text-xs text-amber-800 leading-relaxed">
          📌 <strong>Carry this Booking ID</strong> ({bookingId}) for entry at the venue. Payment is
          non-refundable per our No Refund Policy.
        </p>
      </div>

      <button
        type="button"
        onClick={() => setPage("home")}
        className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-7 py-3 rounded-full font-semibold transition-colors shadow-md shadow-primary/20 cursor-pointer"
      >
        Back to Home
        <ChevronRight className="w-4 h-4" />
      </button>
    </m.div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export function MovieTicket({ setPage }: { setPage: (p: Page) => void }) {
  const emptyAttendee = (): AttendeeForm => ({ name: "", regNo: "", email: "" });

  const [primary, setPrimary] = useState<AttendeeForm>(emptyAttendee());
  const [extras, setExtras] = useState<AttendeeForm[]>([]);
  const [primaryErrors, setPrimaryErrors] = useState<FormErrors>({});
  const [extrasErrors, setExtrasErrors] = useState<FormErrors[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{
    bookingId: string;
    total: number;
    attendeeCount: number;
  } | null>(null);

  const [ticketsEnabled, setTicketsEnabled] = useState(true);
  const [loadingSettings, setLoadingSettings] = useState(true);

  React.useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/settings`);
        if (res.ok) {
          const data = await res.json();
          setTicketsEnabled(data.settings.ticketsEnabled !== false);
        }
      } catch (err) {
        console.error("Failed to fetch settings", err);
      } finally {
        setLoadingSettings(false);
      }
    };
    fetchSettings();
  }, []);

  const attendeeCount = 1 + extras.length;
  const { breakdown, total } = useTicketPricing(attendeeCount);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const updatePrimary = (field: keyof AttendeeForm, value: string) => {
    setPrimary((p) => ({ ...p, [field]: value }));
    setPrimaryErrors((e) => ({ ...e, [field]: undefined }));
    setGlobalError(null);
  };

  const updateExtra = (idx: number, field: keyof AttendeeForm, value: string) => {
    setExtras((prev) => prev.map((a, i) => (i === idx ? { ...a, [field]: value } : a)));
    setExtrasErrors((prev) =>
      prev.map((e, i) => (i === idx ? { ...e, [field]: undefined } : e))
    );
    setGlobalError(null);
  };

  const addExtra = () => {
    setExtras((prev) => [...prev, emptyAttendee()]);
    setExtrasErrors((prev) => [...prev, {}]);
  };

  const removeExtra = (idx: number) => {
    setExtras((prev) => prev.filter((_, i) => i !== idx));
    setExtrasErrors((prev) => prev.filter((_, i) => i !== idx));
  };

  // ── Validate all ──────────────────────────────────────────────────────────
  const validateAll = (): boolean => {
    const pErrors = validateAttendee(primary);
    const eErrors = extras.map(validateAttendee);
    setPrimaryErrors(pErrors);
    setExtrasErrors(eErrors);
    return (
      Object.keys(pErrors).length === 0 &&
      eErrors.every((e) => Object.keys(e).length === 0)
    );
  };

  // ── Razorpay checkout ─────────────────────────────────────────────────────
  const handlePayment = () => {
    if (!validateAll()) {
      setGlobalError("Please fix the errors above before proceeding.");
      return;
    }

    setSubmitting(true);
    setGlobalError(null);

    const options = {
      key: RAZORPAY_KEY_ID,
      amount: total * 100, // in paise
      currency: "INR",
      name: "Inclusiverse",
      description: `Chhichhore Movie Screening — ${attendeeCount} ${attendeeCount === 1 ? "ticket" : "tickets"}`,
      image: "/inclusiverse-logo.png",
      handler: async (response: { razorpay_payment_id: string; razorpay_order_id?: string }) => {
        try {
          const res = await fetch(`${API_BASE}/api/bookings`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              primaryName: primary.name,
              primaryRegNo: primary.regNo,
              primaryEmail: primary.email,
              attendees: extras,
              totalAmount: total,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id || "",
            }),
          });

          const data = await res.json();
          if (!res.ok) throw new Error(data.error || "Failed to save booking");

          setSuccess({
            bookingId: data.bookingId,
            total,
            attendeeCount,
          });
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : "Something went wrong";
          setGlobalError(`Payment captured but booking save failed: ${message}. Please contact us with your payment ID.`);
        } finally {
          setSubmitting(false);
        }
      },
      prefill: {
        name: primary.name,
        email: primary.email,
      },
      theme: { color: "#C62828" },
      modal: {
        ondismiss: () => setSubmitting(false),
      },
    };

    // @ts-ignore – Razorpay loaded via script tag
    const rzp = new window.Razorpay(options);
    rzp.on("payment.failed", (response: { error: { description: string } }) => {
      setGlobalError(`Payment failed: ${response.error.description}`);
      setSubmitting(false);
    });
    rzp.open();
  };

  // ── Success state ─────────────────────────────────────────────────────────
  if (success) {
    return (
      <SuccessScreen
        bookingId={success.bookingId}
        primaryName={primary.name}
        total={success.total}
        attendeeCount={success.attendeeCount}
        setPage={setPage}
      />
    );
  }

  // ── Main render ───────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-surface">
      {/* ── Hero Banner ── */}
      <div className="bg-gradient-to-br from-[#1a0000] via-primary to-[#8B0000] text-white relative overflow-hidden">
        {/* decorative blobs */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-white/10 blur-2xl" />
        </div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 relative">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
            {/* Film icon badge */}
            <div className="w-24 h-24 rounded-3xl bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0 backdrop-blur-sm shadow-2xl">
              <Film className="w-12 h-12 text-white" />
            </div>
            <div className="text-center sm:text-left">
              <div className="inline-block px-3 py-1 bg-white/15 border border-white/25 rounded-full text-xs font-bold uppercase tracking-widest mb-3 backdrop-blur-sm">
                🎟️ Inclusiverse Presents
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold mb-4 leading-tight">
                Chhichhore
              </h1>
              <div className="flex flex-wrap justify-center sm:justify-start gap-4 text-sm font-medium text-white/90">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-white/70" />
                  1st October 2025
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-white/70" />
                  9:00 PM – 11:00 PM
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-white/70" />
                  Actinity Hub
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {!ticketsEnabled && !loadingSettings ? (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-12 text-center max-w-2xl mx-auto mt-8">
            <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Film className="w-10 h-10 text-amber-600" />
            </div>
            <h2 className="text-3xl font-display font-bold text-text-main mb-4">Tickets Unavailable</h2>
            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
              Ticket sales for this event are currently closed. If you already have a booking, you can still use your Booking ID for entry.
            </p>
            <button
              type="button"
              onClick={() => setPage("home")}
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-8 py-3.5 rounded-full font-semibold transition-colors shadow-md shadow-primary/20 cursor-pointer"
            >
              Back to Home
            </button>
          </div>
        ) : loadingSettings ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          {/* ── Left: Form ── */}
          <div className="lg:col-span-2 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-display font-bold text-text-main flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Attendee Details
              </h2>
              <span className="text-sm text-gray-400">{attendeeCount} {attendeeCount === 1 ? "person" : "people"}</span>
            </div>

            <AnimatePresence mode="popLayout">
              {/* Primary */}
              <AttendeeCard
                key="primary"
                attendee={primary}
                index={0}
                onChange={updatePrimary}
                errors={primaryErrors}
                isPrimary
              />

              {/* Extra attendees */}
              {extras.map((extra, idx) => (
                <AttendeeCard
                  key={`extra-${idx}`}
                  attendee={extra}
                  index={idx + 1}
                  onChange={(field, value) => updateExtra(idx, field, value)}
                  onRemove={() => removeExtra(idx)}
                  errors={extrasErrors[idx] || {}}
                  isPrimary={false}
                />
              ))}
            </AnimatePresence>

            {/* Add person button */}
            <button
              type="button"
              onClick={addExtra}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl border-2 border-dashed border-gray-300 hover:border-primary hover:bg-primary/5 text-gray-500 hover:text-primary transition-all font-semibold text-sm group cursor-pointer"
            >
              <UserPlus className="w-4 h-4 group-hover:scale-110 transition-transform" />
              Add Another Person
            </button>

            {/* Global error */}
            {globalError && (
              <m.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4"
              >
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{globalError}</p>
              </m.div>
            )}
          </div>

          {/* ── Right: Price Card ── */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                {/* Card header */}
                <div className="bg-gradient-to-r from-primary to-primary-hover px-5 py-4">
                  <h3 className="font-display font-bold text-white flex items-center gap-2">
                    <IndianRupee className="w-4 h-4" />
                    Price Summary
                  </h3>
                </div>

                {/* Breakdown */}
                <div className="px-5 py-4 space-y-2.5">
                  <AnimatePresence mode="popLayout">
                    {breakdown.map((item) => (
                      <m.div
                        key={item.person}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center justify-between text-sm"
                      >
                        <div className="flex items-center gap-2">
                          <Ticket className="w-3.5 h-3.5 text-primary/60" />
                          <span className="text-gray-600">{item.label}</span>
                        </div>
                        <span className="font-semibold text-text-main">₹{item.cost}</span>
                      </m.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Total */}
                <div className="px-5 py-4 border-t border-gray-100 bg-surface">
                  <div className="flex items-center justify-between">
                    <span className="font-display font-bold text-text-main">Total</span>
                    <m.span
                      key={total}
                      initial={{ scale: 1.15, color: "#C62828" }}
                      animate={{ scale: 1, color: "#1A1A1A" }}
                      transition={{ duration: 0.3 }}
                      className="text-2xl font-display font-bold"
                    >
                      ₹{total}
                    </m.span>
                  </div>
                </div>

                {/* Pay button */}
                <div className="px-5 py-4">
                  <button
                    type="button"
                    onClick={handlePayment}
                    disabled={submitting}
                    className="w-full bg-primary hover:bg-primary-hover disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-colors shadow-md shadow-primary/25 flex items-center justify-center gap-2 cursor-pointer text-base"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Processing…
                      </>
                    ) : (
                      <>
                        <IndianRupee className="w-4 h-4" />
                        Pay ₹{total} with Razorpay
                      </>
                    )}
                  </button>
                  <p className="text-center text-xs text-gray-400 mt-3 leading-relaxed">
                    Payments are secure & encrypted via Razorpay.
                    <br />
                    Non-refundable per our{" "}
                    <button
                      type="button"
                      onClick={() => setPage("no-refund")}
                      className="text-primary underline underline-offset-2 cursor-pointer"
                    >
                      No Refund Policy
                    </button>
                    .
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        )}
      </div>
    </div>
  );
}
