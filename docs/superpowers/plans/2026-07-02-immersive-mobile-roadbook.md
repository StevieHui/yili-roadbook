# Immersive Mobile Roadbook Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a seven-day cinematic roadbook with destination-specific hero imagery and make the entire site usable at 360–430px mobile widths.

**Architecture:** Extend `TripDay` with presentation metadata, keep the existing `selectedDayId` state as the single source of truth, and split the daily page into a visual hero plus a readable execution section. Use responsive CSS and a small stateful mobile navigation without adding UI or animation dependencies.

**Tech Stack:** React 19, TypeScript 6, Vite 8, Vitest, Testing Library, native CSS, generated WebP assets.

## Global Constraints

- Preserve the current itinerary content and map fallback behavior.
- Keep one data-driven daily page; do not create seven duplicate routes or components.
- Support 1440px, 768px, 390px, and 360px without page-level horizontal overflow.
- Keep all primary touch targets at least approximately 44px high.
- Honor `prefers-reduced-motion` and preserve print output without full-screen hero images.
- Add no UI component library or heavy animation dependency.

---

### Task 1: Add daily visual metadata and assets

**Files:**
- Modify: `src/types.ts`
- Modify: `src/data/itinerary.ts`
- Create: `public/images/roadbook/day-01-sayram.webp` through `day-07-yining.webp`
- Test: `src/__tests__/itinerary.test.ts`

**Interfaces:**
- Produces: `TripDay.visual: { image: string; alt: string; focalPoint: string; accent: string; landscape: string }`.
- Consumes: existing `tripDays` array and Vite `BASE_URL` handling at render time.

- [ ] **Step 1: Write a failing metadata test**

Add assertions that every day has a unique `.webp` image path, non-empty alt and landscape copy, a CSS-compatible focal point, and a six-digit hex accent.

- [ ] **Step 2: Run the focused test**

Run: `npm run test -- src/__tests__/itinerary.test.ts`
Expected: FAIL because `visual` is missing.

- [ ] **Step 3: Add the exact type and seven metadata records**

```ts
export interface DayVisual {
  image: string;
  alt: string;
  focalPoint: string;
  accent: `#${string}`;
  landscape: string;
}

export interface TripDay {
  // existing fields
  visual: DayVisual;
}
```

Use `/images/roadbook/day-XX-place.webp` paths, factual Chinese alt text, per-day focal points, and the approved seven visual identities.

- [ ] **Step 4: Generate and inspect seven WebP images**

Generate realistic documentary road-movie landscapes with natural light, restrained cinematic grading, no text, no watermark, and geographic features appropriate to each day. Inspect each output before copying it to `public/images/roadbook/`.

- [ ] **Step 5: Re-run the focused test and commit**

Run: `npm run test -- src/__tests__/itinerary.test.ts`
Expected: PASS.

Commit: `feat: add daily roadbook visual identities`

### Task 2: Build the cinematic daily hero and resilient switching

**Files:**
- Modify: `src/components/DayRoadbook.tsx`
- Modify: `src/styles.css`
- Create: `src/__tests__/day-roadbook.test.tsx`

**Interfaces:**
- Consumes: `TripDay.visual` and existing `onSelectDay(id)` callback.
- Produces: `data-testid="day-hero"`, an accessible day tablist, image error fallback, and adjacent-image preloading.

- [ ] **Step 1: Write failing interaction tests**

Test that the selected day renders its landscape label and three metrics, selecting Day 2 updates the title and hero image, and firing an image error adds an `is-image-unavailable` state without hiding copy.

- [ ] **Step 2: Run the focused test**

Run: `npm run test -- src/__tests__/day-roadbook.test.tsx`
Expected: FAIL because the hero and fallback do not exist.

- [ ] **Step 3: Implement the hero and content boundary**

Render the image as a semantic `<img>` behind layered gradients, apply `object-position` from `visual.focalPoint`, expose `visual.accent` through a scoped CSS custom property, and keep metrics inside the first viewport. Keep timeline, photo notes, and stay information on a stable warm-paper background.

- [ ] **Step 4: Add switching and fallback behavior**

Use local image-failure state keyed by `selectedDay.id`, scroll the hero into view after selecting a tab, use instant scroll for reduced-motion users, and preload the previous and next day images.

- [ ] **Step 5: Implement responsive and print CSS**

Desktop uses an 85–100vh hero and editorial content grid. At 560px and below, use safe text widths, a single content column, 44px tabs, mobile focal points, and no page overflow. Print hides hero imagery while retaining title and metrics.

- [ ] **Step 6: Run tests and commit**

Run: `npm run test -- src/__tests__/day-roadbook.test.tsx src/__tests__/navigation.test.tsx`
Expected: PASS.

Commit: `feat: redesign daily roadbook with cinematic heroes`

### Task 3: Make the site header and remaining views mobile-first

**Files:**
- Modify: `src/components/SiteHeader.tsx`
- Modify: `src/styles.css`
- Modify: `src/__tests__/navigation.test.tsx`

**Interfaces:**
- Consumes: existing `activeView` and `onSelectView` props.
- Produces: accessible menu toggle with `aria-expanded`, closing automatically after view selection.

- [ ] **Step 1: Write the failing mobile-menu test**

Assert that the menu button starts collapsed, expands the navigation, and collapses after selecting “每日路书”. Preserve existing desktop navigation queries.

- [ ] **Step 2: Run the navigation test**

Run: `npm run test -- src/__tests__/navigation.test.tsx`
Expected: FAIL because no menu toggle exists.

- [ ] **Step 3: Implement the menu state**

Add `useState(false)`, a labeled toggle button, `aria-expanded`, and an `is-open` navigation class. Wrap view selection so it closes the menu after calling `onSelectView`.

- [ ] **Step 4: Audit and correct global mobile CSS**

At 560px and below, constrain every section to the viewport, convert remaining multi-column layouts to one column, reduce map height, allow only local scrolling for strips, normalize 16px body text where appropriate, and enforce 44px controls. Do not alter desktop content hierarchy.

- [ ] **Step 5: Run navigation and full tests, then commit**

Run: `npm run test`
Expected: all tests PASS.

Commit: `style: optimize all views for mobile travel use`

### Task 4: Visual verification, build, and deployment

**Files:**
- Modify only if verification exposes defects in the files above.

**Interfaces:**
- Consumes: the completed application and existing deployment configuration.
- Produces: verified production build and deployed webpage.

- [ ] **Step 1: Run static verification**

Run: `npm run test && npm run typecheck && npm run build`
Expected: all commands exit 0.

- [ ] **Step 2: Verify in a real browser**

Run the Vite server and inspect 1440×900, 768×1024, 390×844, and 360×800. Check all seven days, mobile menu, map fallback, image fallback, no horizontal overflow, keyboard focus, reduced motion, and print preview.

- [ ] **Step 3: Fix defects and repeat verification**

For each defect, add or update the smallest relevant test where behavior is testable, then repeat Step 1 and the affected browser viewport.

- [ ] **Step 4: Commit verification fixes**

Commit: `fix: polish responsive roadbook presentation`

- [ ] **Step 5: Push and deploy through the repository's existing workflow**

Inspect the remote and GitHub Pages/Actions configuration, push the current branch, wait for the deployment job to pass, and open the published URL to verify the deployed build.
