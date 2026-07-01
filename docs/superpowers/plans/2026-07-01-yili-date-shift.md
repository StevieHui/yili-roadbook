# Yili Date Shift Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Update the roadbook for a July 14 arrival, July 15-21 driving loop, fixed two-car airport rental, and July 22 morning departure.

**Architecture:** Keep the current static itinerary model and React components. Change the canonical content in `src/data/itinerary.ts`, update the standalone alert copy, and lock the new dates and rental constraints into focused Vitest assertions.

**Tech Stack:** React 19, TypeScript 6, Vite 8, Vitest 4, Testing Library

## Global Constraints

- Arrival is 2026-07-14 at 14:30; pickup is 15:30.
- Rental is two AITO M7 vehicles from 2026-07-14 15:30 through 2026-07-21 15:30 at the Yining Airport service location.
- Day 1 through Day 7 run from 2026-07-15 through 2026-07-21.
- Day 7 must reach the airport service location and finish return by 15:30.
- July 22 is an early departure day with no sightseeing.
- Preserve route order, attractions, overnight destinations, and intra-day times except where Day 7 must change to meet the return deadline.

---

### Task 1: Lock the revised schedule into tests

**Files:**
- Modify: `src/__tests__/itinerary.test.ts`
- Modify: `src/__tests__/calendar-map.test.tsx`

**Interfaces:**
- Consumes: `arrivalDay`, `tripDays`, and `tripMeta` from `src/data/itinerary.ts`
- Produces: Regression coverage for dates, weekdays, rental details, and the Day 6 calendar label

- [ ] **Step 1: Write the failing data assertions**

Update the first itinerary test to expect arrival on `2026-07-14`, driving dates `2026-07-15` through `2026-07-21`, and weekdays Tuesday through Monday. Add assertions that visible metadata contains `15:30`, `两台问界 M7`, and `伊宁机场服务点`, and that Day 7 contains a 15:30 return deadline.

- [ ] **Step 2: Update the calendar expectation**

Change the Day 6 booking button lookup from `/7月21日/` to `/7月20日/`; keep the route and booking assertions unchanged.

- [ ] **Step 3: Run the focused tests and verify RED**

Run: `npm run test -- src/__tests__/itinerary.test.ts src/__tests__/calendar-map.test.tsx`

Expected: FAIL because production data still starts on July 15/16 and lacks the new rental copy.

### Task 2: Update canonical itinerary and alert copy

**Files:**
- Modify: `src/data/itinerary.ts`
- Modify: `src/components/CriticalAlerts.tsx`
- Test: `src/__tests__/itinerary.test.ts`
- Test: `src/__tests__/calendar-map.test.tsx`

**Interfaces:**
- Consumes: Existing `tripMeta`, `arrivalDay`, `reservationTasks`, and `tripDays` shapes
- Produces: Revised static content consumed by all current views without component API changes

- [ ] **Step 1: Shift canonical dates and weekdays**

Set the range to July 14-22, arrival to `2026-07-14`, and Day 1-7 to July 15-21 with weekdays `周三`, `周四`, `周五`, `周六`, `周日`, `周一`, `周二`.

- [ ] **Step 2: Add exact rental content**

State that arrival is 14:30 and pickup is 15:30, the rental contains two AITO M7 vehicles, pickup/return is at the Yining Airport service location, and the rental ends July 21 at 15:30. Update reservation dates for Day 1-2, Day 6, and Day 7.

- [ ] **Step 3: Make Day 7 executable**

Replace the old 09:30 departure and 18:00 optional return with an earlier departure, pre-return refueling/cleaning, and a hard `15:30` airport return. Remove July 23 lodging and sunset alternatives.

- [ ] **Step 4: Replace stale alert copy**

Change alert 05 to emphasize the July 21 15:30 airport return and July 22 early departure. Remove references to July 22 evening flights and July 23 return.

- [ ] **Step 5: Run focused tests and verify GREEN**

Run: `npm run test -- src/__tests__/itinerary.test.ts src/__tests__/calendar-map.test.tsx`

Expected: Both files PASS.

- [ ] **Step 6: Commit the behavior change**

```bash
git add src/data/itinerary.ts src/components/CriticalAlerts.tsx src/__tests__/itinerary.test.ts src/__tests__/calendar-map.test.tsx
git commit -m "feat: shift Yili itinerary to July 14 arrival"
```

### Task 3: Verify the whole application

**Files:**
- Verify only

**Interfaces:**
- Consumes: Completed schedule changes
- Produces: Test, type, and production-build evidence

- [ ] **Step 1: Scan for stale schedule copy**

Run: `rg -n "2026-07-22|7 月 22 日晚|7 月 23|22/23|23 日返" src`

Expected: No stale itinerary or optional-return text.

- [ ] **Step 2: Run the complete verification suite**

Run: `npm run test && npm run typecheck && npm run build`

Expected: All tests pass, TypeScript exits successfully, and Vite produces `dist/`.
