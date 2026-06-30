export type Coordinates = readonly [longitude: number, latitude: number];

export interface Stop {
  id: string;
  name: string;
  coordinates: Coordinates;
  kind: 'start' | 'scenic' | 'photo' | 'stay' | 'warning';
}

export interface PhotoSpot {
  name: string;
  bestTime: string;
  shot: string;
  note: string;
}

export interface TimelineItem {
  time: string;
  activity: string;
  detail: string;
}

export interface TripDay {
  id: `day-${1 | 2 | 3 | 4 | 5 | 6 | 7}`;
  date: string;
  weekday: string;
  title: string;
  summary: string;
  distanceKm: number;
  driveMinutes: number;
  stay: string;
  intensity: '轻松' | '适中' | '较满' | '高强度';
  route: readonly Stop[];
  timeline: readonly TimelineItem[];
  highlights: readonly string[];
  photoSpots: readonly PhotoSpot[];
  reminders: readonly string[];
}

export interface ReservationTask {
  id: string;
  title: string;
  deadline: string;
  when: string;
  status: '必须' | '建议' | '备选';
  detail: string;
  action: string;
}

