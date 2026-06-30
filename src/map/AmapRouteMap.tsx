import { useEffect, useRef, useState } from 'react';
import type { TripDay } from '../types';
import { loadAmap, type AMapNamespace } from './amapLoader';

const dayColors = ['#e46f3a', '#e5b84b', '#3d8d9e', '#6f9464', '#926fa3', '#d65a59', '#315f8c'];

interface AmapRouteMapProps {
  days: readonly TripDay[];
  selectedDayId: string;
}

interface DayOverlay {
  id: string;
  line: any;
  markers: any[];
}

function searchDrivingPath(AMap: AMapNamespace, day: TripDay): Promise<any[]> {
  return new Promise((resolve) => {
    const driving = new AMap.Driving({
      policy: AMap.DrivingPolicy?.LEAST_TIME,
      hideMarkers: true,
      showTraffic: false,
      autoFitView: false,
    });
    const origin = day.route[0].coordinates;
    const destination = day.route.at(-1)!.coordinates;
    const waypoints = day.route.slice(1, -1).map((stop) => stop.coordinates);
    driving.search(origin, destination, { waypoints }, (status: string, result: any) => {
      if (status === 'complete' && result?.routes?.[0]?.steps) {
        const path = result.routes[0].steps.flatMap((step: any) => step.path ?? []);
        if (path.length > 1) resolve(path);
        else resolve(day.route.map((stop) => stop.coordinates));
      } else {
        resolve(day.route.map((stop) => stop.coordinates));
      }
    });
  });
}

export function AmapRouteMap({ days, selectedDayId }: AmapRouteMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const overlaysRef = useRef<DayOverlay[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function initialize() {
      try {
        const AMap = await loadAmap();
        if (cancelled || !containerRef.current) return;
        const map = new AMap.Map(containerRef.current, {
          viewMode: '2D',
          mapStyle: 'amap://styles/whitesmoke',
          zoom: 7,
          center: [82.5, 43.8],
        });
        map.addControl(new AMap.Scale());
        map.addControl(new AMap.ToolBar({ position: { right: '18px', top: '18px' } }));
        mapRef.current = map;

        const overlays = await Promise.all(days.map(async (day, index) => {
          const color = dayColors[index];
          const path = await searchDrivingPath(AMap, day);
          const line = new AMap.Polyline({
            path,
            strokeColor: color,
            strokeWeight: day.id === selectedDayId ? 7 : 4,
            strokeOpacity: day.id === selectedDayId ? 1 : 0.36,
            lineJoin: 'round',
            lineCap: 'round',
            zIndex: day.id === selectedDayId ? 20 : 10,
            showDir: day.id === selectedDayId,
          });
          map.add(line);

          const markers = day.route.map((stop, stopIndex) => {
            const marker = new AMap.Marker({
              position: stop.coordinates,
              anchor: 'center',
              zIndex: day.id === selectedDayId ? 30 : 12,
              content: `<span class="amap-trip-marker" style="--marker-color:${color}">${stopIndex + 1}</span>`,
              title: stop.name,
            });
            map.add(marker);
            return marker;
          });
          return { id: day.id, line, markers };
        }));

        if (cancelled) {
          map.destroy();
          return;
        }
        overlaysRef.current = overlays;
        map.setFitView(overlays.flatMap((overlay) => [overlay.line, ...overlay.markers]), false, [54, 54, 54, 54], 7);
        setLoading(false);
      } catch (reason) {
        if (!cancelled) {
          setError(reason instanceof Error ? reason.message : '地图暂时无法加载');
          setLoading(false);
        }
      }
    }

    void initialize();
    return () => {
      cancelled = true;
      overlaysRef.current = [];
      mapRef.current?.destroy?.();
      mapRef.current = null;
    };
  }, [days]);

  useEffect(() => {
    const selected = overlaysRef.current.find((overlay) => overlay.id === selectedDayId);
    for (const overlay of overlaysRef.current) {
      const active = overlay.id === selectedDayId;
      overlay.line.setOptions({
        strokeWeight: active ? 7 : 4,
        strokeOpacity: active ? 1 : 0.28,
        zIndex: active ? 20 : 10,
        showDir: active,
      });
      overlay.markers.forEach((marker) => marker.setOpacity?.(active ? 1 : 0.38));
    }
    if (selected) mapRef.current?.setFitView?.([selected.line, ...selected.markers], false, [64, 64, 64, 64], 9);
  }, [selectedDayId]);

  return (
    <section className="map-section" id="map" aria-labelledby="map-title">
      <div className="map-copy">
        <p className="section-kicker">真实道路辅助</p>
        <h2 id="map-title">高德路线</h2>
        <p>用于查看真实道路走向和停靠点。山区通行、限流、封路以当天高德导航和现场管制为准。</p>
        <div className="map-legend" aria-label="每日路线颜色">
          {days.map((day, index) => (
            <span className={day.id === selectedDayId ? 'is-active' : ''} key={day.id}>
              <i style={{ backgroundColor: dayColors[index] }} />D{index + 1}
            </span>
          ))}
        </div>
      </div>
      <div className="map-frame">
        <div className="amap-canvas" ref={containerRef} aria-label="伊犁七日自驾交互地图" />
        {loading && !error && <div className="map-status">正在加载高德地图...</div>}
        {error && (
          <div className="map-fallback" role="status">
            <strong>地图暂时无法加载</strong>
            <p>{error}。上方可点击路线图仍可正常使用。</p>
            <ol>
              {days.map((day) => <li key={day.id}>{day.route.map((stop) => stop.name).join(' → ')}</li>)}
            </ol>
          </div>
        )}
      </div>
    </section>
  );
}

