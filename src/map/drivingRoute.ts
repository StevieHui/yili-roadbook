import type { Coordinates, TripDay } from '../types';
import type { AMapNamespace } from './amapLoader';
import { extractDrivingPath } from './routePlanning';

export interface DrivingRequest {
  origin: Coordinates;
  destination: Coordinates;
  waypoints: Coordinates[];
}

export function buildDrivingRequest(day: TripDay): DrivingRequest {
  return {
    origin: day.route[0].coordinates,
    destination: day.route.at(-1)!.coordinates,
    waypoints: [
      ...(day.routeControlPoints ?? []),
      ...day.route.slice(1, -1).map((stop) => stop.coordinates),
    ],
  };
}

function searchDrivingPath(AMap: AMapNamespace, day: TripDay): Promise<Coordinates[] | null> {
  return new Promise((resolve) => {
    const driving = new AMap.Driving({
      policy: AMap.DrivingPolicy?.LEAST_TIME,
      hideMarkers: true,
      showTraffic: false,
      autoFitView: false,
    });
    const { origin, destination, waypoints } = buildDrivingRequest(day);
    driving.search(origin, destination, { waypoints }, (status: string, result: any) => {
      resolve(status === 'complete' ? extractDrivingPath(result) : null);
    });
  });
}

export async function searchDrivingPathWithRetry(AMap: AMapNamespace, day: TripDay) {
  const first = await searchDrivingPath(AMap, day);
  if (first) return first;
  await new Promise((resolve) => setTimeout(resolve, 600));
  return searchDrivingPath(AMap, day);
}
