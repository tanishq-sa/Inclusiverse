export type Page =
  | "home"
  | "about"
  | "team"
  | "timeline"
  | "gallery"
  | "join"
  | "404"
  | "tos"
  | "privacy"
  | "cancellation"
  | "no-refund"
  | "contact";

export interface GalleryPhoto {
  src: string;
  alt: string;
  caption: string;
  cat: string;
  event?: string;
}

export interface GalleryEvent {
  name: string;
  slug: string;
  year?: string;
}

export interface Milestone {
  year: string;
  title: string;
  tagline: string;
  description: string;
  closing: string;
  reportUrl?: string;
  galleryFilter?: string;
}
