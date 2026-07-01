import type { TripDay } from '../types';

interface DayRoadbookProps {
  days: readonly TripDay[];
  selectedDayId: string;
}

function formatMinutes(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest ? `${hours}h ${rest}min` : `${hours}h`;
}

export function DayRoadbook({ days, selectedDayId }: DayRoadbookProps) {
  return (
    <section className="roadbook" id="roadbook" aria-labelledby="roadbook-title">
      <div className="section-shell roadbook-heading">
        <p className="section-kicker">THE FIELD NOTES</p>
        <h2 id="roadbook-title">分段路书</h2>
      </div>
      {days.map((day, index) => (
        <article
          className={`day-roadbook ${day.id === selectedDayId ? 'is-selected' : ''}`}
          id={`roadbook-${day.id}`}
          aria-labelledby={`${day.id}-title`}
          key={day.id}
        >
          <div className="day-rail">
            <span>DAY</span>
            <strong>{String(index + 1).padStart(2, '0')}</strong>
            <i />
            <small>{day.date.slice(5).replace('-', '.')}</small>
          </div>
          <div className="day-main">
            <header>
              <div>
                <h3 id={`${day.id}-title`}>{day.title}</h3>
                <p className="route-string">{day.route.map((stop) => stop.name).join(' → ')}</p>
                <p className="day-summary">{day.summary}</p>
              </div>
              <div className="day-metrics">
                <span><small>里程</small><strong>{day.distanceKm} km</strong></span>
                <span><small>驾驶</small><strong>{formatMinutes(day.driveMinutes)}</strong></span>
                <span><small>强度</small><strong className={`intensity intensity-${day.intensity}`}>{day.intensity}</strong></span>
              </div>
            </header>

            <div className="day-content-grid">
              <div className="timeline">
                <h4>当天节奏</h4>
                <ol>
                  {day.timeline.map((item) => (
                    <li key={`${day.id}-${item.time}`}>
                      <time>{item.time}</time>
                      <div><strong>{item.activity}</strong><p>{item.detail}</p></div>
                    </li>
                  ))}
                </ol>
              </div>
              <aside className="photo-callout">
                <p className="section-kicker">PHOTO NOTES</p>
                {day.photoSpots.map((spot) => (
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
              <p><span>今晚住</span>{day.stay}</p>
              <ul>{day.highlights.map((item) => <li key={item}>{item}</li>)}</ul>
              <div className="day-reminders">
                {day.reminders.map((item) => <p key={item}>注意 · {item}</p>)}
              </div>
            </footer>
          </div>
        </article>
      ))}
    </section>
  );
}

