import React from "react";
import { Heart, ChevronRight, MapPin, ExternalLink, Mail, InstagramIcon, LinkedinIcon } from "lucide-react";
import { Page } from "../types";

export function Footer({ setPage }: Readonly<{ setPage: (p: Page) => void }>) {
  return (
    <footer className="bg-text-main text-white pt-16 pb-12 mt-auto border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-gray-800/80">
          {/* Brand & Mission */}
          <div className="md:col-span-6 space-y-4">
            <button
              type="button"
              onClick={() => setPage("home")}
              className="flex items-center gap-3 group text-left focus:outline-none cursor-pointer"
            >
              <img
                src="/inclusiverse-logo.png"
                alt="Inclusiverse Logo"
                className="w-10 h-10 object-contain drop-shadow-md"
              />
              <span className="font-display font-bold text-2xl tracking-tight text-white">
                Inclusiverse
              </span>
            </button>
            <p className="text-gray-400 max-w-md text-sm leading-relaxed">
              A student-led initiative dedicated to creating joyful, barrier-free, and empowering
              experiences for children with disabilities. Dignity over sympathy, community over
              charity.
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
              {(
                [
                  ["Home", "home"],
                  ["About Us", "about"],
                  ["Our Team", "team"],
                  ["Timeline & Milestones", "timeline"],
                  ["Photo Gallery", "gallery"],
                  ["Join the Movement", "join"],
                ] as [string, Page][]
              ).map(([label, p]) => (
                <li key={p}>
                  <button
                    type="button"
                    onClick={() => setPage(p)}
                    className="hover:text-primary hover:translate-x-1 transition-[color,transform] duration-200 inline-flex items-center gap-1.5 text-left cursor-pointer"
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
                href="mailto:inclusiverse.lavasa@christuniversity.in"
                className="w-10 h-10 rounded-xl bg-white/5 hover:bg-primary/20 border border-white/10 hover:border-primary/40 flex items-center justify-center text-gray-300 hover:text-white transition-colors"
                aria-label="Email Inclusiverse"
                title="inclusiverse.lavasa@christuniversity.in"
              >
                <Mail className="w-4 h-4" />
              </a>
              <a
                href="https://www.instagram.com/inclusiverse.christuniversity"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white/5 hover:bg-primary/20 border border-white/10 hover:border-primary/40 flex items-center justify-center text-gray-300 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a
                href="https://www.linkedin.com/company/inclusiverse-club"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white/5 hover:bg-primary/20 border border-white/10 hover:border-primary/40 flex items-center justify-center text-gray-300 hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <LinkedinIcon className="w-4 h-4" />
              </a>
              <button
                type="button"
                onClick={() => setPage("join")}
                className="px-4 py-2 text-xs font-semibold bg-primary hover:bg-primary-hover text-white rounded-xl transition-colors shadow-sm cursor-pointer"
              >
                Volunteer Now
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar with Credits */}
        <div className="pt-8 border-t border-gray-800/60">
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 mb-4">
            {(
              [
                ["Terms of Service", "tos"],
                ["Privacy Policy", "privacy"],
                ["Cancellation Policy", "cancellation"],
                ["No Refund Policy", "no-refund"],
                ["Contact Us", "contact"],
              ] as [string, Page][]
            ).map(([label, p]) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className="text-xs text-gray-500 hover:text-gray-300 transition-colors underline-offset-2 hover:underline cursor-pointer"
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
