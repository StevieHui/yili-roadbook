import { reservationTasks } from '../data/itinerary';

export function BookingsPanel() {
  return (
    <section className="tool-page bookings-panel" aria-labelledby="bookings-title">
      <header className="tool-heading">
        <p className="section-kicker">BOOKINGS / DEADLINES</p>
        <h1 id="bookings-title">预约节点</h1>
        <p>把会影响成行的事项放在这里：先预约、再订票、最后按航班和还车时间倒推。</p>
      </header>

      <div className="booking-list">
        {reservationTasks.map((task) => (
          <article className={`booking-card booking-${task.status}`} key={task.id}>
            <div>
              <span>{task.status}</span>
              <h2>{task.title}</h2>
              <p>{task.when}</p>
            </div>
            <strong>{task.deadline}</strong>
            <p>{task.detail}</p>
            <em>{task.action}</em>
          </article>
        ))}
      </div>

      <aside className="booking-source">
        <strong>独库北段规则</strong>
        <p>提前 1-7 天预约，按乌苏驿、乔尔玛、那拉提三个入口和 5 个时段管理；Day 6 建议按那拉提入口预约。</p>
      </aside>
    </section>
  );
}
