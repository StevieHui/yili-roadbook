import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import App from '../App';

describe('page shell', () => {
  afterEach(() => cleanup());

  it('renders title, facts, and navigation anchors', () => {
    render(<App />);
    expect(screen.getByRole('heading', { level: 1, name: /出发控制台/ })).toBeVisible();
    expect(screen.getByText(/7 人/)).toBeVisible();
    expect(screen.getByText(/2 辆车/)).toBeVisible();

    const nav = screen.getByRole('navigation', { name: '路书导航' });
    for (const label of ['首页', '路线图', '日历行程', '每日路书', '预约节点', '必带清单', '关键提醒']) {
      expect(within(nav).getByRole('button', { name: label })).toBeVisible();
    }
  });

  it('uses dashboard tabs to jump between key travel tools', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: '出发控制台' })).toBeVisible();
    expect(screen.getAllByText('独库北段预约')[0]).toBeVisible();
    expect(screen.getAllByText('最晚 7 月 20 日 20:00 前')[0]).toBeVisible();

    const nav = screen.getByRole('navigation', { name: '路书导航' });
    fireEvent.click(within(nav).getByRole('button', { name: '预约节点' }));
    expect(screen.getByRole('heading', { name: '预约节点' })).toBeVisible();
    expect(screen.getAllByText(/提前 1-7 天/)[0]).toBeVisible();

    fireEvent.click(within(nav).getByRole('button', { name: '路线图' }));
    expect(screen.getByRole('heading', { name: '交互路线图' })).toBeVisible();
    fireEvent.click(screen.getByRole('button', { name: /DAY 06/ }));
    expect(screen.getByText(/那拉提入口/)).toBeVisible();
  });
});

