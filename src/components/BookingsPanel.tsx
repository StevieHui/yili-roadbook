import { reservationTasks } from '../data/itinerary';
import type { ReservationTask, TripDay } from '../types';

interface BookingsPanelProps {
  days: readonly TripDay[];
  selectedDayId: TripDay['id'];
  onSelectDay: (id: TripDay['id']) => void;
}

const dayTaskIds: Record<TripDay['id'], readonly ReservationTask['id'][]> = {
  'day-1': ['sayram'],
  'day-2': ['sayram'],
  'day-3': ['kalajun'],
  'day-4': ['kuerdening'],
  'day-5': ['nalati', 'duku'],
  'day-6': ['duku', 'backup'],
  'day-7': ['return'],
};

function getDayTasks(day: TripDay) {
  const ids = dayTaskIds[day.id];
  return reservationTasks.filter((task) => ids.includes(task.id));
}

function getStatusText(tasks: readonly ReservationTask[]) {
  if (tasks.some((task) => task.status === '必须')) return '必须预约';
  if (tasks.some((task) => task.status === '建议')) return '建议提前';
  return '无强制预约';
}

export function BookingsPanel({ days, selectedDayId, onSelectDay }: BookingsPanelProps) {
  const selectedDay = days.find((day) => day.id === selectedDayId) ?? days[0];
  const selectedTasks = getDayTasks(selectedDay);

  return (
    <section className="tool-page bookings-panel" aria-labelledby="bookings-title">
      <header className="tool-heading">
        <p className="section-kicker">行程预约表</p>
        <h1 id="bookings-title">预约行程</h1>
        <p>按天查看去哪里、是否要提前预约、最晚确认时间。先处理“必须预约”，再看建议项和备选方案。</p>
      </header>

      <div className="booking-itinerary">
        <div className="booking-day-grid" role="list" aria-label="每日预约行程">
          {days.map((day, index) => {
            const [, month, date] = day.date.split('-');
            const tasks = getDayTasks(day);
            const statusText = getStatusText(tasks);

            return (
              <article
                className={`booking-day-card ${day.id === selectedDay.id ? 'is-active' : ''}`}
                aria-label={`DAY ${String(index + 1).padStart(2, '0')} ${day.title} ${statusText}`}
                key={day.id}
              >
                <button
                  type="button"
                  aria-pressed={day.id === selectedDay.id}
                  aria-label={`${Number(month)}月${Number(date)}日 ${day.weekday} ${day.title}`}
                  onClick={() => onSelectDay(day.id)}
                >
                  <span>DAY {String(index + 1).padStart(2, '0')}</span>
                  <strong>{Number(month)}.{Number(date)}</strong>
                  <small>{day.weekday}</small>
                </button>
                <div>
                  <h2>{day.title}</h2>
                  <p>{day.route.map((stop) => stop.name).join(' → ')}</p>
                </div>
                <strong className={`booking-status status-${statusText}`}>{statusText}</strong>
                <ul>
                  {tasks.map((task) => (
                    <li key={task.id}>
                      <b>{task.title}</b>
                      <span>{task.deadline}</span>
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>

        <aside className="booking-detail" aria-label={`${selectedDay.title}预约详情`}>
          <span>{selectedDay.date} · {selectedDay.weekday}</span>
          <h2>{selectedDay.title}</h2>
          <p>{selectedDay.stay}</p>
          <div className="booking-detail-list">
            {selectedTasks.map((task) => (
              <article className={`booking-detail-card booking-${task.status}`} key={task.id}>
                <div>
                  <span>{task.status}</span>
                  <h3>{task.title}</h3>
                </div>
                <strong>{task.deadline}</strong>
                <p>{task.detail}</p>
                <em>{task.action}</em>
              </article>
            ))}
          </div>
        </aside>
      </div>

      <aside className="booking-source">
        <strong>📱 通用预约渠道</strong>
        <p>微信搜索"游新疆一码游"小程序（覆盖全疆 440+ A 级景区）或"新疆景区预约"，也可在携程、美团购买门票。各景区官方公众号信息更及时：赛里木湖旅游、智游那拉提、喀拉峻旅游、库尔德宁风景区。</p>
        <strong>💡 抢票技巧</strong>
        <p>那拉提自驾票提前 7 天每晚 20:00 放票，独库预约每日 0 点放号——提前填好个人信息，到点直接提交。显示约满别灰心，持续刷新捡漏；租车车牌未确定可先用任意车牌预约，到游客中心更换。</p>
        <strong>⚠️ 特殊规则</strong>
        <p>独库北段仅限 7 座及以下客车，新能源绿牌需额外报备（拨打 12123 确认）。那拉提/赛里木湖/喀拉峻均要求车内至少 1 人驾龄满 3 年。天气决定体验，出发前看好预报并灵活调整行程。</p>
      </aside>
    </section>
  );
}
