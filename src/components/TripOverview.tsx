import { arrivalDay, rentalMeta, tripMeta } from '../data/itinerary';

const stays = ['伊宁', '赛里木湖', '伊宁', '特克斯', '库尔德宁', '那拉提', '尼勒克'];

export function TripOverview() {
  const [, arrivalMonth, arrivalDate] = arrivalDay.date.split('-');
  const arrivalChecklist = arrivalDay.tasks.slice(3);

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
          <p><strong>{rentalMeta.arrivalTime}</strong> 抵达伊宁，<strong>{rentalMeta.pickupTime}</strong> 在 <strong>{rentalMeta.serviceLocation}</strong> 取车。</p>
          <p><strong>{rentalMeta.vehicles[0].model}</strong>（<span>{rentalMeta.vehicles[0].reservationName}</span>）与 <strong>{rentalMeta.vehicles[1].model}</strong>（<span>{rentalMeta.vehicles[1].reservationName}</span>）同点取还。</p>
          <p>{arrivalChecklist.join(' · ')}</p>
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

