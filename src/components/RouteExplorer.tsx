import { useState } from 'react';
import type { TripDay } from '../types';
import { AmapRouteMap } from '../map/AmapRouteMap';
import type { MapAttraction } from '../map/routePlanning';

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
  const [selectedStopIndex, setSelectedStopIndex] = useState(0);
  const [selectedAttraction, setSelectedAttraction] = useState<MapAttraction | null>(null);
  const selectedStop = selectedDay.route[Math.min(selectedStopIndex, selectedDay.route.length - 1)];

  const handleSelectDay = (id: TripDay['id']) => {
    setSelectedStopIndex(0);
    setSelectedAttraction(null);
    onSelectDay(id);
  };

  return (
    <section className="tool-page route-explorer" aria-labelledby="route-explorer-title">
      <header className="tool-heading">
        <p className="section-kicker">路线查询</p>
        <h1 id="route-explorer-title">路线图</h1>
        <p>左侧选日期，中间点停靠点，右侧看里程、耗时、预约和风险。高德地图在下方作为辅助。</p>
      </header>

      <div className="route-workbench">
        <nav className="route-day-list" aria-label="选择路线日">
          {days.map((day, index) => (
            <button
              type="button"
              className={day.id === selectedDay.id ? 'is-active' : ''}
              onClick={() => handleSelectDay(day.id)}
              key={day.id}
            >
              <span>DAY {String(index + 1).padStart(2, '0')}</span>
              <strong>{day.title}</strong>
              <small>{day.distanceKm} km · {formatHours(day.driveMinutes)}</small>
            </button>
          ))}
        </nav>

        <div className="route-map-center" aria-label="路线地图区域">
          <AmapRouteMap days={days} selectedDayId={selectedDay.id} onSelectAttraction={setSelectedAttraction} />
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
          <div className="stop-detail">
            <span>{selectedAttraction ? (selectedAttraction.source === 'curated' ? '行程精选' : '高德周边') : '当前停靠点'}</span>
            <strong>{selectedAttraction?.name ?? selectedStop.name}</strong>
            {selectedAttraction ? (
              <>
                <p>{selectedAttraction.category}{selectedAttraction.stayMinutes ? ` · 建议停留 ${selectedAttraction.stayMinutes} 分钟` : ''}</p>
                <p>{selectedAttraction.advice}</p>
                {selectedAttraction.safetyNote && <small>{selectedAttraction.safetyNote}</small>}
              </>
            ) : (
              <p>{selectedStop.kind === 'warning' ? '管制/风险点，按现场交通指令执行。' : '点击地图看点或下方停靠点查看。'}</p>
            )}
          </div>
          <div className="stop-picker" aria-label="停靠点列表">
            {selectedDay.route.map((stop, index) => (
              <button
                type="button"
                className={index === selectedStopIndex ? 'is-active' : ''}
                key={`${selectedDay.id}-${stop.id}-${index}`}
                onClick={() => { setSelectedStopIndex(index); setSelectedAttraction(null); }}
              >
                <span>{index + 1}</span>
                <strong>{stop.name}</strong>
              </button>
            ))}
          </div>
          {selectedDay.id === 'day-6' ? (
            <div className="duku-notice">
              <strong>独库预约</strong>
              <p>那拉提入口 · 建议 08:00-10:00 或 10:00-12:00 · 19:00 前驶离受控路段。</p>
            </div>
          ) : null}
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

    </section>
  );
}
