# AMap Route Attractions Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Update the roadbook to eight travelers and provide reliable GaoDe driving routes with curated and optional nearby attraction layers.

**Architecture:** Extract route-result handling and nearby-place normalization into testable helpers. The React map loads the selected day first, queues remaining route searches, caches successful paths, never draws fallback straight lines, and exposes marker selections to the existing route detail panel.

**Tech Stack:** React 19, TypeScript 6, AMap JS API 2.0, Vitest 4, Testing Library

## Global Constraints

- Trip size is 8 people and 2 cars.
- Driving paths come only from successful `AMap.Driving` results.
- Failed route searches retain the base map and markers, show retry/open-GaoDe actions, and do not create a straight fallback polyline.
- Curated attractions are shown by default in yellow.
- GaoDe nearby attractions are optional, green, deduplicated, and capped at 8 for the selected day.
- Existing desktop three-column layout remains; mobile controls and details must not cover the map.

---

### Task 1: Lock metadata and route-result behavior

**Files:**
- Modify: `src/__tests__/itinerary.test.ts`
- Create: `src/__tests__/amap-routing.test.ts`
- Create: `src/map/routePlanning.ts`
- Modify: `src/data/itinerary.ts`

**Interfaces:**
- Produces: `extractDrivingPath(result): Coordinates[] | null`, `normalizeNearbyPlaces(results, limit): NearbyAttraction[]`, eight-person metadata, and curated attraction data on each `TripDay`

- [ ] Write tests expecting `tripMeta.people === 8`, successful step-path extraction, `null` for `error/no_data` results, and nearby-result deduplication capped at 8.
- [ ] Run `npm run test -- src/__tests__/itinerary.test.ts src/__tests__/amap-routing.test.ts` and verify RED for missing behavior.
- [ ] Add the typed helpers, update trip metadata, and add curated attraction coordinates/details to itinerary days.
- [ ] Re-run the focused tests and verify GREEN.

### Task 2: Build the interactive map layers

**Files:**
- Modify: `src/map/AmapRouteMap.tsx`
- Modify: `src/map/amapLoader.ts`
- Modify: `src/components/RouteExplorer.tsx`
- Modify: `src/styles.css`
- Modify: `src/__tests__/map-fallback.test.tsx`
- Modify: `src/__tests__/navigation.test.tsx`

**Interfaces:**
- Consumes: route helpers and curated attractions from Task 1
- Produces: selected-day-first route queue, retries, route cache, curated/nearby toggles, marker detail selection, and mobile layout

- [ ] Add failing component tests for eight-person copy, default layer states, and route failure UI without a fallback polyline.
- [ ] Run `npm run test -- src/__tests__/map-fallback.test.tsx src/__tests__/navigation.test.tsx` and verify RED.
- [ ] Implement selected-day-first sequential route loading with one automatic retry, successful-path caching, visible per-day failure state, and GaoDe deep-link fallback.
- [ ] Load `AMap.PlaceSearch`; query only when the nearby toggle is enabled, normalize/deduplicate results, and cap markers at 8.
- [ ] Render curated yellow markers and nearby green markers; connect marker selection to a detail panel with source, stay time, advice, and safety note.
- [ ] Add compact layer controls and responsive styles that keep the map unobstructed.
- [ ] Run focused tests, then `npm run test && npm run typecheck && npm run build`.
- [ ] Verify the live map in desktop and mobile browser viewports, including Day 6/7 route shape, nonblank base map, toggles, marker details, and failure state.
