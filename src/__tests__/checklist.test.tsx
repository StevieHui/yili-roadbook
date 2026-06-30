import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { Checklist } from '../components/Checklist';

describe('checklist', () => {
  beforeEach(() => localStorage.clear());

  it('persists checks and resets them', () => {
    const { unmount } = render(<Checklist />);
    fireEvent.click(screen.getByRole('checkbox', { name: '身份证' }));
    unmount();

    render(<Checklist />);
    expect(screen.getByRole('checkbox', { name: '身份证' })).toBeChecked();
    fireEvent.click(screen.getByRole('button', { name: '重置清单' }));
    expect(screen.getByRole('checkbox', { name: '身份证' })).not.toBeChecked();
  });
});

