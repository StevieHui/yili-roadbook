import { describe, expect, it } from 'vitest';
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
