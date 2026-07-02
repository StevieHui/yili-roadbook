import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { tripDays } from '../data/itinerary';
import { AmapRouteMap } from '../map/AmapRouteMap';

const { drivingSearchSpy, markerSpy, polylineSpy } = vi.hoisted(() => ({
  drivingSearchSpy: vi.fn(),
  markerSpy: vi.fn(),
  polylineSpy: vi.fn(),
}));

vi.mock('../map/amapLoader', () => ({
  loadAmap: vi.fn().mockResolvedValue({
    DrivingPolicy: { LEAST_TIME: 0 },
    Driving: class {
      search(origin: unknown, destination: unknown, options: unknown, callback: (status: string, result: unknown) => void) {
        drivingSearchSpy(origin, destination, options);
        callback('error', { info: 'CUQPS_HAS_EXCEEDED_THE_LIMIT' });
      }
    },
    InfoWindow: class {
      setContent() {}
      open() {}
      close() {}
    },
    Map: class {
      add() {}
      addControl() {}
      destroy() {}
      setFitView() {}
    },
    Marker: class {
      constructor(options: unknown) { markerSpy(options); }
      on() {}
      setOpacity() {}
      show() {}
      hide() {}
    },
    Pixel: class {
      constructor(_x: number, _y: number) {}
    },
    Polyline: class {
      constructor(options: unknown) { polylineSpy(options); }
      setOptions() {}
    },
    Scale: class {},
    TileLayer: { Traffic: class { setOpacity() {} } },
    ToolBar: class {},
  }),
}));

describe('AMap route errors', () => {
  afterEach(() => cleanup());

  it('shows a retry state and never substitutes a straight polyline', async () => {
    render(<AmapRouteMap days={[tripDays[6]]} selectedDayId="day-7" />);

    expect(await screen.findByText(/Day 7 导航路线暂未获取/)).toBeVisible();
    expect(screen.getByRole('button', { name: '重试路线' })).toBeVisible();
    expect(polylineSpy).not.toHaveBeenCalled();
  });

  it('exposes curated and GaoDe-nearby layer controls', async () => {
    render(<AmapRouteMap days={[tripDays[0]]} selectedDayId="day-1" />);

    await waitFor(() => expect(screen.getByRole('checkbox', { name: '精选看点' })).toBeChecked());
    expect(screen.getByRole('checkbox', { name: '高德周边' })).not.toBeChecked();
  });

  it('marks the day 7 lodging without adding it to the driving route', async () => {
    drivingSearchSpy.mockClear();
    markerSpy.mockClear();
    const day7 = {
      ...tripDays[6],
      mapOnlyStops: [{ id: 'map-only-lodging', name: '仅显示住宿点', coordinates: [81.25, 43.95] as const, kind: 'stay' as const }],
    };

    render(<AmapRouteMap days={[day7]} selectedDayId="day-7" />);

    await screen.findByText(/Day 7 导航路线暂未获取/);
    expect(drivingSearchSpy).toHaveBeenCalledWith(
      day7.route[0].coordinates,
      day7.route.at(-1)?.coordinates,
      { waypoints: day7.route.slice(1, -1).map((stop) => stop.coordinates) },
    );
    expect(markerSpy).toHaveBeenCalledWith(expect.objectContaining({ title: '仅显示住宿点' }));
  });
});
