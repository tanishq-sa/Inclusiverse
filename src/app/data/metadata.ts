import { Page } from "../types";

export const ALL_PAGES: Page[] = [
  "home",
  "about",
  "team",
  "timeline",
  "gallery",
  "join",
  "404",
  "tos",
  "privacy",
  "cancellation",
  "no-refund",
  "contact",
];

export const PAGE_METADATA: Record<Page, { title: string; description: string }> = {
  home: {
    title: "Inclusiverse — Empowering Every Child Through Joy & Inclusion",
    description:
      "Inclusiverse is a student-led initiative creating joyful, barrier-free, and empowering experiences for children with disabilities through sports, inclusion, creativity, and compassion.",
  },
  about: {
    title: "About Us — Inclusiverse | Where Everyone Belongs",
    description:
      "Learn about Inclusiverse's mission, purpose, values, and community initiatives at Christ University, Pune Lavasa Campus.",
  },
  team: {
    title: "Our Team — Inclusiverse | Student Leaders & Faculty Mentors",
    description:
      "Meet the passionate student leaders, advisors, and faculty mentors behind Inclusiverse at Christ University, Pune Lavasa Campus.",
  },
  timeline: {
    title: "Timeline & Milestones — Inclusiverse | Our Journey",
    description:
      "Explore the six milestone chapters of Inclusiverse from Beyond Barriers to Take a Stand.",
  },
  gallery: {
    title: "Photo Gallery — Inclusiverse | Captured Moments of Joy",
    description:
      "Joyful moments captured across Inclusiverse events, unified sports championships, and inclusive outreach drives.",
  },
  join: {
    title: "Join Us — Inclusiverse | Volunteer Opportunities",
    description:
      "Become a student volunteer or community partner with Inclusiverse to foster an inclusive world.",
  },
  tos: {
    title: "Terms of Service — Inclusiverse",
    description:
      "Terms of service and legal agreement for visitors and participants of Inclusiverse.",
  },
  privacy: {
    title: "Privacy Policy — Inclusiverse",
    description:
      "Inclusiverse privacy policy regarding data collection, event photos, and participant safety.",
  },
  cancellation: {
    title: "Cancellation Policy — Inclusiverse",
    description:
      "Policy details regarding event registration and volunteer participation at Inclusiverse.",
  },
  "no-refund": {
    title: "No Refund Policy — Inclusiverse",
    description:
      "Non-profit initiative contribution and non-refundable donation policy for Inclusiverse.",
  },
  contact: {
    title: "Contact Us — Inclusiverse",
    description:
      "Reach out to the Inclusiverse student team and faculty coordinators at Christ University, Pune Lavasa Campus.",
  },
  "404": {
    title: "Page Not Found — Inclusiverse",
    description: "The page you are looking for does not exist or has been moved.",
  },
};
