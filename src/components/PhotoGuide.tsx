import type { TripDay } from '../types';

const sceneTips = [
  ['湖', '顺光看水色，逆光拍草甸', '广角 16–35mm + 偏振镜'],
  ['桥', '只在官方观景台完成构图', '中长焦压缩峡谷层次'],
  ['草原', '下午侧光比正午更立体', '70–200mm 拍草坡与牧群'],
  ['森林', '阴天也能获得细腻层次', '浅色衣服 + 擦镜布'],
  ['公路', '车队只在正式停车带摆位', '低机位但人不进车道'],
  ['城市', '蓝调时刻保留环境氛围', '尊重当地居民与肖像权'],
] as const;

export function PhotoGuide({ days }: { days: readonly TripDay[] }) {
  const count = days.reduce((sum, day) => sum + day.photoSpots.length, 0);
  return (
    <section className="photo-guide" id="photos" aria-labelledby="photos-title">
      <div className="section-shell">
        <header className="photo-guide-heading">
          <div>
            <p className="section-kicker">CHASE THE LIGHT</p>
            <h2 id="photos-title">不是打卡清单，<br />是光线计划</h2>
          </div>
          <p>全程标记 {count} 个核心机位。到现场先判断天气和安全边界，再决定焦段与停留时间。</p>
        </header>
        <div className="scene-ledger">
          {sceneTips.map(([scene, light, gear], index) => (
            <article key={scene}>
              <span>0{index + 1}</span>
              <h3>{scene}</h3>
              <p>{light}</p>
              <small>{gear}</small>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

