import React, { useState, useEffect } from "react";
import { LazyMotion, domAnimation, m, AnimatePresence } from "motion/react";
import { Skeleton } from "boneyard-js/react";

import { Page } from "./types";
import { ALL_PAGES, PAGE_METADATA } from "./data/metadata";
import { Nav } from "./components/Nav";
import { Footer } from "./components/Footer";
import { TeamPage } from "./components/TeamPage";

import { Home } from "./pages/Home";
import { About } from "./pages/About";
import { Timeline } from "./pages/Timeline";
import { Gallery } from "./pages/Gallery";
import { JoinUs } from "./pages/JoinUs";
import { NotFound } from "./pages/NotFound";
import { ContactUs } from "./pages/ContactUs";
import { TermsOfService } from "./pages/legal/TermsOfService";
import { PrivacyPolicy } from "./pages/legal/PrivacyPolicy";
import { CancellationPolicy } from "./pages/legal/CancellationPolicy";
import { NoRefundPolicy } from "./pages/legal/NoRefundPolicy";

export type { Page };

function getInitialPage(): Page {
  if (typeof window !== "undefined") {
    const params = new URLSearchParams(window.location.search);
    const p = params.get("page") as Page;
    if (p) {
      if (ALL_PAGES.includes(p)) {
        return p;
      }
      return "404";
    }
    const hash = window.location.hash.replace("#", "") as Page;
    if (hash) {
      if (ALL_PAGES.includes(hash)) {
        return hash;
      }
      return "404";
    }
    const pathname = window.location.pathname.replace(/^\/|\/$/g, "");
    if (pathname && !["index.html", ""].includes(pathname)) {
      if (ALL_PAGES.includes(pathname as Page)) {
        return pathname as Page;
      }
      return "404";
    }
  }
  return "home";
}

function getInitialGalleryFilter(): string {
  if (typeof window !== "undefined") {
    const params = new URLSearchParams(window.location.search);
    return params.get("filter") || "All";
  }
  return "All";
}

export default function App() {
  const [page, setPage] = useState<Page>(getInitialPage);
  const [isDyslexic, setIsDyslexic] = useState(false);
  const [galleryFilter, setGalleryFilter] = useState(getInitialGalleryFilter);
  const [pageLoading, setPageLoading] = useState(false);

  // Sync with browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const p = getInitialPage();
      const f = getInitialGalleryFilter();
      setPage(p);
      setGalleryFilter(f);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Update document title & SEO meta tags on route changes
  useEffect(() => {
    const meta = PAGE_METADATA[page] || PAGE_METADATA["404"];
    document.title = meta.title;

    const setMetaTag = (attr: string, key: string, content: string) => {
      let el = document.querySelector(`meta[${attr}="${key}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    setMetaTag("name", "description", meta.description);
    setMetaTag("property", "og:title", meta.title);
    setMetaTag("property", "og:description", meta.description);
    setMetaTag("name", "twitter:title", meta.title);
    setMetaTag("name", "twitter:description", meta.description);
  }, [page]);

  // Wrap setPage to reset gallery filter when navigating to gallery from nav unless a filter is provided
  const handleSetPage = (p: Page, explicitGalleryFilter?: string) => {
    if (p === "gallery") {
      setGalleryFilter(explicitGalleryFilter ?? "All");
    }
    const url = new URL(window.location.href);
    if (p === "home") {
      url.searchParams.delete("page");
      url.searchParams.delete("filter");
    } else {
      url.searchParams.set("page", p);
      if (p === "gallery" && explicitGalleryFilter && explicitGalleryFilter !== "All") {
        url.searchParams.set("filter", explicitGalleryFilter);
      } else if (p !== "gallery") {
        url.searchParams.delete("filter");
      }
    }
    window.history.pushState(null, "", url.toString());

    if (p !== page) {
      setPageLoading(true);
      setPage(p);
      setTimeout(() => {
        setPageLoading(false);
      }, 300);
    }
  };

  const handleGalleryFilterChange = (filter: string) => {
    setGalleryFilter(filter);
    const url = new URL(window.location.href);
    if (filter && filter !== "All") {
      url.searchParams.set("filter", filter);
    } else {
      url.searchParams.delete("filter");
    }
    window.history.pushState(null, "", url.toString());
  };

  useEffect(() => {
    document.documentElement.classList.toggle("dyslexia-mode", isDyslexic);
  }, [isDyslexic]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  const toggleDyslexic = () => setIsDyslexic((d) => !d);

  const viewGalleryWithFilter = (filter: string) => {
    handleSetPage("gallery", filter);
  };

  const content = {
    home: (
      <Skeleton name="page-home" loading={pageLoading}>
        <Home setPage={handleSetPage} />
      </Skeleton>
    ),
    about: (
      <Skeleton name="page-about" loading={pageLoading}>
        <About />
      </Skeleton>
    ),
    team: (
      <Skeleton name="page-team" loading={pageLoading}>
        <TeamPage onNavigate={handleSetPage} />
      </Skeleton>
    ),
    timeline: (
      <Skeleton name="page-timeline" loading={pageLoading}>
        <Timeline onViewGallery={viewGalleryWithFilter} />
      </Skeleton>
    ),
    gallery: (
      <Skeleton name="page-gallery" loading={pageLoading}>
        <Gallery activeFilter={galleryFilter} setActiveFilter={handleGalleryFilterChange} />
      </Skeleton>
    ),
    join: (
      <Skeleton name="page-join" loading={pageLoading}>
        <JoinUs />
      </Skeleton>
    ),
    "404": (
      <Skeleton name="page-404" loading={pageLoading}>
        <NotFound setPage={handleSetPage} />
      </Skeleton>
    ),
    tos: (
      <Skeleton name="page-tos" loading={pageLoading}>
        <TermsOfService setPage={handleSetPage} />
      </Skeleton>
    ),
    privacy: (
      <Skeleton name="page-privacy" loading={pageLoading}>
        <PrivacyPolicy setPage={handleSetPage} />
      </Skeleton>
    ),
    cancellation: (
      <Skeleton name="page-cancellation" loading={pageLoading}>
        <CancellationPolicy setPage={handleSetPage} />
      </Skeleton>
    ),
    "no-refund": (
      <Skeleton name="page-no-refund" loading={pageLoading}>
        <NoRefundPolicy setPage={handleSetPage} />
      </Skeleton>
    ),
    contact: (
      <Skeleton name="page-contact" loading={pageLoading}>
        <ContactUs setPage={handleSetPage} />
      </Skeleton>
    ),
  }[page] || (
    <Skeleton name="page-404" loading={pageLoading}>
      <NotFound setPage={handleSetPage} />
    </Skeleton>
  );

  return (
    <LazyMotion features={domAnimation}>
      <div className="min-h-screen bg-background text-text-main flex flex-col font-body">
        <Nav
          page={page}
          setPage={handleSetPage}
          isDyslexic={isDyslexic}
          toggleDyslexic={toggleDyslexic}
        />
        <main className="flex-grow">
          <AnimatePresence mode="wait">
            <m.div
              key={page}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              {content}
            </m.div>
          </AnimatePresence>
        </main>
        <Footer setPage={handleSetPage} />
      </div>
    </LazyMotion>
  );
}
