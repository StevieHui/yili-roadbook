import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from '../App';

describe('page shell', () => {
  it('renders title, facts, and navigation anchors', () => {
    render(<App />);
    expect(screen.getByRole('heading', { level: 1, name: /向天山深处/ })).toBeVisible();
    expect(screen.getByText(/7 人/)).toBeVisible();
    expect(screen.getByText(/2 辆车/)).toBeVisible();

    for (const label of ['方案', '路线图', '日历行程', '分段路书', '必带清单', '关键提醒']) {
      expect(screen.getByRole('link', { name: label })).toHaveAttribute(
        'href',
        expect.stringMatching(/^#/),
      );
    }
  });
});

