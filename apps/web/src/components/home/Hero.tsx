import { useTranslation } from 'react-i18next';
import { Chip } from '@me/ui';
import { Section } from './Section';

export function Hero() {
  const { t } = useTranslation('home');

  return (
    <Section id="init" className="hero">
      <Chip variant="success">{t('hero.status')}</Chip>
      <h1 className="hero__headline text-headline-lg">
        {t('hero.headlinePrefix')} <span className="hero__highlight">{t('hero.headlineHighlight')}</span>{' '}
        {t('hero.headlineSuffix')}
      </h1>
      <p className="hero__subcopy text-body-lg">{t('hero.subcopy')}</p>
      <div className="hero__ctas">
        <a href="#featured-systems" className="btn btn--primary">
          {t('hero.ctaPrimary')}
        </a>
        <a href="#the-builder" className="btn btn--secondary">
          {t('hero.ctaSecondary')}
        </a>
      </div>
    </Section>
  );
}
