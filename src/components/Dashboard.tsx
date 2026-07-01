import { tripMeta, tripDays } from '../data/itinerary';
import type { TripDay } from '../types';

interface DashboardProps {
  days: readonly TripDay[];
  onOpenView?: (view: string) => void;
  onSelectDay?: (id: TripDay['id']) => void;
}

const totalDistance = tripDays.reduce((sum, d) => sum + d.distanceKm, 0);

export function Dashboard(_props: DashboardProps) {
  return (
    <section className="dashboard" aria-labelledby="dashboard-title">
      <div className="dashboard-cover">
        <div className="dashboard-copy">
          <p className="section-kicker">天山北麓 · 伊犁河谷 · 盛夏出发</p>
          <h1 id="dashboard-title">向天山深处</h1>
          <p className="dashboard-subtitle">{tripMeta.subtitle}</p>
          <p className="dashboard-lede">
            从伊宁河谷启程，沿雪线向西。七天，一千两百公里，两辆车，八个人。
            高山湖泊把天空收进怀里，云杉森林在侧光中呼吸，独库公路的弯道将雪山一寸一寸拉近。
            这不是一篇攻略，是一份交给夏天的路书。
          </p>
          <div className="dashboard-glass-grid" aria-label="封面行程信息">
            <article>
              <span>日期</span>
              <strong>{tripMeta.dateRange}</strong>
            </article>
            <article>
              <span>队伍</span>
              <strong>{tripMeta.people} 人 · {tripMeta.cars} 辆车</strong>
            </article>
            <article>
              <span>路线</span>
              <strong>伊宁往返 · {tripMeta.drivingDays} 天</strong>
            </article>
            <article>
              <span>全长</span>
              <strong>约 {totalDistance.toLocaleString()} km</strong>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
