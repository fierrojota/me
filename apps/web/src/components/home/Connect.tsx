import iconUrl from '../../assets/icon-64.png';
import { useTranslation } from 'react-i18next';

export function Connect() {
  const { t } = useTranslation('home');

  return (
    // Hand-rolled — NOT <Section>. Replicates Section's own className-building
    // logic (`section${className ? ' ' + className : ''}`) as a literal string
    // for this component's fixed, unchanging id/className values, so `.section`
    // and `.section--snap`'s existing CSS selectors keep matching identically.
    // See DD-38: a one-off escape hatch for Connect only — Hero/Builder/
    // FeaturedSystems (Section's other 3 consumers) are untouched and keep
    // using the shared primitive exactly as before.
    <section id="connect" className="section connect section--snap">
      <div className="container-max">
        <div className="connect__card">
          <h2 className="text-headline-lg">{t('connect.headline')}</h2>
          <p className="connect__subtitle text-body-md">{t('connect.subtitle')}</p>
          <div className="connect__actions">
            <a href="mailto:connect@fierrojota.com" className="btn btn--primary">
              {t('connect.email')}
            </a>
            <p className="connect__status text-label-sm">{t('connect.status')}</p>
          </div>
        </div>
      </div>
      {/* Sibling of .container-max, not nested inside it — the only way to
          escape the 1280px cap. Content unchanged from rev 9. */}
      <footer className="connect__footer">
        <div className="connect__footer-brand">
          <img src={iconUrl} alt="" width={24} height={24} />
          <span className="text-label-md">
            {t('connect.footerBrand', { year: new Date().getFullYear() })}
          </span>
        </div>
        <ul className="connect__footer-links text-label-md">
          <li>
            <a href="https://github.com/fierrojota">{t('connect.footerGithub')}</a>
          </li>
          <li>
            <a href="https://linkedin.com/in/fierrojota">{t('connect.footerLinkedin')}</a>
          </li>
          <li>
            <a href="https://www.youtube.com/@fierrojota" target="_blank" rel="noopener noreferrer">
              {t('connect.footerYoutube')}
            </a>
          </li>
          <li>
            <a href="mailto:connect@fierrojota.com">{t('connect.footerEmail')}</a>
          </li>
        </ul>
      </footer>
    </section>
  );
}
