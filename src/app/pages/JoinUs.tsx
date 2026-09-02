import React from "react";
import { GraduationCap, Users, ExternalLink, Sparkles, Mail, Instagram, Linkedin, MapPin } from "lucide-react";
import { m } from "motion/react";

const CHRIST_UNIVERSITY_VOLUNTEER_FORM_URL = "https://forms.gle/fEb1WZTyRLXr1mLA9";
const OUTSIDE_VOLUNTEER_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLScwkOV4thGYIzt_I9tnsy6gij6AK2E8byMk1PEB3gQv27_Nwg/viewform?usp=publish-editor";

export function JoinUs() {
  return (
    <div className="py-20 lg:py-32 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <m.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-3xl mx-auto mb-16"
      >
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-text-main mb-5 tracking-tight">
          Join the <span className="text-primary">Movement</span>
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
          Choose how you want to make an impact. Are you a student at Christ University Lavasa, or
          joining our wider global network?
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
              Join our on-campus student chapter. Help organize interactive workshops, inclusive
              sports meets, arts events, and peer support activities.
            </p>
          </div>

          <div className="w-full py-4 px-6 rounded-2xl bg-primary group-hover:bg-primary-hover text-white font-semibold text-base transition-colors shadow-md shadow-primary/25 group-hover:shadow-lg flex items-center justify-center gap-2 group-hover:gap-3">
            <span>Apply via Google Form</span>
            <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
        </m.a>

        {/* Card 2: External Volunteer */}
        <m.a
          href={OUTSIDE_VOLUNTEER_FORM_URL}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ y: -6 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.3 }}
          className="bg-white border-2 border-gray-200/80 hover:border-primary rounded-3xl p-8 sm:p-10 flex flex-col justify-between shadow-sm hover:shadow-xl transition-shadow duration-300 relative group cursor-pointer block text-left"
        >
          <div>
            <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-colors duration-300 shadow-sm">
              <Users className="w-8 h-8" />
            </div>
            <div className="inline-block px-3 py-1 rounded-full bg-surface text-gray-600 text-xs font-bold uppercase tracking-wider mb-3">
              Community & Global
            </div>
            <h3 className="text-2xl sm:text-3xl font-display font-bold text-text-main mb-3 group-hover:text-primary transition-colors">
              External Volunteer
            </h3>
            <p className="text-gray-600 text-base leading-relaxed mb-8">
              Join our broader community from anywhere. Help with creative design, outreach, partner
              school collaborations, and mentorship opportunities.
            </p>
          </div>

          <div className="w-full py-4 px-6 rounded-2xl bg-primary group-hover:bg-primary-hover text-white font-semibold text-base transition-colors shadow-md shadow-primary/25 group-hover:shadow-lg flex items-center justify-center gap-2 group-hover:gap-3">
            <span>Apply via Google Form</span>
            <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
        </m.a>
      </div>

      {/* Direct Contact & Social Links */}
      <div className="pt-10 border-t border-gray-200/80 text-center">
        <p className="text-xs uppercase font-bold tracking-wider text-gray-400 mb-4">
          Have questions? Reach out to us
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <a
            href="mailto:inclusiverse.lavasa@christuniversity.in"
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white border border-gray-200 text-sm font-semibold text-text-main hover:text-primary hover:border-primary/40 shadow-sm transition-colors"
          >
            <Mail className="w-4 h-4 text-primary" />
            <span>inclusiverse.lavasa@christuniversity.in</span>
          </a>
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
