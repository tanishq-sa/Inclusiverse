import React from "react";
import { X, Heart } from "lucide-react";
import { m } from "motion/react";

export function DonateModal({ onClose }: Readonly<{ onClose: () => void }>) {
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
        className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full relative shadow-2xl border border-gray-100 flex flex-col items-center"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-text-main hover:bg-gray-100 rounded-full transition-colors z-10 cursor-pointer"
          aria-label="Close donation modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-5 w-full">
          <m.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
            className="w-14 h-14 bg-white border border-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3 p-2 shadow-sm ring-4 ring-gray-50"
          >
            <img src="/inclusiverse-logo.png" alt="Inclusiverse" className="w-10 h-10 object-contain" />
          </m.div>
          <h3 className="text-2xl font-display font-bold text-text-main mb-1">Support Our Cause</h3>
          <p className="text-gray-500 text-sm">Scan the QR code to donate</p>
        </div>

        <div className="w-full rounded-2xl overflow-hidden mb-6 flex justify-center">
          <img
            src="/RazorPayQR.jpg"
            alt="Donate QR Code"
            className="w-full max-w-[280px] h-auto object-contain drop-shadow-md"
          />
        </div>

        {/* Collector Disclosure */}
        <div className="bg-surface/90 border border-gray-200/80 rounded-xl p-3 mb-5 w-full text-center shadow-xs">
          <p className="text-xs font-semibold text-gray-800 flex items-center justify-center gap-1.5">
            <Heart className="w-3.5 h-3.5 fill-primary text-primary flex-shrink-0" />
            <span>Ashish is collecting money on behalf of Inclusiverse</span>
          </p>
        </div>

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
    </div>
  );
}
