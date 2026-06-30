import { tripMeta } from '../data/itinerary';

export function Hero() {
  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <div className="hero-grid" aria-hidden="true" />
      <div className="hero-copy">
        <p className="eyebrow">XINJIANG · ILI ROAD TRIP · 2026</p>
        <h1 id="hero-title">向天山深处</h1>
        <p className="hero-subtitle">{tripMeta.subtitle}</p>
        <div className="hero-route" aria-label="路线摘要">
          <span>伊宁</span><i /><span>赛湖</span><i /><span>喀拉峻</span><i />
          <span>库尔德宁</span><i /><span>那拉提</span><i /><span>唐布拉</span><i /><span>伊宁</span>
        </div>
      </div>
      <div className="hero-index" aria-hidden="true">
        <strong>07</strong>
        <span>DAYS ON<br />THE ROAD</span>
      </div>
      <p className="hero-caption">雪山把路折进河谷，我们沿着光继续向西。</p>
    </section>
  );
}

