import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from '../App';

describe('calendar interaction', () => {
  it('uses the merged booking itinerary to expose July 20 requirements and route details', () => {
    render(<App />);
    const nav = screen.getByRole('navigation', { name: '路书导航' });
    fireEvent.click(within(nav).getByRole('button', { name: '预约行程' }));
    const daySix = screen.getByRole('button', { name: /7月20日/ });
    fireEvent.click(daySix);
    expect(daySix).toHaveAttribute('aria-pressed', 'true');
    const daySixCard = screen.getByRole('article', { name: /DAY 06/ });
    expect(daySixCard).toHaveTextContent('那拉提 → 独库北段');
    expect(daySixCard).toHaveTextContent('必须预约');
    const inlineDetail = screen.getByRole('region', { name: '当天预约时间点' });
    expect(daySixCard.nextElementSibling).toBe(inlineDetail);
    expect(inlineDetail).toHaveTextContent('独库北段预约');
    expect(inlineDetail).toHaveTextContent('7 月 13 日起可约 · 最晚 7 月 19 日');
    fireEvent.click(within(nav).getByRole('button', { name: '路线图' }));
    expect(screen.getByRole('heading', { name: /那拉提 → 独库北段/ })).toBeVisible();
    expect(screen.getAllByText(/那拉提入口/)[0]).toBeVisible();
    expect(screen.getByText('高强度')).toBeVisible();
  });
});
