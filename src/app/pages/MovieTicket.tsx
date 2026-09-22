import React, { useState, useRef } from "react";
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
  Upload,
  Image as ImageIcon,
  ClockIcon,
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
const REG_NO_REGEX = /^(\d{5}|\d{8})$/;
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

import qr59 from "@/assets/gpay-qr-59.png";
import qr99 from "@/assets/gpay-qr-99.png";
import qr139 from "@/assets/gpay-qr-139.png";
import qr179 from "@/assets/gpay-qr-179.png";
import qr219 from "@/assets/gpay-qr-219.png";

// ─── QR code images mapped by total amount ──────────────────────────────────
const QR_IMAGES: Record<number, string> = {
  59: qr59,
  99: qr99,
  139: qr139,
  179: qr179,
  219: qr219,
};

// ─── Validation ────────────────────────────────────────────────────────────────
function validateAttendee(a: AttendeeForm): FormErrors {
  const errors: FormErrors = {};
  if (!a.name.trim()) errors.name = "Name is required";
  if (!REG_NO_REGEX.test(a.regNo)) errors.regNo = "Registration number must be 5 or 8 digits";
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
          <span className="text-sm font-semibold text-text-main truncate max-w-[200px] sm:max-w-[250px]">
            {attendee.name.trim() ? attendee.name : (isPrimary ? "Your Details (Primary)" : `Person ${index + 1}`)}
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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 p-4 sm:p-5">
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
            placeholder="5 or 8 digits"
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
  status,
  setPage,
}: {
  bookingId: string;
  primaryName: string;
  total: number;
  attendeeCount: number;
  status: string;
  setPage: (p: Page) => void;
}) {
  const isPending = status === "pending_review";

  return (
    <m.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="max-w-lg mx-auto text-center py-20 px-4"
    >
      <div className={`w-20 h-20 rounded-full ${isPending ? "bg-amber-100" : "bg-green-100"} flex items-center justify-center mx-auto mb-6`}>
        {isPending ? (
          <ClockIcon className="w-10 h-10 text-amber-600" />
        ) : (
          <CheckCircle2 className="w-10 h-10 text-green-600" />
        )}
      </div>
      <h2 className="text-3xl font-display font-bold text-text-main mb-2">
        {isPending ? "Under Review ⏳" : "You're In! 🎬"}
      </h2>
      <p className="text-gray-500 mb-6 text-base leading-relaxed">
        {isPending ? (
          <>
            Hi <strong>{primaryName}</strong>, your payment screenshot has been received for{" "}
            <strong>{attendeeCount} {attendeeCount === 1 ? "person" : "people"}</strong>.
            Our team will verify it shortly, and you'll receive your tickets via email once approved.
          </>
        ) : (
          <>
            Hi <strong>{primaryName}</strong>, your booking for{" "}
            <strong>{attendeeCount} {attendeeCount === 1 ? "person" : "people"}</strong> is confirmed.
            A confirmation email with your QR ticket(s) has been sent to your Christ email.
          </>
        )}
      </p>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 sm:p-6 mb-5 sm:mb-6 text-left space-y-3 sm:space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500 font-medium">Booking ID</span>
          <span className="font-mono font-bold text-primary text-base tracking-widest">{bookingId}</span>
        </div>
        <div className="flex justify-between items-center border-t border-gray-100 pt-4">
          <span className="text-sm text-gray-500 font-medium">Total Paid</span>
          <span className="font-bold text-text-main text-lg">₹{total}</span>
        </div>
        <div className="flex justify-between items-center border-t border-gray-100 pt-4">
          <span className="text-sm text-gray-500 font-medium">Status</span>
          <span className={`text-sm font-semibold px-3 py-1 rounded-full ${isPending ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"}`}>
            {isPending ? "Pending Review" : "Confirmed"}
          </span>
        </div>
        <div className="flex justify-between items-center border-t border-gray-100 pt-4">
          <span className="text-sm text-gray-500 font-medium">Event</span>
          <span className="text-sm font-semibold text-text-main">Chhichhore · 1 Oct · 9PM</span>
        </div>
        <div className="flex justify-between items-center border-t border-gray-100 pt-4">
          <span className="text-sm text-gray-500 font-medium">Venue</span>
          <span className="text-sm font-semibold text-text-main">Activity Hub</span>
        </div>
      </div>

      <div className={`${isPending ? "bg-amber-50 border-amber-200" : "bg-amber-50 border-amber-200"} border rounded-xl p-4 mb-8 text-left`}>
        <p className="text-xs text-amber-800 leading-relaxed">
          {isPending ? (
            <>📌 <strong>Save this Booking ID</strong> ({bookingId}). You'll receive an email with your QR tickets once your payment is verified.</>
          ) : (
            <>📌 <strong>Carry this Booking ID</strong> ({bookingId}) for entry at the venue. Payment is non-refundable per our No Refund Policy.</>
          )}
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

  const [primary, setPrimary] = useState<AttendeeForm>(() => {
    const saved = sessionStorage.getItem("movieTicketPrimary");
    return saved ? JSON.parse(saved) : emptyAttendee();
  });
  const [extras, setExtras] = useState<AttendeeForm[]>(() => {
    const saved = sessionStorage.getItem("movieTicketExtras");
    return saved ? JSON.parse(saved) : [];
  });

  React.useEffect(() => {
    sessionStorage.setItem("movieTicketPrimary", JSON.stringify(primary));
  }, [primary]);

  React.useEffect(() => {
    sessionStorage.setItem("movieTicketExtras", JSON.stringify(extras));
  }, [extras]);
  const [primaryErrors, setPrimaryErrors] = useState<FormErrors>({});
  const [extrasErrors, setExtrasErrors] = useState<FormErrors[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{
    bookingId: string;
    total: number;
    attendeeCount: number;
    status: string;
  } | null>(null);

  const [ticketsEnabled, setTicketsEnabled] = useState(true);
  const [loadingSettings, setLoadingSettings] = useState(true);

  // Payment flow state
  const [step, setStep] = useState<"form" | "payment">("form");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
  const { breakdown, originalTotal, total, savings } = useTicketPricing(attendeeCount);
  const qrImage = QR_IMAGES[total];

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
    if (attendeeCount >= 5) return; // max 5
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

  // ── Proceed to payment step ───────────────────────────────────────────────
  const handleProceedToPayment = () => {
    if (!validateAll()) {
      setGlobalError("Please fix the errors above before proceeding.");
      return;
    }
    setGlobalError(null);
    setShowConfirmModal(true);
  };

  const confirmAndProceed = () => {
    setShowConfirmModal(false);
    setStep("payment");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ── File upload handler ───────────────────────────────────────────────────
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setGlobalError("Please upload an image file (PNG, JPG, etc.)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setGlobalError("File size must be under 5MB");
      return;
    }

    setScreenshot(file);
    setScreenshotPreview(URL.createObjectURL(file));
    setGlobalError(null);
  };

  // ── Submit payment screenshot ─────────────────────────────────────────────
  const handleSubmitPayment = async () => {
    if (!screenshot) {
      setGlobalError("Please upload a screenshot of your payment.");
      return;
    }

    setSubmitting(true);
    setGlobalError(null);

    try {
      const formData = new FormData();
      formData.append("primaryName", primary.name);
      formData.append("primaryRegNo", primary.regNo);
      formData.append("primaryEmail", primary.email);
      formData.append("attendees", JSON.stringify(extras));
      formData.append("totalAmount", String(total));
      formData.append("screenshot", screenshot);

      const res = await fetch(`${API_BASE}/api/bookings/upload-payment`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit booking");

      setSuccess({
        bookingId: data.bookingId,
        total,
        attendeeCount,
        status: data.status,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      setGlobalError(message);
    } finally {
      setSubmitting(false);
    }
  };

  // ── Success state ─────────────────────────────────────────────────────────
  if (success) {
    return (
      <SuccessScreen
        bookingId={success.bookingId}
        primaryName={primary.name}
        total={success.total}
        attendeeCount={success.attendeeCount}
        status={success.status}
        setPage={setPage}
      />
    );
  }

  // ── Main render ───────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-surface">
      {/* ── Hero Banner ── */}
      <div
        className="text-white relative overflow-hidden bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.6), rgba(0,0,0,0.9)), url('/Chhichhore_Movie_Screening.png')`
        }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 relative z-10 flex flex-col items-center text-center">
          <div className="inline-block px-4 py-1.5 bg-white/10 border border-white/20 rounded-full text-xs font-bold uppercase tracking-[0.2em] mb-6 backdrop-blur-md text-white/90 shadow-xl">
            Inclusiverse Presents
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-extrabold mb-8 leading-tight tracking-tight drop-shadow-2xl">
            Chhichhore
          </h1>
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 text-sm font-medium text-white/90">
            <div className="flex items-center gap-2 px-4 py-2 bg-black/40 border border-white/10 rounded-xl backdrop-blur-md shadow-lg">
              <Calendar className="w-4 h-4 text-white/70" />
              <span>1st October 2025</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-black/40 border border-white/10 rounded-xl backdrop-blur-md shadow-lg">
              <Clock className="w-4 h-4 text-white/70" />
              <span>7:00 PM – 10:00 PM</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-black/40 border border-white/10 rounded-xl backdrop-blur-md shadow-lg">
              <MapPin className="w-4 h-4 text-white/70" />
              <span>Activity Hub</span>
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
        ) : step === "payment" ? (
          /* ── Payment Step: QR + Upload ── */
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Back button */}
            <button
              type="button"
              onClick={() => { setStep("form"); setScreenshot(null); setScreenshotPreview(null); }}
              className="text-sm text-gray-500 hover:text-primary transition-colors cursor-pointer flex items-center gap-1"
            >
              ← Back to form
            </button>

            {/* Step indicator */}
            <div className="flex items-center gap-3 mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-sm font-bold">✓</div>
                <span className="text-sm text-green-600 font-medium">Details</span>
              </div>
              <div className="flex-1 h-0.5 bg-primary/30 rounded-full" />
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">2</div>
                <span className="text-sm text-primary font-semibold">Payment</span>
              </div>
            </div>

            {/* Payment Card */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-primary to-primary-hover px-6 py-5">
                <h3 className="font-display font-bold text-white text-lg flex items-center gap-2">
                  <IndianRupee className="w-5 h-5" />
                  Pay ₹{total} via Google Pay
                </h3>
                <p className="text-white/80 text-sm mt-1">
                  {attendeeCount} {attendeeCount === 1 ? "ticket" : "tickets"} for Chhichhore Movie Screening
                </p>
              </div>

              <div className="p-5 sm:p-6 space-y-5 sm:space-y-6">
                {/* QR Code */}
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-4 font-medium">
                    Scan this QR code with Google Pay, PhonePe, or any UPI app
                  </p>
                  {qrImage ? (
                    <img
                      src={qrImage}
                      alt={`Pay ₹${total} via UPI`}
                      className="max-w-[280px] w-full mx-auto rounded-2xl border border-gray-200 shadow-sm object-contain"
                    />
                  ) : (
                    <div className="inline-block bg-gray-100 rounded-2xl p-8 text-gray-400">
                      <p className="text-sm">QR code not available for this amount</p>
                    </div>
                  )}
                </div>

                {/* Divider */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-gray-200" />
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">After payment</span>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>

                {/* Upload Screenshot */}
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <Upload className="w-4 h-4 text-primary" />
                    Upload Payment Screenshot
                  </p>

                  {screenshotPreview ? (
                    <div className="relative">
                      <img
                        src={screenshotPreview}
                        alt="Payment screenshot preview"
                        className="w-full max-h-80 object-contain rounded-xl border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => { setScreenshot(null); setScreenshotPreview(null); }}
                        className="absolute top-2 right-2 bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors cursor-pointer shadow-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <p className="mt-2 text-xs text-green-600 font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Screenshot attached: {screenshot?.name}
                      </p>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full border-2 border-dashed border-gray-300 hover:border-primary rounded-2xl p-8 text-center cursor-pointer group transition-all hover:bg-primary/5"
                    >
                      <ImageIcon className="w-10 h-10 text-gray-300 group-hover:text-primary/60 mx-auto mb-3 transition-colors" />
                      <p className="text-sm font-medium text-gray-500 group-hover:text-primary transition-colors">
                        Tap to upload screenshot
                      </p>
                      <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</p>
                    </button>
                  )}

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>

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

                {/* Submit */}
                <button
                  type="button"
                  onClick={handleSubmitPayment}
                  disabled={submitting || !screenshot}
                  className="w-full bg-primary hover:bg-primary-hover disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-colors shadow-md shadow-primary/25 flex items-center justify-center gap-2 cursor-pointer text-base"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Submitting…
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      Submit Payment Proof
                    </>
                  )}
                </button>

                <p className="text-center text-xs text-gray-400 leading-relaxed">
                  Your payment will be verified automatically or reviewed by our team.
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
        ) : (
          /* ── Form Step ── */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">

            {/* ── Left: Form ── */}
            <div className="lg:col-span-2 space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-display font-bold text-text-main flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Attendee Details
                </h2>
                <span className="text-sm text-gray-400">{attendeeCount} {attendeeCount === 1 ? "person" : "people"} (max 5)</span>
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
              {attendeeCount < 5 && (
                <button
                  type="button"
                  onClick={addExtra}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl border-2 border-dashed border-gray-300 hover:border-primary hover:bg-primary/5 text-gray-500 hover:text-primary transition-all font-semibold text-sm group cursor-pointer"
                >
                  <UserPlus className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  Add Another Person
                </button>
              )}

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
                      {breakdown.map((item, idx) => {
                        const allAttendees = [primary, ...extras];
                        const attendee = allAttendees[idx];
                        const displayName = attendee?.name.trim() || item.label;

                        return (
                          <m.div
                            key={item.person}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.2 }}
                            className="flex items-center justify-between text-sm"
                          >
                            <div className="flex items-center gap-2 min-w-0 pr-4">
                              <Ticket className="w-3.5 h-3.5 text-primary/60 flex-shrink-0" />
                              <span className="text-gray-600 truncate" title={displayName}>{displayName}</span>
                            </div>
                            <span className="font-semibold text-text-main flex-shrink-0">₹{item.cost}</span>
                          </m.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>

                  {/* Total */}
                  <div className="px-5 py-4 border-t border-gray-100 bg-surface">
                    <div className="flex items-center justify-between">
                      <span className="font-display font-bold text-text-main">Total</span>
                      <div className="flex items-center gap-3">
                        {savings > 0 && (
                          <span className="text-gray-400 line-through font-semibold text-lg">
                            ₹{originalTotal}
                          </span>
                        )}
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
                    {savings > 0 && (
                      <div className="mt-2 text-right">
                        <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full">
                          You save ₹{savings}!
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Proceed button */}
                  <div className="px-5 py-4">
                    <button
                      type="button"
                      onClick={handleProceedToPayment}
                      disabled={submitting}
                      className="w-full bg-primary hover:bg-primary-hover disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-colors shadow-md shadow-primary/25 flex items-center justify-center gap-2 cursor-pointer text-base"
                    >
                      <IndianRupee className="w-4 h-4" />
                      Proceed to Pay ₹{total}
                    </button>
                    <p className="text-center text-xs text-gray-400 mt-3 leading-relaxed">
                      Pay via Google Pay / UPI.
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

      {/* ── Confirmation Modal ── */}
      <AnimatePresence>
        {showConfirmModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setShowConfirmModal(false)}
            />
            <m.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100 flex flex-col max-h-[85vh]"
            >
              <div className="p-6 border-b border-gray-100 bg-surface">
                <h3 className="font-display font-bold text-xl text-text-main">Confirm Details</h3>
                <p className="text-sm text-gray-500 mt-1">Please review the details before proceeding to payment.</p>
              </div>

              <div className="p-6 overflow-y-auto space-y-4">
                {[
                  { ...primary, isPrimary: true },
                  ...extras.map((e) => ({ ...e, isPrimary: false }))
                ].map((att, idx) => (
                  <div key={idx} className="bg-surface rounded-xl p-4 border border-gray-100">
                    <p className="font-medium text-text-main flex items-center justify-between">
                      <span>{att.name}</span>
                      {att.isPrimary && <span className="text-xs text-primary font-bold bg-primary/10 px-2 py-0.5 rounded-full">Primary</span>}
                    </p>
                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs text-gray-400 font-medium mb-0.5">Reg No / Emp ID</span>
                        <span className="font-mono text-sm font-medium text-gray-700">{att.regNo}</span>
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs text-gray-400 font-medium mb-0.5">Email</span>
                        <span className="text-sm font-medium text-gray-700 break-all">{att.email}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-6 border-t border-gray-100 bg-gray-50 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 px-6 py-3 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={confirmAndProceed}
                  className="flex-1 px-6 py-3 rounded-xl bg-primary hover:bg-primary-hover text-white font-semibold shadow-md shadow-primary/25 transition-colors cursor-pointer"
                >
                  Go to Payment
                </button>
              </div>
            </m.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
