import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Card } from './Card';

describe('Card', () => {
  it('renders header with border-bottom class when present', () => {
    render(<Card header="SYSTEM_STATUS">Body</Card>);
    expect(screen.getByText('SYSTEM_STATUS')).toHaveClass('card__header--bordered');
  });

  it('does not render a header element when absent', () => {
    render(<Card>Body</Card>);
    expect(screen.queryByText('SYSTEM_STATUS')).not.toBeInTheDocument();
    expect(document.querySelector('.card__header--bordered')).not.toBeInTheDocument();
  });
});
