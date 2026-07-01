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
    expect(screen.getByRole('article', { name: /DAY 06/ })).toHaveTextContent('那拉提 → 独库北段');
    expect(screen.getByRole('article', { name: /DAY 06/ })).toHaveTextContent('必须预约');
    fireEvent.click(within(nav).getByRole('button', { name: '路线图' }));
    expect(screen.getByRole('heading', { name: /那拉提 → 独库北段/ })).toBeVisible();
    expect(screen.getAllByText(/那拉提入口/)[0]).toBeVisible();
    expect(screen.getByText('高强度')).toBeVisible();
  });
});
