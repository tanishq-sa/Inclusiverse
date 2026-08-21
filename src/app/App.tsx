import React, { useState, useEffect, useRef } from "react";
import { Heart, Menu, X, Accessibility, ArrowRight, ChevronRight, PlayCircle, Camera, FileText, ChevronDown, ChevronUp, GraduationCap, Users, MapPin, Mail, Instagram, Linkedin } from "lucide-react";
import { motion, AnimatePresence, Variants } from "motion/react";
import { ImageWithFallback } from "./components/figma/ImageWithFallback";
import GALLERY_PHOTOS from "../data/photos.json";

// ─── Simple router ────────────────────────────────────────────────────────────
type Page = "home" | "about" | "timeline" | "gallery" | "join";

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
        <motion.div
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
          <button onClick={() => setPage("home")} className="flex items-center gap-2 group focus:outline-none">
            <motion.div
              whileHover={{ rotate: 10, scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="bg-primary text-white p-2 rounded-xl shadow-sm"
            >
              <Heart className="w-6 h-6" />
            </motion.div>
            <span className="font-display font-bold text-2xl tracking-tight text-primary">Inclusiverse</span>
          </button>

          <div className="hidden md:flex items-center space-x-8">
            {link("Home", "home")}
            {link("About", "about")}
            {link("Timeline", "timeline")}
            {link("Gallery", "gallery")}
            <motion.button
              onClick={() => setPage("join")}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="bg-primary hover:bg-primary-hover text-white px-6 py-2.5 rounded-full font-medium transition-colors shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-focus focus:ring-offset-2"
            >
              Join Us
            </motion.button>
          </div>

          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 text-text-main focus:outline-none">
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden md:hidden bg-white border-b border-gray-100 px-4 py-4 space-y-4"
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
          </motion.div>
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
            <button onClick={() => setPage("home")} className="flex items-center gap-2 group text-left focus:outline-none">
              <div className="bg-primary text-white p-2 rounded-xl shadow-sm">
                <Heart className="w-5 h-5" />
              </div>
              <span className="font-display font-bold text-2xl tracking-tight text-white">Inclusiverse</span>
            </button>
            <p className="text-gray-400 max-w-md text-sm leading-relaxed">
              A student-led initiative dedicated to creating joyful, barrier-free, and empowering experiences for children with disabilities. Dignity over sympathy, community over charity.
            </p>
            <div className="flex items-center gap-2 text-xs text-gray-400 bg-white/5 py-1.5 px-3 rounded-full w-fit border border-white/10">
              <MapPin className="w-3.5 h-3.5 text-primary" />
              <span>Christ University, Lavasa Campus</span>
            </div>
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
                    className="hover:text-primary hover:translate-x-1 transition-all duration-200 inline-flex items-center gap-1.5 text-left"
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
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white/5 hover:bg-primary/20 border border-white/10 hover:border-primary/40 flex items-center justify-center text-gray-300 hover:text-white transition-all"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white/5 hover:bg-primary/20 border border-white/10 hover:border-primary/40 flex items-center justify-center text-gray-300 hover:text-white transition-all"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <button
                onClick={() => setPage("join")}
                className="px-4 py-2 text-xs font-semibold bg-primary hover:bg-primary-hover text-white rounded-xl transition-all shadow-sm"
              >
                Volunteer Now
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar with Credits */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} Inclusiverse. All rights reserved.</p>
          <div className="flex items-center gap-1.5 text-gray-400 font-medium bg-white/5 px-3.5 py-1.5 rounded-full border border-white/5">
            <span>Designed & Developed by</span>
            <span className="text-white font-semibold flex items-center gap-1">
              Inclusiverse Team <Heart className="w-3 h-3 text-primary inline fill-primary" />
            </span>
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
      description: "Donation to Inclusiverse",
      image: "", // Add your logo URL here
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
        purpose: "Donation",
      },
      theme: {
        color: "#6366f1",
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
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white rounded-3xl p-8 max-w-md w-full relative shadow-2xl text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
            className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </motion.div>
          <h3 className="text-2xl font-display font-bold text-text-main mb-2">Thank You! 🎉</h3>
          <p className="text-gray-600 mb-6">
            Your donation of <span className="font-bold text-primary">₹{finalAmount.toLocaleString("en-IN")}</span> has been received. You're making a real difference!
          </p>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onClose}
            className="bg-primary hover:bg-primary-hover text-white px-8 py-3 rounded-full font-medium transition-colors"
          >
            Close
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // Error view
  if (paymentStatus === "error") {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
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
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setPaymentStatus("idle")}
              className="bg-primary hover:bg-primary-hover text-white px-8 py-3 rounded-full font-medium transition-colors"
            >
              Try Again
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onClose}
              className="bg-gray-100 hover:bg-gray-200 text-text-main px-8 py-3 rounded-full font-medium transition-colors"
            >
              Cancel
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Main donate form
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="bg-white rounded-3xl p-8 max-w-md w-full relative shadow-2xl"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-text-main hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
            className="w-16 h-16 bg-gradient-to-br from-primary/20 to-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-4"
          >
            <Heart className="w-8 h-8 text-primary" />
          </motion.div>
          <h3 className="text-2xl font-display font-bold text-text-main mb-1">Support Our Cause</h3>
          <p className="text-gray-500 text-sm">Every contribution makes a difference</p>
        </div>

        {/* Preset amount grid + Custom Button */}
        <div className="grid grid-cols-3 gap-2.5 mb-5">
          {PRESET_AMOUNTS.map((preset) => (
            <motion.button
              key={preset}
              type="button"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => handlePresetClick(preset)}
              className={`py-3 rounded-xl font-semibold text-sm transition-all border-2 ${
                selectedPreset === preset
                  ? "bg-primary text-white border-primary shadow-md shadow-primary/25"
                  : "bg-gray-50 text-text-main border-transparent hover:border-primary/30 hover:bg-primary/5"
              }`}
            >
              ₹{preset.toLocaleString("en-IN")}
            </motion.button>
          ))}

          {/* Custom option button */}
          <motion.button
            type="button"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={handleCustomClick}
            className={`py-3 rounded-xl font-semibold text-sm transition-all border-2 ${
              selectedPreset === "custom"
                ? "bg-primary text-white border-primary shadow-md shadow-primary/25"
                : "bg-gray-50 text-text-main border-transparent hover:border-primary/30 hover:bg-primary/5"
            }`}
          >
            Custom
          </motion.button>
        </div>

        {/* Custom amount input field - only shown when Custom is selected */}
        <AnimatePresence>
          {selectedPreset === "custom" && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: "auto", marginBottom: 20 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold text-lg">₹</span>
                <input
                  ref={inputRef}
                  type="text"
                  inputMode="numeric"
                  placeholder="Enter custom amount (min ₹100)"
                  value={customAmount}
                  onChange={handleCustomAmountChange}
                  className={`w-full pl-10 pr-10 py-3.5 bg-gray-50 border-2 rounded-xl text-lg font-medium text-text-main placeholder:text-gray-400 focus:outline-none transition-all ${
                    customAmount && parseInt(customAmount, 10) < 100
                      ? "border-amber-500 ring-2 ring-amber-500/20"
                      : "border-primary ring-2 ring-primary/20 bg-white"
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
            </motion.div>
          )}
        </AnimatePresence>

        {/* Payment methods info */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
            UPI
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
            Cards
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
            Wallets
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
            Netbanking
          </div>
        </div>

        {/* Pay button */}
        <motion.button
          whileHover={finalAmount >= 100 ? { scale: 1.02 } : {}}
          whileTap={finalAmount >= 100 ? { scale: 0.98 } : {}}
          onClick={handlePayment}
          disabled={finalAmount < 100 || isProcessing}
          className={`w-full py-4 rounded-xl font-semibold text-lg transition-all ${
            finalAmount >= 100
              ? "bg-gradient-to-r from-primary to-indigo-500 hover:from-primary-hover hover:to-indigo-600 text-white shadow-lg shadow-primary/25 cursor-pointer"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          {isProcessing ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Processing...
            </span>
          ) : finalAmount >= 100 ? (
            `Donate ₹${finalAmount.toLocaleString("en-IN")}`
          ) : finalAmount > 0 ? (
            "Minimum donation is ₹100"
          ) : (
            "Select or enter an amount"
          )}
        </motion.button>

        {/* Secure payment note */}
        <div className="flex items-center justify-center gap-1.5 mt-4">
          <svg className="w-3.5 h-3.5 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM12 17c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1s3.1 1.39 3.1 3.1v2z"/>
          </svg>
          <span className="text-xs text-gray-400">Secured by Razorpay</span>
        </div>
      </motion.div>
    </div>
  );
}

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
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.5, 0.8, 0.5],
            x: [0, 20, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none"
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="max-w-2xl"
            >
              <motion.h1 variants={fadeUpItem} className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold text-text-main leading-tight mb-6">
                Every Child Deserves <span className="text-primary">Joy</span>,{" "}
                <span className="text-primary">Friendship</span>, and Opportunity.
              </motion.h1>
              <motion.p variants={fadeUpItem} className="text-lg sm:text-xl text-gray-700 mb-10 leading-relaxed max-w-xl">
                Inclusiverse is a student-led initiative creating meaningful experiences for children with
                disabilities through sports, inclusion, creativity, and compassion.
              </motion.p>
              <motion.div variants={fadeUpItem} className="flex flex-wrap gap-4">
                <motion.button
                  onClick={() => setPage("join")}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className="bg-primary hover:bg-primary-hover text-white px-8 py-4 rounded-full font-medium text-lg transition-colors shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-focus focus:ring-offset-2 flex items-center gap-2 group"
                >
                  Join Us Today
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setPage("timeline")}
                  className="bg-white hover:bg-gray-50 text-text-main border border-gray-200 px-8 py-4 rounded-full font-medium text-lg transition-colors focus:outline-none focus:ring-2 focus:ring-focus focus:ring-offset-2 flex items-center gap-2 shadow-sm"
                >
                  <PlayCircle className="w-5 h-5 text-gray-500" />
                  Our Journey
                </motion.button>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl relative group">
                <AnimatePresence mode="sync">
                  {GALLERY_PHOTOS.length > 0 && (
                    <motion.div
                      key={currentImageIndex}
                      initial={{ opacity: 0, scale: 1.1 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute inset-0"
                    >
                      <motion.div
                        animate={{ scale: [1, 1.08] }}
                        transition={{ duration: 5, ease: "easeOut" }}
                        className="w-full h-full"
                      >
                        <ImageWithFallback
                          src={GALLERY_PHOTOS[currentImageIndex].src}
                          alt={GALLERY_PHOTOS[currentImageIndex].alt}
                          className="w-full h-full object-cover"
                        />
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent z-10 pointer-events-none" />
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="absolute bottom-6 left-6 right-6 z-20"
                >
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
            }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {[
              { label: "Volunteers", value: "250+" },
              { label: "Events", value: "15+" },
              { label: "Smiles", value: "500+" },
              { label: "Partner Schools", value: "8+" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
                }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-display font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="max-w-2xl"
            >
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Shared Experiences</h2>
              <p className="text-gray-600 text-lg">Meaningful moments created through sports, art, and community inclusion.</p>
            </motion.div>
            <motion.button
              whileHover={{ x: 4 }}
              onClick={() => setPage("timeline")}
              className="hidden md:flex items-center gap-2 text-primary font-medium hover:text-primary-hover transition-colors"
            >
              View timeline <ChevronRight className="w-4 h-4" />
            </motion.button>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
            }}
            className="grid md:grid-cols-3 gap-8"
          >
            {[
              { title: "Unified Skating Championship", src: "https://images.unsplash.com/photo-1607453998774-d533f65dac99?w=800&q=80", alt: "Two children sitting together and smiling" },
              { title: "Creative Arts Fun Day", src: "https://images.unsplash.com/photo-1524503033411-c9566986fc8f?w=800&q=80", alt: "Two boys making wacky faces and having fun" },
              { title: "Inclusive Sports Meet", src: "https://images.unsplash.com/photo-1469406396016-013bfae5d83e?w=800&q=80", alt: "Children playing and cheering outdoors" },
            ].map((p, i) => (
              <motion.div
                key={i}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
                }}
                whileHover={{ y: -8 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 group cursor-pointer flex flex-col h-full"
              >
                <div className="p-8 flex flex-col flex-grow">
                  <h3 className="text-xl font-display font-bold mb-4 group-hover:text-primary transition-colors">{p.title}</h3>
                  <div className="flex items-center gap-2 text-primary font-medium text-sm mt-auto">
                    Read story <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
          <button onClick={() => setPage("timeline")} className="md:hidden mt-8 w-full flex justify-center items-center gap-2 text-primary font-medium">
            View timeline <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      <section className="py-24 bg-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="inline-block mb-8"
          >
            <Heart className="w-16 h-16 text-primary mx-auto opacity-30" />
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">Ready to make a difference?</h2>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Join our community of students dedicated to building lasting friendships and creating inclusive spaces.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="bg-primary hover:bg-primary-hover text-white px-8 py-4 rounded-full font-medium text-lg transition-colors shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-focus focus:ring-offset-2"
            >
              Become a Volunteer
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setShowDonateModal(true)}
              className="relative bg-surface hover:bg-gray-200 text-text-main px-8 py-4 rounded-full font-medium text-lg transition-colors focus:outline-none focus:ring-2 focus:ring-focus focus:ring-offset-2"
            >
              Donate Now
            </motion.button>
          </div>
        </motion.div>
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
        <motion.div
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
        </motion.div>
      </section>

      {/* Introduction Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
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
          </motion.div>
        </div>
      </section>

      {/* Our Purpose Section */}
      <section className="py-20 bg-surface">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
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
          </motion.div>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
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
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex gap-4 items-start"
                >
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <p className="text-gray-700 leading-relaxed">{item}</p>
                </motion.div>
              ))}
            </div>

            <p className="text-gray-700 leading-relaxed text-lg italic bg-surface p-6 rounded-2xl border-l-4 border-primary">
              From the <span className="font-semibold">State Unified Championship</span> and inclusive campus activities to our outreach initiatives and collaborations with organisations such as <span className="font-semibold">Special Olympics Bharat Maharashtra</span> and schools supporting specially-abled children, our work is rooted in participation, connection, and impact.
            </p>
          </motion.div>
        </div>
      </section>

      {/* More Than Inclusion Section */}
      <section className="py-20 bg-surface">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
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
          </motion.div>
        </div>
      </section>

      {/* Our Community Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
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
          </motion.div>
        </div>
      </section>

      {/* Our Vision Section */}
      <section className="py-24 bg-gradient-to-b from-surface to-primary/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
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
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-primary text-white text-3xl md:text-4xl font-display font-bold py-8 px-6 rounded-3xl shadow-lg mb-12"
            >
              Yes. You do.
            </motion.div>
            <p className="text-gray-600 text-lg italic">
              <span className="font-semibold text-primary">Inclusiverse</span> — Different abilities. Different stories. One community.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

// ─── Timeline ─────────────────────────────────────────────────────────────────
const MILESTONES = [
  {
    year: "2023",
    title: "Beyond Barriers",
    tagline: "Where it all began.",
    description: "Beyond Barriers marked the beginning of the Inclusiverse journey. It was built around the belief that differences should never become limitations and that inclusion begins when we choose to understand one another.\n\nThe initiative laid the foundation for what Inclusiverse would become—a student-led community committed to creating opportunities for participation, connection, and equal opportunity.",
    closing: "Our first step beyond the barriers that divide us.",
    reportUrl: "https://docs.google.com/document/d/1gtp75s_DaImsIL1ZtUwk366AknWk0Icp3nX8G3GE9Uc/edit?usp=drive_link",
    momentsUrl: "https://drive.google.com/drive/folders/1Pv_d6dgGquGrKtn2ZBWHK7-8TRfjYKz4?usp=drive_link"
  },
  {
    year: "2024",
    title: "State Unified Championship",
    tagline: "Bringing people together through sport.",
    description: "The State Unified Championship brought athletes with and without disabilities together on the same field, united by the spirit of sport.\n\nMore than a championship, it became a celebration of teamwork, friendship, determination, and participation. It showed us how sport can break down barriers and create connections that go far beyond the game.",
    closing: "Different abilities. One team. One spirit."
  },
  {
    year: "2025",
    title: "Emerging InClusiWarriors",
    tagline: "Celebrating participation.",
    description: "Emerging InClusiWarriors created an opportunity for specially-abled students to come to campus, participate in fun activities, and experience a space where they could simply be themselves.\n\nThe focus was never just on competition. It was about building confidence, encouraging interaction, creating friendships, and celebrating every individual's ability to participate.",
    closing: "Because every participant is a warrior in their own way."
  },
  {
    year: "2025",
    title: "InclusiAI",
    tagline: "Innovation with inclusion at its core.",
    description: "With InclusiAI, we explored how technology and innovation can contribute to a more inclusive and accessible world.\n\nThe initiative brought together creativity, problem-solving, and technology, encouraging students to look at real-world challenges through an inclusive lens and imagine solutions that can make a difference.",
    closing: "Ideas that innovate. Solutions that include."
  },
  {
    year: "2026",
    title: "Compassion in Action — Asha Bhavan",
    tagline: "Taking inclusion beyond the campus.",
    description: "Our visit to Asha Bhavan Special School, Satara marked another meaningful step in our journey.\n\nThrough interactions, activities, and shared experiences, students had the opportunity to connect with the children and understand inclusion through real human connections. The experience reminded us that sometimes the most meaningful impact comes from the simplest things—being present, listening, sharing, and caring.",
    closing: "Inclusion begins with empathy and comes alive through action."
  },
  {
    year: "2026",
    title: "Take a Stand",
    tagline: "Giving every voice a platform.",
    description: "Take a Stand created a space for students to express their perspectives, engage with important issues, and confidently make their voices heard.\n\nFor us, inclusion also means ensuring that people have the freedom and opportunity to speak, question, share, and be heard.",
    closing: "Because every voice deserves a space."
  },
];

function MilestoneCard({ milestone, index }: { milestone: typeof MILESTONES[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative flex gap-6 md:gap-10"
    >
      <div className="flex flex-col items-center">
        <motion.div
          whileHover={{ scale: 1.1 }}
          className="bg-primary text-white text-sm font-bold px-4 py-2 rounded-full shadow-md whitespace-nowrap z-10 font-display"
        >
          {milestone.year}
        </motion.div>
        {index < MILESTONES.length - 1 && <div className="flex-1 w-px bg-gray-300 mt-4 mb-4" style={{ minHeight: "200px" }} />}
      </div>
      <div className="flex-1 bg-white rounded-3xl shadow-sm border border-gray-200 p-8 mb-8 hover:shadow-lg transition-shadow">
        <div className="mb-4">
          <h3 className="text-2xl md:text-3xl font-display font-bold text-text-main mb-2">{milestone.title}</h3>
          <p className="text-primary font-semibold italic text-lg">{milestone.tagline}</p>
        </div>
        <div className="space-y-4">
          {milestone.description.split('\n\n').map((para, i) => (
            <p key={i} className="text-gray-700 leading-relaxed">{para}</p>
          ))}
        </div>
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-primary font-semibold text-lg italic">{milestone.closing}</p>
        </div>
        {(milestone.reportUrl || milestone.momentsUrl) && (
          <div className="mt-6 flex flex-wrap gap-3">
            {milestone.reportUrl && (
              <a
                href={milestone.reportUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white font-semibold text-sm px-4 py-2 rounded-full transition-all hover:shadow-md focus:outline-none focus:ring-2 focus:ring-focus focus:ring-offset-2"
              >
                <FileText className="w-4 h-4" />
                Report
              </a>
            )}
            {milestone.momentsUrl && (
              <a
                href={milestone.momentsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-surface hover:bg-gray-200 text-text-main font-semibold text-sm px-4 py-2 rounded-full transition-all hover:shadow-md focus:outline-none focus:ring-2 focus:ring-focus focus:ring-offset-2"
              >
                <Camera className="w-4 h-4" />
                Moments Captured
              </a>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

function Timeline() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-surface py-20">
        <motion.div
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
        </motion.div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {MILESTONES.map((milestone, i) => (
            <MilestoneCard key={i} milestone={milestone} index={i} />
          ))}
          <div className="flex justify-start pl-5 mt-8">
            <motion.div
              animate={{ scale: [1, 1.4, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-3 h-3 rounded-full bg-primary"
            />
          </div>
        </div>
      </section>

      {/* Conclusion Section */}
      <section className="py-24 bg-gradient-to-b from-white to-surface">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
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
            <motion.p
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl md:text-2xl font-display font-bold text-primary"
            >
              The next chapter of Inclusiverse is waiting to be written—<span className="text-text-main">with you.</span>
            </motion.p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

// ─── Gallery ──────────────────────────────────────────────────────────────────


function Gallery() {
  const [lightbox, setLightbox] = useState<typeof GALLERY_PHOTOS[0] | null>(null);

  return (
    <div>
      <section className="bg-surface py-20">
        <motion.div
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
        </motion.div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            layout
            className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5"
          >
            <AnimatePresence mode="popLayout">
              {GALLERY_PHOTOS.map((photo, i) => (
                <motion.button
                  layout
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                  transition={{ duration: 0.4, delay: i * 0.03 }}
                  key={photo.src}
                  onClick={() => setLightbox(photo)}
                  className="w-full break-inside-avoid rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group relative block text-left"
                >
                  <img src={photo.src} alt={photo.alt} loading="lazy" className="w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <span className="text-white text-sm font-medium">{photo.caption}</span>
                    <span className="ml-2 bg-primary text-white text-xs px-2 py-0.5 rounded-full">{photo.cat}</span>
                  </div>
                </motion.button>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <motion.div
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Join Us Page ─────────────────────────────────────────────────────────────
function JoinUs() {
  return (
    <div className="py-20 lg:py-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto px-4 text-center"
      >
        <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">Join Inclusiverse</h1>
        <p className="text-xl text-gray-600 mb-12">
          Choose how you want to make an impact. Are you a student at Christ University Lavasa, or are you joining us from outside?
        </p>
        <div className="flex flex-col md:flex-row gap-6 justify-center">
          <motion.a
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            href="#"
            className="flex-1 bg-surface hover:bg-gray-100 border-2 border-gray-200 p-8 rounded-3xl flex flex-col items-center gap-4 transition-all"
          >
            <div className="bg-white p-5 rounded-full shadow-sm mb-2 text-primary">
              <GraduationCap className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold">Christ University Lavasa</h3>
            <p className="text-gray-600">Join our on-campus chapter and participate in local events.</p>
          </motion.a>
          
          <motion.a
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            href="#"
            className="flex-1 bg-primary text-white p-8 rounded-3xl flex flex-col items-center gap-4 shadow-lg hover:shadow-xl transition-all"
          >
            <div className="bg-white/20 p-5 rounded-full mb-2">
              <Users className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold">Outside Volunteer</h3>
            <p className="text-white/90">Join our global network of volunteers and supporters.</p>
          </motion.a>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState<Page>("home");
  const [isDyslexic, setIsDyslexic] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dyslexia-mode", isDyslexic);
  }, [isDyslexic]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page]);

  const toggleDyslexic = () => setIsDyslexic(d => !d);

  const content = {
    home: <Home setPage={setPage} />,
    about: <About />,
    timeline: <Timeline />,
    gallery: <Gallery />,
    join: <JoinUs />,
  }[page];

  return (
    <div className="min-h-screen bg-background text-text-main flex flex-col font-body">
      <Nav page={page} setPage={setPage} isDyslexic={isDyslexic} toggleDyslexic={toggleDyslexic} />
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={page}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            {content}
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer setPage={setPage} />
    </div>
  );
}

