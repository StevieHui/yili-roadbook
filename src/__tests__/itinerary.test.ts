import { describe, expect, it } from 'vitest';
import { arrivalDay, tripDays, tripMeta } from '../data/itinerary';
import { getDayById, getTripDistance } from '../lib/itinerary';

describe('itinerary data', () => {
  it('covers arrival plus seven driving days in order', () => {
    expect(arrivalDay.date).toBe('2026-07-15');
    expect(tripDays.map((day) => day.date)).toEqual([
      '2026-07-16',
      '2026-07-17',
      '2026-07-18',
      '2026-07-19',
      '2026-07-20',
      '2026-07-21',
      '2026-07-22',
    ]);
  });

  it('keeps the route near 1200 kilometres for seven people', () => {
    expect(getTripDistance(tripDays)).toBeGreaterThanOrEqual(1150);
    expect(getTripDistance(tripDays)).toBeLessThanOrEqual(1250);
    expect(tripMeta).toMatchObject({ people: 7, cars: 2 });
  });

  it('gives every day a stay, route, and photo spot', () => {
    for (const day of tripDays) {
      expect(day.stay.length).toBeGreaterThan(0);
      expect(day.route.length).toBeGreaterThanOrEqual(2);
      expect(day.photoSpots.length).toBeGreaterThan(0);
    }
    expect(getDayById('day-6')?.title).toContain('独库');
  });
});

