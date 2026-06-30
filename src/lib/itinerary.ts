import { tripDays } from '../data/itinerary';
import type { TripDay } from '../types';

export function getTripDistance(days: readonly TripDay[]): number {
  return days.reduce((sum, day) => sum + day.distanceKm, 0);
}

export function getDayById(id: string): TripDay | undefined {
  return tripDays.find((day) => day.id === id);
}

