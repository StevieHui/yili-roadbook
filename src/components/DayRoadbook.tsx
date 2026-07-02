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

export function DayRoadbook({ days, selectedDayId, onSelectDay }: DayRoadbookProps) {
  const selectedDay = days.find((d) => d.id === selectedDayId) ?? days[0];
  const dayIndex = days.findIndex((d) => d.id === selectedDay.id);

  return (
    <section className="roadbook" id="roadbook" aria-labelledby="roadbook-title">
      <div className="section-shell roadbook-heading">
        <p className="section-kicker">THE FIELD NOTES</p>
        <h2 id="roadbook-title">分段路书</h2>
      </div>

      <nav className="roadbook-tabs" aria-label="选择日期">
        {days.map((day, index) => (
          <button
            type="button"
            key={day.id}
            className={day.id === selectedDayId ? 'is-active' : ''}
            onClick={() => onSelectDay(day.id)}
          >
            <span>DAY {String(index + 1).padStart(2, '0')}</span>
            <strong>{day.date.slice(5)}</strong>
            <small>{day.weekday}</small>
          </button>
        ))}
      </nav>

      <article
        className="day-roadbook"
        id={`roadbook-${selectedDay.id}`}
        aria-labelledby={`${selectedDay.id}-title`}
        key={selectedDay.id}
      >
        {selectedDay.heroImage && (
          <div
            className="day-hero"
            style={{ backgroundImage: `url(${selectedDay.heroImage})` }}
            aria-hidden="true"
          >
            <div className="day-hero-overlay">
              <span>DAY {String(dayIndex + 1).padStart(2, '0')}</span>
              <h3>{selectedDay.title}</h3>
              <p>{selectedDay.route.map((stop) => stop.name).join(' → ')}</p>
            </div>
          </div>
        )}
        <div className="day-rail">
          <span>DAY</span>
          <strong>{String(dayIndex + 1).padStart(2, '0')}</strong>
          <i />
          <small>{selectedDay.date.slice(5).replace('-', '.')}</small>
        </div>
        <div className="day-main">
          <header>
            <div>
              <h3 id={`${selectedDay.id}-title`}>{selectedDay.title}</h3>
              <p className="route-string">{selectedDay.route.map((stop) => stop.name).join(' → ')}</p>
              <p className="day-summary">{selectedDay.summary}</p>
            </div>
            <div className="day-metrics">
              <span><small>里程</small><strong>{selectedDay.distanceKm} km</strong></span>
              <span><small>驾驶</small><strong>{formatMinutes(selectedDay.driveMinutes)}</strong></span>
              <span><small>强度</small><strong className={`intensity intensity-${selectedDay.intensity}`}>{selectedDay.intensity}</strong></span>
            </div>
          </header>

          <div className="day-content-grid">
            <div className="timeline">
              <h4>当天节奏</h4>
              <ol>
                {selectedDay.timeline.map((item) => (
                  <li key={`${selectedDay.id}-${item.time}`}>
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

          <footer className="day-footer">
            <p><span>今晚住</span>{selectedDay.stay}</p>
          </footer>
        </div>
      </article>
    </section>
  );
}

