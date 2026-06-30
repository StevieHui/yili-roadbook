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

    const nav = screen.getByRole('navigation', { name: '路书导航' });
    for (const label of ['首页', '路线图', '日历行程', '每日路书', '预约节点', '必带清单', '关键提醒']) {
      expect(within(nav).getByRole('button', { name: label })).toBeVisible();
    }
  });

  it('uses dashboard tabs to jump between key travel tools', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: '伊犁自驾路书' })).toBeVisible();
    expect(screen.queryByRole('heading', { name: /向天山深处/ })).not.toBeInTheDocument();
    expect(screen.getAllByText('独库北段预约')[0]).toBeVisible();
    expect(screen.getAllByText('最晚 7 月 20 日 20:00 前')[0]).toBeVisible();

    const nav = screen.getByRole('navigation', { name: '路书导航' });
    fireEvent.click(within(nav).getByRole('button', { name: '预约节点' }));
    expect(screen.getByRole('heading', { name: '预约节点' })).toBeVisible();
    expect(screen.getAllByText(/提前 1-7 天/)[0]).toBeVisible();

    fireEvent.click(within(nav).getByRole('button', { name: '路线图' }));
    expect(screen.getByRole('heading', { name: '路线图' })).toBeVisible();
    expect(screen.getByLabelText('可点击路线示意图')).toBeVisible();
    fireEvent.click(screen.getByRole('button', { name: /DAY 06/ }));
    expect(screen.getAllByText(/那拉提入口/)[0]).toBeVisible();
    expect(screen.getAllByText(/08:00-10:00/)[0]).toBeVisible();
  });
});

