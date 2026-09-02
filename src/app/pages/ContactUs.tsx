import React from "react";
import { ArrowLeft, Mail, Instagram, Linkedin, MapPin, ChevronRight } from "lucide-react";
import { Page } from "../types";

export function ContactUs({ setPage }: { setPage: (p: Page) => void }) {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="bg-gradient-to-br from-primary/10 via-white to-purple-50 border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <button
            type="button"
            onClick={() => setPage("home")}
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary transition-colors mb-8 group cursor-pointer"
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
          <p className="text-gray-600 text-base leading-relaxed max-w-2xl">
            Have a question about your donation, our events, or our policies? Reach out directly —
            our student team typically responds within 1–2 business days.
          </p>
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
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">
                  Email
                </p>
                <a
                  href="mailto:inclusiverse.lavasa@christuniversity.in"
                  className="text-sm text-primary hover:underline break-all"
                >
                  inclusiverse.lavasa@christuniversity.in
                </a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Instagram className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">
                  Instagram
                </p>
                <a
                  href="https://www.instagram.com/inclusiverse.christuniversity"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline"
                >
                  @inclusiverse.christuniversity
                </a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Linkedin className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">
                  LinkedIn
                </p>
                <a
                  href="https://www.linkedin.com/company/inclusiverse-club"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline"
                >
                  Inclusiverse Club
                </a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">
                  Location
                </p>
                <a
                  href="https://maps.app.goo.gl/kV1XKQ1xFksGbzqU6"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-600 hover:text-primary transition-colors"
                >
                  Christ University, Lavasa Campus
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Donation Queries */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
          <h3 className="font-display font-bold text-text-main mb-3 text-base">Donation Queries?</h3>
          <p className="text-sm text-gray-500 leading-relaxed mb-5">
            For issues related to payments, duplicate transactions, or technical errors with
            Razorpay, please email us directly with your <strong>Razorpay Payment ID</strong> and we
            will get back to you within 2 business days.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(
              [
                "Terms of Service",
                "Privacy Policy",
                "Cancellation Policy",
                "No Refund Policy",
              ] as const
            ).map((label) => {
              const map: Record<string, Page> = {
                "Terms of Service": "tos",
                "Privacy Policy": "privacy",
                "Cancellation Policy": "cancellation",
                "No Refund Policy": "no-refund",
              };
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => setPage(map[label])}
                  className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-primary transition-colors group text-left cursor-pointer"
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
