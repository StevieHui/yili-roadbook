const navItems = [
  ['首页', 'home'],
  ['路线图', 'route'],
  ['预约行程', 'bookings'],
  ['每日路书', 'roadbook'],
  ['必带清单', 'checklist'],
  ['关键提醒', 'alerts'],
] as const;

interface SiteHeaderProps {
  activeView: string;
  onSelectView: (view: string) => void;
}

export function SiteHeader({ activeView, onSelectView }: SiteHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const selectView = (view: string) => {
    onSelectView(view);
    setIsMenuOpen(false);
  };

  return (
    <header className="site-header">
      <button type="button" className="brand" onClick={() => selectView('home')} aria-label="返回首页">
        <span className="brand-mark">N43°</span>
        <span>伊犁路书</span>
      </button>
      <button
        type="button"
        className="nav-toggle"
        aria-label={isMenuOpen ? '关闭导航菜单' : '打开导航菜单'}
        aria-expanded={isMenuOpen}
        aria-controls="site-navigation"
        onClick={() => setIsMenuOpen((open) => !open)}
      >
        <span /><span />
      </button>
      <nav id="site-navigation" aria-label="路书导航" className={isMenuOpen ? 'is-open' : ''}>
        {navItems.map(([label, view]) => (
          <button
            type="button"
            className={activeView === view ? 'is-active' : ''}
            onClick={() => selectView(view)}
            key={view}
          >
            {label}
          </button>
        ))}
      </nav>
    </header>
  );
}

import { useState } from 'react';
