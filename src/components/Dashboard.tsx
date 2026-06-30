import { reservationTasks, tripMeta } from '../data/itinerary';
import type { TripDay } from '../types';

interface DashboardProps {
  days: readonly TripDay[];
  onOpenView: (view: string) => void;
  onSelectDay: (id: TripDay['id']) => void;
}

export function Dashboard({ days, onOpenView, onSelectDay }: DashboardProps) {
  const mustDo = reservationTasks.filter((task) => task.status === '必须');
  const highRiskDay = days.find((day) => day.intensity === '高强度') ?? days[0];

  return (
    <section className="dashboard" aria-labelledby="dashboard-title">
      <div className="dashboard-hero">
        <p className="section-kicker">TRIP COMMAND CENTER</p>
        <h1 id="dashboard-title">出发控制台</h1>
        <p>{tripMeta.dateRange} · {tripMeta.people} 人 · {tripMeta.cars} 辆车 · 约 {tripMeta.distanceKm.toLocaleString()} km</p>
      </div>

      <div className="command-grid">
        <article className="priority-card">
          <span>最高优先级</span>
          <h2>独库北段预约</h2>
          <strong>最晚 7 月 20 日 20:00 前</strong>
          <p>Day 6 从那拉提入口进入，两辆车分别预约同一入口，优先选上午时段。</p>
          <button type="button" onClick={() => onOpenView('bookings')}>查看预约节点</button>
        </article>

        <article>
          <span>返航判断</span>
          <h2>7 月 22 / 23</h2>
          <p>{tripMeta.returnWindow}</p>
          <button type="button" onClick={() => onOpenView('roadbook')}>看 Day 7 安排</button>
        </article>

        <article>
          <span>风险日</span>
          <h2>{highRiskDay.title}</h2>
          <p>{highRiskDay.summary}</p>
          <button
            type="button"
            onClick={() => {
              onSelectDay(highRiskDay.id);
              onOpenView('route');
            }}
          >
            打开路线图
          </button>
        </article>
      </div>

      <div className="quick-tools" aria-label="快速入口">
        {[
          ['路线图', 'route'],
          ['日历行程', 'calendar'],
          ['每日路书', 'roadbook'],
          ['预约节点', 'bookings'],
          ['出片地点', 'photo'],
          ['必带清单', 'checklist'],
        ].map(([label, view]) => (
          <button type="button" key={view} onClick={() => onOpenView(view)}>
            {label}
          </button>
        ))}
      </div>

      <div className="deadline-board">
        <header>
          <p className="section-kicker">DO BEFORE DEPARTURE</p>
          <h2>必须先确认</h2>
        </header>
        <div>
          {mustDo.map((task) => (
            <article key={task.id}>
              <span>{task.deadline}</span>
              <h3>{task.title}</h3>
              <p>{task.action}</p>
            </article>
          ))}
        </div>
      </div>

      <ol className="day-launcher" aria-label="七天路线入口">
        {days.map((day, index) => (
          <li key={day.id}>
            <button
              type="button"
              onClick={() => {
                onSelectDay(day.id);
                onOpenView('roadbook');
              }}
            >
              <span>DAY {String(index + 1).padStart(2, '0')}</span>
              <strong>{day.title}</strong>
              <small>{day.distanceKm} km · {Math.round(day.driveMinutes / 60 * 10) / 10} h · {day.stay}</small>
            </button>
          </li>
        ))}
      </ol>
    </section>
  );
}
