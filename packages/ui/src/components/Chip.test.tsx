import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Chip } from './Chip';

describe('Chip', () => {
  it('renders neutral variant with correct class', () => {
    render(<Chip variant="neutral">STATUS: IDLE</Chip>);
    expect(screen.getByText('STATUS: IDLE')).toHaveClass('chip--neutral');
  });

  it('renders success variant with correct class', () => {
    render(<Chip variant="success">STATUS: ACTIVE</Chip>);
    expect(screen.getByText('STATUS: ACTIVE')).toHaveClass('chip--success');
  });

  it('renders error variant with correct class', () => {
    render(<Chip variant="error">STATUS: FAILED</Chip>);
    expect(screen.getByText('STATUS: FAILED')).toHaveClass('chip--error');
  });

  it('does not truncate long text', () => {
    const longText = 'A'.repeat(200);
    render(<Chip>{longText}</Chip>);
    const chip = screen.getByText(longText);
    expect(chip.className).not.toMatch(/truncate|nowrap|ellipsis/);
  });
});
