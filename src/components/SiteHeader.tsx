const navItems = [
  ['首页', 'home'],
  ['路线图', 'route'],
  ['日历行程', 'calendar'],
  ['每日路书', 'roadbook'],
  ['预约节点', 'bookings'],
  ['必带清单', 'checklist'],
  ['关键提醒', 'alerts'],
] as const;

interface SiteHeaderProps {
  activeView: string;
  onSelectView: (view: string) => void;
}

export function SiteHeader({ activeView, onSelectView }: SiteHeaderProps) {
  return (
    <header className="site-header">
      <button type="button" className="brand" onClick={() => onSelectView('home')} aria-label="返回首页">
        <span className="brand-mark">N43°</span>
        <span>伊犁路书</span>
      </button>
      <nav aria-label="路书导航">
        {navItems.map(([label, view]) => (
          <button
            type="button"
            className={activeView === view ? 'is-active' : ''}
            onClick={() => onSelectView(view)}
            key={view}
          >
            {label}
          </button>
        ))}
      </nav>
    </header>
  );
}

