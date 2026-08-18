# Inclusiverse — Refined Design & Content Brief
### Theme: "Together Beyond Differences"

---

## 1. Design Philosophy (sharpened)

Keep the original instinct — dignity over sympathy, community over charity — but make it operational:

| Instead of... | Do this |
|---|---|
| "We helped them" | Show shared moments: two kids laughing at the same joke, not a volunteer "assisting" a child |
| Sad-to-happy before/afters | Frame as **Preparation → Event → Reflection** — nobody was incomplete beforehand |
| Generic stock-photo warmth | Real photos only, real names (with consent), real quotes |
| "Specially-abled" everywhere | Decision point, not a default — ask children/families/partner schools what language they prefer. Some communities prefer identity-first ("disabled children"), others person-first ("children with disabilities"). Consistency + community input matters more than which one you pick. |

**One-line brand promise to keep everyone aligned:**
*"A place where belonging isn't given as charity — it's built through friendship."*

---

## 2. Visual System (expanded from your 4 colors)

**Core palette**
| Role | Color | Notes |
|---|---|---|
| Primary | Deep Red `#C62828` | On white = ~5.9:1 contrast, passes AA for normal text |
| Secondary | Black `#1A1A1A` | Body text, not pure `#000` — softer on the eye |
| Background | White `#FFFFFF` | |
| Surface | Soft Gray `#F7F7F7` | Section backgrounds, cards |
| + Add: Hover/Active red | `#A61F1F` | Darker red for button states — don't reuse primary for hover |
| + Add: Success/Focus | A visible focus ring color distinct from red (e.g. a deep navy or the red at higher contrast with a white outline) — red-on-red focus states are hard to see |

**Typography**
- Headline: a warm, slightly rounded display face (e.g. Fraunces or Poppins) — large, confident, not corporate
- Body: a clean humanist sans (e.g. Inter or Manrope) for readability at small sizes
- Dyslexia-friendly alternate: Lexend or OpenDyslexic, swappable via the accessibility toggle

**Tokens to define once, reuse everywhere:** spacing scale (4/8/16/24/32/48/64px), corner radius scale (small card 12px, large card 24px, pill buttons 999px), shadow levels (resting, hover-lift, modal).

---

## 3. Consolidated Information Architecture

Your original list had overlap (Events Timeline vs. Interactive Journey; Gallery Before/After vs. Gallery). Merged into one clean sitemap:

1. **Home**
2. **About** — Story, Mission, Vision (one section, not scattered)
3. **Projects** — grid → individual project detail pages
4. **Events** — full timeline + countdown to next event
5. **Gallery** — masonry, filterable by *Photos / Videos / Preparation–Event–Reflection sets*
6. **Team**
7. **Blogs / Stories** — volunteer stories + community stories, one content type, tagged by author type
8. **Volunteer** — join form, "why join," testimonials, certificate verification
9. **FAQs**
10. **Donate** — "Coming Soon" state
11. **Accessibility** — statement + live controls
12. **Contact** — map, email, Instagram, LinkedIn
13. **Privacy** *(new — needed because minors' images/stories are involved)*

The **timeline component** (Started → First Event → Special Olympics → School Visits → Growing Community → Future Events) is built once and reused: a short teaser on Home, the full interactive version on the Events page.

---

## 4. Homepage Structure (refined)

**Hero**
- Full-bleed emotional image/video, floating abstract red shapes in background (respect `prefers-reduced-motion` — freeze or slow the shapes for users who need it)
- Headline: *"Every Child Deserves Joy, Friendship, and Opportunity."*
- Subhead: *"Inclusiverse is a student-led initiative creating meaningful experiences for children with disabilities through sports, inclusion, creativity, and compassion."*
- CTAs: **Join Us** / **Our Journey**

**About preview** — split layout, photo collage left, Story/Mission/Vision right (link to full About page for depth)

**Impact counters** — animated on scroll-into-view, e.g. 250+ Volunteers, 15+ Events, 500+ Smiles, 8+ Partner Schools — followed by an India map highlighting active locations

**Featured Projects** — 3 cards max on homepage (Unified Skating Championship, Blind School Visit, Inclusive Fun Day), each linking to a full project page with gallery

**Gallery preview** — masonry teaser, "View Full Gallery" CTA

**Volunteer testimonials** — horizontal scroll, "I joined Inclusiverse because…"

**Community stories** — short, dignified narrative snippets: *"For one afternoon, the playground became a place where everyone belonged."* (See ethics note in §6 before publishing any story tied to a specific child.)

**Events timeline teaser** — 3–4 nodes, "See Full Timeline" CTA

**Team preview** — 4–6 circular cards, link to full Team page

**Partners** — scrolling logo strip

**Join CTA** — short pitch + button to Volunteer page

**Donate teaser** — "Coming Soon" badge, no dead-end; explain what donations will fund once live

**Footer/Contact** — map, socials, email

---

## 5. Micro-interactions (deduped single list)

Fade-in on scroll · cards lift on hover · counters animate once in view · timeline nodes slide/reveal sequentially · gallery images zoom slightly on hover · buttons have a subtle ripple on click · background blobs drift slowly · optional cursor spotlight on desktop only (never on touch devices)

**Rule:** every one of these must have a reduced-motion fallback (instant state change instead of animation) — this isn't optional given the accessibility commitment.

---

## 6. Ethical Storytelling & Media Consent — *new section, worth prioritizing*

Because the site will feature photos, videos, and personal stories of children with disabilities, a few practices matter more here than on a typical club site:

- **Written guardian consent** for every photo, video, or story featuring a child, collected before publishing — not assumed because a school partnered with you.
- **Age-appropriate assent** from the child themselves where possible, in addition to guardian consent.
- **No single-story reduction** — a child shouldn't be represented by their disability alone; show the same range of moments (joy, boredom, competitiveness, friendship) you'd show any child.
- **Opt-out/takedown process** — guardians can request removal of any image or story at any time. State this plainly on the Contact and Privacy pages; it's also a strong trust signal for parents considering whether to let their child participate.
- **Before/after framing** — keep your instinct to avoid "sad before, happy after." Use **Preparation → Event → Reflection** instead, which you already had — just make sure copy never implies the child needed "fixing."
- **A short Privacy page** covering how images/data are stored and how to request removal — currently missing from the sitemap, and worth adding given the subject matter.

---

## 7. Accessibility — from checklist to implementation

| Feature | How it's actually built |
|---|---|
| Keyboard navigation | Full tab order, visible focus states, skip-to-content link |
| Screen reader support | Semantic HTML5 landmarks (`<nav>`, `<main>`, `<article>`), ARIA only where semantics fall short |
| Dark mode | `prefers-color-scheme` + manual toggle |
| High contrast mode | Separate theme, not just inverted colors — check ratios explicitly |
| Dyslexia-friendly font | Toggle swaps body font to Lexend/OpenDyslexic |
| Font size changer | Root `rem` sizing + a visible stepper control, not just browser zoom |
| Reduced motion | `prefers-reduced-motion` media query respected across all animations in §5 |
| Alt text | Describes action/emotion ("Two children laughing while playing catch"), not just objects |
| Testing | Manual pass with NVDA/VoiceOver + keyboard-only navigation before launch |

---

## 8. Feature Phasing — you listed ~15 advanced features; here's a build order

**Phase 1 — Launch**
Home, About, Projects, Gallery, Events, Team, Volunteer signup form, Contact, Privacy, core accessibility toolkit (dark mode, font size, reduced motion, semantic HTML, alt text), Donate "coming soon"

**Phase 2 — Community depth**
Blogs/Stories, testimonials, full interactive timeline, partner logos, FAQs, Memory Wall

**Phase 3 — Advanced/nice-to-have**
Certificate verification, Achievement Wall / media coverage, PDF annual report viewer, event countdown widget, floating rotating quotes, cursor spotlight

This keeps the first release shippable instead of trying to launch all 15+ features simultaneously — you can always fold Phase 2/3 items in as the club grows.

---

## 9. Light tech note (optional)

Given this is student-run with likely turnover, consider a lightweight headless CMS (e.g., Sanity or a simple admin panel) for the Gallery and Blogs sections specifically, so future club members can add content without touching code. Framer Motion (or CSS-only) for the animations in §5, built with reduced-motion fallbacks from day one rather than retrofitted later.

---

## 10. Consolidated AI Build Prompt (ready to hand to Claude Code or similar)

> Design and build a premium, emotionally warm website for **Inclusiverse**, a student-led university club creating inclusive experiences for children with disabilities. Emphasize dignity, friendship, and shared experience — never charity or sympathy.
>
> **Visual system:** white background, deep red `#C62828` primary, near-black `#1A1A1A` text, soft gray `#F7F7F7` section backgrounds, rounded cards, generous whitespace, large confident typography. Visual tone: Apple × Airbnb × premium nonprofit — clean but warm, never corporate or clinical.
>
> **Homepage:** full-bleed emotional hero (headline: "Every Child Deserves Joy, Friendship, and Opportunity"), About preview, animated impact counters + India map, 3 featured project cards, masonry gallery preview, volunteer testimonials, community stories (dignified, non-reductive), timeline teaser, team preview, partner logos, join CTA, "Donate — Coming Soon," footer contact.
>
> **Additional pages:** About, Projects, Events (full timeline + countdown), Gallery (masonry, filterable), Team, Blogs/Stories, Volunteer (signup + certificate verification), FAQs, Accessibility, Privacy, Contact.
>
> **Accessibility (non-negotiable, build in from the start):** semantic HTML, full keyboard navigation, screen-reader tested, dark mode, high-contrast mode, dyslexia-friendly font toggle, adjustable font size, `prefers-reduced-motion` respected on every animation, descriptive alt text throughout.
>
> **Micro-interactions:** scroll fade-ins, card lift on hover, animated counters, sliding timeline reveals, gallery zoom on hover, button ripple, slow-drifting background shapes — every one with a reduced-motion fallback.
>
> **Content ethics:** any photo, video, or story involving a child requires documented guardian consent and a visible opt-out/takedown process (linked from Contact and Privacy pages). Frame gallery sets as Preparation → Event → Reflection, never "sad before / happy after."
>
> **Build order:** ship Phase 1 (Home, About, Projects, Gallery, Events, Team, Volunteer signup, Contact, Privacy, full accessibility toolkit, Donate placeholder) before adding Phase 2 (Blogs, testimonials, full timeline, FAQs, Memory Wall) and Phase 3 (certificate verification, achievement wall, annual report viewer, countdown widget).
>
> Fully responsive across desktop, tablet, mobile. Reusable component system with consistent spacing, radius, and shadow tokens defined once.