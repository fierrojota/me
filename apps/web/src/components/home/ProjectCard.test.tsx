import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProjectCard } from './ProjectCard';

describe('ProjectCard', () => {
  it('renders tag, title, description and an img when the image prop is passed', () => {
    render(
      <ProjectCard
        tag="[ SYSTEM_ARCH ]"
        title="AURA_CORE"
        description="High-performance orchestration system."
        image={{
          src: '/aura-core.webp',
          srcSmall: '/aura-core-688.webp',
          srcTiny: '/aura-core-344.webp',
          alt: 'AURA_CORE preview',
          width: 1200,
          height: 675,
        }}
      />,
    );
    expect(screen.getByText('[ SYSTEM_ARCH ]')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'AURA_CORE' })).toBeInTheDocument();
    expect(screen.getByText('High-performance orchestration system.')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'AURA_CORE preview' })).toBeInTheDocument();
  });

  it('renders the inline glyph, not an img, when no image prop is passed', () => {
    render(
      <ProjectCard
        tag="[ MOBILE_SYSTEMS ]"
        title="FZ_CONNECT"
        description="Cross-platform mobile athlete dashboard."
      />,
    );
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(document.querySelector('.project-card__glyph')).toBeInTheDocument();
  });
});
