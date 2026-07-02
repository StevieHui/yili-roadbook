import { useEffect, useRef, useState } from 'react';
import type { TripDay } from '../types';
import { loadAmap } from './amapLoader';
import { searchDrivingPathWithRetry } from './drivingRoute';

interface DailyRouteSnapshotProps {
  day: TripDay;
}

export function DailyRouteSnapshot({ day }: DailyRouteSnapshotProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const dayNumber = Number(day.id.split('-')[1]);

  useEffect(() => {
    let cancelled = false;
    let map: any = null;

    async function initialize() {
      setStatus('loading');
      try {
        const AMap = await loadAmap();
        if (cancelled || !containerRef.current) return;

        const satellite = new AMap.TileLayer.Satellite();
        map = new AMap.Map(containerRef.current, {
          viewMode: '2D',
          zoom: 8,
          center: day.route[0].coordinates,
          dragEnable: false,
          zoomEnable: false,
          jogEnable: false,
          pitchEnable: false,
          rotateEnable: false,
          keyboardEnable: false,
          touchZoom: false,
          doubleClickZoom: false,
          scrollWheel: false,
        });
        map.add(satellite);

        const path = await searchDrivingPathWithRetry(AMap, day);
        if (cancelled) return;
        if (!path) {
          setStatus('error');
          return;
        }

        const outline = new AMap.Polyline({
          path,
          strokeColor: '#10201D',
          strokeWeight: 8,
          strokeOpacity: 0.78,
          lineJoin: 'round',
          lineCap: 'round',
          zIndex: 20,
        });
        const line = new AMap.Polyline({
          path,
          strokeColor: day.visual.accent,
          strokeWeight: 4,
          strokeOpacity: 1,
          lineJoin: 'round',
          lineCap: 'round',
          zIndex: 21,
        });
        map.add([outline, line]);

        const routeMarkers = day.route.map((stop, index) => new AMap.Marker({
          position: stop.coordinates,
          anchor: 'center',
          zIndex: 30,
          content: `<span class="daily-route-marker">${index + 1}</span>`,
          title: stop.name,
        }));
        const lodgingMarkers = (day.mapOnlyStops ?? []).map((stop) => new AMap.Marker({
          position: stop.coordinates,
          anchor: 'center',
          zIndex: 30,
          content: '<span class="daily-route-marker is-lodging">住</span>',
          title: stop.name,
        }));
        const markers = [...routeMarkers, ...lodgingMarkers];
        map.add(markers);
        map.setFitView([outline, ...markers], false, [42, 42, 42, 42], 10);
        setStatus('ready');
      } catch {
        if (!cancelled) setStatus('error');
      }
    }

    void initialize();
    return () => {
      cancelled = true;
      map?.destroy?.();
    };
  }, [day]);

  return (
    <figure className="daily-route-snapshot" data-testid="daily-route-snapshot">
      <div
        ref={containerRef}
        className="daily-route-snapshot-canvas"
        aria-label={`Day ${dayNumber} 非交互卫星路线图`}
      />
      {status === 'loading' && <figcaption className="daily-route-snapshot-status">正在加载当天卫星路线...</figcaption>}
      {status === 'error' && (
        <figcaption className="daily-route-snapshot-status is-error">
          <strong>当天路线暂未获取</strong>
          <span>{day.route.map((stop) => stop.name).join(' → ')}</span>
        </figcaption>
      )}
    </figure>
  );
}
