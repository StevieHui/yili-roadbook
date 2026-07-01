import { cleanup, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { RouteExplorer } from '../components/RouteExplorer';
import { tripDays } from '../data/itinerary';

vi.mock('../map/amapLoader', () => ({
  loadAmap: vi.fn().mockResolvedValue({
    DrivingPolicy: { LEAST_TIME: 0 },
    Driving: class {
      search(_origin: unknown, _destination: unknown, _options: unknown, callback: (status: string, result: unknown) => void) {
        callback('complete', { routes: [{ steps: [{ path: [[81, 43], [82, 44]] }] }] });
      }
    },
    InfoWindow: class { setContent() {} open() {} close() {} },
    Map: class { add() {} addControl() {} destroy() {} setFitView() {} },
    Marker: class { on() {} setOpacity() {} show() {} hide() {} },
    Pixel: class { constructor(_x: number, _y: number) {} },
    Polyline: class { setOptions() {} },
    Scale: class {},
    ToolBar: class {},
  }),
}));

function getDetailPanel(): HTMLElement {
  return document.querySelector('.stop-detail')! as HTMLElement;
}

function getAside(): HTMLElement {
  return document.querySelector('.route-detail')! as HTMLElement;
}

describe('RouteExplorer', () => {
  afterEach(() => cleanup());

  it('shows the stop detail label and first stop name by default', () => {
    render(<RouteExplorer days={[tripDays[0]]} selectedDayId="day-1" onSelectDay={vi.fn()} />);
    expect(within(getDetailPanel()).getByText('当前停靠点')).toBeVisible();
    expect(within(getDetailPanel()).getByText('伊宁市')).toBeVisible();
  });

  it('renders the day title, summary, distance, and intensity in the detail aside', () => {
    render(<RouteExplorer days={[tripDays[0]]} selectedDayId="day-1" onSelectDay={vi.fn()} />);
    expect(within(getAside()).getByText(tripDays[0].title)).toBeVisible();
    expect(within(getAside()).getByText(tripDays[0].summary)).toBeVisible();
    expect(within(getAside()).getByText(`${tripDays[0].distanceKm} km`)).toBeVisible();
    expect(within(getAside()).getByText(tripDays[0].intensity)).toBeVisible();
  });

  it('renders four stop buttons for day-1 in the stop picker', () => {
    render(<RouteExplorer days={[tripDays[0]]} selectedDayId="day-1" onSelectDay={vi.fn()} />);
    const picker = screen.getByLabelText('停靠点列表');
    const buttons = picker.querySelectorAll('button');
    expect(buttons.length).toBe(tripDays[0].route.length);
    const names = Array.from(buttons).map((btn) => btn.textContent?.replace(/^\d/, '').trim());
    for (const stop of tripDays[0].route) {
      expect(names.some((name) => name?.includes(stop.name))).toBe(true);
    }
  });

  it('shows the default non-warning help text when no attraction is selected', () => {
    render(<RouteExplorer days={[tripDays[5]]} selectedDayId="day-6" onSelectDay={vi.fn()} />);
    expect(screen.getByText('当前停靠点')).toBeVisible();
    expect(within(getDetailPanel()).getByText(/点击地图看点或下方停靠点查看/)).toBeVisible();
  });

  it('renders the day list nav with both days', () => {
    render(<RouteExplorer days={[tripDays[0], tripDays[1]]} selectedDayId="day-1" onSelectDay={vi.fn()} />);
    const nav = screen.getByLabelText('选择路线日');
    expect(within(nav).getByText(tripDays[0].title)).toBeVisible();
    expect(within(nav).getByText(tripDays[1].title)).toBeVisible();
  });
});
