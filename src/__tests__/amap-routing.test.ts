import { describe, expect, it, vi } from 'vitest';
import { tripDays } from '../data/itinerary';
import { buildDrivingRequest, searchDrivingPathWithRetry } from '../map/drivingRoute';
import { extractDrivingPath, normalizeNearbyPlaces } from '../map/routePlanning';

describe('AMap route planning helpers', () => {
  it('extracts the navigable path from successful driving steps', () => {
    expect(extractDrivingPath({
      routes: [{ steps: [{ path: [[81, 43], [82, 44]] }, { path: [[83, 45]] }] }],
    })).toEqual([[81, 43], [82, 44], [83, 45]]);
  });

  it('returns no path when GaoDe has no navigable route', () => {
    expect(extractDrivingPath({ info: 'NO_DATA' })).toBeNull();
    expect(extractDrivingPath({ routes: [{ steps: [] }] })).toBeNull();
  });

  it('inserts hidden Duku control points before visible day 6 waypoints', () => {
    const day6 = tripDays[5];

    expect(buildDrivingRequest(day6)).toEqual({
      origin: day6.route[0].coordinates,
      destination: day6.route.at(-1)?.coordinates,
      waypoints: [
        [84.340261, 43.308788],
        [84.310378, 43.638115],
        ...day6.route.slice(1, -1).map((stop) => stop.coordinates),
      ],
    });
    expect(day6.route.map((stop) => stop.coordinates)).not.toContainEqual([84.340261, 43.308788]);
  });

  it('uses the saved day 6 plan instead of current-time GaoDe routing', async () => {
    const day6 = tripDays[5];
    const drivingSpy = vi.fn();
    const AMap = {
      DrivingPolicy: { LEAST_TIME: 0 },
      Driving: class { constructor() { drivingSpy(); } },
    };

    expect(day6.plannedTrack?.length).toBeGreaterThan(100);
    await expect(searchDrivingPathWithRetry(AMap, day6)).resolves.toEqual(day6.plannedTrack);
    expect(drivingSpy).not.toHaveBeenCalled();
  });

  it('deduplicates nearby attractions and caps the result at eight', () => {
    const places = Array.from({ length: 10 }, (_, index) => ({
      id: index === 1 ? 'poi-0' : `poi-${index}`,
      name: `看点 ${index}`,
      location: { lng: 81 + index / 100, lat: 43 + index / 100 },
      type: '风景名胜',
      address: `地址 ${index}`,
    }));

    const result = normalizeNearbyPlaces(places, 8);

    expect(result).toHaveLength(8);
    expect(new Set(result.map((place) => place.id)).size).toBe(8);
    expect(result[0]).toMatchObject({ source: 'amap', category: '风景名胜' });
  });
});
