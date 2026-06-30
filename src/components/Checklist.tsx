import { useMemo, useState } from 'react';
import { loadChecklist, saveChecklist } from '../lib/checklist';

const storageKey = 'yili-roadbook-checklist-v1';

const groups = [
  ['证件车辆', ['身份证', '驾驶证', '行驶证 / 租车合同', '保险与救援电话', '两车备用钥匙', '独库预约码']],
  ['衣物防护', ['冲锋衣或薄羽绒', '速干长裤', '防晒帽与墨镜', 'SPF50+ 防晒', '雨具', '舒适徒步鞋']],
  ['摄影电子', ['相机与镜头', '备用电池', '充电器与插线板', '移动电源', '存储卡', '擦镜布']],
  ['食品药品', ['每车饮用水', '高能量路餐', '肠胃药', '创可贴与消毒用品', '晕车药', '驱蚊用品']],
  ['团队公共物资', ['车载充电器', '垃圾袋', '纸巾湿巾', '离线地图', '对讲或车队群', '保温毯']],
  ['验收确认', ['两车车牌信息', '景区预约截图', '住宿停车确认', '航班与还车时间', '备用路线收藏', '同行人紧急联系人']],
] as const;

export function Checklist() {
  const [checked, setChecked] = useState(() => loadChecklist(localStorage, storageKey));
  const items = useMemo(() => groups.flatMap(([, values]) => values), []);
  const completed = items.filter((item) => checked[item]).length;

  const toggle = (item: string) => {
    setChecked((current) => {
      const next = { ...current, [item]: !current[item] };
      saveChecklist(localStorage, storageKey, next);
      return next;
    });
  };

  const reset = () => {
    setChecked({});
    localStorage.removeItem(storageKey);
  };

  return (
    <section className="checklist-section" id="checklist" aria-labelledby="checklist-title">
      <div className="section-shell">
        <header className="checklist-heading">
          <div>
            <p className="section-kicker">PACK LIGHT / PREPARE RIGHT</p>
            <h2 id="checklist-title">必带清单</h2>
          </div>
          <div className="checklist-progress" aria-live="polite">
            <strong>{completed}</strong><span>/ {items.length} 已确认</span>
            <div><i style={{ width: `${(completed / items.length) * 100}%` }} /></div>
          </div>
        </header>

        <div className="checklist-groups">
          {groups.map(([title, values], groupIndex) => (
            <fieldset key={title}>
              <legend><span>0{groupIndex + 1}</span>{title}</legend>
              {values.map((item) => (
                <label key={item} className={checked[item] ? 'is-checked' : ''}>
                  <input type="checkbox" checked={Boolean(checked[item])} onChange={() => toggle(item)} />
                  <i aria-hidden="true" />
                  <span>{item}</span>
                </label>
              ))}
            </fieldset>
          ))}
        </div>
        <div className="checklist-actions">
          <button type="button" onClick={reset}>重置清单</button>
          <p>勾选结果只保存在这台设备的浏览器中。</p>
        </div>
      </div>
    </section>
  );
}

