import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LanguageToggle } from './LanguageToggle';

describe('LanguageToggle', () => {
  it('renders EN/ES as two buttons, marking the active one aria-pressed', () => {
    render(<LanguageToggle value="en" onChange={() => {}} />);
    expect(screen.getByRole('button', { name: 'EN' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'ES' })).toHaveAttribute('aria-pressed', 'false');
  });

  it('calls onChange with the clicked language', () => {
    const onChange = vi.fn();
    render(<LanguageToggle value="en" onChange={onChange} />);
    fireEvent.click(screen.getByRole('button', { name: 'ES' }));
    expect(onChange).toHaveBeenCalledWith('es');
  });
});
