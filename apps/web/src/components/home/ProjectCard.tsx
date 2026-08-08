import { Card, Chip } from '@me/ui';

export type ProjectCardProps = {
  tag: string;
  tagVariant?: 'success' | 'neutral';
  title: string;
  description: string;
  image?: { src: string; srcSmall: string; srcTiny: string; alt: string; width: number; height: number };
  /** Per-card `sizes`; the treemap decides how wide this cell actually is. */
  imageSizes?: string;
};

export function ProjectCard({ tag, tagVariant = 'success', title, description, image, imageSizes }: ProjectCardProps) {
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
          // Two widths rather than one resized file: the rendered size comes
          // from the treemap weights in data/projects.ts, so hardcoding a
          // resolution would silently upscale the day those weights change.
          // srcset lets the browser pick per cell size and per device pixel
          // ratio instead — the small cells stop downloading 1376px art, and
          // a retina screen still gets the large one.
          srcSet={`${image.srcTiny} 344w, ${image.srcSmall} 688w, ${image.src} 1376w`}
          sizes={imageSizes ?? '(max-width: 819px) 92vw, 45vw'}
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
