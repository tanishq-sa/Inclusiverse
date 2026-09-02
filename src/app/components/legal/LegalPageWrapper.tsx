import React from "react";
import { ArrowLeft } from "lucide-react";
import { Page } from "../../types";

export function LegalPageWrapper({
  title,
  subtitle,
  icon,
  children,
  setPage,
}: {
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
            type="button"
            onClick={() => setPage("home")}
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary transition-colors mb-8 group cursor-pointer"
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

export function LegalSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
      <h2 className="text-lg font-display font-bold text-text-main mb-4 pb-3 border-b border-gray-100">
        {title}
      </h2>
      <div className="text-gray-600 text-sm leading-relaxed space-y-3">{children}</div>
    </section>
  );
}
