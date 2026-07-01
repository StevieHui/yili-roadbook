import { tripMeta } from '../data/itinerary';

const teamNames = ['柳意轩', '夏执', '陈熠辉', '辛励佳', '赵禹砚', '袁畅', '齐天下'];

export function Dashboard() {
  return (
    <section className="dashboard" aria-labelledby="dashboard-title">
      <div className="dashboard-cover">
        <div className="dashboard-copy">
          <p className="section-kicker">天山北麓 · 伊犁河谷 · 盛夏出发</p>
          <h1 id="dashboard-title">向天山深处</h1>
          <p className="dashboard-subtitle">
            从伊犁河谷启程，绕天山腹地一周——湖泊、云杉、草甸与盘山路逐一展开，这是交给夏天的一千二百公里。
          </p>
          <div className="dashboard-glass-grid" aria-label="封面行程信息">
            <article>
              <span>里程</span>
              <strong>约 {tripMeta.distanceKm.toLocaleString()} km</strong>
            </article>
            <article className="span-2">
              <span>主要景观</span>
              <strong>赛里木湖 &nbsp;·&nbsp; 果子沟 &nbsp;·&nbsp; 喀拉峻 &nbsp;·&nbsp; 库尔德宁 &nbsp;·&nbsp; 那拉提 &nbsp;·&nbsp; 独库 &nbsp;·&nbsp; 唐布拉</strong>
            </article>
            <article>
              <span>时间</span>
              <strong>{tripMeta.dateRange}</strong>
            </article>
            <article className="span-2">
              <span>赛里木湖车神</span>
              <strong>{teamNames.join('、')}</strong>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
