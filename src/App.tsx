import { useState } from 'react';
import { CalendarStrip } from './components/CalendarStrip';
import { Checklist } from './components/Checklist';
import { CriticalAlerts } from './components/CriticalAlerts';
import { DayRoadbook } from './components/DayRoadbook';
import { Hero } from './components/Hero';
import { PhotoGuide } from './components/PhotoGuide';
import { SiteHeader } from './components/SiteHeader';
import { TripOverview } from './components/TripOverview';
import { tripDays } from './data/itinerary';
import { AmapRouteMap } from './map/AmapRouteMap';
import type { TripDay } from './types';

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
        <Checklist />
        <CriticalAlerts />
      </main>
      <footer>
        <span>43°N · 81°E</span>
        <p>伊宁往返 · 2026 盛夏</p>
      </footer>
    </>
  );
}
