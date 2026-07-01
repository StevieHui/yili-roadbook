import { tripMeta } from '../data/itinerary';

export function Hero() {
  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <div className="hero-grid" aria-hidden="true" />
      <div className="hero-copy">
        <p className="eyebrow">XINJIANG · ILI ROAD TRIP · 2026</p>
        <h1 id="hero-title">向天山深处</h1>
        <p className="hero-subtitle">{tripMeta.subtitle}</p>
        <p className="hero-lede">
          从伊宁河谷到独库垭口，湖泊、森林、草甸与盘山路逐一展开。
          七天，只为把方向盘对准雪山的方向。
        </p>
        <div className="hero-route" aria-label="路线摘要">
          <span>伊宁</span><i /><span>赛湖</span><i /><span>喀拉峻</span><i />
          <span>库尔德宁</span><i /><span>那拉提</span><i /><span>唐布拉</span><i /><span>伊宁</span>
        </div>
      </div>
      <div className="hero-index" aria-hidden="true">
        <strong>07</strong>
        <span>DAYS ON<br />THE ROAD</span>
      </div>
      <p className="hero-caption">雪线之下，万物生长。</p>
    </section>
  );
}
