import { useEffect, useRef, useState, type CSSProperties } from 'react';
import type { TripDay } from '../types';

interface DayRoadbookProps {
  days: readonly TripDay[];
  selectedDayId: TripDay['id'];
  onSelectDay: (id: TripDay['id']) => void;
}

function formatMinutes(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest ? `${hours}h ${rest}min` : `${hours}h`;
}

function assetUrl(path: string) {
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;
}

function routeTitleSegments(title: string) {
  const parts = title.split(/\s*(→|·)\s*/).filter(Boolean);
  const segments = [parts[0]];
  for (let index = 1; index < parts.length; index += 2) {
    segments.push(` ${parts[index]} ${parts[index + 1]}`);
  }
  return segments;
}

export function DayRoadbook({ days, selectedDayId, onSelectDay }: DayRoadbookProps) {
  const selectedDay = days.find((day) => day.id === selectedDayId) ?? days[0];
  const dayIndex = days.findIndex((day) => day.id === selectedDay.id);
  const heroRef = useRef<HTMLDivElement>(null);
  const activeTabRef = useRef<HTMLButtonElement>(null);
  const [failedDayId, setFailedDayId] = useState<TripDay['id'] | null>(null);

  useEffect(() => {
    activeTabRef.current?.scrollIntoView?.({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    const adjacentDays = [days[dayIndex - 1], days[dayIndex + 1]].filter(Boolean);
    adjacentDays.forEach((day) => {
      const image = new Image();
      image.src = assetUrl(day.visual.image);
    });
  }, [dayIndex, days]);

  const selectDay = (id: TripDay['id']) => {
    onSelectDay(id);
    requestAnimationFrame(() => {
      const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
      heroRef.current?.scrollIntoView?.({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    });
  };

  const heroStyle = {
    '--day-accent': selectedDay.visual.accent,
    '--day-focal-point': selectedDay.visual.focalPoint,
  } as CSSProperties;

  return (
    <section className="roadbook immersive-roadbook" id="roadbook" aria-labelledby="roadbook-title">
      <h2 id="roadbook-title" className="visually-hidden">每日路书</h2>

      <nav className="roadbook-tabs" aria-label="选择日期" role="tablist">
        {days.map((day, index) => {
          const isActive = day.id === selectedDayId;
          return (
            <button
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`roadbook-${day.id}`}
              ref={isActive ? activeTabRef : undefined}
              key={day.id}
              className={isActive ? 'is-active' : ''}
              onClick={() => selectDay(day.id)}
            >
              <span>DAY {String(index + 1).padStart(2, '0')}</span>
              <strong>{day.date.slice(5)}</strong>
              <small>{day.weekday}</small>
            </button>
          );
        })}
      </nav>

      <article id={`roadbook-${selectedDay.id}`} aria-labelledby={`${selectedDay.id}-title`} role="tabpanel">
        <div
          ref={heroRef}
          className={`day-hero${failedDayId === selectedDay.id ? ' is-image-unavailable' : ''}`}
          data-testid="day-hero"
          style={heroStyle}
        >
          <img
            src={assetUrl(selectedDay.visual.image)}
            alt={selectedDay.visual.alt}
            onError={() => setFailedDayId(selectedDay.id)}
          />
          <div className="day-hero-shade" aria-hidden="true" />
          <div className="day-hero-copy">
            <div className="day-hero-index">
              <span>DAY</span>
              <strong>{String(dayIndex + 1).padStart(2, '0')}</strong>
              <small>{selectedDay.date.slice(5).replace('-', '.')} · {selectedDay.weekday}</small>
            </div>
            <div className="day-hero-main">
              <p className="day-landscape">{selectedDay.visual.landscape}</p>
              <h3 id={`${selectedDay.id}-title`}>
                {routeTitleSegments(selectedDay.title).map((segment) => (
                  <span className="route-title-segment" key={segment}>{segment}</span>
                ))}
              </h3>
              <p className="route-string">{selectedDay.route.map((stop) => stop.name).join(' → ')}</p>
              <p className="day-summary">{selectedDay.summary}</p>
            </div>
            <div className="day-metrics" aria-label="当天驾驶信息">
              <span><small>里程</small><strong>{selectedDay.distanceKm} km</strong></span>
              <span><small>驾驶</small><strong>{formatMinutes(selectedDay.driveMinutes)}</strong></span>
              <span><small>强度</small><strong>{selectedDay.intensity}</strong></span>
            </div>
            <a className="day-scroll-cue" href="#day-schedule"><span>查看行程</span><i aria-hidden="true">↓</i></a>
          </div>
        </div>

        <div className="day-roadbook" id="day-schedule">
          <div className="day-main">
            <header className="day-section-heading">
              <div><p className="section-kicker">ON THE ROAD</p><h3>行程</h3></div>
              <p>按时间执行，给风景和路况留出余量。</p>
            </header>
            <div className="day-content-grid">
              <div className="timeline">
                <ol>
                  {selectedDay.timeline.map((item, index) => (
                    <li key={`${selectedDay.id}-${item.time}`} className={index === 0 ? 'is-departure' : ''}>
                      <time>{item.time}</time>
                      <div><strong>{item.activity}</strong><p>{item.detail}</p></div>
                    </li>
                  ))}
                </ol>
              </div>
              <aside className="photo-callout">
                <p className="section-kicker">PHOTO NOTES</p>
                {selectedDay.photoSpots.map((spot) => (
                  <div className="photo-note" key={spot.name}>
                    <span>{spot.bestTime}</span>
                    <h4>{spot.name}</h4>
                    <p>{spot.shot}</p>
                    <small>{spot.note}</small>
                  </div>
                ))}
              </aside>
            </div>
            <footer className="day-footer"><p><span>今晚住</span>{selectedDay.stay}</p></footer>
          </div>
        </div>
      </article>
    </section>
  );
}
