import { useTranslation } from 'react-i18next';
import { Card, Chip } from '@me/ui';
import { Section } from './Section';
import { builderProfile } from '../../data/builder';
import builderPhoto from '../../assets/the-builder.webp';
import builderPhotoSmall from '../../assets/the-builder-512.webp';

export function Builder() {
  const { t } = useTranslation('home');

  return (
    <Section id="the-builder" className="builder section--snap">
      <div className="builder__image-wrap">
        <Chip variant="neutral">{t('builder.sourceImageLabel')}</Chip>
        <img
          className="builder__image"
          src={builderPhoto}
          // Renders ~493 CSS px on desktop and ~301 on tablet, so a 1x screen
          // was pulling the full 768px file. The 768 stays for retina, which
          // needs 986 and is already slightly under it.
          srcSet={`${builderPhotoSmall} 512w, ${builderPhoto} 768w`}
          sizes="(max-width: 819px) 50vw, 493px"
          alt={t('builder.imageAlt')}
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className="builder__content">
        <h2 className="text-headline-lg">{t('builder.heading')}</h2>
        <ul className="builder__facts text-body-md">
          <li>
            {t(builderProfile.roleKey)}{' '}
            <a href={builderProfile.company.url} target="_blank" rel="noopener noreferrer">
              {builderProfile.company.name}
            </a>
          </li>
          <li>{t(builderProfile.specializationKey)}</li>
          <li>{t(builderProfile.philosophyKey)}</li>
          <li>{t(builderProfile.humanKey)}</li>
        </ul>
        <blockquote className="builder__quote text-body-lg">{t(builderProfile.quoteKey)}</blockquote>
        <div className="builder__stats">
          {builderProfile.stats.map((stat) => (
            <Card key={stat.titleKey}>
              <Chip variant="success">{t(stat.labelKey)}</Chip>
              <h3 className="text-body-lg">{t(stat.titleKey)}</h3>
              <p className="text-body-md">{t(stat.bodyKey)}</p>
            </Card>
          ))}
        </div>
      </div>
    </Section>
  );
}
