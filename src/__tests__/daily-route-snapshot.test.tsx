import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { tripDays } from '../data/itinerary';
import { DailyRouteSnapshot } from '../map/DailyRouteSnapshot';

const { mapOptionsSpy, mapAddSpy, markerSpy, polylineSpy, satelliteSpy } = vi.hoisted(() => ({
  mapOptionsSpy: vi.fn(),
  mapAddSpy: vi.fn(),
  markerSpy: vi.fn(),
  polylineSpy: vi.fn(),
  satelliteSpy: vi.fn(),
}));

vi.mock('../map/amapLoader', () => ({
  loadAmap: vi.fn().mockResolvedValue({
    DrivingPolicy: { LEAST_TIME: 0 },
    Driving: class {
      search(_origin: unknown, _destination: unknown, _options: unknown, callback: (status: string, result: unknown) => void) {
        callback('complete', { routes: [{ steps: [{ path: [[84.02, 43.24], [84.34, 43.31], [84.36, 43.65]] }] }] });
      }
    },
    Map: class {
      constructor(_container: unknown, options: unknown) { mapOptionsSpy(options); }
      add(item: unknown) { mapAddSpy(item); }
      destroy() {}
      setFitView() {}
    },
    Marker: class { constructor(options: unknown) { markerSpy(options); } },
    Polyline: class { constructor(options: unknown) { polylineSpy(options); } },
    TileLayer: {
      Satellite: class { constructor() { satelliteSpy(); } },
    },
  }),
}));

describe('DailyRouteSnapshot', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('renders a fixed satellite map with the real route and visible stops only', async () => {
    const day6 = tripDays[5];

    render(<DailyRouteSnapshot day={day6} />);

    await waitFor(() => expect(satelliteSpy).toHaveBeenCalledOnce());
    expect(mapOptionsSpy).toHaveBeenCalledWith(expect.objectContaining({
      dragEnable: false,
      zoomEnable: false,
      scrollWheel: false,
      doubleClickZoom: false,
      keyboardEnable: false,
      touchZoom: false,
    }));
    expect(polylineSpy).toHaveBeenCalledWith(expect.objectContaining({
      path: [[84.02, 43.24], [84.34, 43.31], [84.36, 43.65]],
    }));
    expect(markerSpy.mock.calls.map(([options]) => options.title)).toEqual(day6.route.map((stop) => stop.name));
    expect(screen.getByLabelText('Day 6 非交互卫星路线图')).toBeVisible();
  });
});
