import { useState } from 'react';
import { CalendarStrip } from './components/CalendarStrip';
import { DayRoadbook } from './components/DayRoadbook';
import { Hero } from './components/Hero';
import { PhotoGuide } from './components/PhotoGuide';
import { SiteHeader } from './components/SiteHeader';
import { TripOverview } from './components/TripOverview';
import { tripDays } from './data/itinerary';
import { AmapRouteMap } from './map/AmapRouteMap';
import type { TripDay } from './types';

const pendingSections = [
  ['checklist', '必带清单', '两辆车共用一套不遗漏的出发检查。'],
  ['alerts', '关键提醒', '路况、预约与山地驾驶优先于打卡。'],
] as const;

export default function App() {
  const [selectedDayId, setSelectedDayId] = useState<TripDay['id']>('day-1');

  const selectDay = (id: TripDay['id']) => {
    setSelectedDayId(id);
    document.getElementById(`roadbook-${id}`)?.scrollIntoView?.({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <TripOverview />
        <AmapRouteMap days={tripDays} selectedDayId={selectedDayId} />
        <CalendarStrip days={tripDays} selectedDayId={selectedDayId} onSelectDay={selectDay} />
        <DayRoadbook days={tripDays} selectedDayId={selectedDayId} />
        <PhotoGuide days={tripDays} />
        {pendingSections.map(([id, title, copy], index) => (
          <section className="pending-section section-shell" id={id} key={id} aria-labelledby={`${id}-title`}>
            <span className="section-number">0{index + 6}</span>
            <div>
              <p className="section-kicker">COMING INTO VIEW</p>
              <h2 id={`${id}-title`}>{title}</h2>
              <p>{copy}</p>
            </div>
          </section>
        ))}
      </main>
      <footer>
        <span>43°N · 81°E</span>
        <p>伊宁往返 · 2026 盛夏</p>
      </footer>
    </>
  );
}
