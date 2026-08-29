import React, { useState, useEffect, useRef } from "react";
import { Heart, Menu, X, Accessibility, ArrowRight, ChevronRight, PlayCircle, Camera, FileText, ChevronDown, ChevronUp, GraduationCap, Users, MapPin, Mail, Instagram, Linkedin, Home as HomeIcon, Compass, Sparkles, AlertCircle, ArrowLeft, Search, CheckCircle2, Send, Phone, ExternalLink } from "lucide-react";
import { LazyMotion, domAnimation, m, AnimatePresence, Variants } from "motion/react";
import { Skeleton } from "boneyard-js/react";
import confetti from "canvas-confetti";
import GALLERY_PHOTOS_RAW from "../data/photos.json";
import GALLERY_EVENTS_RAW from "../data/events.json";
import { ImageWithFallback } from "./components/figma/ImageWithFallback";

type GalleryPhoto = { src: string; alt: string; caption: string; cat: string; event?: string };
type GalleryEvent = { name: string; slug: string; year?: string };
const GALLERY_PHOTOS = GALLERY_PHOTOS_RAW as GalleryPhoto[];
const GALLERY_EVENTS = GALLERY_EVENTS_RAW as GalleryEvent[];


// ─── Simple router ────────────────────────────────────────────────────────────
type Page = "home" | "about" | "timeline" | "gallery" | "join" | "404" | "tos" | "privacy" | "cancellation" | "no-refund" | "contact";

// ─── Navigation ──────────────────────────────────────────────────────────────
function Nav({ page, setPage, isDyslexic, toggleDyslexic }: {
  page: Page;
  setPage: (p: Page) => void;
  isDyslexic: boolean;
  toggleDyslexic: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  const link = (label: string, target: Page) => (
    <button
      onClick={() => { setPage(target); setMenuOpen(false); }}
      className={`relative text-text-main hover:text-primary transition-colors font-medium py-1 ${page === target ? "text-primary font-semibold" : ""}`}
    >
      {label}
      {page === target && (
        <m.div
          layoutId="activeNavIndicator"
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
        />
      )}
    </button>
  );

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <button onClick={() => setPage("home")} className="flex items-center gap-3 group focus:outline-none">
            <m.img
              src="/inclusiverse-logo.png"
              alt="Inclusiverse Logo"
              whileHover={{ rotate: 8, scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              className="w-12 h-12 object-contain drop-shadow-sm"
            />
            <span className="font-display font-bold text-2xl tracking-tight text-primary">Inclusiverse</span>
          </button>

          <div className="hidden md:flex items-center space-x-8">
            {link("Home", "home")}
            {link("About", "about")}
            {link("Timeline", "timeline")}
            {link("Gallery", "gallery")}
            <m.button
              onClick={() => setPage("join")}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="bg-primary hover:bg-primary-hover text-white px-6 py-2.5 rounded-full font-medium transition-colors shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-focus focus:ring-offset-2"
            >
              Join Us
            </m.button>
          </div>

          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 text-text-main focus:outline-none">
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <m.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="md:hidden bg-white border-b border-gray-100 px-4 py-4 space-y-4 shadow-md"
          >
            {(["home", "about", "timeline", "gallery"] as Page[]).map((p) => (
              <button
                key={p}
                onClick={() => { setPage(p); setMenuOpen(false); }}
                className={`block w-full text-left font-medium capitalize py-1 transition-colors ${page === p ? "text-primary font-bold" : "text-text-main hover:text-primary"}`}
              >
                {p === "timeline" ? "Timeline" : p === "gallery" ? "Gallery" : p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
            <button onClick={() => { setPage("join"); setMenuOpen(false); }} className="w-full bg-primary hover:bg-primary-hover text-white px-6 py-2.5 rounded-full font-medium transition-colors shadow-sm">
              Join Us
            </button>
          </m.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer({ setPage }: { setPage: (p: Page) => void }) {
  return (
    <footer className="bg-text-main text-white pt-16 pb-12 mt-auto border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-gray-800/80">
          {/* Brand & Mission */}
          <div className="md:col-span-6 space-y-4">
            <button onClick={() => setPage("home")} className="flex items-center gap-3 group text-left focus:outline-none">
              <img
                src="/inclusiverse-logo.png"
                alt="Inclusiverse Logo"
                className="w-10 h-10 object-contain drop-shadow-md"
              />
              <span className="font-display font-bold text-2xl tracking-tight text-white">Inclusiverse</span>
            </button>
            <p className="text-gray-400 max-w-md text-sm leading-relaxed">
              A student-led initiative dedicated to creating joyful, barrier-free, and empowering experiences for children with disabilities. Dignity over sympathy, community over charity.
            </p>
            <a
              href="https://maps.app.goo.gl/kV1XKQ1xFksGbzqU6"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 py-1.5 px-3 rounded-full w-fit border border-white/10 hover:border-primary/40 transition-colors group"
              title="Open Christ University, Lavasa Campus on Google Maps"
            >
              <MapPin className="w-3.5 h-3.5 text-primary group-hover:scale-110 transition-transform" />
              <span>Christ University, Lavasa Campus</span>
              <ExternalLink className="w-3 h-3 text-gray-500 group-hover:text-primary transition-colors" />
            </a>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3">
            <h4 className="font-display font-semibold text-white text-base mb-4 tracking-wide uppercase text-xs">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              {([
                ["Home", "home"],
                ["About Us", "about"],
                ["Timeline & Milestones", "timeline"],
                ["Photo Gallery", "gallery"],
                ["Join the Movement", "join"],
              ] as [string, Page][]).map(([label, p]) => (
                <li key={p}>
                  <button
                    onClick={() => setPage(p)}
                    className="hover:text-primary hover:translate-x-1 transition-[color,transform] duration-200 inline-flex items-center gap-1.5 text-left"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-primary/70" />
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Get Involved & Connect */}
          <div className="md:col-span-3">
            <h4 className="font-display font-semibold text-white text-base mb-4 tracking-wide uppercase text-xs">
              Get in Touch
            </h4>
            <p className="text-sm text-gray-400 mb-4">
              Have questions or want to collaborate? Reach out to our student volunteer team.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://www.instagram.com/inclusiverse.christuniversity"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white/5 hover:bg-primary/20 border border-white/10 hover:border-primary/40 flex items-center justify-center text-gray-300 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://www.linkedin.com/company/inclusiverse-club"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white/5 hover:bg-primary/20 border border-white/10 hover:border-primary/40 flex items-center justify-center text-gray-300 hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <button
                onClick={() => setPage("join")}
                className="px-4 py-2 text-xs font-semibold bg-primary hover:bg-primary-hover text-white rounded-xl transition-colors shadow-sm"
              >
                Volunteer Now
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar with Credits */}
        <div className="pt-8 border-t border-gray-800/60">
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 mb-4">
            {([
              ["Terms of Service", "tos"],
              ["Privacy Policy", "privacy"],
              ["Cancellation Policy", "cancellation"],
              ["No Refund Policy", "no-refund"],
              ["Contact Us", "contact"],
            ] as [string, Page][]).map(([label, p]) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className="text-xs text-gray-500 hover:text-gray-300 transition-colors underline-offset-2 hover:underline"
              >
                {label}
              </button>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
            <p>© {new Date().getFullYear()} Inclusiverse. All rights reserved. Donations are non-refundable.</p>
            <div className="flex items-center gap-1.5 text-gray-400 font-medium bg-white/5 px-3.5 py-1.5 rounded-full border border-white/5">
              <span>Designed & Developed by</span>
              <span className="text-white font-semibold flex items-center gap-1">
                Inclusiverse Team <Heart className="w-3 h-3 text-primary inline fill-primary" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── Razorpay Type Declaration ────────────────────────────────────────────────
declare global {
  interface Window {
    Razorpay: any;
  }
}

// ─── Donate Modal with Razorpay ──────────────────────────────────────────────
const PRESET_AMOUNTS = [100, 250, 500, 1000, 2500];

const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID;

function DonateModal({ onClose }: { onClose: () => void }) {
  const [selectedPreset, setSelectedPreset] = useState<number | "custom">(2500);
  const [customAmount, setCustomAmount] = useState("2500");
  const [amount, setAmount] = useState<number | "">(2500);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "success" | "error">("idle");
  const inputRef = useRef<HTMLInputElement>(null);

  const handlePresetClick = (value: number) => {
    setSelectedPreset(value);
    setAmount(value);
    setCustomAmount(value.toString());
  };

  const handleCustomClick = () => {
    setSelectedPreset("custom");
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    }, 50);
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, "");
    setCustomAmount(val);
    const parsed = val ? parseInt(val, 10) : "";
    setAmount(parsed);
    if (typeof parsed === "number" && PRESET_AMOUNTS.includes(parsed)) {
      setSelectedPreset(parsed);
    } else {
      setSelectedPreset("custom");
    }
  };

  const finalAmount = typeof amount === "number" ? amount : 0;

  const handlePayment = () => {
    if (finalAmount < 100) return;
    setIsProcessing(true);

    const options = {
      key: RAZORPAY_KEY_ID,
      amount: finalAmount * 100, // Razorpay expects amount in paise
      currency: "INR",
      name: "Inclusiverse",
      description: "Donation to Inclusiverse (Collected by Ashish)",
      image: "/inclusiverse-logo.png",
      handler: function (_response: any) {
        setIsProcessing(false);
        setPaymentStatus("success");
      },
      prefill: {
        name: "",
        email: "",
        contact: "",
      },
      notes: {
        purpose: "Donation to Inclusiverse",
        collector: "Ashish (on behalf of Inclusiverse)",
      },
      theme: {
        color: "#6b46c1",
      },
      modal: {
        ondismiss: function () {
          setIsProcessing(false);
        },
      },
    };

    try {
      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function () {
        setIsProcessing(false);
        setPaymentStatus("error");
      });
      rzp.open();
    } catch {
      setIsProcessing(false);
      setPaymentStatus("error");
    }
  };

  // Success view
  if (paymentStatus === "success") {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <m.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white rounded-3xl p-8 max-w-md w-full relative shadow-2xl text-center"
        >
          <m.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
            className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </m.div>
          <h3 className="text-2xl font-display font-bold text-text-main mb-2">Thank You! 🎉</h3>
          <p className="text-gray-600 mb-6">
            Your donation of <span className="font-bold text-primary">₹{finalAmount.toLocaleString("en-IN")}</span> has been received. You're making a real difference!
          </p>
          <m.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onClose}
            className="bg-primary hover:bg-primary-hover text-white px-8 py-3 rounded-full font-medium transition-colors"
          >
            Close
          </m.button>
        </m.div>
      </div>
    );
  }

  // Error view
  if (paymentStatus === "error") {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <m.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white rounded-3xl p-8 max-w-md w-full relative shadow-2xl text-center"
        >
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <X className="w-10 h-10 text-red-500" />
          </div>
          <h3 className="text-2xl font-display font-bold text-text-main mb-2">Payment Failed</h3>
          <p className="text-gray-600 mb-6">
            Something went wrong with your payment. Please try again.
          </p>
          <div className="flex gap-3 justify-center">
            <m.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setPaymentStatus("idle")}
              className="bg-primary hover:bg-primary-hover text-white px-8 py-3 rounded-full font-medium transition-colors"
            >
              Try Again
            </m.button>
            <m.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onClose}
              className="bg-gray-100 hover:bg-gray-200 text-text-main px-8 py-3 rounded-full font-medium transition-colors"
            >
              Cancel
            </m.button>
          </div>
        </m.div>
      </div>
    );
  }

  // Main donate form
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <m.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full relative shadow-2xl border border-gray-100"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-text-main hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-5">
          <m.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
            className="w-14 h-14 bg-white border border-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3 p-2 shadow-sm ring-4 ring-gray-50"
          >
            <img src="/inclusiverse-logo.png" alt="Inclusiverse" className="w-10 h-10 object-contain" />
          </m.div>
          <h3 className="text-2xl font-display font-bold text-text-main mb-1">Support Our Cause</h3>
          <p className="text-gray-500 text-sm">Every contribution makes a difference</p>
        </div>

        {/* Ashish Collector Disclosure - Placed informatively at top */}
        <div className="bg-surface/90 border border-gray-200/80 rounded-2xl p-3.5 mb-5 text-center shadow-xs">
          <p className="text-xs font-semibold text-gray-800 flex items-center justify-center gap-1.5">
            <Heart className="w-3.5 h-3.5 fill-primary text-primary flex-shrink-0" />
            <span>Ashish is collecting money on behalf of Inclusiverse</span>
          </p>
          <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">
            All contributions directly support inclusive student initiatives & events.
          </p>
        </div>

        {/* Preset amount grid + Custom Button */}
        <div className="grid grid-cols-3 gap-2.5 mb-4">
          {PRESET_AMOUNTS.map((preset) => {
            const isSelected = selectedPreset === preset;
            return (
              <m.button
                key={preset}
                type="button"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handlePresetClick(preset)}
                className={`py-3 rounded-xl font-semibold text-sm transition-colors border cursor-pointer ${
                  isSelected
                    ? "bg-primary text-white border-primary shadow-md shadow-primary/20"
                    : "bg-surface hover:bg-gray-100 text-text-main border-gray-200/80 hover:border-gray-300"
                }`}
              >
                ₹{preset.toLocaleString("en-IN")}
              </m.button>
            );
          })}

          {/* Custom option button */}
          <m.button
            type="button"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleCustomClick}
            className={`py-3 rounded-xl font-semibold text-sm transition-colors border cursor-pointer ${
              selectedPreset === "custom"
                ? "bg-primary text-white border-primary shadow-md shadow-primary/20"
                : "bg-surface hover:bg-gray-100 text-text-main border-gray-200/80 hover:border-gray-300"
            }`}
          >
            Custom
          </m.button>
        </div>

        {/* Custom amount input field - only shown when Custom is selected */}
        <AnimatePresence>
          {selectedPreset === "custom" && (
            <m.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="mb-4"
            >
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-lg select-none pointer-events-none">₹</span>
                <input
                  ref={inputRef}
                  type="text"
                  inputMode="numeric"
                  placeholder="Enter custom amount (min ₹100)"
                  value={customAmount}
                  onChange={handleCustomAmountChange}
                  className={`w-full pl-10 pr-10 py-3.5 bg-gray-50/80 border-2 rounded-2xl text-base font-semibold text-text-main placeholder:text-gray-400 placeholder:font-normal focus:outline-none transition-colors ${
                    customAmount && parseInt(customAmount, 10) < 100
                      ? "border-amber-400 ring-2 ring-amber-400/20 bg-white"
                      : "border-primary/40 focus:border-primary focus:ring-4 focus:ring-primary/10 bg-white"
                  }`}
                />
                {customAmount && (
                  <button
                    type="button"
                    onClick={() => {
                      setCustomAmount("");
                      setAmount("");
                      inputRef.current?.focus();
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 rounded-full transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              {customAmount && parseInt(customAmount, 10) < 100 && (
                <p className="text-xs text-amber-600 mt-1.5 ml-1 font-medium flex items-center gap-1">
                  Minimum donation amount is ₹100
                </p>
              )}
            </m.div>
          )}
        </AnimatePresence>

        {/* Payment methods info */}
        <div className="flex items-center justify-center gap-3.5 py-2 px-3 bg-gray-50/80 rounded-xl border border-gray-100 mb-5">
          <div className="flex items-center gap-1 text-xs text-gray-500 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>UPI</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>Cards</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>Wallets</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>Netbanking</span>
          </div>
        </div>

        {/* Pay button */}
        <m.button
          whileHover={finalAmount >= 100 ? { scale: 1.02 } : {}}
          whileTap={finalAmount >= 100 ? { scale: 0.98 } : {}}
          onClick={handlePayment}
          disabled={finalAmount < 100 || isProcessing}
          className={`w-full py-4 rounded-2xl font-semibold text-base transition-colors ${
            finalAmount >= 100
              ? "bg-primary hover:bg-primary-hover text-white shadow-lg shadow-primary/25 cursor-pointer"
              : "bg-gray-100 text-gray-400 border border-gray-200/60 cursor-not-allowed"
          }`}
        >
          {isProcessing ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin w-5 h-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Processing Payment...</span>
            </span>
          ) : finalAmount >= 100 ? (
            `Donate ₹${finalAmount.toLocaleString("en-IN")}`
          ) : finalAmount > 0 ? (
            "Minimum donation is ₹100"
          ) : (
            "Select or enter an amount"
          )}
        </m.button>

        {/* Secure payment note */}
        <div className="flex items-center justify-center gap-1.5 mt-3.5 text-gray-400">
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM12 17c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1s3.1 1.39 3.1 3.1v2z" />
          </svg>
          <span className="text-xs font-medium">Secured by Razorpay</span>
        </div>

        {/* Non-refundable notice */}
        <p className="text-[10px] text-center text-gray-400 mt-2 leading-relaxed">
          All donations are <span className="font-semibold text-gray-500">non-refundable</span>. By donating, you agree to our{" "}
          <a
            href="?page=no-refund"
            onClick={(e) => { e.preventDefault(); onClose(); setTimeout(() => { const u = new URL(window.location.href); u.searchParams.set("page","no-refund"); window.history.pushState(null,"",u.toString()); window.dispatchEvent(new PopStateEvent("popstate")); }, 10); }}
            className="underline hover:text-gray-600 transition-colors"
          >
            No Refund Policy
          </a>{" "}and{" "}
          <a
            href="?page=tos"
            onClick={(e) => { e.preventDefault(); onClose(); setTimeout(() => { const u = new URL(window.location.href); u.searchParams.set("page","tos"); window.history.pushState(null,"",u.toString()); window.dispatchEvent(new PopStateEvent("popstate")); }, 10); }}
            className="underline hover:text-gray-600 transition-colors"
          >
            Terms of Service
          </a>.
        </p>
      </m.div>
    </div>
  );
}

// ─── Timeline Milestones Data ──────────────────────────────────────────────────
const MILESTONES = [
  {
    year: "2023",
    title: "Beyond Barriers",
    tagline: "Where it all began.",
    description: "Beyond Barriers marked the beginning of the Inclusiverse journey. It was built around the belief that differences should never become limitations and that inclusion begins when we choose to understand one another.\n\nThe initiative laid the foundation for what Inclusiverse would become—a student-led community committed to creating opportunities for participation, connection, and equal opportunity.",
    closing: "Our first step beyond the barriers that divide us.",
    reportUrl: "/reports/Beyond_Barriers_Activity_Report.pdf",
    galleryFilter: "beyond-barriers"
  },
  {
    year: "2024",
    title: "State Unified Championship",
    tagline: "Bringing people together through sport.",
    description: "The State Unified Championship brought athletes with and without disabilities together on the same field, united by the spirit of sport.\n\nMore than a championship, it became a celebration of teamwork, friendship, determination, and participation. It showed us how sport can break down barriers and create connections that go far beyond the game.",
    closing: "Different abilities. One team. One spirit.",
    reportUrl: "/reports/State_Unified_Championship_Report.pdf",
    galleryFilter: "state-unified-championship"
  },
  {
    year: "2025",
    title: "Emerging InClusiWarriors",
    tagline: "Celebrating participation.",
    description: "Emerging InClusiWarriors created an opportunity for specially-abled students to come to campus, participate in fun activities, and experience a space where they could simply be themselves.\n\nThe focus was never just on competition. It was about building confidence, encouraging interaction, creating friendships, and celebrating every individual's ability to participate.",
    closing: "Because every participant is a warrior in their own way.",
    reportUrl: "/reports/Emerging_InclusiWarriors_Report.pdf",
    galleryFilter: "emerging-inclusiwarriors"
  },
  {
    year: "2025",
    title: "InclusiAI",
    tagline: "Innovation with inclusion at its core.",
    description: "With InclusiAI, we explored how technology and innovation can contribute to a more inclusive and accessible world.\n\nThe initiative brought together creativity, problem-solving, and technology, encouraging students to look at real-world challenges through an inclusive lens and imagine solutions that can make a difference.",
    closing: "Ideas that innovate. Solutions that include.",
    reportUrl: "/reports/InclusiAI_Report.pdf",
    galleryFilter: "inclusiai"
  },
  {
    year: "2026",
    title: "Compassion in Action — Asha Bhavan",
    tagline: "Taking inclusion beyond the campus.",
    description: "Our visit to Asha Bhavan Special School, Satara marked another meaningful step in our journey.\n\nThrough interactions, activities, and shared experiences, students had the opportunity to connect with the children and understand inclusion through real human connections. The experience reminded us that sometimes the most meaningful impact comes from the simplest things—being present, listening, sharing, and caring.",
    closing: "Inclusion begins with empathy and comes alive through action.",
    reportUrl: "/reports/Compassion_in_Action_Report.pdf",
    galleryFilter: "compassion-in-action-asha-bhavan"
  },
  {
    year: "2026",
    title: "Take a Stand",
    tagline: "Giving every voice a platform.",
    description: "Take a Stand created a space for students to express their perspectives, engage with important issues, and confidently make their voices heard.\n\nFor us, inclusion also means ensuring that people have the freedom and opportunity to speak, question, share, and be heard.",
    closing: "Because every voice deserves a space.",
    reportUrl: "/reports/Take_a_Stand_Report.pdf",
    galleryFilter: "take-a-stand"
  },
];

// ─── Home ─────────────────────────────────────────────────────────────────────
const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.05 },
  },
};

const fadeUpItem: Variants = {
  hidden: { opacity: 0, y: 25 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

function Home({ setPage }: { setPage: (p: Page) => void }) {
  const [showDonateModal, setShowDonateModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Dynamic events count derived directly from Timeline MILESTONES & registered events
  const dynamicEventsCount = React.useMemo(() => {
    const uniqueEvents = new Set<string>();
    MILESTONES.forEach(m => uniqueEvents.add(m.title.toLowerCase().trim()));
    GALLERY_EVENTS.forEach(e => uniqueEvents.add(e.name.toLowerCase().trim()));
    return Math.max(uniqueEvents.size, MILESTONES.length, 1);
  }, []);

  // Dynamic shared experiences sourced directly from Timeline MILESTONES
  const sharedExperiences = React.useMemo(() => {
    return MILESTONES.map((m) => {
      // Find a matching photo for this milestone from GALLERY_PHOTOS
      const matched = GALLERY_PHOTOS.find(
        p => (m.galleryFilter && p.event === m.galleryFilter) ||
             (p.cat && p.cat.toLowerCase() === m.title.toLowerCase()) ||
             (p.caption && p.caption.toLowerCase().includes(m.title.toLowerCase()))
      );

      // Default backup photo based on milestone title hash
      const fallbackPhoto = GALLERY_PHOTOS.length > 0
        ? GALLERY_PHOTOS[Math.abs(m.title.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)) % GALLERY_PHOTOS.length]
        : null;

      const photo = matched || fallbackPhoto;

      return {
        ...m,
        photoSrc: photo ? photo.src : "/gallery/compassion-in-action-asha-bhavan/IMG_1730.webp",
        photoAlt: photo ? photo.alt : m.title,
      };
    });
  }, []);

  useEffect(() => {
    if (!GALLERY_PHOTOS.length) return;
    const interval = setInterval(() => {
      setCurrentImageIndex(prev => (prev + 1) % GALLERY_PHOTOS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <section className="relative overflow-hidden bg-surface py-20 lg:py-32">
        {/* Background decorative glow (pure CSS animation, no continuous DOM JS mutations) */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            <m.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="max-w-2xl"
            >
              <m.h1 variants={fadeUpItem} className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold text-text-main leading-tight mb-6">
                Every Child Deserves <span className="text-primary">Joy</span>,{" "}
                <span className="text-primary">Friendship</span>, and Opportunity.
              </m.h1>
              <m.p variants={fadeUpItem} className="text-lg sm:text-xl text-gray-700 mb-10 leading-relaxed max-w-xl">
                Inclusiverse is a student-led initiative creating meaningful experiences for children with
                disabilities through sports, inclusion, creativity, and compassion.
              </m.p>
              <m.div variants={fadeUpItem} className="flex flex-wrap gap-4">
                <m.button
                  onClick={() => setPage("join")}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className="bg-primary hover:bg-primary-hover text-white px-8 py-4 rounded-full font-medium text-lg transition-colors shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-focus focus:ring-offset-2 flex items-center gap-2 group"
                >
                  Join Us Today
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </m.button>
                <m.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setPage("timeline")}
                  className="bg-white hover:bg-gray-50 text-text-main border border-gray-200 px-8 py-4 rounded-full font-medium text-lg transition-colors focus:outline-none focus:ring-2 focus:ring-focus focus:ring-offset-2 flex items-center gap-2 shadow-sm"
                >
                  <PlayCircle className="w-5 h-5 text-gray-500" />
                  Our Journey
                </m.button>
              </m.div>
            </m.div>

            <m.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl relative group">
                <AnimatePresence mode="sync">
                  {GALLERY_PHOTOS.length > 0 && (
                    <m.div
                      key={currentImageIndex}
                      initial={{ opacity: 0, scale: 1.1 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute inset-0"
                    >
                      <m.div
                        animate={{ scale: [1, 1.08] }}
                        transition={{ duration: 5, ease: "easeOut" }}
                        className="w-full h-full"
                      >
                        <ImageWithFallback
                          src={GALLERY_PHOTOS[currentImageIndex].src}
                          alt={GALLERY_PHOTOS[currentImageIndex].alt}
                          className="w-full h-full object-cover"
                        />
                      </m.div>
                    </m.div>
                  )}
                </AnimatePresence>
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent z-10 pointer-events-none" />
                <m.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="absolute bottom-6 left-6 right-6 z-20"
                >
                </m.div>
              </div>
            </m.div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <m.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
            }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto"
          >
            {[
              { label: "Volunteers", value: "50+" },
              { label: "Events", value: `${dynamicEventsCount}+` },
              { label: "Smiles", value: "500+" },
            ].map((stat, i) => (
              <m.div
                key={i}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
                }}
                className="text-center p-4 rounded-2xl bg-surface/50 sm:bg-transparent"
              >
                <div className="text-4xl md:text-5xl font-display font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-gray-600 font-medium text-base">{stat.label}</div>
              </m.div>
            ))}
          </m.div>
        </div>
      </section>

      <section className="py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <m.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="max-w-2xl"
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-3 uppercase tracking-wider">
                Our Journey & Milestones
              </div>
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-3 text-text-main">Shared Experiences</h2>
              <p className="text-gray-600 text-lg">Meaningful moments created through sports, art, and community inclusion.</p>
            </m.div>
            <m.button
              whileHover={{ x: 4 }}
              onClick={() => setPage("timeline")}
              className="hidden md:flex items-center gap-2 text-primary font-semibold hover:text-primary-hover transition-colors cursor-pointer"
            >
              <span>View full timeline ({MILESTONES.length} chapters)</span>
              <ChevronRight className="w-4 h-4" />
            </m.button>
          </div>

          <m.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
            }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {sharedExperiences.slice(0, 3).map((exp, i) => (
              <m.div
                key={exp.title}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
                }}
                whileHover={{ y: -8 }}
                onClick={() => setPage("timeline")}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 group cursor-pointer flex flex-col h-full border border-gray-100/80"
              >
                {/* Image header with Year Badge */}
                <div className="relative h-52 sm:h-56 overflow-hidden bg-gray-100">
                  <ImageWithFallback
                    src={exp.photoSrc}
                    alt={exp.photoAlt}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full bg-white/95 backdrop-blur-xs text-text-main text-xs font-bold shadow-md">
                      {exp.year}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-4 right-4">
                    <p className="text-white/95 text-xs font-medium line-clamp-1 italic">
                      "{exp.tagline}"
                    </p>
                  </div>
                </div>

                {/* Content body */}
                <div className="p-6 sm:p-7 flex flex-col flex-grow">
                  <h3 className="text-xl font-display font-bold mb-2 text-text-main group-hover:text-primary transition-colors line-clamp-1">
                    {exp.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 mb-6 flex-grow">
                    {exp.description.split('\n')[0]}
                  </p>
                  <div className="flex items-center justify-between text-primary font-semibold text-sm pt-4 border-t border-gray-100 mt-auto">
                    <span>Read story</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                  </div>
                </div>
              </m.div>
            ))}
          </m.div>

          <div className="mt-10 text-center md:hidden">
            <button
              onClick={() => setPage("timeline")}
              className="w-full py-3.5 px-6 rounded-2xl bg-white border border-gray-200 text-primary font-semibold text-sm shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>View full timeline ({MILESTONES.length} chapters)</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <m.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        >
          <div className="inline-block mb-8 animate-pulse">
            <Heart className="w-16 h-16 text-primary mx-auto opacity-30" />
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">Ready to make a difference?</h2>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Join our community of students dedicated to building lasting friendships and creating inclusive spaces.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <m.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setPage("join")}
              className="bg-primary hover:bg-primary-hover text-white px-8 py-4 rounded-full font-medium text-lg transition-colors shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-focus focus:ring-offset-2 cursor-pointer"
            >
              Become a Volunteer
            </m.button>
            <m.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setShowDonateModal(true)}
              className="relative bg-surface hover:bg-gray-200 text-text-main px-8 py-4 rounded-full font-medium text-lg transition-colors focus:outline-none focus:ring-2 focus:ring-focus focus:ring-offset-2 cursor-pointer"
            >
              Donate Now
            </m.button>
          </div>
        </m.div>
      </section>

      <AnimatePresence>
        {showDonateModal && (
          <DonateModal onClose={() => setShowDonateModal(false)} />
        )}
      </AnimatePresence>
    </>
  );
}

// ─── About ────────────────────────────────────────────────────────────────────
function About() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-surface py-24">
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        >
          <h1 className="text-5xl sm:text-6xl font-display font-bold text-text-main mb-6">
            Where Everyone <span className="text-primary">Belongs</span>
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            Inclusiverse is a student-led initiative at Christ University, Pune Lavasa Campus, built on a simple belief: everyone deserves to feel included, heard, respected, and valued.
          </p>
        </m.div>
      </section>

      {/* Introduction Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="prose prose-lg max-w-none text-gray-700"
          >
            <p className="text-lg leading-relaxed">
              We are more than just a club. We are a community of students who believe that inclusion is not merely about creating opportunities for people—it is about <span className="font-semibold text-primary">creating spaces where people feel comfortable enough to participate, express themselves, discover their strengths, and simply be themselves.</span>
            </p>
            <p className="text-lg leading-relaxed mt-6">
              Our journey began with a vision to bridge gaps between people of different abilities, backgrounds, and experiences. Today, Inclusiverse works towards creating meaningful opportunities for <span className="font-semibold text-primary">specially-abled individuals and the wider community</span> through sports, cultural activities, awareness initiatives, creative events, and social engagement.
            </p>
          </m.div>
        </div>
      </section>

      {/* Our Purpose Section */}
      <section className="py-20 bg-surface">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-display font-bold mb-8 text-text-main">Our Purpose</h2>
            <div className="bg-white rounded-3xl p-8 shadow-sm">
              <p className="text-lg font-semibold text-primary mb-6">We believe that differences should never become barriers.</p>
              <p className="text-gray-700 leading-relaxed mb-6">
                Through our initiatives, we aim to challenge stereotypes, encourage empathy, and build a culture where accessibility and inclusion become a part of everyday life. Whether it is bringing specially-abled children to campus, organising inclusive games, conducting awareness activities, collaborating with schools and organisations, or creating platforms for students to express themselves, every initiative is driven by the same purpose—to make inclusion something we <span className="font-semibold">experience</span>, not just something we talk about.
              </p>
            </div>
          </m.div>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-display font-bold mb-6 text-text-main">What We Do</h2>
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              At Inclusiverse, we believe that change can happen through both big movements and small moments.
            </p>

            <div className="space-y-4 mb-8">
              {[
                "Inclusive sports and recreational activities that encourage participation, teamwork, and confidence.",
                "Cultural and creative initiatives that provide everyone with a platform to express themselves.",
                "Awareness and sensitisation programmes that encourage conversations around disability, accessibility, empathy, and equality.",
                "Community outreach initiatives in collaboration with schools, organisations, and individuals working towards inclusion.",
                "Student-led events and campaigns that turn ideas into meaningful action.",
                "Collaborative projects and competitions that use creativity, technology, and innovation to address real-world challenges.",
              ].map((item, index) => (
                <m.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex gap-4 items-start"
                >
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <p className="text-gray-700 leading-relaxed">{item}</p>
                </m.div>
              ))}
            </div>

            <p className="text-gray-700 leading-relaxed text-lg italic bg-surface p-6 rounded-2xl border-l-4 border-primary">
              From the <span className="font-semibold">State Unified Championship</span> and inclusive campus activities to our outreach initiatives and collaborations with organisations such as <span className="font-semibold">Special Olympics Bharat Maharashtra</span> and schools supporting specially-abled children, our work is rooted in participation, connection, and impact.
            </p>
          </m.div>
        </div>
      </section>

      {/* More Than Inclusion Section */}
      <section className="py-20 bg-surface">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-display font-bold mb-8 text-text-main">More Than Inclusion</h2>
            <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-3xl p-8 border border-primary/20">
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                For us, inclusion is not about asking people to fit into an existing space.
              </p>
              <p className="text-xl font-semibold text-primary mb-6">
                It is about changing the space so that everyone has a place in it.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                We want to create an environment where a person's ability does not define their opportunities, where differences are met with curiosity rather than judgement, and where every individual has the confidence to participate without feeling like an outsider.
              </p>
            </div>
            <p className="text-gray-700 leading-relaxed mt-8 text-lg">
              We know that meaningful change does not happen overnight. It begins with awareness, grows through understanding, and becomes real through consistent action.
            </p>
          </m.div>
        </div>
      </section>

      {/* Our Community Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-display font-bold mb-8 text-text-main">Our Community</h2>
            <div className="space-y-6">
              <p className="text-lg text-gray-700 leading-relaxed">
                Inclusiverse is powered by students who bring different ideas, talents, perspectives, and experiences to the table. It is a space where students learn not only how to organise events, but also how to listen, collaborate, understand different perspectives, and contribute to something larger than themselves.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Every volunteer, participant, collaborator, faculty member, and community partner becomes a part of our journey.
              </p>
              <p className="text-lg font-semibold text-primary bg-surface p-6 rounded-2xl">
                Because ultimately, <span className="text-gray-900">Inclusiverse is not defined by the events we conduct. It is defined by the people we bring together.</span>
              </p>
            </div>
          </m.div>
        </div>
      </section>

      {/* Our Vision Section */}
      <section className="py-24 bg-gradient-to-b from-surface to-primary/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-8 text-text-main">Our Vision</h2>
            <p className="text-xl text-gray-700 leading-relaxed mb-12">
              We envision a community where <span className="font-semibold text-primary">inclusion is the norm, accessibility is a shared responsibility, and every individual has the opportunity to participate, grow, and thrive.</span>
            </p>
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              We are working towards a future where no one has to ask, <span className="italic font-medium">"Do I belong here?"</span>
            </p>
            <p className="text-lg text-gray-700 mb-12">
              Because the answer should always be:
            </p>
            <m.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-primary text-white text-3xl md:text-4xl font-display font-bold py-8 px-6 rounded-3xl shadow-lg mb-12"
            >
              Yes. You do.
            </m.div>
            <p className="text-gray-600 text-lg italic">
              <span className="font-semibold text-primary">Inclusiverse</span> — Different abilities. Different stories. One community.
            </p>
          </m.div>
        </div>
      </section>
    </div>
  );
}

// ─── Timeline ─────────────────────────────────────────────────────────────────
function MilestoneCard({ milestone, index, onViewGallery }: { milestone: typeof MILESTONES[0]; index: number; onViewGallery: (filter: string) => void }) {
  const hasGalleryPhotos = milestone.galleryFilter && GALLERY_PHOTOS.some(p => p.event === milestone.galleryFilter);

  return (
    <m.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative flex gap-4 sm:gap-6 md:gap-10"
    >
      {/* Timeline spine */}
      <div className="relative flex flex-col items-center flex-shrink-0">
        <m.div
          whileHover={{ scale: 1.1 }}
          className="bg-primary text-white text-xs sm:text-sm font-bold px-3 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-md whitespace-nowrap z-10 font-display"
        >
          {milestone.year}
        </m.div>
        {index < MILESTONES.length - 1 && (
          <div className="flex-1 w-px bg-gradient-to-b from-primary/30 to-gray-200 mt-4" />
        )}
      </div>
      {/* Card */}
      <div className="flex-1 bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-gray-200 p-5 sm:p-8 mb-6 sm:mb-8 hover:shadow-lg transition-shadow">
        <div className="mb-4">
          <h3 className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-text-main mb-2">{milestone.title}</h3>
          <p className="text-primary font-semibold italic text-base sm:text-lg">{milestone.tagline}</p>
        </div>
        <div className="space-y-4">
          {milestone.description.split('\n\n').map((para, i) => (
            <p key={i} className="text-gray-700 leading-relaxed text-sm sm:text-base">{para}</p>
          ))}
        </div>
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-primary font-semibold text-base sm:text-lg italic">{milestone.closing}</p>
        </div>
        {(milestone.reportUrl || milestone.galleryFilter) && (
          <div className="mt-6 flex flex-wrap gap-3">
            {milestone.reportUrl && (
              <a
                href={milestone.reportUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white font-semibold text-sm px-4 py-2 rounded-full transition-colors hover:shadow-md focus:outline-none focus:ring-2 focus:ring-focus focus:ring-offset-2"
              >
                <FileText className="w-4 h-4" />
                Report
              </a>
            )}
            {milestone.galleryFilter && hasGalleryPhotos && (
              <button
                onClick={() => onViewGallery(milestone.galleryFilter!)}
                className="inline-flex items-center gap-2 bg-surface hover:bg-gray-200 text-text-main font-semibold text-sm px-4 py-2 rounded-full transition-colors hover:shadow-md focus:outline-none focus:ring-2 focus:ring-focus focus:ring-offset-2"
              >
                <Camera className="w-4 h-4" />
                Moments Captured
              </button>
            )}
          </div>
        )}
      </div>
    </m.div>
  );
}

function Timeline({ onViewGallery }: { onViewGallery: (filter: string) => void }) {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-surface py-20">
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        >
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-6 text-text-main">
            Our <span className="text-primary">Journey</span>
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-primary">Six Milestones. One Growing Movement.</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            Inclusiverse began with a simple idea: <span className="font-semibold">to look beyond barriers and create spaces where everyone can participate, connect, and belong.</span>
          </p>
          <p className="text-gray-600 mt-6 leading-relaxed">
            From our first initiative in 2023 to the work we continue today, each milestone has shaped who we are. Every event has taught us something, introduced us to new communities, and brought us one step closer to the inclusive world we envision.
          </p>
        </m.div>
      </section>

      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {MILESTONES.map((milestone, i) => (
            <MilestoneCard key={i} milestone={milestone} index={i} onViewGallery={onViewGallery} />
          ))}
          <div className="flex justify-start pl-4 sm:pl-5 mt-4 sm:mt-8">
            <div className="w-3 h-3 rounded-full bg-primary animate-ping" />
          </div>
        </div>
      </section>

      {/* Conclusion Section */}
      <section className="py-24 bg-gradient-to-b from-white to-surface">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-8 text-text-main">Our Story Continues</h2>
            <p className="text-xl text-gray-700 mb-8 leading-relaxed">
              Six milestones. Countless people. One shared purpose.
            </p>
            <div className="bg-white rounded-3xl p-8 md:p-12 border border-gray-200 shadow-sm mb-8">
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                From <span className="font-semibold text-primary">Beyond Barriers</span> to <span className="font-semibold text-primary">Take a Stand</span>, our journey has evolved—but our core belief has remained the same:
              </p>
              <h3 className="text-3xl md:text-4xl font-display font-bold text-primary mb-8">
                Everyone deserves to belong.
              </h3>
              <p className="text-gray-700 leading-relaxed mb-6">
                These milestones are not just events on a timeline. They represent the people we have met, the communities we have connected with, the conversations we have started, and the barriers we continue to challenge.
              </p>
              <p className="text-lg text-gray-700 font-semibold">
                And this is only the beginning.
              </p>
            </div>
            <m.p
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl md:text-2xl font-display font-bold text-primary"
            >
              The next chapter of Inclusiverse is waiting to be written—<span className="text-text-main">with you.</span>
            </m.p>
          </m.div>
        </div>
      </section>
    </div>
  );
}

// ─── Gallery ──────────────────────────────────────────────────────────────────
const INITIAL_GALLERY_COUNT = 12;
const GALLERY_BATCH_SIZE = 12;

const ALL_GALLERY_FILTERS: { name: string; slug: string }[] = (() => {
  const eventFilters = GALLERY_EVENTS.map((e: { name: string; slug: string }) => ({ name: e.name, slug: e.slug }));
  const seenNames = new Set(eventFilters.map((e: { name: string; slug: string }) => e.name));
  const additional: { name: string; slug: string }[] = [];
  for (const photo of GALLERY_PHOTOS) {
    if (photo.cat && photo.cat !== "All" && !seenNames.has(photo.cat)) {
      seenNames.add(photo.cat);
      additional.push({
        name: photo.cat,
        slug: photo.cat.toLowerCase().replace(/\s+/g, '-'),
      });
    }
  }
  return [...eventFilters, ...additional];
})();

function GalleryCard({
  photo,
  index,
  onClick,
}: {
  photo: GalleryPhoto;
  index: number;
  onClick: () => void;
}) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <m.button
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min((index % GALLERY_BATCH_SIZE) * 0.03, 0.3) }}
      onClick={onClick}
      className="w-full break-inside-avoid rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 group relative block text-left bg-gray-100 mb-5"
    >
      <div className="relative w-full overflow-hidden bg-gray-100">
        <img
          src={photo.src}
          alt={photo.alt}
          loading={index < 6 ? "eager" : "lazy"}
          onLoad={() => setIsLoaded(true)}
          className={`w-full object-cover group-hover:scale-105 transition-transform duration-500 ${
            isLoaded ? "opacity-100" : "opacity-0 min-h-[220px]"
          }`}
        />
        {!isLoaded && (
          <div className="absolute inset-0 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 animate-pulse min-h-[220px]" />
        )}
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-[opacity,transform] duration-300 pointer-events-none">
        <span className="text-white text-sm font-medium drop-shadow-sm">{photo.caption}</span>
        <span className="ml-2 bg-primary text-white text-xs px-2.5 py-0.5 rounded-full shadow-sm">{photo.cat}</span>
      </div>
    </m.button>
  );
}

function Gallery({ activeFilter, setActiveFilter }: { activeFilter: string; setActiveFilter: (f: string) => void }) {
  const [lightbox, setLightbox] = useState<typeof GALLERY_PHOTOS[0] | null>(null);
  const [visibleCount, setVisibleCount] = useState(INITIAL_GALLERY_COUNT);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const allFilters = ALL_GALLERY_FILTERS;

  const filteredPhotos = activeFilter === "All"
    ? GALLERY_PHOTOS
    : GALLERY_PHOTOS.filter(p => p.cat === activeFilter || p.event === activeFilter);

  // Reset visible count when switching tabs so top images load first
  const handleFilterChange = (slug: string) => {
    setActiveFilter(slug);
    setVisibleCount(INITIAL_GALLERY_COUNT);
  };

  useEffect(() => {
    setVisibleCount(INITIAL_GALLERY_COUNT);
  }, [activeFilter]);

  const visiblePhotos = filteredPhotos.slice(0, visibleCount);
  const hasMore = visibleCount < filteredPhotos.length;

  // Progressive intersection observer for smooth bottom appending
  useEffect(() => {
    if (!hasMore) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + GALLERY_BATCH_SIZE, filteredPhotos.length));
        }
      },
      { rootMargin: "350px" }
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }
    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [hasMore, filteredPhotos.length]);

  return (
    <div>
      <section className="bg-surface py-20">
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        >
          <h1 className="text-5xl font-display font-bold mb-5">
            <span className="text-primary">Gallery</span>
          </h1>
          <p className="text-xl text-gray-600">
            Joyful moments captured across our events, projects, and community gatherings.
          </p>
        </m.div>
      </section>

      {/* Filter Pills */}
      {allFilters.length > 0 && (
        <section className="bg-white pt-10 pb-2">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <m.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="flex flex-wrap justify-center gap-3"
            >
              <button
                onClick={() => handleFilterChange("All")}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-focus focus:ring-offset-2 ${activeFilter === "All"
                    ? "bg-primary text-white shadow-md shadow-primary/25"
                    : "bg-surface text-gray-600 hover:bg-gray-200 hover:text-text-main"
                  }`}
              >
                All Events
              </button>
              {allFilters.map((filter) => (
                <button
                  key={filter.slug}
                  onClick={() => handleFilterChange(filter.slug)}
                  className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-focus focus:ring-offset-2 ${activeFilter === filter.slug
                      ? "bg-primary text-white shadow-md shadow-primary/25"
                      : "bg-surface text-gray-600 hover:bg-gray-200 hover:text-text-main"
                    }`}
                >
                  {filter.name}
                </button>
              ))}
            </m.div>
          </div>
        </section>
      )}

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredPhotos.length === 0 ? (
            <m.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <Camera className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-xl text-gray-400 font-display font-semibold">No photos yet for this event</p>
              <p className="text-gray-400 mt-2">Photos will appear here once they are uploaded.</p>
            </m.div>
          ) : (
            <>
              <m.div
                key={activeFilter}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="columns-1 sm:columns-2 lg:columns-3 gap-5"
              >
                {visiblePhotos.map((photo, i) => (
                  <GalleryCard
                    key={photo.src}
                    photo={photo}
                    index={i}
                    onClick={() => setLightbox(photo)}
                  />
                ))}
              </m.div>

              {/* Bottom Infinite Scroll Sentinel & Load More trigger */}
              {hasMore && (
                <div ref={loadMoreRef} className="pt-10 pb-6 text-center">
                  <m.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setVisibleCount((prev) => Math.min(prev + GALLERY_BATCH_SIZE, filteredPhotos.length))}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-surface hover:bg-gray-200 text-sm font-semibold text-text-main transition-colors border border-gray-200 shadow-xs"
                  >
                    <span>Load More Photos</span>
                    <span className="text-xs text-primary font-bold">({filteredPhotos.length - visibleCount} remaining)</span>
                  </m.button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <AnimatePresence>
        {lightbox && (
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <m.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={e => e.stopPropagation()}
              className="relative max-w-3xl w-full rounded-3xl overflow-hidden shadow-2xl bg-white"
            >
              <button onClick={() => setLightbox(null)} className="absolute top-4 right-4 z-10 bg-white/90 hover:bg-white p-2 rounded-full shadow transition-colors" aria-label="Close">
                <X className="w-5 h-5 text-text-main" />
              </button>
              <img src={lightbox.src} alt={lightbox.alt} loading="lazy" className="w-full object-cover max-h-[70vh]" />
              <div className="p-5">
                <p className="font-display font-semibold">{lightbox.caption}</p>
                <span className="inline-block mt-2 bg-primary/10 text-primary text-xs font-medium px-3 py-1 rounded-full">{lightbox.cat}</span>
              </div>
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Join Us Page ─────────────────────────────────────────────────────────────
const CHRIST_UNIVERSITY_VOLUNTEER_FORM_URL = "https://forms.gle/fEb1WZTyRLXr1mLA9";

function JoinUs() {
  return (
    <div className="py-20 lg:py-32 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <m.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-3xl mx-auto mb-16"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-semibold mb-4 border border-primary/20">
          <Heart className="w-4 h-4 fill-primary" />
          <span>Become a Part of Inclusiverse</span>
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-text-main mb-5 tracking-tight">
          Join the <span className="text-primary">Movement</span>
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
          Choose how you want to make an impact. Are you a student at Christ University Lavasa, or joining our wider global network?
        </p>
      </m.div>

      {/* Two Action Cards / Buttons */}
      <div className="grid md:grid-cols-2 gap-8 mb-16">
        {/* Card 1: Christ University Lavasa */}
        <m.a
          href={CHRIST_UNIVERSITY_VOLUNTEER_FORM_URL}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ y: -6 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.3 }}
          className="bg-white border-2 border-gray-200/80 hover:border-primary rounded-3xl p-8 sm:p-10 flex flex-col justify-between shadow-sm hover:shadow-xl transition-shadow duration-300 relative group cursor-pointer block text-left"
        >
          <div>
            <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-colors duration-300 shadow-sm">
              <GraduationCap className="w-8 h-8" />
            </div>
            <div className="inline-block px-3 py-1 rounded-full bg-surface text-gray-600 text-xs font-bold uppercase tracking-wider mb-3">
              On-Campus Chapter
            </div>
            <h3 className="text-2xl sm:text-3xl font-display font-bold text-text-main mb-3 group-hover:text-primary transition-colors">
              Christ University Lavasa
            </h3>
            <p className="text-gray-600 text-base leading-relaxed mb-8">
              Join our on-campus student chapter. Help organize interactive workshops, inclusive sports meets, arts events, and peer support activities.
            </p>
          </div>

          <div className="w-full py-4 px-6 rounded-2xl bg-primary group-hover:bg-primary-hover text-white font-semibold text-base transition-colors shadow-md shadow-primary/25 group-hover:shadow-lg flex items-center justify-center gap-2 group-hover:gap-3">
            <span>Apply via Google Form</span>
            <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
        </m.a>

        {/* Card 2: Outside Volunteer - Coming Soon */}
        <m.div
          whileHover={{ y: -4 }}
          transition={{ duration: 0.3 }}
          className="bg-white border-2 border-gray-200/80 rounded-3xl p-8 sm:p-10 flex flex-col justify-between shadow-sm relative text-left"
        >
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gray-100 text-gray-600 flex items-center justify-center shadow-xs">
                <Users className="w-8 h-8" />
              </div>
              <span className="px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200/70 text-amber-700 text-xs font-bold uppercase tracking-wide">
                Coming Soon
              </span>
            </div>
            <div className="inline-block px-3 py-1 rounded-full bg-surface text-gray-600 text-xs font-bold uppercase tracking-wider mb-3">
              Community & Global
            </div>
            <h3 className="text-2xl sm:text-3xl font-display font-bold text-text-main mb-3">
              Outside Volunteer
            </h3>
            <p className="text-gray-600 text-base leading-relaxed mb-8">
              Join our broader community from anywhere. Opportunities for creative design, social outreach, partner school collaborations, and mentorship will open soon.
            </p>
          </div>

          <div className="w-full py-4 px-6 rounded-2xl bg-gray-100 border border-gray-200/70 text-gray-500 font-semibold text-base flex items-center justify-center gap-2 select-none cursor-not-allowed">
            <span>Applications Opening Soon</span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
        </m.div>
      </div>

      {/* Direct Contact & Social Links */}
      <div className="pt-10 border-t border-gray-200/80 text-center">
        <p className="text-xs uppercase font-bold tracking-wider text-gray-400 mb-4">Have questions? Reach out to us</p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <a
            href="https://www.instagram.com/inclusiverse.christuniversity"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white border border-gray-200 text-sm font-semibold text-text-main hover:text-primary hover:border-primary/40 shadow-sm transition-colors"
          >
            <Instagram className="w-4 h-4 text-pink-500" />
            <span>@inclusiverse.christuniversity</span>
          </a>
          <a
            href="https://www.linkedin.com/company/inclusiverse-club"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white border border-gray-200 text-sm font-semibold text-text-main hover:text-primary hover:border-primary/40 shadow-sm transition-colors"
          >
            <Linkedin className="w-4 h-4 text-blue-600" />
            <span>Inclusiverse Club</span>
          </a>
          <a
            href="https://maps.app.goo.gl/kV1XKQ1xFksGbzqU6"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white border border-gray-200 text-sm font-semibold text-text-main hover:text-primary hover:border-primary/40 shadow-sm transition-colors group"
            title="Open Christ University, Pune Lavasa Campus on Google Maps"
          >
            <MapPin className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
            <span>Christ University, Pune Lavasa Campus</span>
          </a>
        </div>
      </div>
    </div>
  );
}

// ─── 404 Page ─────────────────────────────────────────────────────────────────
function NotFound({ setPage }: { setPage: (p: Page) => void }) {
  return (
    <div className="min-h-[75vh] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Decorative Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-gradient-to-tr from-primary/15 via-pink-200/20 to-indigo-100/30 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-12 right-12 w-64 h-64 bg-primary/10 rounded-full blur-2xl pointer-events-none -z-10" />

      <m.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-2xl w-full text-center"
      >
        {/* Floating 404 badge with logo and sparkles */}
        <div className="relative inline-flex items-center justify-center mb-8">
          <m.div
            animate={{
              y: [0, -10, 0],
              rotate: [0, 2, -2, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="relative"
          >
            <div className="flex items-center justify-center gap-2 sm:gap-4 font-display font-black text-7xl sm:text-9xl text-primary/90 tracking-tighter select-none">
              <span>4</span>
              <m.div
                whileHover={{ rotate: 360, scale: 1.15 }}
                transition={{ duration: 0.8 }}
                className="w-20 h-20 sm:w-28 sm:h-28 rounded-3xl bg-white shadow-xl shadow-primary/20 border-2 border-primary/20 flex items-center justify-center p-3 relative"
              >
                <img
                  src="/inclusiverse-logo.png"
                  alt="Inclusiverse Logo"
                  className="w-full h-full object-contain"
                />
                <m.div
                  animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-400 to-pink-500 text-white p-1.5 rounded-full shadow-md"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                </m.div>
              </m.div>
              <span>4</span>
            </div>
          </m.div>
        </div>

        {/* Heading & Subtitle */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-text-main mb-4 tracking-tight">
          Lost in the <span className="text-primary">Inclusiverse?</span>
        </h1>
        <p className="text-gray-600 text-base sm:text-lg max-w-lg mx-auto mb-10 leading-relaxed">
          The page you’re looking for might have moved, been renamed, or simply took a different path. Don't worry—every journey leads back to community and joy.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
          <m.button
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setPage("home")}
            className="bg-primary hover:bg-primary-hover text-white px-7 py-3.5 rounded-full font-semibold transition-colors shadow-md shadow-primary/25 hover:shadow-lg flex items-center gap-2"
          >
            <HomeIcon className="w-4 h-4" />
            <span>Back to Home</span>
          </m.button>

          <m.button
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setPage("gallery")}
            className="bg-white hover:bg-gray-50 text-text-main border border-gray-200 px-6 py-3.5 rounded-full font-semibold transition-colors shadow-sm hover:border-primary/40 flex items-center gap-2"
          >
            <Camera className="w-4 h-4 text-primary" />
            <span>Explore Gallery</span>
          </m.button>
        </div>

        {/* Quick Links Card */}
        <div className="bg-white/80 backdrop-blur-sm border border-gray-100 rounded-3xl p-6 shadow-sm max-w-md mx-auto">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">Or discover other sections</p>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "About Us", target: "about" as Page, icon: Heart },
              { label: "Timeline", target: "timeline" as Page, icon: Compass },
              { label: "Join Us", target: "join" as Page, icon: Users },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.target}
                  onClick={() => setPage(item.target)}
                  className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-surface/70 hover:bg-primary/10 text-gray-700 hover:text-primary transition-colors duration-200 group text-center"
                >
                  <Icon className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-semibold">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </m.div>
    </div>
  );
}

// ─── Legal Page Wrapper ────────────────────────────────────────────────────────
function LegalPageWrapper({ title, subtitle, icon, children, setPage }: {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  setPage: (p: Page) => void;
}) {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="bg-gradient-to-br from-primary/10 via-white to-purple-50 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <button
            onClick={() => setPage("home")}
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </button>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
              {icon}
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-display font-bold text-text-main">{title}</h1>
              <p className="text-gray-500 text-sm mt-1">Last updated: August 2025</p>
            </div>
          </div>
          <p className="text-gray-600 text-base leading-relaxed max-w-2xl">{subtitle}</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        {children}
      </div>
    </div>
  );
}

function LegalSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
      <h2 className="text-lg font-display font-bold text-text-main mb-4 pb-3 border-b border-gray-100">{title}</h2>
      <div className="text-gray-600 text-sm leading-relaxed space-y-3">{children}</div>
    </section>
  );
}

// ─── Terms of Service ────────────────────────────────────────────────────────
function TermsOfService({ setPage }: { setPage: (p: Page) => void }) {
  return (
    <LegalPageWrapper
      title="Terms of Service"
      subtitle="Please read these terms carefully before making a donation to Inclusiverse through our Razorpay-powered crowdfunding platform."
      icon={<FileText className="w-6 h-6" />}
      setPage={setPage}
    >
      <LegalSection title="1. Acceptance of Terms">
        <p>By accessing our website and making a donation, you confirm that you have read, understood, and agree to be bound by these Terms of Service. If you do not agree with any part of these terms, please do not proceed with your donation.</p>
      </LegalSection>

      <LegalSection title="2. About Inclusiverse">
        <p>Inclusiverse is a student-led initiative operating under Christ University, Lavasa Campus. We organize inclusive events and activities for children with disabilities. Donations collected through this platform are managed by designated student volunteers on behalf of Inclusiverse.</p>
        <p>All funds raised go directly toward organizing events, procuring materials, and supporting participants in our inclusive programs.</p>
      </LegalSection>

      <LegalSection title="3. Nature of Donations">
        <p>All contributions made through this platform are <strong>voluntary donations</strong> to support Inclusiverse's crowdfunding initiatives. Donations are not purchases of goods or services. By donating, you acknowledge:</p>
        <ul className="list-disc ml-5 space-y-1 mt-2">
          <li>Your contribution is a voluntary gift to support Inclusiverse's mission.</li>
          <li>Donations are <strong>strictly non-refundable</strong> once processed (see our No Refund Policy).</li>
          <li>You will receive no goods, services, equity, or reward in exchange for your donation.</li>
          <li>Inclusiverse is not a registered NGO or charitable trust; donations may not be tax-deductible.</li>
        </ul>
      </LegalSection>

      <LegalSection title="4. Payment Processing">
        <p>All payments are processed securely through <strong>Razorpay</strong>, a third-party payment gateway. By making a payment, you also agree to Razorpay's Terms of Service and Privacy Policy available at <a href="https://razorpay.com/terms" target="_blank" rel="noopener noreferrer" className="text-primary underline">razorpay.com/terms</a>.</p>
        <p>We accept UPI, Credit/Debit Cards, Net Banking, and Wallets. All transactions are encrypted and secured by Razorpay's infrastructure.</p>
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
        <p>Inclusiverse reserves the right to modify these Terms of Service at any time. Continued use of the platform after changes constitutes acceptance of the revised terms. We encourage you to review this page periodically.</p>
      </LegalSection>

      <LegalSection title="8. Contact">
        <p>For any questions regarding these terms, please <button onClick={() => setPage("contact")} className="text-primary underline hover:text-primary/80">contact us</button>.</p>
      </LegalSection>
    </LegalPageWrapper>
  );
}

// ─── Privacy Policy ──────────────────────────────────────────────────────────
function PrivacyPolicy({ setPage }: { setPage: (p: Page) => void }) {
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
          <li><strong>Personal details:</strong> Name, email address, phone number (optional, entered in Razorpay checkout)</li>
          <li><strong>Transaction data:</strong> Payment amount, transaction ID, payment method used</li>
          <li><strong>Technical data:</strong> Browser type, device information, IP address (collected automatically)</li>
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
        <p className="mt-2">We do <strong>not</strong> sell, rent, or share your personal information with third parties for marketing purposes.</p>
      </LegalSection>

      <LegalSection title="3. Razorpay's Role">
        <p>Payment information (card numbers, UPI IDs, bank details) is processed directly by Razorpay and is never stored on our servers. Razorpay is PCI-DSS compliant. Please review <a href="https://razorpay.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary underline">Razorpay's Privacy Policy</a> for details on how they handle your payment data.</p>
      </LegalSection>

      <LegalSection title="4. Data Security">
        <p>We implement reasonable administrative and technical safeguards to protect your data. However, no internet transmission is 100% secure. We encourage donors to use secure networks when making payments.</p>
      </LegalSection>

      <LegalSection title="5. Data Retention">
        <p>Transaction records are retained for accounting and compliance purposes for a minimum of 3 years. Personal information is retained only as long as necessary for the purposes described above.</p>
      </LegalSection>

      <LegalSection title="6. Your Rights">
        <p>You have the right to:</p>
        <ul className="list-disc ml-5 space-y-1 mt-2">
          <li>Request access to the personal data we hold about you</li>
          <li>Request correction of inaccurate information</li>
          <li>Request deletion of your data (subject to legal obligations)</li>
        </ul>
        <p className="mt-2">To exercise these rights, please <button onClick={() => setPage("contact")} className="text-primary underline hover:text-primary/80">contact us</button>.</p>
      </LegalSection>

      <LegalSection title="7. Cookies">
        <p>Our website may use minimal cookies for basic functionality (e.g., remembering accessibility preferences). We do not use tracking or advertising cookies. Razorpay's checkout may use cookies governed by their own policy.</p>
      </LegalSection>

      <LegalSection title="8. Changes to This Policy">
        <p>We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated revision date.</p>
      </LegalSection>
    </LegalPageWrapper>
  );
}

// ─── Cancellation Policy ─────────────────────────────────────────────────────
function CancellationPolicy({ setPage }: { setPage: (p: Page) => void }) {
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
          <p className="text-amber-700 text-sm mt-1">Donations to Inclusiverse are final and cannot be cancelled once the payment is initiated and confirmed. Please review your donation amount carefully before proceeding.</p>
        </div>
      </div>

      <LegalSection title="1. Pre-Payment Cancellation">
        <p>You may cancel or exit the Razorpay payment window at any time <strong>before</strong> confirming your payment. Simply close the Razorpay checkout or click "Cancel." No amount will be charged if the payment is not completed.</p>
      </LegalSection>

      <LegalSection title="2. Post-Payment Cancellation">
        <p>Once a donation payment is <strong>successfully processed</strong> through Razorpay, it is considered final and <strong>cannot be cancelled</strong>. This is because:</p>
        <ul className="list-disc ml-5 space-y-1 mt-2">
          <li>Donations are immediately allocated toward Inclusiverse's event planning and operations.</li>
          <li>Crowdfunding contributions are voluntary gifts with no obligation of return.</li>
          <li>Processing and gateway fees incurred are non-recoverable.</li>
        </ul>
      </LegalSection>

      <LegalSection title="3. Failed Transactions">
        <p>If your payment fails or is declined but an amount has been debited from your account, please note:</p>
        <ul className="list-disc ml-5 space-y-1 mt-2">
          <li>Failed transaction reversals are handled automatically by Razorpay and your bank, typically within 5–7 business days.</li>
          <li>You will not be charged for failed transactions that do not result in a successful payment confirmation.</li>
          <li>If you face any issues, please <button onClick={() => setPage("contact")} className="text-primary underline hover:text-primary/80">contact us</button> immediately with your transaction details.</li>
        </ul>
      </LegalSection>

      <LegalSection title="4. Duplicate Payments">
        <p>If you accidentally make a duplicate donation, please contact us within 48 hours with both transaction IDs. We will review the case on a goodwill basis and may issue a refund for the duplicate amount at our sole discretion, subject to Razorpay's refund capabilities.</p>
      </LegalSection>

      <LegalSection title="5. Technical Errors">
        <p>In case of technical errors where payment is deducted but not confirmed on our end, please reach out to us with your payment reference number. We will investigate with Razorpay and resolve the issue promptly.</p>
      </LegalSection>
    </LegalPageWrapper>
  );
}

// ─── No Refund Policy ────────────────────────────────────────────────────────
function NoRefundPolicy({ setPage }: { setPage: (p: Page) => void }) {
  return (
    <LegalPageWrapper
      title="No Refund Policy"
      subtitle="All donations made to Inclusiverse through our Razorpay payment gateway are non-refundable. Please read this policy before contributing."
      icon={<AlertCircle className="w-6 h-6" />}
      setPage={setPage}
    >
      <div className="bg-red-50 border border-red-200 rounded-2xl p-5 flex gap-3">
        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-red-800 text-sm">No Refunds on Donations</p>
          <p className="text-red-700 text-sm mt-1">All donations to Inclusiverse are strictly non-refundable. By completing your donation, you acknowledge and accept this policy in full.</p>
        </div>
      </div>

      <LegalSection title="1. Non-Refundable Nature of Donations">
        <p>Inclusiverse operates as a <strong>crowdfunding-based charitable initiative</strong>. All donations collected through our Razorpay-powered platform are:</p>
        <ul className="list-disc ml-5 space-y-1 mt-2">
          <li>Voluntary contributions made freely by the donor</li>
          <li>Immediately directed toward planned events and operations</li>
          <li>Not exchangeable for goods, services, or any monetary return</li>
          <li><strong>Non-refundable</strong> under all circumstances once payment is successfully processed</li>
        </ul>
      </LegalSection>

      <LegalSection title="2. Why We Cannot Issue Refunds">
        <p>Our no-refund policy exists because:</p>
        <ul className="list-disc ml-5 space-y-1 mt-2">
          <li><strong>Crowdfunding nature:</strong> Like all crowdfunding platforms, contributions are pooled and used collectively toward a common cause.</li>
          <li><strong>Operational commitments:</strong> Funds are planned and committed to event vendors, transportation, and participant support well in advance.</li>
          <li><strong>Gateway fees:</strong> Razorpay charges payment processing fees which are deducted at the time of transaction and cannot be recovered.</li>
          <li><strong>Voluntary contribution:</strong> Donations are gifts, not purchases, and do not carry a right to refund.</li>
        </ul>
      </LegalSection>

      <LegalSection title="3. Exceptions">
        <p>The only exceptions where we may consider a refund at our <strong>sole discretion</strong> are:</p>
        <ul className="list-disc ml-5 space-y-1 mt-2">
          <li>Verified duplicate payments (same donor, same amount, processed twice within minutes)</li>
          <li>Payment debited but order/confirmation not received due to a verified technical failure</li>
        </ul>
        <p className="mt-2">Even in these exceptional cases, any refund is subject to Razorpay's refund timeline (typically 5–10 business days) and our internal review process. We do not guarantee a refund in any case.</p>
      </LegalSection>

      <LegalSection title="4. Chargebacks">
        <p>Initiating an unauthorized chargeback or dispute for a valid donation transaction is a violation of these terms. We reserve the right to contest any chargeback with Razorpay and your card issuer by providing transaction evidence. Donors who initiate fraudulent chargebacks may be banned from future participation in Inclusiverse events.</p>
      </LegalSection>

      <LegalSection title="5. Donor Acknowledgment">
        <p>By proceeding with a donation, you explicitly acknowledge that:</p>
        <ul className="list-disc ml-5 space-y-1 mt-2">
          <li>You have read and understood this No Refund Policy.</li>
          <li>Your donation is final and non-refundable once processed.</li>
          <li>You are donating voluntarily to support Inclusiverse's inclusive initiatives.</li>
          <li>You will not dispute the charge unless a verified technical error has occurred.</li>
        </ul>
      </LegalSection>

      <LegalSection title="6. Contact for Concerns">
        <p>If you have concerns before donating, please <button onClick={() => setPage("contact")} className="text-primary underline hover:text-primary/80">contact us</button> before making a payment. We're happy to answer any questions about how your funds will be used.</p>
      </LegalSection>
    </LegalPageWrapper>
  );
}


// ─── Contact Us ───────────────────────────────────────────────────────────────
function ContactUs({ setPage }: { setPage: (p: Page) => void }) {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="bg-gradient-to-br from-primary/10 via-white to-purple-50 border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <button
            onClick={() => setPage("home")}
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </button>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
              <Mail className="w-6 h-6" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-display font-bold text-text-main">Contact Us</h1>
          </div>
          <p className="text-gray-600 text-base leading-relaxed max-w-2xl">Have a question about your donation, our events, or our policies? Reach out directly — our student team typically responds within 1–2 business days.</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
        {/* Get in Touch */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
          <h3 className="font-display font-bold text-text-main mb-6 text-base">Get in Touch</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Mail className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Email</p>
                <a href="mailto:inclusiverse.christuniversity@gmail.com" className="text-sm text-primary hover:underline break-all">inclusiverse.christuniversity@gmail.com</a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Instagram className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Instagram</p>
                <a href="https://www.instagram.com/inclusiverse.christuniversity" target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">@inclusiverse.christuniversity</a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Linkedin className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">LinkedIn</p>
                <a href="https://www.linkedin.com/company/inclusiverse-club" target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">Inclusiverse Club</a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Location</p>
                <a href="https://maps.app.goo.gl/kV1XKQ1xFksGbzqU6" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-600 hover:text-primary transition-colors">Christ University, Lavasa Campus</a>
              </div>
            </div>
          </div>
        </div>

        {/* Donation Queries */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
          <h3 className="font-display font-bold text-text-main mb-3 text-base">Donation Queries?</h3>
          <p className="text-sm text-gray-500 leading-relaxed mb-5">For issues related to payments, duplicate transactions, or technical errors with Razorpay, please email us directly with your <strong>Razorpay Payment ID</strong> and we will get back to you within 2 business days.</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(["Terms of Service", "Privacy Policy", "Cancellation Policy", "No Refund Policy"] as const).map((label) => {
              const map: Record<string, Page> = {
                "Terms of Service": "tos",
                "Privacy Policy": "privacy",
                "Cancellation Policy": "cancellation",
                "No Refund Policy": "no-refund",
              };
              return (
                <button
                  key={label}
                  onClick={() => setPage(map[label])}
                  className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-primary transition-colors group text-left"
                >
                  <ChevronRight className="w-3 h-3 text-primary/60 group-hover:translate-x-0.5 transition-transform flex-shrink-0" />
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

const ALL_PAGES: Page[] = ["home", "about", "timeline", "gallery", "join", "404", "tos", "privacy", "cancellation", "no-refund", "contact"];

function getInitialPage(): Page {
  if (typeof window !== "undefined") {
    const params = new URLSearchParams(window.location.search);
    const p = params.get("page") as Page;
    if (p) {
      if (ALL_PAGES.includes(p)) {
        return p;
      }
      return "404";
    }
    const hash = window.location.hash.replace("#", "") as Page;
    if (hash) {
      if (ALL_PAGES.includes(hash)) {
        return hash;
      }
      return "404";
    }
    const pathname = window.location.pathname.replace(/^\/|\/$/g, "");
    if (pathname && !["index.html", ""].includes(pathname)) {
      if (ALL_PAGES.includes(pathname as Page)) {
        return pathname as Page;
      }
      return "404";
    }
  }
  return "home";
}

function getInitialGalleryFilter(): string {
  if (typeof window !== "undefined") {
    const params = new URLSearchParams(window.location.search);
    return params.get("filter") || "All";
  }
  return "All";
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState<Page>(getInitialPage);
  const [isDyslexic, setIsDyslexic] = useState(false);
  const [galleryFilter, setGalleryFilter] = useState(getInitialGalleryFilter);
  const [pageLoading, setPageLoading] = useState(false);

  // Sync with browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const p = getInitialPage();
      const f = getInitialGalleryFilter();
      setPage(p);
      setGalleryFilter(f);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Wrap setPage to reset gallery filter when navigating to gallery from nav unless a filter is provided
  const handleSetPage = (p: Page, explicitGalleryFilter?: string) => {
    if (p === "gallery") {
      setGalleryFilter(explicitGalleryFilter ?? "All");
    }
    const url = new URL(window.location.href);
    if (p === "home") {
      url.searchParams.delete("page");
      url.searchParams.delete("filter");
    } else {
      url.searchParams.set("page", p);
      if (p === "gallery" && explicitGalleryFilter && explicitGalleryFilter !== "All") {
        url.searchParams.set("filter", explicitGalleryFilter);
      } else if (p !== "gallery") {
        url.searchParams.delete("filter");
      }
    }
    window.history.pushState(null, "", url.toString());

    if (p !== page) {
      setPageLoading(true);
      setPage(p);
      setTimeout(() => {
        setPageLoading(false);
      }, 300);
    }
  };

  const handleGalleryFilterChange = (filter: string) => {
    setGalleryFilter(filter);
    const url = new URL(window.location.href);
    if (filter && filter !== "All") {
      url.searchParams.set("filter", filter);
    } else {
      url.searchParams.delete("filter");
    }
    window.history.pushState(null, "", url.toString());
  };

  useEffect(() => {
    document.documentElement.classList.toggle("dyslexia-mode", isDyslexic);
  }, [isDyslexic]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page]);

  const toggleDyslexic = () => setIsDyslexic(d => !d);

  // Navigate to gallery with a specific event filter pre-selected
  const viewGalleryWithFilter = (filter: string) => {
    handleSetPage("gallery", filter);
  };

  const content = {
    home: (
      <Skeleton name="page-home" loading={pageLoading}>
        <Home setPage={handleSetPage} />
      </Skeleton>
    ),
    about: (
      <Skeleton name="page-about" loading={pageLoading}>
        <About />
      </Skeleton>
    ),
    timeline: (
      <Skeleton name="page-timeline" loading={pageLoading}>
        <Timeline onViewGallery={viewGalleryWithFilter} />
      </Skeleton>
    ),
    gallery: (
      <Skeleton name="page-gallery" loading={pageLoading}>
        <Gallery activeFilter={galleryFilter} setActiveFilter={handleGalleryFilterChange} />
      </Skeleton>
    ),
    join: (
      <Skeleton name="page-join" loading={pageLoading}>
        <JoinUs />
      </Skeleton>
    ),
    "404": (
      <Skeleton name="page-404" loading={pageLoading}>
        <NotFound setPage={handleSetPage} />
      </Skeleton>
    ),
    tos: (
      <Skeleton name="page-tos" loading={pageLoading}>
        <TermsOfService setPage={handleSetPage} />
      </Skeleton>
    ),
    privacy: (
      <Skeleton name="page-privacy" loading={pageLoading}>
        <PrivacyPolicy setPage={handleSetPage} />
      </Skeleton>
    ),
    cancellation: (
      <Skeleton name="page-cancellation" loading={pageLoading}>
        <CancellationPolicy setPage={handleSetPage} />
      </Skeleton>
    ),
    "no-refund": (
      <Skeleton name="page-no-refund" loading={pageLoading}>
        <NoRefundPolicy setPage={handleSetPage} />
      </Skeleton>
    ),
    contact: (
      <Skeleton name="page-contact" loading={pageLoading}>
        <ContactUs setPage={handleSetPage} />
      </Skeleton>
    ),
  }[page] || (
    <Skeleton name="page-404" loading={pageLoading}>
      <NotFound setPage={handleSetPage} />
    </Skeleton>
  );

  return (
    <LazyMotion features={domAnimation}>
      <div className="min-h-screen bg-background text-text-main flex flex-col font-body">
      <Nav page={page} setPage={handleSetPage} isDyslexic={isDyslexic} toggleDyslexic={toggleDyslexic} />
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <m.div
            key={page}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            {content}
          </m.div>
        </AnimatePresence>
      </main>
      <Footer setPage={handleSetPage} />
      </div>
    </LazyMotion>
  );
}

