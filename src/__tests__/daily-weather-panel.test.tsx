import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { tripDays } from '../data/itinerary';
import { DailyWeatherPanel } from '../map/DailyWeatherPanel';

const weatherConstructorSpy = vi.fn();

vi.mock('../map/amapLoader', () => ({
  loadAmap: vi.fn().mockResolvedValue({
    Weather: class {
      constructor() { weatherConstructorSpy(); }
      getLive(city: string, callback: (error: null, data: unknown) => void) {
        callback(null, {
          city,
          weather: '晴',
          temperature: '24',
          windDirection: '西',
          windPower: '3',
          humidity: '38',
          reportTime: '2026-07-02 20:00:00',
        });
      }
      getForecast(city: string, callback: (error: null, data: unknown) => void) {
        callback(null, {
          city,
          forecasts: [
            { date: '2026-07-02', dayWeather: '晴', nightWeather: '多云', dayTemp: '29', nightTemp: '17', dayWindDir: '西', dayWindPower: '3' },
            { date: '2026-07-03', dayWeather: '多云', nightWeather: '小雨', dayTemp: '27', nightTemp: '16', dayWindDir: '西北', dayWindPower: '4' },
          ],
        });
      }
    },
  }),
}));

describe('DailyWeatherPanel', () => {
  it('shows live conditions and near-term forecast without pretending it covers the trip date', async () => {
    render(<DailyWeatherPanel day={tripDays[5]} />);

    await waitFor(() => expect(weatherConstructorSpy).toHaveBeenCalledOnce());
    expect(screen.getByText('尼勒克县')).toBeVisible();
    expect(screen.getByText('24℃')).toBeVisible();
    expect(screen.getByText(/晴 · 西风 3级/)).toBeVisible();
    expect(screen.getByText('07.02')).toBeVisible();
    expect(screen.getByText('07.03')).toBeVisible();
    expect(screen.getByText(/尚未进入 7 月 20 日预报窗口/)).toBeVisible();
    expect(screen.getByText(/高德更新于 2026-07-02 20:00:00/)).toBeVisible();
  });
});
