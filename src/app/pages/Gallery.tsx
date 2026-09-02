import React, { useState, useEffect, useRef } from "react";
import { Camera, ChevronLeft, ChevronRight, X } from "lucide-react";
import { m, AnimatePresence } from "motion/react";
import { GalleryPhoto, GalleryEvent } from "../types";
import GALLERY_PHOTOS_RAW from "../../data/photos.json";
import GALLERY_EVENTS_RAW from "../../data/events.json";

const GALLERY_PHOTOS = GALLERY_PHOTOS_RAW as GalleryPhoto[];
const GALLERY_EVENTS = GALLERY_EVENTS_RAW as GalleryEvent[];

const INITIAL_GALLERY_COUNT = 12;
const GALLERY_BATCH_SIZE = 12;

const ALL_GALLERY_FILTERS: { name: string; slug: string }[] = (() => {
  const eventFilters = GALLERY_EVENTS.map((e: { name: string; slug: string }) => ({
    name: e.name,
    slug: e.slug,
  }));
  const seenNames = new Set(eventFilters.map((e: { name: string; slug: string }) => e.name));
  const additional: { name: string; slug: string }[] = [];
  for (const photo of GALLERY_PHOTOS) {
    if (photo.cat && photo.cat !== "All" && !seenNames.has(photo.cat)) {
      seenNames.add(photo.cat);
      additional.push({
        name: photo.cat,
        slug: photo.cat.toLowerCase().replace(/\s+/g, "-"),
      });
    }
  }
  return [...eventFilters, ...additional];
})();

function GalleryCard({
  photo,
  index,
  onClick,
}: Readonly<{
  photo: GalleryPhoto;
  index: number;
  onClick: () => void;
}>) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <m.button
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min((index % GALLERY_BATCH_SIZE) * 0.03, 0.3) }}
      onClick={onClick}
      className="w-full break-inside-avoid rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 group relative block text-left bg-gray-100 mb-5 cursor-pointer"
    >
      <div className="relative w-full overflow-hidden bg-gray-100">
        <img
          src={photo.src}
          alt={photo.alt}
          loading={index < 6 ? "eager" : "lazy"}
          onLoad={() => setIsLoaded(true)}
          className={`w-full object-cover group-hover:scale-105 transition-transform duration-500 ${
            isLoaded ? "opacity-100" : "opacity-0 min-h-[220px]"
          }`}
        />
        {!isLoaded && (
          <div className="absolute inset-0 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 animate-pulse min-h-[220px]" />
        )}
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-[opacity,transform] duration-300 pointer-events-none">
        <span className="text-white text-sm font-medium drop-shadow-sm">{photo.caption}</span>
        <span className="ml-2 bg-primary text-white text-xs px-2.5 py-0.5 rounded-full shadow-sm">
          {photo.cat}
        </span>
      </div>
    </m.button>
  );
}

export function Gallery({
  activeFilter,
  setActiveFilter,
}: Readonly<{
  activeFilter: string;
  setActiveFilter: (f: string) => void;
}>) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [visibleCount, setVisibleCount] = useState(INITIAL_GALLERY_COUNT);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const allFilters = ALL_GALLERY_FILTERS;

  const filteredPhotos =
    activeFilter === "All"
      ? GALLERY_PHOTOS
      : GALLERY_PHOTOS.filter((p) => p.cat === activeFilter || p.event === activeFilter);

  const handleFilterChange = (slug: string) => {
    setActiveFilter(slug);
    setVisibleCount(INITIAL_GALLERY_COUNT);
    setLightboxIndex(null);
  };

  useEffect(() => {
    setVisibleCount(INITIAL_GALLERY_COUNT);
  }, [activeFilter]);

  const visiblePhotos = filteredPhotos.slice(0, visibleCount);
  const hasMore = visibleCount < filteredPhotos.length;

  const handleCloseLightbox = () => setLightboxIndex(null);

  const handlePrevPhoto = () => {
    if (lightboxIndex !== null && filteredPhotos.length > 0) {
      setLightboxIndex((prev) => (prev! - 1 + filteredPhotos.length) % filteredPhotos.length);
    }
  };

  const handleNextPhoto = () => {
    if (lightboxIndex !== null && filteredPhotos.length > 0) {
      setLightboxIndex((prev) => (prev! + 1) % filteredPhotos.length);
    }
  };

  // Keyboard navigation & body scroll locking for lightbox accessibility
  useEffect(() => {
    if (lightboxIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleCloseLightbox();
      } else if (e.key === "ArrowLeft") {
        handlePrevPhoto();
      } else if (e.key === "ArrowRight") {
        handleNextPhoto();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [lightboxIndex, filteredPhotos.length]);

  // Progressive intersection observer for smooth bottom appending
  useEffect(() => {
    if (!hasMore) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + GALLERY_BATCH_SIZE, filteredPhotos.length));
        }
      },
      { rootMargin: "350px" }
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }
    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [hasMore, filteredPhotos.length]);

  const currentPhoto = lightboxIndex !== null ? filteredPhotos[lightboxIndex] : null;

  return (
    <div>
      <section className="bg-surface py-20">
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        >
          <h1 className="text-5xl font-display font-bold mb-5">
            <span className="text-primary">Gallery</span>
          </h1>
          <p className="text-xl text-gray-600">
            Joyful moments captured across our events, projects, and community gatherings.
          </p>
        </m.div>
      </section>

      {/* Filter Pills */}
      {allFilters.length > 0 && (
        <section className="bg-white pt-10 pb-2">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <m.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="flex flex-wrap justify-center gap-3"
            >
              <button
                type="button"
                onClick={() => handleFilterChange("All")}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-focus focus:ring-offset-2 cursor-pointer ${
                  activeFilter === "All"
                    ? "bg-primary text-white shadow-md shadow-primary/25"
                    : "bg-surface text-gray-600 hover:bg-gray-200 hover:text-text-main"
                }`}
              >
                All Events
              </button>
              {allFilters.map((filter) => (
                <button
                  key={filter.slug}
                  type="button"
                  onClick={() => handleFilterChange(filter.slug)}
                  className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-focus focus:ring-offset-2 cursor-pointer ${
                    activeFilter === filter.slug
                      ? "bg-primary text-white shadow-md shadow-primary/25"
                      : "bg-surface text-gray-600 hover:bg-gray-200 hover:text-text-main"
                  }`}
                >
                  {filter.name}
                </button>
              ))}
            </m.div>
          </div>
        </section>
      )}

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredPhotos.length === 0 ? (
            <m.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <Camera className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-xl text-gray-400 font-display font-semibold">
                No photos yet for this event
              </p>
              <p className="text-gray-400 mt-2">Photos will appear here once they are uploaded.</p>
            </m.div>
          ) : (
            <>
              <m.div
                key={activeFilter}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="columns-1 sm:columns-2 lg:columns-3 gap-5"
              >
                {visiblePhotos.map((photo, i) => (
                  <GalleryCard
                    key={photo.src}
                    photo={photo}
                    index={i}
                    onClick={() => setLightboxIndex(i)}
                  />
                ))}
              </m.div>

              {/* Bottom Infinite Scroll Sentinel & Load More trigger */}
              {hasMore && (
                <div ref={loadMoreRef} className="pt-10 pb-6 text-center">
                  <m.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() =>
                      setVisibleCount((prev) =>
                        Math.min(prev + GALLERY_BATCH_SIZE, filteredPhotos.length)
                      )
                    }
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-surface hover:bg-gray-200 text-sm font-semibold text-text-main transition-colors border border-gray-200 shadow-xs cursor-pointer"
                  >
                    <span>Load More Photos</span>
                    <span className="text-xs text-primary font-bold">
                      ({filteredPhotos.length - visibleCount} remaining)
                    </span>
                  </m.button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <AnimatePresence>
        {currentPhoto && lightboxIndex !== null && (
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
            onClick={handleCloseLightbox}
            role="dialog"
            aria-modal="true"
            aria-label={`Photo lightbox: ${currentPhoto.caption}`}
          >
            {/* Previous Photo Button */}
            {filteredPhotos.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevPhoto();
                }}
                aria-label="Previous photo (Left arrow key)"
                className="fixed left-3 sm:left-6 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-white/20 hover:bg-white text-white hover:text-text-main backdrop-blur-md border border-white/20 flex items-center justify-center transition-all duration-200 shadow-lg cursor-pointer hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white"
              >
                <ChevronLeft className="w-6 h-6 -translate-x-0.5" />
              </button>
            )}

            {/* Next Photo Button */}
            {filteredPhotos.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNextPhoto();
                }}
                aria-label="Next photo (Right arrow key)"
                className="fixed right-3 sm:right-6 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-white/20 hover:bg-white text-white hover:text-text-main backdrop-blur-md border border-white/20 flex items-center justify-center transition-all duration-200 shadow-lg cursor-pointer hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white"
              >
                <ChevronRight className="w-6 h-6 translate-x-0.5" />
              </button>
            )}

            <m.div
              initial={{ scale: 0.92, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 15 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full rounded-3xl overflow-hidden shadow-2xl bg-white flex flex-col max-h-[90vh]"
            >
              {/* Header Bar */}
              <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between pointer-events-none">
                <span className="bg-black/60 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm">
                  {lightboxIndex + 1} / {filteredPhotos.length}
                </span>

                <button
                  type="button"
                  onClick={handleCloseLightbox}
                  className="pointer-events-auto bg-black/60 hover:bg-black/80 text-white p-2 rounded-full shadow-md backdrop-blur-md transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-white"
                  aria-label="Close photo preview (Escape key)"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Photo Display */}
              <div className="w-full bg-black flex items-center justify-center overflow-hidden min-h-[300px] max-h-[70vh]">
                <img
                  src={currentPhoto.src}
                  alt={currentPhoto.alt}
                  className="w-full h-full object-contain max-h-[70vh]"
                />
              </div>

              {/* Footer Info & Details */}
              <div className="p-5 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-gray-100">
                <div>
                  <p className="font-display font-semibold text-text-main text-base sm:text-lg">
                    {currentPhoto.caption}
                  </p>
                  <span className="inline-block mt-1 bg-primary/10 text-primary text-xs font-semibold px-2.5 py-0.5 rounded-full">
                    {currentPhoto.cat}
                  </span>
                </div>
                <div className="hidden sm:flex items-center gap-2 text-xs text-gray-400">
                  <kbd className="px-2 py-1 bg-gray-100 rounded text-gray-600 border border-gray-200">
                    ←
                  </kbd>
                  <kbd className="px-2 py-1 bg-gray-100 rounded text-gray-600 border border-gray-200">
                    →
                  </kbd>
                  <span>to navigate</span>
                  <span className="mx-1">·</span>
                  <kbd className="px-2 py-1 bg-gray-100 rounded text-gray-600 border border-gray-200">
                    Esc
                  </kbd>
                  <span>to close</span>
                </div>
              </div>
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}
