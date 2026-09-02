import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { m, AnimatePresence } from "motion/react";
import { Page } from "../types";

export function Nav({
  page,
  setPage,
  isDyslexic,
  toggleDyslexic,
}: Readonly<{
  page: Page;
  setPage: (p: Page) => void;
  isDyslexic: boolean;
  toggleDyslexic: () => void;
}>) {
  const [menuOpen, setMenuOpen] = useState(false);

  const link = (label: string, target: Page) => (
    <button
      type="button"
      onClick={() => {
        setPage(target);
        setMenuOpen(false);
      }}
      className={`relative text-text-main hover:text-primary transition-colors font-medium py-1 ${
        page === target ? "text-primary font-semibold" : ""
      }`}
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
          <button
            type="button"
            onClick={() => setPage("home")}
            className="flex items-center gap-3 group focus:outline-none"
          >
            <m.img
              src="/inclusiverse-logo.png"
              alt="Inclusiverse Logo"
              whileHover={{ rotate: 8, scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              className="w-12 h-12 object-contain drop-shadow-sm"
            />
            <span className="font-display font-bold text-2xl tracking-tight text-primary">
              Inclusiverse
            </span>
          </button>

          <div className="hidden md:flex items-center space-x-8">
            {link("Home", "home")}
            {link("About", "about")}
            {link("Team", "team")}
            {link("Timeline", "timeline")}
            {link("Gallery", "gallery")}
            <m.button
              onClick={() => setPage("join")}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="bg-primary hover:bg-primary-hover text-white px-6 py-2.5 rounded-full font-medium transition-colors shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-focus focus:ring-offset-2 cursor-pointer"
            >
              Join Us
            </m.button>
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 text-text-main focus:outline-none cursor-pointer"
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          >
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
            {(["home", "about", "team", "timeline", "gallery"] as Page[]).map((p) => {
              const label =
                p === "timeline"
                  ? "Timeline"
                  : p === "gallery"
                  ? "Gallery"
                  : p === "team"
                  ? "Team"
                  : p.charAt(0).toUpperCase() + p.slice(1);
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => {
                    setPage(p);
                    setMenuOpen(false);
                  }}
                  className={`block w-full text-left font-medium capitalize py-1 transition-colors ${
                    page === p ? "text-primary font-bold" : "text-text-main hover:text-primary"
                  }`}
                >
                  {label}
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => {
                setPage("join");
                setMenuOpen(false);
              }}
              className="w-full bg-primary hover:bg-primary-hover text-white px-6 py-2.5 rounded-full font-medium transition-colors shadow-sm cursor-pointer"
            >
              Join Us
            </button>
          </m.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
