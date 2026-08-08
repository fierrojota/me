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
            // No aria-label: it was set to the title alone, which overrode the
            // card's visible text and left the accessible name ("AURA") not
            // containing what a user actually reads ("[ PRODUCT ] AURA Master
            // Your Soul — ..."). That breaks WCAG 2.5.3 Label in Name: someone
            // using voice control who says a phrase they can see would not
            // activate the link. Letting the name derive from the content is
            // more verbose but correct.
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
              image={
                project.image && project.imageAlt
                  ? { ...project.image, alt: t(project.imageAlt) }
                  : undefined
              }
              /* The cell's width is decided by the treemap, not by a fixed
                 column, so a single `sizes` for every card made the browser
                 request the same width for a 211px cell and a 616px one.
                 Passing the real percentage lets it pick per card. Desktop is
                 capped by container-max (1280px), hence the px form. */
              imageSizes={`(max-width: 819px) 92vw, (max-width: 1279px) ${rects[index].width}vw, ${Math.round(rects[index].width * 12.8)}px`}
            />
          </a>
        ))}
      </div>
    </Section>
  );
}
