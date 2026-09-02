import React from "react";
import { FileText, Camera } from "lucide-react";
import { m } from "motion/react";
import { Milestone, GalleryPhoto } from "../types";
import { MILESTONES } from "../data/milestones";
import GALLERY_PHOTOS_RAW from "../../data/photos.json";

const GALLERY_PHOTOS = GALLERY_PHOTOS_RAW as GalleryPhoto[];

function MilestoneCard({
  milestone,
  index,
  onViewGallery,
}: Readonly<{
  milestone: Milestone;
  index: number;
  onViewGallery: (filter: string) => void;
}>) {
  const hasGalleryPhotos =
    milestone.galleryFilter && GALLERY_PHOTOS.some((p) => p.event === milestone.galleryFilter);

  return (
    <m.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative flex gap-4 sm:gap-6 md:gap-10"
    >
      {/* Timeline spine */}
      <div className="relative flex flex-col items-center flex-shrink-0">
        <m.div
          whileHover={{ scale: 1.1 }}
          className="bg-primary text-white text-xs sm:text-sm font-bold px-3 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-md whitespace-nowrap z-10 font-display"
        >
          {milestone.year}
        </m.div>
        {index < MILESTONES.length - 1 && (
          <div className="flex-1 w-px bg-gradient-to-b from-primary/30 to-gray-200 mt-4" />
        )}
      </div>

      {/* Card */}
      <div className="flex-1 bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-gray-200 p-5 sm:p-8 mb-6 sm:mb-8 hover:shadow-lg transition-shadow">
        <div className="mb-4">
          <h3 className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-text-main mb-2">
            {milestone.title}
          </h3>
          <p className="text-primary font-semibold italic text-base sm:text-lg">
            {milestone.tagline}
          </p>
        </div>
        <div className="space-y-4">
          {milestone.description.split("\n\n").map((para) => (
            <p key={para} className="text-gray-700 leading-relaxed text-sm sm:text-base">
              {para}
            </p>
          ))}
        </div>
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-primary font-semibold text-base sm:text-lg italic">
            {milestone.closing}
          </p>
        </div>
        {(milestone.reportUrl || milestone.galleryFilter) && (
          <div className="mt-6 flex flex-wrap gap-3">
            {milestone.reportUrl && (
              <a
                href={milestone.reportUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white font-semibold text-sm px-4 py-2 rounded-full transition-colors hover:shadow-md focus:outline-none focus:ring-2 focus:ring-focus focus:ring-offset-2"
              >
                <FileText className="w-4 h-4" />
                Report
              </a>
            )}
            {milestone.galleryFilter && hasGalleryPhotos && (
              <button
                type="button"
                onClick={() => onViewGallery(milestone.galleryFilter!)}
                className="inline-flex items-center gap-2 bg-surface hover:bg-gray-200 text-text-main font-semibold text-sm px-4 py-2 rounded-full transition-colors hover:shadow-md focus:outline-none focus:ring-2 focus:ring-focus focus:ring-offset-2 cursor-pointer"
              >
                <Camera className="w-4 h-4" />
                Moments Captured
              </button>
            )}
          </div>
        )}
      </div>
    </m.div>
  );
}

export function Timeline({
  onViewGallery,
}: Readonly<{
  onViewGallery: (filter: string) => void;
}>) {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-surface py-20">
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        >
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-6 text-text-main">
            Our <span className="text-primary">Journey</span>
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-primary">
            Six Milestones. One Growing Movement.
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            Inclusiverse began with a simple idea:{" "}
            <span className="font-semibold">
              to look beyond barriers and create spaces where everyone can participate, connect, and
              belong.
            </span>
          </p>
          <p className="text-gray-600 mt-6 leading-relaxed">
            From our first initiative in 2023 to the work we continue today, each milestone has
            shaped who we are. Every event has taught us something, introduced us to new
            communities, and brought us one step closer to the inclusive world we envision.
          </p>
        </m.div>
      </section>

      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {MILESTONES.map((milestone, i) => (
            <MilestoneCard
              key={milestone.title}
              milestone={milestone}
              index={i}
              onViewGallery={onViewGallery}
            />
          ))}
          <div className="flex justify-start pl-4 sm:pl-5 mt-4 sm:mt-8">
            <div className="w-3 h-3 rounded-full bg-primary animate-ping" />
          </div>
        </div>
      </section>

      {/* Conclusion Section */}
      <section className="py-24 bg-gradient-to-b from-white to-surface">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-8 text-text-main">
              Our Story Continues
            </h2>
            <p className="text-xl text-gray-700 mb-8 leading-relaxed">
              Six milestones. Countless people. One shared purpose.
            </p>
            <div className="bg-white rounded-3xl p-8 md:p-12 border border-gray-200 shadow-sm mb-8">
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                From <span className="font-semibold text-primary">Beyond Barriers</span> to{" "}
                <span className="font-semibold text-primary">Take a Stand</span>, our journey has
                evolved—but our core belief has remained the same:
              </p>
              <h3 className="text-3xl md:text-4xl font-display font-bold text-primary mb-8">
                Everyone deserves to belong.
              </h3>
              <p className="text-gray-700 leading-relaxed mb-6">
                These milestones are not just events on a timeline. They represent the people we
                have met, the communities we have connected with, the conversations we have
                started, and the barriers we continue to challenge.
              </p>
              <p className="text-lg text-gray-700 font-semibold">And this is only the beginning.</p>
            </div>
            <m.p
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl md:text-2xl font-display font-bold text-primary"
            >
              The next chapter of Inclusiverse is waiting to be written—
              <span className="text-text-main">with you.</span>
            </m.p>
          </m.div>
        </div>
      </section>
    </div>
  );
}
