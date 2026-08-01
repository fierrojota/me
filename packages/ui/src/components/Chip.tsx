import type { ReactNode } from 'react';
import './chip.css';

export type ChipProps = {
  variant?: 'neutral' | 'success' | 'error';
  children: ReactNode;
};

export function Chip({ variant = 'neutral', children }: ChipProps) {
  return <span className={`chip chip--${variant}`}>{children}</span>;
}
