import { useEffect, useState } from 'react';
import type { TripDay } from '../types';
import { loadAmap } from './amapLoader';

interface DailyWeatherPanelProps {
  day: TripDay;
}

interface LiveWeather {
  city: string;
  weather: string;
  temperature: string;
  windDirection: string;
  windPower: string;
  humidity: string;
  reportTime: string;
}

interface ForecastWeather {
  date: string;
  dayWeather: string;
  nightWeather: string;
  dayTemp: string;
  nightTemp: string;
  dayWindDir: string;
  dayWindPower: string;
}

function getLive(weather: any, city: string): Promise<LiveWeather> {
  return new Promise((resolve, reject) => {
    weather.getLive(city, (error: unknown, data: LiveWeather) => error ? reject(error) : resolve(data));
  });
}

function getForecast(weather: any, city: string): Promise<ForecastWeather[]> {
  return new Promise((resolve, reject) => {
    weather.getForecast(city, (error: unknown, data: { forecasts?: ForecastWeather[] }) => (
      error ? reject(error) : resolve(data.forecasts ?? [])
    ));
  });
}

function shortDate(date: string) {
  return date.slice(5).replace('-', '.');
}

function tripDateLabel(date: string) {
  const [, month, day] = date.split('-');
  return `${Number(month)} 月 ${Number(day)} 日`;
}

export function DailyWeatherPanel({ day }: DailyWeatherPanelProps) {
  const [live, setLive] = useState<LiveWeather | null>(null);
  const [forecasts, setForecasts] = useState<ForecastWeather[]>([]);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setStatus('loading');
      try {
        const AMap = await loadAmap();
        const weather = new AMap.Weather();
        const [nextLive, nextForecasts] = await Promise.all([
          getLive(weather, day.weatherCity),
          getForecast(weather, day.weatherCity),
        ]);
        if (cancelled) return;
        setLive(nextLive);
        setForecasts(nextForecasts);
        setStatus('ready');
      } catch {
        if (!cancelled) setStatus('error');
      }
    }
    void load();
    return () => { cancelled = true; };
  }, [day]);

  if (status === 'loading') return <section className="daily-weather-panel is-status">正在获取当地天气...</section>;
  if (status === 'error' || !live) return <section className="daily-weather-panel is-status">天气暂未获取</section>;

  const includesTripDate = forecasts.some((forecast) => forecast.date === day.date);
  return (
    <section className="daily-weather-panel" aria-label={`${day.weatherCity}天气预报`}>
      <div className="daily-weather-live">
        <p className="section-kicker">LOCAL WEATHER</p>
        <div><strong>{live.city || day.weatherCity}</strong><b>{live.temperature}℃</b></div>
        <p>{live.weather} · {live.windDirection}风 {live.windPower}级 · 湿度 {live.humidity}%</p>
        <small>高德更新于 {live.reportTime}</small>
      </div>
      <div className="daily-weather-forecast">
        {forecasts.map((forecast) => (
          <article className={forecast.date === day.date ? 'is-trip-day' : ''} key={forecast.date}>
            <time>{shortDate(forecast.date)}</time>
            <strong>{forecast.dayWeather}</strong>
            <span>{forecast.nightTemp}–{forecast.dayTemp}℃</span>
            <small>{forecast.dayWindDir}风 {forecast.dayWindPower}级</small>
          </article>
        ))}
      </div>
      {!includesTripDate && (
        <p className="daily-weather-window">尚未进入 {tripDateLabel(day.date)}预报窗口，当前数据仅供装备准备参考。</p>
      )}
    </section>
  );
}
