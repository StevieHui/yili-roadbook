import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from '../App';

describe('calendar interaction', () => {
  it('selects July 21 and exposes the high-intensity route', () => {
    render(<App />);
    const daySix = screen.getByRole('button', { name: /7月21日/ });
    fireEvent.click(daySix);
    expect(daySix).toHaveAttribute('aria-pressed', 'true');
    expect(
      screen.getByText(/那拉提旅游风景区 → 乔尔玛烈士陵园 → 唐布拉百里画廊 → 尼勒克县/),
    ).toBeVisible();
    expect(screen.getByText('高强度')).toBeVisible();
  });
});
