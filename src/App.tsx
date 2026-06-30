import { Hero } from './components/Hero';
import { SiteHeader } from './components/SiteHeader';
import { TripOverview } from './components/TripOverview';

const pendingSections = [
  ['map', '路线图', '一张地图看懂七天分段与关键机位。'],
  ['calendar', '日历行程', '按日期进入当天节奏。'],
  ['roadbook', '分段路书', '从出发到入住，每个节点都有答案。'],
  ['photos', '摄影机位', '把光线、焦段和安全边界一起记下。'],
  ['checklist', '必带清单', '两辆车共用一套不遗漏的出发检查。'],
  ['alerts', '关键提醒', '路况、预约与山地驾驶优先于打卡。'],
] as const;

export default function App() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <TripOverview />
        {pendingSections.map(([id, title, copy], index) => (
          <section className="pending-section section-shell" id={id} key={id} aria-labelledby={`${id}-title`}>
            <span className="section-number">0{index + 2}</span>
            <div>
              <p className="section-kicker">COMING INTO VIEW</p>
              <h2 id={`${id}-title`}>{title}</h2>
              <p>{copy}</p>
            </div>
          </section>
        ))}
      </main>
      <footer>
        <span>43°N · 81°E</span>
        <p>伊宁往返 · 2026 盛夏</p>
      </footer>
    </>
  );
}

