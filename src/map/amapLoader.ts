export type AMapNamespace = Record<string, any>;

declare global {
  interface Window {
    AMap?: AMapNamespace;
    _AMapSecurityConfig?: { securityJsCode: string };
    __yiliAmapReady?: () => void;
  }
}

let pendingLoad: Promise<AMapNamespace> | null = null;

export function loadAmap(): Promise<AMapNamespace> {
  if (window.AMap) return Promise.resolve(window.AMap);
  if (pendingLoad) return pendingLoad;

  const key = import.meta.env.VITE_AMAP_KEY?.trim();
  const securityJsCode = import.meta.env.VITE_AMAP_SECURITY_CODE?.trim();
  if (!key || !securityJsCode) {
    return Promise.reject(new Error('高德地图环境变量未配置'));
  }

  window._AMapSecurityConfig = { securityJsCode };
  pendingLoad = new Promise<AMapNamespace>((resolve, reject) => {
    const timeout = window.setTimeout(() => reject(new Error('高德地图加载超时')), 15_000);
    window.__yiliAmapReady = () => {
      window.clearTimeout(timeout);
      if (window.AMap) resolve(window.AMap);
      else reject(new Error('高德地图对象不可用'));
    };

    const script = document.createElement('script');
    script.id = 'yili-amap-script';
    script.async = true;
    script.onerror = () => {
      window.clearTimeout(timeout);
      pendingLoad = null;
      reject(new Error('高德地图脚本加载失败'));
    };
    script.src = `https://webapi.amap.com/maps?v=2.0&key=${encodeURIComponent(key)}&plugin=AMap.Driving,AMap.ToolBar,AMap.Scale&callback=__yiliAmapReady`;
    document.head.appendChild(script);
  });

  return pendingLoad;
}

