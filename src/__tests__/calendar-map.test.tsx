import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from '../App';

describe('calendar interaction', () => {
  it('selects July 21 and exposes the high-intensity route', () => {
    render(<App />);
    const nav = screen.getByRole('navigation', { name: '路书导航' });
    fireEvent.click(within(nav).getByRole('button', { name: '日历行程' }));
    const daySix = screen.getByRole('button', { name: /7月21日/ });
    fireEvent.click(daySix);
    expect(daySix).toHaveAttribute('aria-pressed', 'true');
    fireEvent.click(within(nav).getByRole('button', { name: '路线图' }));
    expect(screen.getByRole('heading', { name: /那拉提 → 独库北段/ })).toBeVisible();
    expect(screen.getAllByText(/那拉提入口/)[0]).toBeVisible();
    expect(screen.getByText('高强度')).toBeVisible();
  });
});
