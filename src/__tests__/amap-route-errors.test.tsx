import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { tripDays } from '../data/itinerary';
import { AmapRouteMap } from '../map/AmapRouteMap';

const { polylineSpy } = vi.hoisted(() => ({ polylineSpy: vi.fn() }));

vi.mock('../map/amapLoader', () => ({
  loadAmap: vi.fn().mockResolvedValue({
    DrivingPolicy: { LEAST_TIME: 0 },
    Driving: class {
      search(_origin: unknown, _destination: unknown, _options: unknown, callback: (status: string, result: unknown) => void) {
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
});
