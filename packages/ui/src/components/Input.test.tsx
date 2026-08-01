import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Input } from './Input';

describe('Input', () => {
  it('associates label with input via htmlFor/id', () => {
    render(<Input label="Callsign" />);
    const input = screen.getByLabelText('Callsign');
    expect(input).toBeInTheDocument();
  });

  it('respects a caller-supplied id', () => {
    render(<Input label="Callsign" id="callsign" />);
    expect(screen.getByLabelText('Callsign')).toHaveAttribute('id', 'callsign');
  });

  it('becomes the active element on focus', () => {
    render(<Input label="Callsign" />);
    const input = screen.getByLabelText('Callsign');
    input.focus();
    expect(input).toHaveFocus();
    expect(input).toHaveClass('input-field__control');
  });
});
