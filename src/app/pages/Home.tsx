import React, { useState, useEffect } from "react";
import { ArrowRight, PlayCircle, Heart, ChevronRight, Mail, Instagram, Linkedin, Pause, Play } from "lucide-react";
import { m, AnimatePresence, Variants } from "motion/react";
import { Page, GalleryPhoto, GalleryEvent } from "../types";
import { MILESTONES } from "../data/milestones";
import GALLERY_PHOTOS_RAW from "../../data/photos.json";
import GALLERY_EVENTS_RAW from "../../data/events.json";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { DonateModal } from "../components/DonateModal";

const GALLERY_PHOTOS = GALLERY_PHOTOS_RAW as GalleryPhoto[];
const GALLERY_EVENTS = GALLERY_EVENTS_RAW as GalleryEvent[];

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

export function Home({ setPage }: Readonly<{ setPage: (p: Page) => void }>) {
  const [showDonateModal, setShowDonateModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isSlideshowPaused, setIsSlideshowPaused] = useState(false);

  // Dynamic events count derived directly from Timeline MILESTONES & registered events
  const dynamicEventsCount = React.useMemo(() => {
    const uniqueEvents = new Set<string>();
    MILESTONES.forEach((m) => uniqueEvents.add(m.title.toLowerCase().trim()));
    GALLERY_EVENTS.forEach((e) => uniqueEvents.add(e.name.toLowerCase().trim()));
    return Math.max(uniqueEvents.size, MILESTONES.length, 1);
  }, []);

  // Dynamic shared experiences sourced directly from Timeline MILESTONES
  const sharedExperiences = React.useMemo(() => {
    return MILESTONES.map((m) => {
      const matched = GALLERY_PHOTOS.find(
        (p) =>
          (m.galleryFilter && p.event === m.galleryFilter) ||
          p.cat?.toLowerCase() === m.title.toLowerCase() ||
          p.caption?.toLowerCase().includes(m.title.toLowerCase())
      );

      const fallbackPhoto =
        GALLERY_PHOTOS.length > 0
          ? GALLERY_PHOTOS[
              Math.abs(m.title.split("").reduce((acc, c) => acc + (c.codePointAt(0) ?? 0), 0)) %
                GALLERY_PHOTOS.length
            ]
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
    if (!GALLERY_PHOTOS.length || isSlideshowPaused) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % GALLERY_PHOTOS.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isSlideshowPaused]);

  return (
    <>
      <section className="relative overflow-hidden bg-surface py-20 lg:py-32">
        {/* Background decorative glow */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            <m.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="max-w-2xl"
            >
              <m.h1
                variants={fadeUpItem}
                className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold text-text-main leading-tight mb-6"
              >
                Every Child Deserves <span className="text-primary">Joy</span>,{" "}
                <span className="text-primary">Friendship</span>, and Opportunity.
              </m.h1>
              <m.p
                variants={fadeUpItem}
                className="text-lg sm:text-xl text-gray-700 mb-10 leading-relaxed max-w-xl"
              >
                Inclusiverse is a student-led initiative creating meaningful experiences for
                children with disabilities through sports, inclusion, creativity, and compassion.
              </m.p>
              <m.div variants={fadeUpItem} className="flex flex-wrap gap-4">
                <m.button
                  type="button"
                  onClick={() => setPage("join")}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className="bg-primary hover:bg-primary-hover text-white px-8 py-4 rounded-full font-medium text-lg transition-colors shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-focus focus:ring-offset-2 flex items-center gap-2 group cursor-pointer"
                >
                  Join Us Today
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </m.button>
                <m.button
                  type="button"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setPage("timeline")}
                  className="bg-white hover:bg-gray-50 text-text-main border border-gray-200 px-8 py-4 rounded-full font-medium text-lg transition-colors focus:outline-none focus:ring-2 focus:ring-focus focus:ring-offset-2 flex items-center gap-2 shadow-sm cursor-pointer"
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
              <div
                className="aspect-square rounded-3xl overflow-hidden shadow-2xl relative select-none"
                role="region"
                aria-roledescription="carousel"
                aria-label="Inclusiverse photo highlights slideshow"
              >
                <AnimatePresence mode="sync">
                  {GALLERY_PHOTOS.length > 0 && (
                    <m.div
                      key={currentImageIndex}
                      initial={{ opacity: 0, scale: 1.08 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute inset-0"
                    >
                      <div className="w-full h-full">
                        <ImageWithFallback
                          src={GALLERY_PHOTOS[currentImageIndex]?.src}
                          alt={GALLERY_PHOTOS[currentImageIndex]?.alt || "Inclusiverse moment"}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </m.div>
                  )}
                </AnimatePresence>

                {/* Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />

                {/* Bottom Control Bar: Caption & Play/Pause Toggle */}
                <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-auto gap-2">
                  <div className="bg-black/50 backdrop-blur-md text-white text-xs px-3.5 py-2 rounded-full line-clamp-1 max-w-[65%] shadow-sm font-medium border border-white/10">
                    {GALLERY_PHOTOS[currentImageIndex]?.caption || "Inclusiverse Moments"}
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsSlideshowPaused((p) => !p)}
                    aria-label={isSlideshowPaused ? "Play slideshow" : "Pause slideshow"}
                    className="inline-flex items-center gap-1.5 bg-black/60 hover:bg-black/80 backdrop-blur-md text-white text-xs font-semibold px-3.5 py-2 rounded-full shadow-sm border border-white/15 transition-all duration-200 cursor-pointer hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary"
                    title={isSlideshowPaused ? "Resume slideshow" : "Pause slideshow"}
                  >
                    {isSlideshowPaused ? (
                      <>
                        <Play className="w-3.5 h-3.5 fill-white" />
                        <span>Play</span>
                      </>
                    ) : (
                      <>
                        <Pause className="w-3.5 h-3.5 fill-white" />
                        <span>Pause</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </m.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
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
                <div className="text-4xl md:text-5xl font-display font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 font-medium text-base">{stat.label}</div>
              </m.div>
            ))}
          </m.div>
        </div>
      </section>

      {/* Shared Experiences Section */}
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
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-3 text-text-main">
                Shared Experiences
              </h2>
              <p className="text-gray-600 text-lg">
                Meaningful moments created through sports, art, and community inclusion.
              </p>
            </m.div>
            <m.button
              type="button"
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
            {sharedExperiences.slice(0, 3).map((exp) => (
              <m.div
                key={exp.title}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
                  },
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
                    {exp.description.split("\n")[0]}
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
              type="button"
              onClick={() => setPage("timeline")}
              className="w-full py-3.5 px-6 rounded-2xl bg-white border border-gray-200 text-primary font-semibold text-sm shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>View full timeline ({MILESTONES.length} chapters)</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
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
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
            Ready to make a difference?
          </h2>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Join our community of students dedicated to building lasting friendships and creating
            inclusive spaces.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <m.button
              type="button"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setPage("join")}
              className="bg-primary hover:bg-primary-hover text-white px-8 py-4 rounded-full font-medium text-lg transition-colors shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-focus focus:ring-offset-2 cursor-pointer"
            >
              Become a Volunteer
            </m.button>
            <m.button
              type="button"
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

      {/* Contact Us & Connect Section */}
      <section className="py-20 bg-surface border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <m.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-14"
          >
            <h2 className="text-4xl sm:text-5xl font-display font-bold text-text-main mb-4">
              Contact & <span className="text-primary">Connect with Us</span>
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Have questions, collaboration ideas, or want to invite Inclusiverse for an inclusive
              initiative? Reach out directly to our team.
            </p>
          </m.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
            {/* Email Card */}
            <m.a
              href="mailto:inclusiverse.lavasa@christuniversity.in"
              whileHover={{ y: -5 }}
              className="bg-white p-7 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center group cursor-pointer"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                <Mail className="w-6 h-6" />
              </div>
              <span className="text-xs uppercase font-bold tracking-wider text-gray-400 mb-1">
                Email
              </span>
              <h3 className="text-lg font-bold text-text-main group-hover:text-primary transition-colors mb-2">
                Send an Email
              </h3>
              <p className="text-sm font-medium text-primary break-all">
                inclusiverse.lavasa@christuniversity.in
              </p>
            </m.a>

            {/* Instagram Card */}
            <m.a
              href="https://www.instagram.com/inclusiverse.christuniversity"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -5 }}
              className="bg-white p-7 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center group cursor-pointer"
            >
              <div className="w-14 h-14 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center mb-4 group-hover:bg-pink-600 group-hover:text-white transition-colors duration-300">
                <Instagram className="w-6 h-6" />
              </div>
              <span className="text-xs uppercase font-bold tracking-wider text-gray-400 mb-1">
                Social Media
              </span>
              <h3 className="text-lg font-bold text-text-main group-hover:text-pink-600 transition-colors mb-2">
                Instagram
              </h3>
              <p className="text-sm font-medium text-gray-600">
                @inclusiverse.christuniversity
              </p>
            </m.a>

            {/* LinkedIn Card */}
            <m.a
              href="https://www.linkedin.com/company/inclusiverse-club"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -5 }}
              className="bg-white p-7 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center group cursor-pointer sm:col-span-2 lg:col-span-1"
            >
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                <Linkedin className="w-6 h-6" />
              </div>
              <span className="text-xs uppercase font-bold tracking-wider text-gray-400 mb-1">
                Social Media
              </span>
              <h3 className="text-lg font-bold text-text-main group-hover:text-blue-600 transition-colors mb-2">
                LinkedIn
              </h3>
              <p className="text-sm font-medium text-gray-600">
                Inclusiverse Club
              </p>
            </m.a>
          </div>

          {/* Quick Action CTA inside Contact Box */}
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-gray-100 shadow-sm max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            <div>
              <h3 className="text-xl sm:text-2xl font-display font-bold text-text-main mb-2">
                Want to become an active student volunteer?
              </h3>
              <p className="text-gray-600 text-sm">
                Join our on-campus team at Christ University, Pune Lavasa Campus.
              </p>
            </div>
            <div className="shrink-0">
              <button
                type="button"
                onClick={() => setPage("join")}
                className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-primary hover:bg-primary-hover text-white font-medium text-sm transition-colors shadow-sm cursor-pointer"
              >
                <span>Join the Movement</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {showDonateModal && <DonateModal onClose={() => setShowDonateModal(false)} />}
      </AnimatePresence>
    </>
  );
}
