import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { tripDays } from '../data/itinerary';
import { AmapRouteMap } from '../map/AmapRouteMap';

vi.mock('../map/amapLoader', () => ({
  loadAmap: vi.fn().mockRejectedValue(new Error('blocked')),
}));

describe('route map fallback', () => {
  it('keeps a readable route summary when AMap fails', async () => {
    render(<AmapRouteMap days={tripDays} selectedDayId="day-1" />);
    expect(await screen.findByText(/地图暂时无法加载/)).toBeVisible();
    expect(screen.getByText(/缘居阁民宿 → 赛里木湖东门/)).toBeVisible();
    expect(screen.getByText(/伊宁机场服务点（住宿标记：缘居阁民宿）/)).toBeVisible();
  });
});

