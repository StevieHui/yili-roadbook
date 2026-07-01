import { render, screen } from '@testing-library/react';
import { jsx } from 'react/jsx-runtime';
import { describe, expect, it } from 'vitest';
import { TripOverview } from '../components/TripOverview';
import { arrivalDay, tripDays, tripMeta } from '../data/itinerary';
import { getDayById, getTripDistance } from '../lib/itinerary';

describe('itinerary data', () => {
  it('covers arrival plus seven driving days in order', () => {
    expect(arrivalDay.date).toBe('2026-07-14');
    expect(tripDays.map((day) => day.date)).toEqual([
      '2026-07-15',
      '2026-07-16',
      '2026-07-17',
      '2026-07-18',
      '2026-07-19',
      '2026-07-20',
      '2026-07-21',
    ]);
    expect(tripDays.map((day) => day.weekday)).toEqual([
      '周三',
      '周四',
      '周五',
      '周六',
      '周日',
      '周一',
      '周二',
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

  it('shows the revised rental metadata in the overview', () => {
    render(jsx(TripOverview, {}));

    expect(screen.getByText('15:30')).toBeVisible();
    expect(screen.getByText('问界 M7')).toBeVisible();
    expect(screen.getByText('陈熠辉')).toBeVisible();
    expect(screen.getByText('理想 L6')).toBeVisible();
    expect(screen.getByText('赵禹砚')).toBeVisible();
    expect(screen.getByText('伊宁机场服务点')).toBeVisible();
  });

  it('ends day 7 at the airport service location by 15:00 for the return deadline', () => {
    const day7 = getDayById('day-7');

    expect(day7?.timeline).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          time: '15:00',
          activity: '伊宁机场服务点',
        }),
      ]),
    );
    expect(day7?.route.map((stop) => stop.name)).toContain('伊宁机场服务点');
    expect(tripMeta.returnWindow).toContain('15:30');
  });
});

