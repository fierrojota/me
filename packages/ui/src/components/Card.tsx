import type { ReactNode } from 'react';
import './card.css';

export type CardProps = {
  header?: ReactNode;
  children: ReactNode;
};

export function Card({ header, children }: CardProps) {
  return (
    <div className="card">
      {header && <div className="card__header card__header--bordered">{header}</div>}
      <div className="card__body">{children}</div>
    </div>
  );
}
