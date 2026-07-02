import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import App from '../App';

describe('page shell', () => {
  afterEach(() => cleanup());

  it('renders title, facts, and navigation anchors', () => {
    render(<App />);
    expect(screen.getByRole('heading', { level: 1, name: /向天山深处/ })).toBeVisible();
    expect(screen.getByText(/从伊犁河谷启程/)).toBeVisible();
    expect(screen.getByLabelText('封面行程信息')).toBeVisible();
    expect(screen.getByText(/赛里木湖车神/)).toBeVisible();
    expect(screen.getByText(/伊昭公路/)).toBeVisible();
    expect(screen.queryByText('必须先确认')).not.toBeInTheDocument();
    expect(screen.queryByText('查看预约行程')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('行程概览')).not.toBeInTheDocument();

    const nav = screen.getByRole('navigation', { name: '路书导航' });
    for (const label of ['首页', '路线图', '预约行程', '每日路书', '必带清单']) {
      expect(within(nav).getByRole('button', { name: label })).toBeVisible();
    }
    expect(within(nav).queryByRole('button', { name: '日历行程' })).not.toBeInTheDocument();
    expect(within(nav).queryByRole('button', { name: '预约节点' })).not.toBeInTheDocument();
  });

  it('uses dashboard tabs to jump between key travel tools', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: /向天山深处/ })).toBeVisible();

    const nav = screen.getByRole('navigation', { name: '路书导航' });
    fireEvent.click(within(nav).getByRole('button', { name: '预约行程' }));
    expect(screen.getByRole('heading', { name: '预约行程' })).toBeVisible();
    expect(screen.getByText(/赛里木湖自驾票/)).toBeVisible();
    expect(screen.getByRole('article', { name: /DAY 06/ })).toHaveTextContent('必须预约');

    fireEvent.click(within(nav).getByRole('button', { name: '路线图' }));
    expect(screen.getByRole('heading', { name: '路线图' })).toBeVisible();
    expect(screen.getByLabelText('路线地图区域')).toBeVisible();
    expect(screen.queryByLabelText('可点击路线示意图')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /DAY 06/ }));
    expect(screen.getAllByText(/那拉提入口/)[0]).toBeVisible();
    expect(screen.getByText(/独库预约/)).toBeVisible();
  });

  it('opens the mobile navigation and closes it after choosing a view', () => {
    render(<App />);

    const menuButton = screen.getByRole('button', { name: '打开导航菜单' });
    const nav = screen.getByRole('navigation', { name: '路书导航' });
    expect(menuButton).toHaveAttribute('aria-expanded', 'false');
    expect(nav).not.toHaveClass('is-open');

    fireEvent.click(menuButton);
    expect(menuButton).toHaveAttribute('aria-expanded', 'true');
    expect(nav).toHaveClass('is-open');

    fireEvent.click(within(nav).getByRole('button', { name: '每日路书' }));
    expect(screen.getByRole('heading', { name: '每日路书' })).toBeInTheDocument();
    expect(menuButton).toHaveAttribute('aria-expanded', 'false');
    expect(nav).not.toHaveClass('is-open');
  });
});

