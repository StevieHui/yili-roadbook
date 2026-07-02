# DAY6 Route Constraint and Daily Satellite Map Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** 强制 DAY6 沿独库北段规划，并在每日路书中展示当前日期的一张非交互卫星轨迹图。

**Architecture:** `TripDay.routeControlPoints` 保存隐藏规划点；共享驾车 helper 统一组装高德起终点、途经点和路径重试。新组件 `DailyRouteSnapshot` 只渲染当前 DAY，使用高德卫星图层并关闭全部交互。

**Tech Stack:** React、TypeScript、Vitest、Testing Library、高德 JS API 2.0。

## Global Constraints

- DAY6 控制点依次为 `[84.340261, 43.308788]`、`[84.310378, 43.638115]`。
- 控制点参与 `Driving.search`，但不显示为停靠点或编号标记。
- `mapOnlyStops` 显示为住宿标记，但不参与驾车规划。
- 每日路书只渲染当前 DAY 的一张卫星图。
- 地图不提供拖拽、缩放、实时路况、周边搜索或控件。
- 路径失败时显示可见停靠点顺序，不绘制直线。

---

### Task 1: Shared Driving Request and DAY6 Controls

**Files:**
- Modify: `src/types.ts`
- Modify: `src/data/itinerary.ts`
- Create: `src/map/drivingRoute.ts`
- Modify: `src/map/AmapRouteMap.tsx`
- Test: `src/__tests__/amap-routing.test.ts`
- Test: `src/__tests__/itinerary.test.ts`

**Interfaces:**
- Produces: `TripDay.routeControlPoints?: readonly Coordinates[]`
- Produces: `buildDrivingRequest(day: TripDay): { origin: Coordinates; destination: Coordinates; waypoints: Coordinates[] }`
- Produces: `searchDrivingPathWithRetry(AMap: AMapNamespace, day: TripDay): Promise<Coordinates[] | null>`

- [x] **Step 1: 写失败测试**，断言 DAY6 有两个指定控制点，`buildDrivingRequest` 的途经点顺序为控制点、乔尔玛路口、唐布拉，且可见 `route` 不包含控制点。
- [x] **Step 2: 运行 `npm run test -- src/__tests__/amap-routing.test.ts src/__tests__/itinerary.test.ts`，确认因字段和 helper 缺失而失败。**
- [x] **Step 3: 添加类型和 DAY6 数据，实现共享 helper；让 `AmapRouteMap` 删除本地重复搜索函数并调用共享 helper。**
- [x] **Step 4: 再次运行定向测试，确认通过。**

### Task 2: Non-interactive Satellite Snapshot

**Files:**
- Create: `src/map/DailyRouteSnapshot.tsx`
- Create: `src/__tests__/daily-route-snapshot.test.tsx`
- Modify: `src/styles.css`

**Interfaces:**
- Consumes: `day: TripDay` and `searchDrivingPathWithRetry`.
- Produces: `<DailyRouteSnapshot day={selectedDay} />`，根节点使用 `data-testid="daily-route-snapshot"`。

- [x] **Step 1: 写失败测试**，模拟高德 `Map`、`TileLayer.Satellite`、`Driving`、`Polyline` 与 `Marker`；断言卫星图层被添加，地图选项关闭全部交互，真实路径绘制，控制点不生成 Marker。
- [x] **Step 2: 运行 `npm run test -- src/__tests__/daily-route-snapshot.test.tsx`，确认组件缺失导致失败。**
- [x] **Step 3: 实现组件**：加载高德、创建 Satellite 图层、搜索路径、绘制高对比双层轨迹、绘制 `route` 编号点和 `mapOnlyStops` 住宿点、自动适配视野；错误状态列出 `day.route`。
- [x] **Step 4: 添加桌面 16:9、移动端较高比例、加载态和错误态样式，并确保容器 `pointer-events: none`。**
- [x] **Step 5: 运行组件测试并确认通过。**

### Task 3: Daily Roadbook Integration and Verification

**Files:**
- Modify: `src/components/DayRoadbook.tsx`
- Modify: `src/__tests__/day-roadbook.test.tsx`
- Modify: `src/__tests__/amap-route-errors.test.tsx`

**Interfaces:**
- Consumes: `<DailyRouteSnapshot day={selectedDay} />`。

- [x] **Step 1: 在路书测试中 mock `DailyRouteSnapshot`，断言切换 DAY 时页面始终只有一张地图且其日期随当前 DAY 更新。**
- [x] **Step 2: 在时间线与摄影提示下方加入当前 DAY 卫星图区域和标题“今日卫星路线”。**
- [x] **Step 3: 更新交互地图 mock，使其共享 helper 测试继续确认 DAY7 住宿不进入驾车途经点。**
- [x] **Step 4: 运行 `npm run test`、`npm run typecheck`、`npm run build`。**
- [x] **Step 5: 运行 `git diff --check`，检查最终差异只包含设计范围和实施计划。**

