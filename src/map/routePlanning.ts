import type { Coordinates } from '../types';

export interface MapAttraction {
  id: string;
  name: string;
  coordinates: Coordinates;
  category: string;
  source: 'curated' | 'amap';
  stayMinutes?: number;
  advice: string;
  safetyNote?: string;
  markerClass: string;
}

export function extractDrivingPath(result: any): Coordinates[] | null {
  const steps = result?.routes?.[0]?.steps;
  if (!Array.isArray(steps)) return null;
  const path = steps.flatMap((step: any) => Array.isArray(step?.path) ? step.path : []);
  return path.length > 1 ? path : null;
}

export function normalizeNearbyPlaces(places: readonly any[], limit = 8): MapAttraction[] {
  const seen = new Set<string>();
  const normalized: MapAttraction[] = [];

  for (const place of places) {
    const id = String(place?.id ?? `${place?.name}-${place?.location?.lng}-${place?.location?.lat}`);
    const lng = Number(place?.location?.lng);
    const lat = Number(place?.location?.lat);
    if (seen.has(id) || !place?.name || !Number.isFinite(lng) || !Number.isFinite(lat)) continue;
    seen.add(id);
    normalized.push({
      id,
      name: String(place.name),
      coordinates: [lng, lat],
      category: String(place.type ?? '沿线看点').split(';')[0],
      source: 'amap',
      advice: place.address ? String(place.address) : '高德地图沿线搜索结果',
      markerClass: 'nearby',
    });
    if (normalized.length >= limit) break;
  }

  return normalized;
}
