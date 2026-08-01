import type { ReactNode } from 'react';

export type SectionProps = {
  id?: string;
  className?: string;
  children: ReactNode;
};

export function Section({ id, className, children }: SectionProps) {
  return (
    <section id={id} className={`section${className ? ` ${className}` : ''}`}>
      <div className="container-max">{children}</div>
    </section>
  );
}
