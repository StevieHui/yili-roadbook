const alerts = [
  {
    level: '01 / 必须预约',
    title: '独库北段 · 两辆车分别预约',
    copy: '2026 年北段实行 08:00–19:00 分时预约。Day 6 从那拉提入口进入，提前 1–7 天为两辆车分别预约同一入口和相邻时段。',
    action: '出发前 24h 再查路况、预约码与车牌',
  },
  {
    level: '02 / 提前锁定',
    title: '赛湖、喀拉峻与热门住宿',
    copy: '旺季自驾名额、景区内住宿和热门镇区房源都可能提前售罄。票价、开放时段与自驾规则均以出发前官方信息为准。',
    action: '两车车牌与全部身份证信息提前整理',
  },
  {
    level: '03 / 车辆纪律',
    title: '每车两名司机，绝不路中拍照',
    copy: '山路驾驶 2 小时轮换。弯道、桥面、应急车道、落石区和没有完整停车空间的位置，不因拍照临停。',
    action: '两车保持可见距离，不跟车过近',
  },
  {
    level: '04 / 天气优先',
    title: '山里一天能过四季',
    copy: '降雨、落石、低温和强风都可能临时改变计划。任何现场封路与景区管控均高于本路书；Day 6 必须保留取消或绕行权。',
    action: '每天睡前与出发前各查一次预警',
  },
  {
    level: '05 / 返航缓冲',
    title: '7 月 22 日返航只做收束',
    copy: '如果订 22 日晚航班，Day 7 不再加景点，抵达伊宁后优先洗车、加油、整理行李和还车。23 日返航才保留伊犁河日落。',
    action: '还车时间倒推至少 4 小时进伊宁',
  },
  {
    level: '06 / 弱网准备',
    title: '离线地图与集合点双备份',
    copy: '两台以上手机下载伊犁离线地图，住宿、景区入口、加油站与当天集合点全部收藏。车队失联时按约定点会合。',
    action: '不要依赖临时口头目的地',
  },
  {
    level: '07 / 生态边界',
    title: '不碾草场，不追牲畜',
    copy: '无人机先查禁飞规则；不跨越围栏，不进入未开放草地，不近距离追拍马群。所有垃圾带回有处理能力的地点。',
    action: '拍到照片，也要把风景完整留下',
  },
] as const;

export function CriticalAlerts() {
  return (
    <section className="alerts-section" id="alerts" aria-labelledby="alerts-title">
      <div className="section-shell">
        <header className="alerts-heading">
          <p className="section-kicker">READ BEFORE DEPARTURE</p>
          <h2 id="alerts-title">关键提醒</h2>
          <p>好看的计划必须先是安全、可执行的计划。</p>
        </header>
        <div className="alerts-list">
          {alerts.map((alert) => (
            <article key={alert.level}>
              <p>{alert.level}</p>
              <h3>{alert.title}</h3>
              <div><p>{alert.copy}</p><strong>{alert.action}</strong></div>
            </article>
          ))}
        </div>
        <p className="source-note">独库预约与交通规则属于动态信息，请以新疆公安、交通运输部门及现场通告为准。</p>
      </div>
    </section>
  );
}

