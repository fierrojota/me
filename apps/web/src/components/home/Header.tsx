import { useTranslation } from 'react-i18next';
import { Nav, LanguageToggle } from '@me/ui';
import { useActiveSection } from '../../hooks/useActiveSection';

const SECTION_IDS = ['init', 'the-builder', 'featured-systems', 'connect'] as const;

export function Header() {
  const { t, i18n } = useTranslation('home');
  const language = (i18n.resolvedLanguage ?? i18n.language) as 'en' | 'es';
  const activeId = useActiveSection(SECTION_IDS);

  const links = [
    { label: t('header.nav.init'), to: '#init' },
    { label: t('header.nav.about'), to: '#the-builder' },
    { label: t('header.nav.systems'), to: '#featured-systems' },
    { label: t('header.nav.connect'), to: '#connect' },
  ];

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Nav
          brand={
            <a href="#init" className="site-header__brand-link">
              <img className="site-header__logo" src="/icon-192.png" alt="" width={32} height={32} />
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
