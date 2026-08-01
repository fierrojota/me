import type { CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import { ProjectCard } from './ProjectCard';
import { Section } from './Section';
import { projects } from '../../data/projects';
import { treemap } from '../../lib/treemap';

export function FeaturedSystems() {
  const { t } = useTranslation('home');
  const rects = treemap(projects); // cheap for single-digit N — no memoization needed

  return (
    <Section id="featured-systems" className="featured-systems section--snap">
      <div className="featured-systems__heading">
        <div>
          <h2 className="text-headline-lg">{t('featuredSystems.heading')}</h2>
          <p className="text-body-md">{t('featuredSystems.subcopy')}</p>
        </div>
        <a href="https://github.com/jotafierro" className="featured-systems__github text-label-md">
          {t('featuredSystems.githubLink')}
        </a>
      </div>
      <div className="grid featured-systems__grid">
        {projects.map((project, index) => (
          <a
            key={project.id}
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t(project.title)}
            className="project-card-cell"
            style={
              {
                '--rect-top': `${rects[index].top}%`,
                '--rect-left': `${rects[index].left}%`,
                '--rect-width': `${rects[index].width}%`,
                '--rect-height': `${rects[index].height}%`,
              } as CSSProperties
            }
          >
            <ProjectCard
              tag={t(project.tag)}
              tagVariant={project.tagVariant}
              title={t(project.title)}
              description={t(project.description)}
            />
          </a>
        ))}
      </div>
    </Section>
  );
}
