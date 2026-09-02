import React from "react";
import { Sparkles, Home as HomeIcon, Camera, Heart, Compass, Users } from "lucide-react";
import { m } from "motion/react";
import { Page } from "../types";

export function NotFound({ setPage }: Readonly<{ setPage: (p: Page) => void }>) {
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
          The page you’re looking for might have moved, been renamed, or simply took a different path.
          Don't worry—every journey leads back to community and joy.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
          <m.button
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setPage("home")}
            className="bg-primary hover:bg-primary-hover text-white px-7 py-3.5 rounded-full font-semibold transition-colors shadow-md shadow-primary/25 hover:shadow-lg flex items-center gap-2 cursor-pointer"
          >
            <HomeIcon className="w-4 h-4" />
            <span>Back to Home</span>
          </m.button>

          <m.button
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setPage("gallery")}
            className="bg-white hover:bg-gray-50 text-text-main border border-gray-200 px-6 py-3.5 rounded-full font-semibold transition-colors shadow-sm hover:border-primary/40 flex items-center gap-2 cursor-pointer"
          >
            <Camera className="w-4 h-4 text-primary" />
            <span>Explore Gallery</span>
          </m.button>
        </div>

        {/* Quick Links Card */}
        <div className="bg-white/80 backdrop-blur-sm border border-gray-100 rounded-3xl p-6 shadow-sm max-w-md mx-auto">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">
            Or discover other sections
          </p>
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
                  type="button"
                  onClick={() => setPage(item.target)}
                  className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-surface/70 hover:bg-primary/10 text-gray-700 hover:text-primary transition-colors duration-200 group text-center cursor-pointer"
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
