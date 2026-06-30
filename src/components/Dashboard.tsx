import { tripMeta } from '../data/itinerary';
import type { TripDay } from '../types';

interface DashboardProps {
  days: readonly TripDay[];
  onOpenView?: (view: string) => void;
  onSelectDay?: (id: TripDay['id']) => void;
}

export function Dashboard(_props: DashboardProps) {
  return (
    <section className="dashboard" aria-labelledby="dashboard-title">
      <div className="dashboard-cover">
        <div className="dashboard-copy">
          <p className="section-kicker">北疆伊犁环线</p>
          <h1 id="dashboard-title">{tripMeta.title}</h1>
          <p className="dashboard-subtitle">{tripMeta.subtitle}</p>
          <div className="dashboard-glass-grid" aria-label="封面行程信息">
            <article>
              <span>时间</span>
              <strong>{tripMeta.dateRange}</strong>
            </article>
            <article>
              <span>规模</span>
              <strong>{tripMeta.people} 人 · {tripMeta.cars} 辆车</strong>
            </article>
            <article>
              <span>路线</span>
              <strong>伊宁往返 · {tripMeta.drivingDays} 天</strong>
            </article>
            <article>
              <span>全长</span>
              <strong>约 {tripMeta.distanceKm.toLocaleString()} km</strong>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
