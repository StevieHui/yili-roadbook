import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import App from '../App';

describe('page shell', () => {
  afterEach(() => cleanup());

  it('renders title, facts, and navigation anchors', () => {
    render(<App />);
    expect(screen.getByRole('heading', { level: 1, name: /伊犁自驾路书/ })).toBeVisible();
    expect(screen.getByText(/7 人/)).toBeVisible();
    expect(screen.getByText(/2 辆车/)).toBeVisible();
    expect(screen.queryByText('必须先确认')).not.toBeInTheDocument();
    expect(screen.queryByText('查看预约行程')).not.toBeInTheDocument();

    const nav = screen.getByRole('navigation', { name: '路书导航' });
    for (const label of ['首页', '路线图', '预约行程', '每日路书', '必带清单', '关键提醒']) {
      expect(within(nav).getByRole('button', { name: label })).toBeVisible();
    }
    expect(within(nav).queryByRole('button', { name: '日历行程' })).not.toBeInTheDocument();
    expect(within(nav).queryByRole('button', { name: '预约节点' })).not.toBeInTheDocument();
  });

  it('uses dashboard tabs to jump between key travel tools', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: '伊犁自驾路书' })).toBeVisible();
    expect(screen.queryByRole('heading', { name: /向天山深处/ })).not.toBeInTheDocument();

    const nav = screen.getByRole('navigation', { name: '路书导航' });
    fireEvent.click(within(nav).getByRole('button', { name: '预约行程' }));
    expect(screen.getByRole('heading', { name: '预约行程' })).toBeVisible();
    expect(screen.getAllByText(/提前 1-7 天/)[0]).toBeVisible();
    expect(screen.getByRole('article', { name: /DAY 06/ })).toHaveTextContent('必须预约');
    expect(screen.getByRole('article', { name: /DAY 06/ })).toHaveTextContent('独库北段预约');

    fireEvent.click(within(nav).getByRole('button', { name: '路线图' }));
    expect(screen.getByRole('heading', { name: '路线图' })).toBeVisible();
    expect(screen.getByLabelText('路线地图区域')).toBeVisible();
    expect(screen.queryByLabelText('可点击路线示意图')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /DAY 06/ }));
    expect(screen.getAllByText(/那拉提入口/)[0]).toBeVisible();
    expect(screen.getAllByText(/08:00-10:00/)[0]).toBeVisible();
  });
});

