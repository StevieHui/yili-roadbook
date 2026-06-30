import { tripMeta } from '../data/itinerary';
import type { TripDay } from '../types';

interface DashboardProps {
  days: readonly TripDay[];
  onOpenView?: (view: string) => void;
  onSelectDay?: (id: TripDay['id']) => void;
}

export function Dashboard({ days }: DashboardProps) {
  return (
    <section className="dashboard" aria-labelledby="dashboard-title">
      <div className="dashboard-cover">
        <div>
          <p className="section-kicker">北疆伊犁环线</p>
          <h1 id="dashboard-title">{tripMeta.title}</h1>
        </div>
      </div>

      <dl className="dashboard-summary-strip" aria-label="行程概览">
        <div><dt>时间</dt><dd>{tripMeta.dateRange}</dd></div>
        <div><dt>人数/车辆</dt><dd>{tripMeta.people} 人 · {tripMeta.cars} 辆车</dd></div>
        <div><dt>路线</dt><dd>伊宁往返 · {tripMeta.drivingDays} 天</dd></div>
        <div><dt>全长</dt><dd>约 {tripMeta.distanceKm.toLocaleString()} km</dd></div>
        <div><dt>住宿点</dt><dd>{days.map((day) => day.stay.split('（')[0]).join(' / ')}</dd></div>
      </dl>
    </section>
  );
}
