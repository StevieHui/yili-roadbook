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
                <ul className="booking-key-points">
                  {task.keyPoints.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
                <div className="booking-channels">
                  {task.channels.map((ch) => (
                    <span key={ch}>{ch}</span>
                  ))}
                </div>
                <em>{task.action}</em>
              </article>
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}
