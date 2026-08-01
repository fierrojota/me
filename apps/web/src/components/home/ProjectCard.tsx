import { Card, Chip } from '@me/ui';

export type ProjectCardProps = {
  tag: string;
  tagVariant?: 'success' | 'neutral';
  title: string;
  description: string;
  image?: { src: string; alt: string; width: number; height: number };
};

export function ProjectCard({ tag, tagVariant = 'success', title, description, image }: ProjectCardProps) {
  return (
    <Card>
      <div className="project-card__body">
        <Chip variant={tagVariant}>{tag}</Chip>
        <h3 className="text-headline-md">{title}</h3>
        <p className="text-body-md">{description}</p>
      </div>
      {image ? (
        <img
          className="project-card__image"
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          loading="lazy"
          decoding="async"
        />
      ) : (
        <svg className="project-card__glyph" viewBox="0 0 40 40" width={40} height={40} aria-hidden="true">
          <circle cx="20" cy="20" r="3" fill="var(--primary-container)" />
          <path d="M12 20a8 8 0 0 1 16 0" stroke="var(--primary-container)" strokeWidth="2" fill="none" />
          <path
            d="M6 20a14 14 0 0 1 28 0"
            stroke="var(--primary-container)"
            strokeWidth="2"
            fill="none"
            opacity="0.5"
          />
        </svg>
      )}
    </Card>
  );
}
