import iconUrl from '../../assets/icon-64.png';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Nav, LanguageToggle } from '@me/ui';
import { useActiveSection } from '../../hooks/useActiveSection';

const SECTION_IDS = ['init', 'the-builder', 'featured-systems', 'connect'] as const;

export function Header() {
  const { t, i18n } = useTranslation('home');
  const language = (i18n.resolvedLanguage ?? i18n.language) as 'en' | 'es';
  const activeId = useActiveSection(SECTION_IDS);

  // Memoized because Nav's measuring layout effect depends on `links`. A fresh
  // array each render re-ran it on every active-section change, forcing two
  // getBoundingClientRect() reads mid-scroll — a synchronous layout in the
  // exact frame the browser is animating a smooth scroll.
  const links = useMemo(
    () => [
      { label: t('header.nav.init'), to: '#init' },
      { label: t('header.nav.about'), to: '#the-builder' },
      { label: t('header.nav.systems'), to: '#featured-systems' },
      { label: t('header.nav.connect'), to: '#connect' },
    ],
    [t],
  );

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Nav
          brand={
            <a href="#init" className="site-header__brand-link">
              <img className="site-header__logo" src={iconUrl} alt="" width={32} height={32} />
              <span>{t('header.wordmark')}</span>
            </a>
          }
          links={links}
          cta={
            <LanguageToggle
              value={language}
              onChange={(lang) => i18n.changeLanguage(lang)}
              label={t('header.languageLabel')}
            />
          }
          menuLabel={t('header.nav.menuLabel')}
          activeTo={activeId ? `#${activeId}` : undefined}
        />
      </div>
    </header>
  );
}
