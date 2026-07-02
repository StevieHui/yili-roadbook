# 指定住宿与路线地图标记 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** 将缘居阁民宿与长桥郡写入对应日期的每日路书，并在路线图中以真实住宿位置显示且不改变 DAY7 还车路线。

**Architecture:** 住宿作为可复用 `Stop` 存放在行程数据中；正常驾车日直接替换泛化的城市起终点。`TripDay` 增加只显示、不参与驾车规划的 `mapOnlyStops`，用于 DAY7 还车后的缘居阁住宿标记。

**Tech Stack:** React、TypeScript、Vitest、Testing Library、高德 JS API。

## Global Constraints

- 缘居阁地址：伊宁市开发区天津北路 148 号。
- 长桥郡地址：新疆维吾尔自治区伊犁哈萨克自治州特克斯县波斯坦街四环路与博斯坦街四环路一巷交叉口西南 80 米。
- DAY7 自驾终点必须保持为伊宁机场服务点。
- `mapOnlyStops` 只能生成地图标记，不能传入 `Driving.search`。

---

### Task 1: 住宿数据与每日路书

**Files:**
- Modify: `src/types.ts`
- Modify: `src/data/itinerary.ts`
- Test: `src/__tests__/itinerary.test.ts`

**Interfaces:**
- Produces: `TripDay.mapOnlyStops?: readonly Stop[]`
- Produces: 缘居阁与长桥郡 `Stop`，坐标通过高德 `PlaceSearch` 按完整地址核准并固化为 GCJ-02。

- [x] **Step 1: 写失败测试**：断言 7 月 14、15、21 日住宿为“缘居阁民宿”，7 月 16、17 日为“长桥郡”；断言 DAY1–4 的相应路线端点和 DAY7 `mapOnlyStops`。
- [x] **Step 2: 运行 `npm run test -- src/__tests__/itinerary.test.ts`**，确认测试因住宿仍为泛化城市点而失败。
- [x] **Step 3: 用高德 `PlaceSearch` 按完整地址核准两个 GCJ-02 坐标；在 `itinerary.ts` 新增住宿点，更新 `arrivalDay.stay`、DAY1–4 的 `stay`/路线/文案、DAY7 的 `stay`/文案/`mapOnlyStops` 与返程说明。**
- [x] **Step 4: 运行定向测试并确认通过。**

### Task 2: 地图附加住宿标记

**Files:**
- Modify: `src/map/AmapRouteMap.tsx`
- Test: `src/__tests__/amap-route-errors.test.tsx`
- Test: `src/__tests__/map-fallback.test.tsx`

**Interfaces:**
- Consumes: `TripDay.mapOnlyStops?: readonly Stop[]`

- [x] **Step 1: 写失败测试**：捕获 `Driving.search` 参数并确认 DAY7 终点仍是机场服务点、缘居阁未进入途经点；捕获 `Marker` 标题并确认缘居阁被绘制。
- [x] **Step 2: 运行地图定向测试并确认预期失败。**
- [x] **Step 3: 将 `mapOnlyStops` 合并到普通标记和精选住宿标记渲染及视野适配中，但保持 `searchDrivingPath` 只读取 `day.route`。失败回退列表以“住宿标记”单列附加点。**
- [x] **Step 4: 运行地图定向测试并确认通过。**

### Task 3: 总览与完整验证

**Files:**
- Modify: `src/components/TripOverview.tsx`
- Test: `src/__tests__/itinerary.test.ts`
- Test: `src/__tests__/day-roadbook.test.tsx`

**Interfaces:**
- Consumes: 完整住宿名称并映射为简短的住宿接力标签。

- [x] **Step 1: 更新住宿接力测试，期望值为 `['伊宁', '伊宁', '特克斯', '特克斯', '库尔德宁', '那拉提', '尼勒克', '伊宁']`；更新受路线节点名称影响的路书测试。**
- [x] **Step 2: 让总览短标签将缘居阁映射为“伊宁”、长桥郡映射为“特克斯”。**
- [x] **Step 3: 运行 `npm run test`、`npm run typecheck` 与 `npm run build`。**
- [x] **Step 4: 检查 `git diff --check` 和最终差异，确认未改动无关文件。**

