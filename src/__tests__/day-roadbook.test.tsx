import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { DayRoadbook } from '../components/DayRoadbook';
import { tripDays } from '../data/itinerary';

vi.mock('../map/DailyRouteSnapshot', () => ({
  DailyRouteSnapshot: ({ day }: { day: { id: string } }) => (
    <div data-testid="daily-route-snapshot" data-day-id={day.id} />
  ),
}));

vi.mock('../map/DailyWeatherPanel', () => ({
  DailyWeatherPanel: ({ day }: { day: { weatherCity: string } }) => (
    <div data-testid="daily-weather-panel">{day.weatherCity}</div>
  ),
}));

describe('immersive daily roadbook', () => {
  afterEach(() => cleanup());

  it('puts the selected destination and driving metrics in the hero', () => {
    render(<DayRoadbook days={tripDays} selectedDayId="day-1" onSelectDay={() => undefined} />);

    const hero = screen.getByTestId('day-hero');
    expect(hero).toHaveTextContent('高山湖泊');
    expect(hero).toHaveTextContent('360 km');
    expect(hero).toHaveTextContent('5h');
    expect(hero).toHaveTextContent('较满');
    expect(screen.getByRole('img', { name: /赛里木湖湛蓝湖面/ })).toHaveAttribute('src', expect.stringContaining('day-01-sayram.webp'));
    expect(screen.getByRole('heading', { name: '行程' })).toBeVisible();
    expect(screen.getByText('查看行程')).toBeVisible();
    expect(screen.queryByText('当天节奏')).not.toBeInTheDocument();
  });

  it('exposes day selection as an accessible tablist', () => {
    const onSelectDay = vi.fn();
    render(<DayRoadbook days={tripDays} selectedDayId="day-1" onSelectDay={onSelectDay} />);

    const dayTwo = screen.getByRole('tab', { name: /DAY 02/ });
    expect(dayTwo).toHaveAttribute('aria-selected', 'false');
    fireEvent.click(dayTwo);
    expect(onSelectDay).toHaveBeenCalledWith('day-2');
  });

  it('keeps hero copy visible when the image fails', () => {
    render(<DayRoadbook days={tripDays} selectedDayId="day-1" onSelectDay={() => undefined} />);

    fireEvent.error(screen.getByRole('img', { name: /赛里木湖湛蓝湖面/ }));
    expect(screen.getByTestId('day-hero')).toHaveClass('is-image-unavailable');
    expect(screen.getByTestId('day-hero')).toHaveTextContent('伊宁 → 赛里木湖');
  });

  it('renders exactly one satellite snapshot for the selected day', () => {
    const { rerender } = render(
      <DayRoadbook days={tripDays} selectedDayId="day-1" onSelectDay={() => undefined} />,
    );

    expect(screen.getAllByTestId('daily-route-snapshot')).toHaveLength(1);
    expect(screen.getByTestId('daily-route-snapshot')).toHaveAttribute('data-day-id', 'day-1');
    rerender(<DayRoadbook days={tripDays} selectedDayId="day-6" onSelectDay={() => undefined} />);
    expect(screen.getAllByTestId('daily-route-snapshot')).toHaveLength(1);
    expect(screen.getByTestId('daily-route-snapshot')).toHaveAttribute('data-day-id', 'day-6');
  });

  it('keeps destination names together while allowing route-level wrapping', () => {
    const { container, rerender } = render(
      <DayRoadbook days={tripDays} selectedDayId="day-1" onSelectDay={() => undefined} />,
    );

    expect(Array.from(container.querySelectorAll('.route-title-segment')).map((node) => node.textContent)).toEqual([
      '伊宁',
      ' → 赛里木湖',
      ' 当日往返',
    ]);

    rerender(<DayRoadbook days={tripDays} selectedDayId="day-2" onSelectDay={() => undefined} />);
    expect(Array.from(container.querySelectorAll('.route-title-segment')).map((node) => node.textContent)).toEqual([
      '伊宁',
      ' → 特克斯',
    ]);

    rerender(<DayRoadbook days={tripDays} selectedDayId="day-6" onSelectDay={() => undefined} />);
    expect(Array.from(container.querySelectorAll('.route-title-segment')).map((node) => node.textContent)).toEqual([
      '那拉提',
      ' → 尼勒克',
    ]);

    rerender(<DayRoadbook days={tripDays} selectedDayId="day-7" onSelectDay={() => undefined} />);
    expect(Array.from(container.querySelectorAll('.route-title-segment')).map((node) => node.textContent)).toEqual([
      '尼勒克',
      ' → 伊宁机场服务点',
    ]);
  });
});
