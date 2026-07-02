import { useEffect, useRef, useState } from 'react';
import type { Coordinates, Stop, TripDay } from '../types';
import { loadAmap, type AMapNamespace } from './amapLoader';
import { extractDrivingPath, normalizeNearbyPlaces, type MapAttraction } from './routePlanning';

const dayColors = ['#e46f3a', '#e5b84b', '#3d8d9e', '#6f9464', '#926fa3', '#d65a59', '#315f8c'];

interface AmapRouteMapProps {
  days: readonly TripDay[];
  selectedDayId: string;
  onSelectAttraction?: (attraction: MapAttraction | null) => void;
}

interface DayOverlay {
  id: string;
  line: any | null;
  markers: any[];
  attractionMarkers: any[];
}

function stopToAttraction(stop: Stop): MapAttraction {
  const kindMap: Record<Stop['kind'], { category: string; markerClass: string; stayMinutes: number; advice: string; safetyNote: string }> = {
    start: { category: '出发点', markerClass: 'marker-start', stayMinutes: 0, advice: '今日行程起点。', safetyNote: '检查车辆状态后出发。' },
    scenic: { category: '景区', markerClass: 'marker-scenic', stayMinutes: 60, advice: '该点已纳入当日路书，按时间表安排停留。', safetyNote: '只在正式停车区或合规观景点下车。' },
    photo: { category: '摄影点', markerClass: 'marker-photo', stayMinutes: 45, advice: '根据当日光线和安全停车条件选择机位。', safetyNote: '只在正式停车区或合规观景点下车。' },
    stay: { category: '住宿/休整', markerClass: 'marker-stay', stayMinutes: 30, advice: '该点已纳入当日路书，按时间表安排停留。', safetyNote: '只在正式停车区或合规观景点下车。' },
    warning: { category: '风险提醒', markerClass: 'marker-warning', stayMinutes: 15, advice: '该点已纳入当日路书，按时间表安排停留。', safetyNote: '以现场交通管制与天气预警为准。' },
  };
  const mapped = kindMap[stop.kind];
  return {
    id: `curated-${stop.id}`,
    name: stop.name,
    coordinates: stop.coordinates,
    category: mapped.category,
    source: 'curated',
    stayMinutes: mapped.stayMinutes,
    advice: mapped.advice,
    safetyNote: mapped.safetyNote,
    markerClass: mapped.markerClass,
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
    const origin = day.route[0].coordinates;
    const destination = day.route.at(-1)!.coordinates;
    const waypoints = day.route.slice(1, -1).map((stop) => stop.coordinates);
    driving.search(origin, destination, { waypoints }, (status: string, result: any) => {
      resolve(status === 'complete' ? extractDrivingPath(result) : null);
    });
  });
}

async function searchDrivingPathWithRetry(AMap: AMapNamespace, day: TripDay) {
  const first = await searchDrivingPath(AMap, day);
  if (first) return first;
  await new Promise((resolve) => setTimeout(resolve, 600));
  return searchDrivingPath(AMap, day);
}

function searchNearbyAt(AMap: AMapNamespace, center: Coordinates): Promise<any[]> {
  return new Promise((resolve) => {
    if (!AMap.PlaceSearch) return resolve([]);
    const search = new AMap.PlaceSearch({
      city: '伊犁哈萨克自治州',
      citylimit: false,
      pageSize: 20,
      type: '风景名胜',
    });
    search.searchNearBy('', center, 30000, (status: string, result: any) => {
      resolve(status === 'complete' ? result?.poiList?.pois ?? [] : []);
    });
  });
}

async function searchNearby(AMap: AMapNamespace, day: TripDay): Promise<MapAttraction[]> {
  const sampleIndexes = [...new Set([0, Math.floor(day.route.length / 2), day.route.length - 1])];
  const places: any[] = [];
  for (const index of sampleIndexes) {
    places.push(...await searchNearbyAt(AMap, day.route[index].coordinates));
  }
  return normalizeNearbyPlaces(places, 8);
}

function amapNavigationUrl(day: TripDay) {
  const start = day.route[0];
  const end = day.route.at(-1)!;
  return `https://uri.amap.com/navigation?from=${start.coordinates.join(',')},${encodeURIComponent(start.name)}&to=${end.coordinates.join(',')},${encodeURIComponent(end.name)}&mode=car&policy=1&src=yili-roadbook&callnative=0`;
}

function buildInfoContent(attraction: MapAttraction): string {
  const badge = attraction.source === 'curated' ? '行程精选' : '高德周边';
  const stay = attraction.stayMinutes ? ` · 建议停留 ${attraction.stayMinutes} 分钟` : '';
  const safety = attraction.safetyNote ? `<small>${attraction.safetyNote}</small>` : '';
  return `<div class="amap-info-window"><strong>${badge}</strong><h4>${attraction.name}</h4><p>${attraction.category}${stay}</p><p>${attraction.advice}</p>${safety}</div>`;
}

export function AmapRouteMap({ days, selectedDayId, onSelectAttraction }: AmapRouteMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const amapRef = useRef<AMapNamespace | null>(null);
  const infoWindowRef = useRef<any>(null);
  const overlaysRef = useRef<DayOverlay[]>([]);
  const nearbyMarkersRef = useRef<any[]>([]);
  const trafficLayerRef = useRef<any>(null);
  const selectedDayIdRef = useRef(selectedDayId);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [routeErrors, setRouteErrors] = useState<Record<string, boolean>>({});
  const [showCurated, setShowCurated] = useState(true);
  const [showNearby, setShowNearby] = useState(false);
  const [showTraffic, setShowTraffic] = useState(false);
  const [nearbyLoading, setNearbyLoading] = useState(false);
  const [retryVersion, setRetryVersion] = useState(0);

  selectedDayIdRef.current = selectedDayId;
  const selectedDay = days.find((day) => day.id === selectedDayId) ?? days[0];

  useEffect(() => {
    let cancelled = false;

    async function initialize() {
      setLoading(true);
      setRouteErrors({});
      try {
        const AMap = await loadAmap();
        if (cancelled || !containerRef.current) return;
        amapRef.current = AMap;
        const map = new AMap.Map(containerRef.current, {
          viewMode: '2D',
          mapStyle: 'amap://styles/whitesmoke',
          zoom: 7,
          center: [82.5, 43.8],
        });
        map.addControl(new AMap.Scale());
        map.addControl(new AMap.ToolBar({ position: { right: '18px', top: '70px' } }));
        const infoWindow = new AMap.InfoWindow({ offset: new AMap.Pixel(0, -32), closeWhenClickMap: true });
        infoWindowRef.current = infoWindow;
        mapRef.current = map;
        const trafficLayer = new AMap.TileLayer.Traffic({ autoRefresh: true, interval: 180 });
        trafficLayer.setOpacity(0.7);
        trafficLayerRef.current = trafficLayer;

        const prioritizedDays = [...days].sort((a, b) => Number(b.id === selectedDayIdRef.current) - Number(a.id === selectedDayIdRef.current));
        const overlays: DayOverlay[] = [];

        for (const day of prioritizedDays) {
          if (cancelled) break;
          const dayIndex = days.findIndex((item) => item.id === day.id);
          const color = dayColors[dayIndex];
          const path = await searchDrivingPathWithRetry(AMap, day);
          const line = path ? new AMap.Polyline({
            path,
            strokeColor: color,
            strokeWeight: day.id === selectedDayIdRef.current ? 7 : 4,
            strokeOpacity: day.id === selectedDayIdRef.current ? 1 : 0.28,
            lineJoin: 'round',
            lineCap: 'round',
            zIndex: day.id === selectedDayIdRef.current ? 20 : 10,
            showDir: day.id === selectedDayIdRef.current,
          }) : null;
          if (line) map.add(line);
          else setRouteErrors((current) => ({ ...current, [day.id]: true }));

          const routeMarkers = day.route.map((stop, stopIndex) => {
            const marker = new AMap.Marker({
              position: stop.coordinates,
              anchor: 'center',
              zIndex: day.id === selectedDayIdRef.current ? 30 : 12,
              content: `<span class="amap-trip-marker" style="--marker-color:${color}">${stopIndex + 1}</span>`,
              title: stop.name,
            });
            map.add(marker);
            return marker;
          });
          const mapOnlyMarkers = (day.mapOnlyStops ?? []).map((stop) => {
            const marker = new AMap.Marker({
              position: stop.coordinates,
              anchor: 'center',
              zIndex: day.id === selectedDayIdRef.current ? 30 : 12,
              content: `<span class="amap-trip-marker marker-stay" style="--marker-color:${color}">住</span>`,
              title: stop.name,
            });
            map.add(marker);
            return marker;
          });
          const markers = [...routeMarkers, ...mapOnlyMarkers];

          const attractionStops = [...day.route.slice(1), ...(day.mapOnlyStops ?? [])];
          const attractionMarkers = attractionStops.map((stop) => {
            const attraction = stopToAttraction(stop);
            const marker = new AMap.Marker({
              position: attraction.coordinates,
              anchor: 'center',
              zIndex: 36,
              content: `<span class="amap-attraction-marker ${attraction.markerClass}"></span>`,
              title: attraction.name,
            });
            marker.on?.('click', () => {
              onSelectAttraction?.(attraction);
              const iw = infoWindowRef.current;
              if (iw) {
                iw.setContent(buildInfoContent(attraction));
                iw.open(map, attraction.coordinates);
              }
            });
            map.add(marker);
            if (day.id !== selectedDayIdRef.current || !showCurated) marker.hide?.();
            return marker;
          });
          overlays.push({ id: day.id, line, markers, attractionMarkers });
        }

        if (cancelled) {
          map.destroy();
          return;
        }
        overlaysRef.current = overlays;
        const visible = overlays.flatMap((overlay) => [overlay.line, ...overlay.markers].filter(Boolean));
        if (visible.length) map.setFitView(visible, false, [54, 54, 54, 54], 7);
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
      nearbyMarkersRef.current = [];
      mapRef.current?.destroy?.();
      mapRef.current = null;
      amapRef.current = null;
    };
  }, [days, retryVersion]);

  useEffect(() => {
    onSelectAttraction?.(null);
    infoWindowRef.current?.close?.();
    const selected = overlaysRef.current.find((overlay) => overlay.id === selectedDayId);
    for (const overlay of overlaysRef.current) {
      const active = overlay.id === selectedDayId;
      overlay.line?.setOptions?.({
        strokeWeight: active ? 7 : 4,
        strokeOpacity: active ? 1 : 0.28,
        zIndex: active ? 20 : 10,
        showDir: active,
      });
      overlay.markers.forEach((marker) => marker.setOpacity?.(active ? 1 : 0.32));
      overlay.attractionMarkers.forEach((marker) => active && showCurated ? marker.show?.() : marker.hide?.());
    }
    nearbyMarkersRef.current.forEach((marker) => mapRef.current?.remove?.(marker));
    nearbyMarkersRef.current = [];
    setShowNearby(false);
    if (selected) {
      const fitItems = [selected.line, ...selected.markers].filter(Boolean);
      if (fitItems.length) mapRef.current?.setFitView?.(fitItems, false, [64, 64, 64, 64], 9);
    }
  }, [selectedDayId, showCurated]);

  useEffect(() => {
    const layer = trafficLayerRef.current;
    const map = mapRef.current;
    if (!layer || !map) return;
    if (showTraffic) { map.add(layer); } else { map.remove(layer); }
  }, [showTraffic]);

  useEffect(() => {
    let cancelled = false;
    async function updateNearby() {
      const map = mapRef.current;
      const AMap = amapRef.current;
      nearbyMarkersRef.current.forEach((marker) => map?.remove?.(marker));
      nearbyMarkersRef.current = [];
      if (!showNearby || !map || !AMap || !selectedDay) return;
      setNearbyLoading(true);
      const attractions = await searchNearby(AMap, selectedDay);
      if (cancelled) return;
      nearbyMarkersRef.current = attractions.map((attraction) => {
        const marker = new AMap.Marker({
          position: attraction.coordinates,
          anchor: 'center',
          zIndex: 35,
          content: '<span class="amap-attraction-marker nearby"></span>',
          title: attraction.name,
        });
        marker.on?.('click', () => {
          onSelectAttraction?.(attraction);
          const iw = infoWindowRef.current;
          const mapInst = mapRef.current;
          if (iw && mapInst) {
            iw.setContent(buildInfoContent(attraction));
            iw.open(mapInst, attraction.coordinates);
          }
        });
        map.add(marker);
        return marker;
      });
      setNearbyLoading(false);
    }
    void updateNearby();
    return () => { cancelled = true; };
  }, [showNearby, selectedDayId]);

  const selectedDayNumber = Number(selectedDay?.id.split('-')[1] ?? 1);

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
        <div className="map-layer-controls" aria-label="地图图层">
          <label><input type="checkbox" checked={showCurated} onChange={(event) => setShowCurated(event.target.checked)} />精选看点</label>
          <label><input type="checkbox" checked={showNearby} onChange={(event) => setShowNearby(event.target.checked)} />高德周边</label>
          <label><input type="checkbox" checked={showTraffic} onChange={(event) => setShowTraffic(event.target.checked)} />实时路况</label>
          {nearbyLoading && <span>搜索中...</span>}
        </div>
        {loading && !error && <div className="map-status">正在加载高德地图...</div>}
        {!loading && routeErrors[selectedDayId] && (
          <div className="map-route-error" role="status">
            <strong>Day {selectedDayNumber} 导航路线暂未获取</strong>
            <span>已保留停靠点，未绘制直线。</span>
            <button type="button" onClick={() => setRetryVersion((value) => value + 1)}>重试路线</button>
            <a href={amapNavigationUrl(selectedDay)} target="_blank" rel="noreferrer">在高德中打开</a>
          </div>
        )}
        {error && (
          <div className="map-fallback" role="status">
            <strong>地图暂时无法加载</strong>
            <p>{error}。上方可点击路线图仍可正常使用。</p>
            <ol>{days.map((day) => (
              <li key={day.id}>
                {day.route.map((stop) => stop.name).join(' → ')}
                {day.mapOnlyStops?.length ? `（住宿标记：${day.mapOnlyStops.map((stop) => stop.name).join('、')}）` : ''}
              </li>
            ))}</ol>
          </div>
        )}
      </div>
    </section>
  );
}
