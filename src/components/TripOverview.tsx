import { arrivalDay, tripMeta } from '../data/itinerary';

const stays = ['伊宁', '赛里木湖', '伊宁', '特克斯', '库尔德宁', '那拉提', '尼勒克'];

export function TripOverview() {
  const [, arrivalMonth, arrivalDate] = arrivalDay.date.split('-');
  const { rental } = arrivalDay;

  return (
    <section className="overview section-shell" id="overview" aria-labelledby="overview-title">
      <header className="section-heading">
        <p className="section-kicker">ROUTE AT A GLANCE</p>
        <h2 id="overview-title">先看全程，再向远方</h2>
        <p>7 月 14 日在伊宁完成取车、补给和休整；从 7 月 15 日起连续七天，湖泊、草原、森林与高山公路依次展开。</p>
      </header>

      <div className="fact-ribbon" aria-label="行程核心数据">
        <div><span>日期</span><strong>{tripMeta.dateRange}</strong></div>
        <div><span>队伍</span><strong>{tripMeta.people} 人 · {tripMeta.cars} 辆车</strong></div>
        <div><span>全长</span><strong>约 {tripMeta.distanceKm.toLocaleString()} km</strong></div>
        <div><span>驾驶日</span><strong>{tripMeta.drivingDays} 天</strong></div>
      </div>

      <div className="arrival-note">
        <span className="arrival-date">{arrivalMonth} / {arrivalDate}</span>
        <div>
          <p className="eyebrow">PROLOGUE</p>
          <h3>{arrivalDay.title}</h3>
          <p><strong>{rental.arrivalTime}</strong> 抵达伊宁，<strong>{rental.pickupTime}</strong> 在 <strong>{rental.serviceLocation}</strong> 取车。</p>
          {rental.vehicles.map((vehicle) => (
            <p key={vehicle.model}>
              <strong>{vehicle.model}</strong>（<span>{vehicle.reservationName}</span>）同点取还。
            </p>
          ))}
          {arrivalDay.tasks.map((task) => <p key={task}>{task}</p>)}
          <p className="return-window">{tripMeta.returnWindow}</p>
        </div>
      </div>

      <div className="stay-line" aria-label="住宿点">
        <span>住宿接力</span>
        <ol>
          {stays.map((stay, index) => <li key={`${stay}-${index}`}>{stay}</li>)}
        </ol>
      </div>
    </section>
  );
}

