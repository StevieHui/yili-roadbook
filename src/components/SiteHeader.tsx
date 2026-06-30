const navItems = [
  ['方案', '#overview'],
  ['路线图', '#map'],
  ['日历行程', '#calendar'],
  ['分段路书', '#roadbook'],
  ['必带清单', '#checklist'],
  ['关键提醒', '#alerts'],
] as const;

export function SiteHeader() {
  return (
    <header className="site-header">
      <a className="brand" href="#top" aria-label="返回首页">
        <span className="brand-mark">N43°</span>
        <span>向天山深处</span>
      </a>
      <nav aria-label="路书导航">
        {navItems.map(([label, href]) => (
          <a href={href} key={href}>{label}</a>
        ))}
      </nav>
    </header>
  );
}

