import type { TripDay } from '../types';
import { AmapRouteMap } from '../map/AmapRouteMap';

interface RouteExplorerProps {
  days: readonly TripDay[];
  selectedDayId: TripDay['id'];
  onSelectDay: (id: TripDay['id']) => void;
}

function formatHours(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest ? `${hours} 小时 ${rest} 分` : `${hours} 小时`;
}

export function RouteExplorer({ days, selectedDayId, onSelectDay }: RouteExplorerProps) {
  const selectedDay = days.find((day) => day.id === selectedDayId) ?? days[0];

  return (
    <section className="tool-page route-explorer" aria-labelledby="route-explorer-title">
      <header className="tool-heading">
        <p className="section-kicker">ROUTE MAP / DAILY SWITCHER</p>
        <h1 id="route-explorer-title">交互路线图</h1>
        <p>先用下方示意图快速决策；高德加载成功后，可继续查看真实道路轨迹。</p>
      </header>

      <div className="route-workbench">
        <nav className="route-day-list" aria-label="选择路线日">
          {days.map((day, index) => (
            <button
              type="button"
              className={day.id === selectedDay.id ? 'is-active' : ''}
              onClick={() => onSelectDay(day.id)}
              key={day.id}
            >
              <span>DAY {String(index + 1).padStart(2, '0')}</span>
              <strong>{day.title}</strong>
              <small>{day.distanceKm} km · {formatHours(day.driveMinutes)}</small>
            </button>
          ))}
        </nav>

        <div className="schematic-map" aria-label={`${selectedDay.title}路线示意`}>
          {selectedDay.route.map((stop, index) => (
            <div className={`schematic-stop stop-${stop.kind}`} key={`${selectedDay.id}-${stop.id}-${index}`}>
              <i>{index + 1}</i>
              <span>{stop.name}</span>
            </div>
          ))}
        </div>

        <aside className="route-detail">
          <span>{selectedDay.date} · {selectedDay.weekday}</span>
          <h2>{selectedDay.title}</h2>
          <p>{selectedDay.summary}</p>
          <div className="route-metrics">
            <strong>{selectedDay.distanceKm} km</strong>
            <strong>{formatHours(selectedDay.driveMinutes)}</strong>
            <strong>{selectedDay.intensity}</strong>
          </div>
          <h3>关键提醒</h3>
          <ul>
            {selectedDay.reminders.map((item) => <li key={item}>{item}</li>)}
          </ul>
          <h3>出片点</h3>
          <ul>
            {selectedDay.photoSpots.map((spot) => (
              <li key={spot.name}>{spot.name} · {spot.bestTime} · {spot.shot}</li>
            ))}
          </ul>
        </aside>
      </div>

      <AmapRouteMap days={days} selectedDayId={selectedDay.id} />
    </section>
  );
}
