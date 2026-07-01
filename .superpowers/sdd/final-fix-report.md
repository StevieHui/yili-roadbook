# Final Fix Report

## Changed Files

- `src/components/TripOverview.tsx`
- `src/data/itinerary.ts`
- `src/__tests__/itinerary.test.ts`

## Findings Addressed

1. Replaced the hard-coded stay relay in `TripOverview` with labels derived from canonical itinerary stay data so the July 21 airport-area stay is included.
2. Corrected the Day 3 `07:30` timeline detail from stale weekend wording to Friday-specific wording.
3. Added exact assertions for `arrivalDay.rental.arrivalTime === '14:30'` and for the Day 7 `15:30` timeline event that explicitly completes the return.

## RED Evidence

Focused run before production changes:

```text
$ npm run test -- src/__tests__/itinerary.test.ts
FAIL src/__tests__/itinerary.test.ts
- shows the full stay relay through the July 21 airport-area overnight stop
  Expected final stay item "伊宁机场" but it was missing.
- keeps the friday departure copy and day 7 return completion exact
  Expected Day 3 detail "周五尽早出城，车上解决简餐。"
  Received "周末提前出城，车上解决简餐。"
```

## GREEN Evidence

Focused run after the fixes:

```text
$ npm run test -- src/__tests__/itinerary.test.ts
PASS src/__tests__/itinerary.test.ts
Tests 6 passed (6)
```

## Full Verification

```text
$ npm run test && npm run typecheck && npm run build
PASS 5 test files, 11 tests passed
PASS tsc --noEmit
PASS vite build
```

## Commit

- Commit message: `fix: align itinerary return details`

## Self-Review

- Kept the scope inside the owned files only.
- Derived the overview stay sequence from existing itinerary stay data with a small local label normalizer instead of adding new schema.
- Tightened tests around the exact review requirements without redesigning the itinerary model or UI.
