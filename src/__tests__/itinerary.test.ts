import { render, screen, within } from '@testing-library/react';
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

  it('keeps the route near 1300 kilometres for eight people', () => {
    expect(getTripDistance(tripDays)).toBeGreaterThanOrEqual(1250);
    expect(getTripDistance(tripDays)).toBeLessThanOrEqual(1350);
    expect(tripMeta).toMatchObject({ people: 8, cars: 2 });
  });

  it('gives every day a stay, route, and photo spot', () => {
    for (const day of tripDays) {
      expect(day.stay.length).toBeGreaterThan(0);
      expect(day.route.length).toBeGreaterThanOrEqual(2);
      expect(day.photoSpots.length).toBeGreaterThan(0);
    }
    expect(getDayById('day-6')?.title).toContain('独库');
  });

  it('gives every day a unique, usable visual identity', () => {
    const imagePaths = tripDays.map((day) => day.visual.image);

    expect(new Set(imagePaths)).toHaveLength(tripDays.length);
    for (const day of tripDays) {
      expect(day.visual.image).toMatch(/^\/images\/roadbook\/day-\d{2}-[a-z-]+\.webp$/);
      expect(day.visual.alt.trim().length).toBeGreaterThan(8);
      expect(day.visual.landscape.trim().length).toBeGreaterThan(1);
      expect(day.visual.focalPoint).toMatch(/^\d+% \d+%$/);
      expect(day.visual.accent).toMatch(/^#[0-9a-fA-F]{6}$/);
    }
  });

  it('shows the revised rental metadata in the overview', () => {
    render(jsx(TripOverview, {}));

    expect(arrivalDay.rental.arrivalTime).toBe('14:30');
    expect(arrivalDay.rental.pickupTime).toBe('15:30');
    expect(arrivalDay.rental.vehicles).toEqual([
      { model: '问界 M7', reservationName: '陈熠辉' },
      { model: '理想 L6', reservationName: '赵禹砚' },
    ]);
    expect(screen.getByText('14:30')).toBeVisible();
    expect(screen.getByText('15:30')).toBeVisible();
    expect(screen.getByText('问界 M7')).toBeVisible();
    expect(screen.getByText('陈熠辉')).toBeVisible();
    expect(screen.getByText('理想 L6')).toBeVisible();
    expect(screen.getByText('赵禹砚')).toBeVisible();
    expect(screen.getByText('伊宁机场服务点')).toBeVisible();
    expect(screen.getByText(/核对订单、保险与随车证件/)).toBeVisible();
    for (const task of arrivalDay.tasks) {
      expect(screen.getByText(task)).toBeVisible();
    }
  });

  it('shows the full stay relay through the July 21 airport-area overnight stop', () => {
    const { container } = render(jsx(TripOverview, {}));
    const stayLine = within(container).getByLabelText('住宿点');

    const stayItems = within(stayLine)
      .getAllByRole('listitem')
      .map((item) => item.textContent);

    expect(stayItems).toEqual(['伊宁', '伊宁', '特克斯', '特克斯', '库尔德宁', '那拉提', '尼勒克', '伊宁机场']);
  });

  it('keeps the friday departure copy and day 7 return completion exact', () => {
    const day3 = getDayById('day-3');
    const day7 = getDayById('day-7');

    expect(day3?.timeline).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          time: '09:00',
          activity: '特克斯出发',
          detail: '睡足后从容出发，车程仅半小时。连住两晚不用搬行李。',
        }),
      ]),
    );
    expect(day7?.timeline).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          time: '15:30',
          activity: '完成还车',
          detail: '机场服务点办结交车，次日按早班机节奏出发。',
        }),
        expect.objectContaining({
          time: '15:00',
          activity: '伊宁机场服务点',
        }),
      ]),
    );
    expect(day7?.route.map((stop) => stop.name)).toContain('伊宁机场服务点');
    expect(tripMeta.returnWindow).toBe('7 月 21 日 15:00 前到达伊宁机场服务点，15:30 前完成还车；7 月 22 日按早班机节奏直接出发。');
  });
});

