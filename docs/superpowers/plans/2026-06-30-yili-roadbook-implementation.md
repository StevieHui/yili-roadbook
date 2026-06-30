# 伊犁环线自驾路书网站 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建高级、可分享、移动端友好的伊犁七日自驾故事地图，包含真实高德地图、摄影机位、清单、提醒和打印版。

**Architecture:** Vite + React + TypeScript 单页应用。路线和摄影内容集中在结构化数据文件；高德地图封装在独立适配器中，加载失败时显示静态路线摘要；清单状态只存浏览器 `localStorage`。

**Tech Stack:** Node.js LTS、Vite、React、TypeScript、Vitest、Testing Library、高德地图 JS API 2.0、原生 CSS。

## Global Constraints

- 2026-07-15 伊宁休整，2026-07-16 至 2026-07-22 七日自驾。
- 全程主线约 1,200 km，7 人、2 辆 7 座及以下车辆。
- 高德 Key 与安全密钥只写 `.env.local`，正式发布前轮换已暴露凭据。
- 易变票务、开放时间和路况统一标记“出发前复核”。
- 1440px、768px、390px 均无横向溢出。
- 尊重 `prefers-reduced-motion`，移动端交互目标至少 44px。
- 地图失败不得阻断正文、导航、清单或打印。

---

## File Structure

```text
.
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
├── tsconfig.json
├── vite.config.ts
├── public/images/yili-hero.webp
├── src/
│   ├── App.tsx
│   ├── main.tsx
│   ├── styles.css
│   ├── types.ts
│   ├── data/itinerary.ts
│   ├── lib/itinerary.ts
│   ├── lib/checklist.ts
│   ├── map/amapLoader.ts
│   ├── map/AmapRouteMap.tsx
│   ├── components/SiteHeader.tsx
│   ├── components/Hero.tsx
│   ├── components/TripOverview.tsx
│   ├── components/CalendarStrip.tsx
│   ├── components/DayRoadbook.tsx
│   ├── components/PhotoGuide.tsx
│   ├── components/Checklist.tsx
│   ├── components/CriticalAlerts.tsx
│   ├── test/setup.ts
│   └── __tests__/*.test.tsx
└── docs/superpowers/
```

---

### Task 1: Toolchain, Types, and Researched Itinerary

**Files:**
- Create: `package.json`, `tsconfig.json`, `vite.config.ts`, `index.html`, `.gitignore`, `.env.example`
- Create: `src/types.ts`, `src/data/itinerary.ts`, `src/lib/itinerary.ts`
- Create: `src/test/setup.ts`, `src/__tests__/itinerary.test.ts`

**Interfaces:**
- Produces: `TripDay`, `Stop`, `PhotoSpot`, `tripDays`, `arrivalDay`, `tripMeta`, `getTripDistance()`, `getDayById(id)`.
- Consumers: all later UI and map tasks.

- [ ] **Step 1: Install and verify Node.js LTS**

Run only because `node --version` is currently unavailable:

```powershell
winget install OpenJS.NodeJS.LTS --accept-package-agreements --accept-source-agreements
```

Open a fresh shell and run `node --version` and `npm --version`; both must exit 0.

- [ ] **Step 2: Create package and test configuration**

Create scripts `dev`, `preview`, `test`, `typecheck`, `build`. Install React, React DOM, Vite, TypeScript, Vitest, jsdom, Testing Library, jest-dom, and the Vite React plugin. Configure Vitest for jsdom and `src/test/setup.ts`.

```powershell
npm install
```

Expected: `package-lock.json` is created.

- [ ] **Step 3: Write the failing itinerary tests**

```ts
import { describe, expect, it } from 'vitest';
import { arrivalDay, tripDays, tripMeta } from '../data/itinerary';
import { getDayById, getTripDistance } from '../lib/itinerary';

describe('itinerary data', () => {
  it('covers arrival plus seven driving days in order', () => {
    expect(arrivalDay.date).toBe('2026-07-15');
    expect(tripDays.map((day) => day.date)).toEqual([
      '2026-07-16', '2026-07-17', '2026-07-18', '2026-07-19',
      '2026-07-20', '2026-07-21', '2026-07-22',
    ]);
  });

  it('keeps the route near 1200 kilometres for seven people', () => {
    expect(getTripDistance(tripDays)).toBeGreaterThanOrEqual(1150);
    expect(getTripDistance(tripDays)).toBeLessThanOrEqual(1250);
    expect(tripMeta).toMatchObject({ people: 7, cars: 2 });
  });

  it('gives every day a stay, route, and photo spot', () => {
    for (const day of tripDays) {
      expect(day.stay.length).toBeGreaterThan(0);
      expect(day.route.length).toBeGreaterThanOrEqual(2);
      expect(day.photoSpots.length).toBeGreaterThan(0);
    }
    expect(getDayById('day-6')?.title).toContain('独库');
  });
});
```

- [ ] **Step 4: Run RED**

```powershell
npm test -- src/__tests__/itinerary.test.ts
```

Expected: FAIL because itinerary modules do not exist.

- [ ] **Step 5: Implement types and approved data**

```ts
export type Coordinates = readonly [number, number];
export interface Stop {
  id: string; name: string; coordinates: Coordinates;
  kind: 'start' | 'scenic' | 'photo' | 'stay' | 'warning';
}
export interface PhotoSpot {
  name: string; bestTime: string; shot: string; note: string;
}
export interface TripDay {
  id: `day-${1 | 2 | 3 | 4 | 5 | 6 | 7}`;
  date: string; weekday: string; title: string; summary: string;
  distanceKm: number; driveMinutes: number; stay: string;
  intensity: '轻松' | '适中' | '较满' | '高强度';
  route: readonly Stop[];
  timeline: readonly { time: string; activity: string; detail: string }[];
  highlights: readonly string[];
  photoSpots: readonly PhotoSpot[];
  reminders: readonly string[];
}
```

Populate the approved seven days with daily distances `153, 238, 148, 92, 159, 290, 118`. Implement total and lookup as pure functions.

- [ ] **Step 6: Run GREEN and commit**

```powershell
npm test -- src/__tests__/itinerary.test.ts
npm run typecheck
git add package.json package-lock.json tsconfig.json vite.config.ts index.html .gitignore .env.example src
git commit -m "feat: add researched Yili itinerary data"
```

Expected: three itinerary tests and typecheck pass.

---

### Task 2: Editorial App Shell and Navigation

**Files:**
- Create: `src/main.tsx`, `src/App.tsx`, `src/styles.css`
- Create: `src/components/SiteHeader.tsx`, `Hero.tsx`, `TripOverview.tsx`
- Test: `src/__tests__/navigation.test.tsx`

**Interfaces:**
- Produces section IDs `overview`, `map`, `calendar`, `roadbook`, `photos`, `checklist`, `alerts`.
- Hero title: `向天山深处`.

- [ ] **Step 1: Write the failing shell test**

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from '../App';

it('renders title, facts, and navigation anchors', () => {
  render(<App />);
  expect(screen.getByRole('heading', { level: 1, name: /向天山深处/ })).toBeVisible();
  expect(screen.getByText(/7 人/)).toBeVisible();
  expect(screen.getByText(/2 辆车/)).toBeVisible();
  for (const label of ['方案', '路线图', '日历行程', '分段路书', '必带清单', '关键提醒']) {
    expect(screen.getByRole('link', { name: label })).toHaveAttribute('href', expect.stringMatching(/^#/));
  }
});
```

- [ ] **Step 2: Run RED**

`npm test -- src/__tests__/navigation.test.tsx` must fail because `App` does not exist.

- [ ] **Step 3: Implement semantic shell and visual tokens**

Build sticky navigation, cinematic hero, and horizontal overview band. Use the approved six colors, serif display heading, sans-serif body, visible focus rings, `clamp()` typography, and gradient fallback. Leave semantic containers for later sections.

- [ ] **Step 4: Run GREEN and commit**

```powershell
npm test -- src/__tests__/navigation.test.tsx
npm run typecheck
git add src index.html
git commit -m "feat: build editorial roadbook shell"
```

---

### Task 3: Calendar, Roadbook, and Photography Guide

**Files:**
- Create: `src/components/CalendarStrip.tsx`, `DayRoadbook.tsx`, `PhotoGuide.tsx`
- Modify: `src/App.tsx`, `src/styles.css`
- Test: `src/__tests__/calendar-map.test.tsx`

**Interfaces:**
- `CalendarStrip({ days, selectedDayId, onSelectDay })`.
- `DayRoadbook({ days })` renders all print content.
- `App` owns `selectedDayId`.

- [ ] **Step 1: Write the failing selection test**

```tsx
it('selects July 21 and exposes the high-intensity route', () => {
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: /7月21日/ }));
  expect(screen.getByRole('button', { name: /7月21日/ })).toHaveAttribute('aria-pressed', 'true');
  expect(screen.getByText(/那拉提.*乔尔玛.*唐布拉.*尼勒克/)).toBeVisible();
  expect(screen.getByText('高强度')).toBeVisible();
});
```

- [ ] **Step 2: Run RED**

`npm test -- src/__tests__/calendar-map.test.tsx` must fail because date buttons are absent.

- [ ] **Step 3: Implement the three sections**

Each day article shows route, distance, drive time, stay, intensity, timeline, highlights, photo spots, and reminders. Date buttons use `aria-pressed`; selecting one updates state and scrolls the corresponding article into view. Photography guide groups lake, bridge, grassland, forest, road, and city scenes.

- [ ] **Step 4: Run GREEN and commit**

```powershell
npm test -- src/__tests__/calendar-map.test.tsx
npm run typecheck
git add src
git commit -m "feat: add interactive seven-day roadbook"
```

---

### Task 4: AMap Route Map and Failure Fallback

**Files:**
- Create: `src/map/amapLoader.ts`, `src/map/AmapRouteMap.tsx`
- Modify: `src/App.tsx`, `src/styles.css`, `.env.example`, `.gitignore`
- Create local-only: `.env.local`
- Test: `src/__tests__/map-fallback.test.tsx`

**Interfaces:**
- `loadAmap(): Promise<typeof window.AMap>`.
- `AmapRouteMap({ days, selectedDayId })`.
- One line and marker group per day; selected day is visually dominant.

- [ ] **Step 1: Write the failing fallback test**

```tsx
vi.mock('../map/amapLoader', () => ({
  loadAmap: vi.fn().mockRejectedValue(new Error('blocked')),
}));

it('keeps a readable route summary when AMap fails', async () => {
  render(<AmapRouteMap days={tripDays} selectedDayId="day-1" />);
  expect(await screen.findByText(/地图暂时无法加载/)).toBeVisible();
  expect(screen.getByText(/伊宁.*赛里木湖/)).toBeVisible();
});
```

- [ ] **Step 2: Run RED**

`npm test -- src/__tests__/map-fallback.test.tsx` must fail because map files do not exist.

- [ ] **Step 3: Implement loader, layers, and secrets**

Set `window._AMapSecurityConfig = { securityJsCode }` before loading JS API 2.0. Reject cleanly when either environment value is empty. Load the official script only once, fit the full route initially, fit the selected day after calendar changes, and destroy the map on unmount.

`.env.example` contains:

```dotenv
VITE_AMAP_KEY=
VITE_AMAP_SECURITY_CODE=
```

Write prototype credentials to ignored `.env.local` without printing them.

- [ ] **Step 4: Run GREEN and commit**

```powershell
npm test -- src/__tests__/map-fallback.test.tsx src/__tests__/calendar-map.test.tsx
npm run typecheck
git add .env.example .gitignore src
git commit -m "feat: add resilient AMap route map"
```

Expected: tests pass and `.env.local` is not tracked.

---

### Task 5: Persistent Checklist, Critical Alerts, and Print

**Files:**
- Create: `src/lib/checklist.ts`, `src/components/Checklist.tsx`, `CriticalAlerts.tsx`
- Modify: `src/data/itinerary.ts`, `src/App.tsx`, `src/styles.css`
- Test: `src/__tests__/checklist.test.tsx`

**Interfaces:**
- Storage key: `yili-roadbook-checklist-v1`.
- `loadChecklist(storage, key)` and `saveChecklist(storage, key, value)`.

- [ ] **Step 1: Write the failing persistence test**

```tsx
it('persists checks and resets them', () => {
  const { unmount } = render(<Checklist />);
  fireEvent.click(screen.getByRole('checkbox', { name: '身份证' }));
  unmount();
  render(<Checklist />);
  expect(screen.getByRole('checkbox', { name: '身份证' })).toBeChecked();
  fireEvent.click(screen.getByRole('button', { name: '重置清单' }));
  expect(screen.getByRole('checkbox', { name: '身份证' })).not.toBeChecked();
});
```

- [ ] **Step 2: Run RED**

`npm test -- src/__tests__/checklist.test.tsx` must fail because `Checklist` does not exist.

- [ ] **Step 3: Implement checklist, alerts, and print rules**

Checklist groups: 证件车辆、衣物防护、摄影电子、食品药品、团队公共物资. Alerts place the 2026 独库预约 rule first, then two-car separate reservations, tickets, offline maps, fuel, weather, drone, and no-roadside-parking. Print hides navigation/map controls and keeps each day together where possible.

- [ ] **Step 4: Run GREEN and commit**

```powershell
npm test -- src/__tests__/checklist.test.tsx
npm run typecheck
git add src
git commit -m "feat: add persistent packing guide and alerts"
```

---

### Task 6: Original Hero Asset and High-End Polish

**Files:**
- Create: `public/images/yili-hero.webp`
- Modify: `src/components/Hero.tsx`, `src/styles.css`, `index.html`

**Interfaces:**
- Original 16:9-or-wider bitmap, minimum width 1920px, no embedded text or logos.
- CSS provides a complete gradient fallback.

- [ ] **Step 1: Generate the landscape with the `imagegen` skill**

Prompt for a photorealistic cinematic Yili panorama: turquoise alpine lake, Tian Shan spruce foothills, meadow, small winding road, golden hour, restrained natural color, safe dark text area; exclude people, logos, embedded words, fantasy geography, and oversaturation.

- [ ] **Step 2: Add art direction and motion safeguards**

Set responsive focal positions and directional overlay. Add a complete reduced-motion override setting animation/transition duration to `0.01ms` and scroll behavior to `auto`.

- [ ] **Step 3: Run checks and commit**

```powershell
npm test
npm run typecheck
npm run build
git add public src index.html
git commit -m "style: finish cinematic Yili visual system"
```

Expected: tests, typecheck, and production build pass.

---

### Task 7: Browser Acceptance and Final Audit

**Files:**
- Modify only files implicated by observed failures.

**Interfaces:**
- Preview URL: `http://127.0.0.1:4173/`.
- Viewports: 1440×1000, 768×1024, 390×844.

- [ ] **Step 1: Start production preview**

```powershell
npm run build
npm run preview -- --host 127.0.0.1 --port 4173
```

- [ ] **Step 2: Verify in the in-app browser**

Check no overflow; hero readability; all anchors; 7 月 21 日 map/day synchronization; checklist reload/reset; map failure fallback; keyboard order; empty console; and print content containing seven days, stays, checklist, and alerts.

- [ ] **Step 3: Fix observed defects test-first**

For every defect: add the smallest failing Vitest test, confirm RED, apply one fix, confirm focused GREEN.

- [ ] **Step 4: Run final verification**

```powershell
npm test
npm run typecheck
npm run build
git status --short
```

Expected: all tests pass; typecheck/build exit 0; `.env.local` remains ignored; the supplied reference JPG may remain intentionally untracked.
