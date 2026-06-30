import type { TripDay } from '../types';

interface CalendarStripProps {
  days: readonly TripDay[];
  selectedDayId: string;
  onSelectDay: (id: TripDay['id']) => void;
}

export function CalendarStrip({ days, selectedDayId, onSelectDay }: CalendarStripProps) {
  return (
    <section className="calendar-section" id="calendar" aria-labelledby="calendar-title">
      <div className="section-shell">
        <header className="section-heading compact-heading">
          <p className="section-kicker">SEVEN DAYS / SEVEN LANDSCAPES</p>
          <h2 id="calendar-title">日历行程</h2>
          <p>点击日期，地图与当天路书会一起切换。真正需要早起的只有两天，最重的一天留给独库。</p>
        </header>
        <div className="calendar-strip" role="group" aria-label="选择行程日期">
          {days.map((day, index) => {
            const [, month, date] = day.date.split('-');
            return (
              <button
                type="button"
                className={selectedDayId === day.id ? 'is-active' : ''}
                aria-pressed={selectedDayId === day.id}
                aria-label={`${Number(month)}月${Number(date)}日 ${day.weekday} ${day.title}`}
                onClick={() => onSelectDay(day.id)}
                key={day.id}
              >
                <span>DAY {String(index + 1).padStart(2, '0')}</span>
                <strong>{date}</strong>
                <small>{day.weekday.replace('周', '星期')}</small>
                <em>{day.title.split('→').at(-1)?.trim()}</em>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

