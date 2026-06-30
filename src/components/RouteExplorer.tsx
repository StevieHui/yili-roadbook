import { useState } from 'react';
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
  const [selectedStopIndex, setSelectedStopIndex] = useState(0);
  const selectedStop = selectedDay.route[Math.min(selectedStopIndex, selectedDay.route.length - 1)];

  const handleSelectDay = (id: TripDay['id']) => {
    setSelectedStopIndex(0);
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

        <div className="schematic-map" aria-label="可点击路线示意图">
          {selectedDay.route.map((stop, index) => (
            <button
              type="button"
              className={`schematic-stop stop-${stop.kind} ${index === selectedStopIndex ? 'is-active' : ''}`}
              key={`${selectedDay.id}-${stop.id}-${index}`}
              onClick={() => setSelectedStopIndex(index)}
            >
              <i>{index + 1}</i>
              <span>{stop.name}</span>
            </button>
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
          <div className="stop-detail">
            <span>当前停靠点</span>
            <strong>{selectedStop.name}</strong>
            <p>{selectedStop.kind === 'warning' ? '管制/风险点，按现场交通指令执行。' : '点击中间停靠点可切换查看。'}</p>
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

      <section className="amap-secondary" aria-label="高德地图辅助">
        <header>
          <h2>高德地图（辅助）</h2>
          <p>如果域名、密钥或安全码限制导致加载失败，上方可点击路线图仍可正常使用。</p>
        </header>
        <AmapRouteMap days={days} selectedDayId={selectedDay.id} />
      </section>
    </section>
  );
}
