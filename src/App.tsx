import { useState } from 'react';
import { BookingsPanel } from './components/BookingsPanel';
import { Checklist } from './components/Checklist';
import { CriticalAlerts } from './components/CriticalAlerts';
import { Dashboard } from './components/Dashboard';
import { DayRoadbook } from './components/DayRoadbook';
import { PhotoGuide } from './components/PhotoGuide';
import { RouteExplorer } from './components/RouteExplorer';
import { SiteHeader } from './components/SiteHeader';
import { TripOverview } from './components/TripOverview';
import { tripDays } from './data/itinerary';
import type { TripDay } from './types';

type ViewId = 'home' | 'overview' | 'route' | 'roadbook' | 'bookings' | 'photo' | 'checklist' | 'alerts';

export default function App() {
  const [activeView, setActiveView] = useState<ViewId>('home');
  const [selectedDayId, setSelectedDayId] = useState<TripDay['id']>('day-1');

  const selectDay = (id: TripDay['id']) => {
    setSelectedDayId(id);
  };

  const selectView = (view: string) => setActiveView(view as ViewId);

  return (
    <>
      <SiteHeader activeView={activeView} onSelectView={selectView} />
      <main className="app-shell">
        {activeView === 'home' && <Dashboard days={tripDays} onOpenView={selectView} onSelectDay={selectDay} />}
        {activeView === 'overview' && <TripOverview />}
        {activeView === 'route' && <RouteExplorer days={tripDays} selectedDayId={selectedDayId} onSelectDay={selectDay} />}
        {activeView === 'roadbook' && <DayRoadbook days={tripDays} selectedDayId={selectedDayId} />}
        {activeView === 'bookings' && <BookingsPanel days={tripDays} selectedDayId={selectedDayId} onSelectDay={selectDay} />}
        {activeView === 'photo' && <PhotoGuide days={tripDays} />}
        {activeView === 'checklist' && <Checklist />}
        {activeView === 'alerts' && <CriticalAlerts />}
      </main>
      <footer>
        <span>43°N · 81°E</span>
        <p>伊宁往返 · 2026 盛夏</p>
      </footer>
    </>
  );
}
