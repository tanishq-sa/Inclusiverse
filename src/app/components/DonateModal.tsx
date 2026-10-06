import React, { useState, useMemo } from "react";
import { X, Heart, IndianRupee, Sparkles, ArrowLeft } from "lucide-react";
import { m, AnimatePresence } from "motion/react";

const PRESET_AMOUNTS = [50, 100, 200, 500, 1000];

const UPI_BASE =
  "upi://pay?cu=INR&mc=7392&mode=19&pa=ashish773470.rzp@rxairtel&tn=Payment%20To%20Inclusiverse&tr=TWG19Fmo4sGnCVqrv2";

function buildQrUrl(amount: number): string {
  const upiUrl = `${UPI_BASE}&am=${amount.toFixed(2)}`;
  const encoded = encodeURIComponent(upiUrl);
  return `https://linktoqr.tanishqsa.dev/api/qr?text=${encoded}&size=400&fg=1A1A2E&bg=FFFFFF&ecl=H&format=png&margin=2`;
}

export function DonateModal({ onClose }: Readonly<{ onClose: () => void }>) {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(100);
  const [customAmount, setCustomAmount] = useState("");
  const [isCustom, setIsCustom] = useState(false);
  const [step, setStep] = useState<"amount" | "qr">("amount");

  const activeAmount = isCustom
    ? parseFloat(customAmount) || 0
    : selectedAmount ?? 0;

  const qrUrl = useMemo(
    () => (activeAmount > 0 ? buildQrUrl(activeAmount) : ""),
    [activeAmount],
  );

  const handlePreset = (amt: number) => {
    setIsCustom(false);
    setSelectedAmount(amt);
    setCustomAmount("");
  };

  const handleCustomFocus = () => {
    setIsCustom(true);
    setSelectedAmount(null);
  };

  const handlePay = () => {
    if (activeAmount > 0) {
      setStep("qr");
    }
  };

  const handleBack = () => {
    setStep("amount");
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <m.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full relative shadow-2xl border border-gray-100 flex flex-col items-center max-h-[90vh] overflow-y-auto"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-text-main hover:bg-gray-100 rounded-full transition-colors z-10 cursor-pointer"
          aria-label="Close donation modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Back Button (QR step only) */}
        {step === "qr" && (
          <button
            type="button"
            onClick={handleBack}
            className="absolute top-4 left-4 p-2 text-gray-400 hover:text-text-main hover:bg-gray-100 rounded-full transition-colors z-10 cursor-pointer"
            aria-label="Go back to amount selection"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}

        {/* Header */}
        <div className="text-center mb-5 w-full">
          <m.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
            className="w-14 h-14 bg-white border border-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3 p-2 shadow-sm ring-4 ring-gray-50"
          >
            <img
              src="/inclusiverse-logo.png"
              alt="Inclusiverse"
              className="w-10 h-10 object-contain"
            />
          </m.div>
          <h3 className="text-2xl font-display font-bold text-text-main mb-1">
            Support Our Cause
          </h3>
          <p className="text-gray-500 text-sm">
            {step === "amount"
              ? "Choose an amount to donate via UPI"
              : `Scan to pay ₹${activeAmount.toLocaleString("en-IN")}`}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {/* ───── STEP 1: Amount Selection ───── */}
          {step === "amount" && (
            <m.div
              key="step-amount"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="w-full flex flex-col items-center"
            >
              {/* Preset Amounts */}
              <div className="w-full mb-5">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2.5 text-center">
                  Select Amount
                </p>
                <div className="grid grid-cols-3 gap-2.5">
                  {PRESET_AMOUNTS.map((amt) => {
                    const active = !isCustom && selectedAmount === amt;
                    return (
                      <m.button
                        key={amt}
                        type="button"
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => handlePreset(amt)}
                        className={`relative py-3 rounded-xl font-semibold text-sm transition-all duration-200 cursor-pointer border ${active
                            ? "bg-primary text-white border-primary shadow-lg shadow-primary/25"
                            : "bg-gray-50 text-gray-700 border-gray-200 hover:border-primary/40 hover:bg-primary/5"
                          }`}
                      >
                        <span className="flex items-center justify-center gap-0.5">
                          <IndianRupee className="w-3.5 h-3.5" />
                          {amt.toLocaleString("en-IN")}
                        </span>
                      </m.button>
                    );
                  })}

                  {/* Custom Amount */}
                  <div
                    className={`relative rounded-xl border transition-all duration-200 ${isCustom
                        ? "border-primary bg-primary/5 shadow-lg shadow-primary/10 ring-1 ring-primary/30"
                        : "border-gray-200 bg-gray-50 hover:border-primary/40"
                      }`}
                  >
                    <div className="flex items-center px-3 py-1.5 gap-1">
                      <Sparkles
                        className={`w-3.5 h-3.5 flex-shrink-0 ${isCustom ? "text-primary" : "text-gray-400"
                          }`}
                      />
                      <input
                        type="number"
                        min="1"
                        placeholder="Custom"
                        value={customAmount}
                        onFocus={handleCustomFocus}
                        onChange={(e) => {
                          setIsCustom(true);
                          setSelectedAmount(null);
                          setCustomAmount(e.target.value);
                        }}
                        className="w-full bg-transparent text-sm font-semibold text-gray-700 placeholder:text-gray-400 outline-none py-1.5 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Selected Amount Display */}
              {activeAmount > 0 && (
                <m.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="w-full bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 rounded-2xl p-4 mb-5 text-center"
                >
                  <p className="text-xs text-gray-500 mb-1">You're donating</p>
                  <p className="text-3xl font-display font-bold text-primary flex items-center justify-center gap-1">
                    <IndianRupee className="w-6 h-6" />
                    {activeAmount.toLocaleString("en-IN")}
                  </p>
                </m.div>
              )}

              {/* Collector Disclosure */}
              <div className="bg-surface/90 border border-gray-200/80 rounded-xl p-3 mb-5 w-full text-center shadow-xs">
                <p className="text-xs font-semibold text-gray-800 flex items-center justify-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 fill-primary text-primary flex-shrink-0" />
                  <span>
                    Ashish is collecting money on behalf of Inclusiverse
                  </span>
                </p>
              </div>

              {/* Pay Button */}
              <m.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handlePay}
                disabled={activeAmount <= 0}
                className={`w-full py-3.5 rounded-2xl font-semibold text-base transition-all shadow-lg cursor-pointer ${activeAmount > 0
                    ? "bg-primary hover:bg-primary-hover text-white shadow-primary/25"
                    : "bg-gray-200 text-gray-400 shadow-none cursor-not-allowed"
                  }`}
              >
                {activeAmount > 0 ? (
                  <span className="flex items-center justify-center gap-1.5">
                    Pay <IndianRupee className="w-4 h-4" />
                    {activeAmount.toLocaleString("en-IN")}
                  </span>
                ) : (
                  "Select an amount"
                )}
              </m.button>
            </m.div>
          )}

          {/* ───── STEP 2: QR Code ───── */}
          {step === "qr" && (
            <m.div
              key="step-qr"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.25 }}
              className="w-full flex flex-col items-center"
            >
              {/* Amount Badge */}
              <m.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-full px-5 py-2 mb-5"
              >
                <p className="text-lg font-bold text-primary flex items-center gap-1">
                  <IndianRupee className="w-4.5 h-4.5" />
                  {activeAmount.toLocaleString("en-IN")}
                </p>
              </m.div>

              {/* QR Code */}
              <m.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.15, type: "spring", stiffness: 200, damping: 20 }}
                className="relative rounded-2xl overflow-hidden bg-white p-3 border border-gray-100 shadow-md mb-4"
              >
                <img
                  src={qrUrl}
                  alt={`UPI QR code for ₹${activeAmount}`}
                  className="w-[220px] h-[220px] sm:w-[260px] sm:h-[260px] object-contain"
                />
              </m.div>

              {/* Instructions */}
              <m.p
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="text-sm text-gray-500 mb-5 text-center"
              >
                Open any UPI app and scan this code
              </m.p>

              {/* Collector Disclosure */}
              <div className="bg-surface/90 border border-gray-200/80 rounded-xl p-3 mb-5 w-full text-center shadow-xs">
                <p className="text-xs font-semibold text-gray-800 flex items-center justify-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 fill-primary text-primary flex-shrink-0" />
                  <span>
                    Ashish is collecting money on behalf of Inclusiverse
                  </span>
                </p>
              </div>

              {/* Done Button */}
              <m.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="w-full bg-primary hover:bg-primary-hover text-white py-3.5 rounded-2xl font-semibold text-base transition-colors shadow-lg shadow-primary/25 cursor-pointer"
              >
                Done
              </m.button>
            </m.div>
          )}
        </AnimatePresence>
      </m.div>
    </div>
  );
}
