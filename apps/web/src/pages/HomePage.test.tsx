import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { I18nextProvider } from 'react-i18next';
import en from '../locales/en/home.json';
import { testI18n } from '../lib/test-i18n';
import { nextQuarter } from '../lib/quarter';
import { projects } from '../data/projects';
import { HomePage } from './HomePage';

const projectById = (id: string) => projects.find((p) => p.id === id)!;

function renderHomePage() {
  return render(
    <I18nextProvider i18n={testI18n}>
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    </I18nextProvider>,
  );
}

describe('HomePage', () => {
  describe('AC-1 — Header/Nav', () => {
    it('renders header/nav landmarks, brand and nav links, with no CONNECT.EXE cta', () => {
      renderHomePage();
      expect(screen.getByRole('banner')).toBeInTheDocument();
      expect(screen.getByRole('navigation')).toBeInTheDocument();
      expect(screen.getByText(en.header.wordmark)).toBeInTheDocument();
      expect(screen.getByRole('link', { name: en.header.nav.about })).toHaveAttribute('href', '/#the-builder');
      expect(screen.getByRole('link', { name: en.header.nav.systems })).toHaveAttribute('href', '/#featured-systems');
      expect(screen.getByRole('link', { name: en.header.nav.connect })).toHaveAttribute('href', '/#connect');
      expect(screen.queryByText(en.header.connect)).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: en.header.connect })).not.toBeInTheDocument();
      // Queried by label, not by role: the toggle is a bare <summary>, whose
      // implicit button role comes from HTML-AAM and is not mapped by jsdom.
      // Real browsers expose it (plus aria-expanded) — that is why the
      // explicit role="button" was removed.
      expect(screen.getByLabelText(en.header.nav.menuLabel)).toBeInTheDocument();
    });

    it('renders the brand as a link to #init', () => {
      renderHomePage();
      expect(screen.getByRole('link', { name: en.header.wordmark })).toHaveAttribute('href', '#init');
    });
  });

  describe('AC-2 — Hero', () => {
    it('renders the status chip, headline highlight, subcopy and both CTAs', () => {
      renderHomePage();
      expect(screen.getByText(en.hero.status)).toBeInTheDocument();
      expect(screen.getByText(en.hero.headlineHighlight)).toBeInTheDocument();
      expect(screen.getByText(new RegExp(en.hero.subcopy.slice(0, 40)))).toBeInTheDocument();
      expect(screen.getByRole('link', { name: en.hero.ctaPrimary })).toHaveAttribute('href', '#featured-systems');
      expect(screen.getByRole('link', { name: en.hero.ctaSecondary })).toHaveAttribute('href', '#the-builder');
    });
  });

  describe('AC-3 — About/Builder', () => {
    it('renders the builder image, facts, pull-quote and two stat cards', () => {
      renderHomePage();
      const image = screen.getByRole('img', { name: en.builder.imageAlt });
      expect(image).toBeInTheDocument();
      expect(image.getAttribute('alt')).not.toBe('');
      expect(screen.getByText(new RegExp(en.builder.factRolePrefix))).toBeInTheDocument();
      expect(screen.getByText(en.builder.factSpecialization)).toBeInTheDocument();
      expect(screen.getByText(en.builder.factPhilosophy)).toBeInTheDocument();
      expect(screen.getByText(en.builder.factHuman)).toBeInTheDocument();
      expect(screen.getByText(en.builder.quote)).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: en.builder.stat1Title })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: en.builder.stat2Title })).toBeInTheDocument();
    });

    it('renders the Fz Sports company name as a new-tab link to fzsports.com', () => {
      renderHomePage();
      const link = screen.getByRole('link', { name: 'Fz Sports' });
      expect(link).toHaveAttribute('href', 'https://www.fzsports.com/');
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });

  describe('AC-4 — Featured Systems', () => {
    it('renders the OPEN_GITHUB link and all 4 project cards', () => {
      renderHomePage();
      expect(screen.getByRole('link', { name: en.featuredSystems.githubLink })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: en.featuredSystems.aura.title })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: en.featuredSystems.jFlow.title })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: en.featuredSystems.superclean.title })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: en.featuredSystems.me.title })).toBeInTheDocument();
    });

    it('sizes the desktop treemap by weight (aura > j-flow > superclean > me)', () => {
      renderHomePage();
      const area = (title: string) => {
        const cell = screen.getByRole('heading', { name: title }).closest('.project-card-cell')! as HTMLElement;
        return (
          parseFloat(cell.style.getPropertyValue('--rect-width')) *
          parseFloat(cell.style.getPropertyValue('--rect-height'))
        );
      };
      expect(area(en.featuredSystems.aura.title)).toBeGreaterThan(area(en.featuredSystems.jFlow.title));
      expect(area(en.featuredSystems.jFlow.title)).toBeGreaterThan(area(en.featuredSystems.superclean.title));
      expect(area(en.featuredSystems.superclean.title)).toBeGreaterThan(area(en.featuredSystems.me.title));
    });

    it('renders each project hero image with its alt text (not the fallback glyph)', () => {
      renderHomePage();
      // Asserted against the imported asset rather than a literal path: the
      // images live in src/assets now so Vite fingerprints them, and the built
      // URL is not knowable here. Both widths are checked, since a missing
      // srcSmall would silently ship the 1376px file to every cell.
      const auraImg = screen.getByRole('img', { name: en.featuredSystems.aura.imageAlt });
      expect(auraImg).toHaveAttribute('src', projectById('aura').image!.src);
      expect(auraImg.getAttribute('srcset')).toContain(projectById('aura').image!.srcSmall);
      expect(screen.getByRole('img', { name: en.featuredSystems.jFlow.imageAlt })).toHaveAttribute(
        'src',
        projectById('jFlow').image!.src,
      );
    });

    it('each project card is a link to its own url, opening in a new tab', () => {
      renderHomePage();
      const link = screen.getByRole('link', { name: en.featuredSystems.aura.title });
      expect(link).toHaveAttribute('href', 'https://aura-dev.jotafierro.me/');
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });

  describe('AC-5 — Connect', () => {
    it('renders the headline, subtitle, mailto cta and status microcopy', () => {
      renderHomePage();
      expect(screen.getByRole('heading', { name: en.connect.headline })).toBeInTheDocument();
      const { quarter, year } = nextQuarter();
      const expectedSubtitle = en.connect.subtitle
        .replace('{{quarter}}', String(quarter))
        .replace('{{year}}', String(year));
      expect(screen.getByText(expectedSubtitle)).toBeInTheDocument();
      expect(screen.getByRole('link', { name: en.connect.email })).toHaveAttribute(
        'href',
        'mailto:connect@jotafierro.me',
      );
      expect(screen.getByText(en.connect.status)).toBeInTheDocument();
    });

    it('renders the former Footer brand/year and GitHub/LinkedIn/Email links inside the Connect section', () => {
      renderHomePage();
      expect(
        screen.getByText(new RegExp(`jotafierro\\.me // ${new Date().getFullYear()}`)),
      ).toBeInTheDocument();
      expect(screen.getByRole('link', { name: en.connect.footerGithub })).toHaveAttribute(
        'href',
        'https://github.com/jotafierro',
      );
      expect(screen.getByRole('link', { name: en.connect.footerLinkedin })).toHaveAttribute(
        'href',
        'https://linkedin.com/in/jotafierro',
      );
      expect(screen.getByRole('link', { name: en.connect.footerEmail })).toHaveAttribute(
        'href',
        'mailto:connect@jotafierro.me',
      );
      expect(document.getElementById('connect')?.querySelector('footer')).toBeInTheDocument();
    });
  });

  describe('AC-9 — Accessibility baseline (landmark uniqueness)', () => {
    it('renders exactly one header/nav/main landmark', () => {
      renderHomePage();
      expect(screen.getAllByRole('banner')).toHaveLength(1);
      expect(screen.getAllByRole('navigation')).toHaveLength(1);
      expect(screen.getAllByRole('main')).toHaveLength(1);
    });

    it('has no contentinfo landmark — the only <footer> on the page is nested inside <main>/#connect, which (per the ARIA-in-HTML spec) downgrades its implicit role from contentinfo to generic', () => {
      renderHomePage();
      // ponytail: jsdom + @testing-library/dom's role computation (via aria-query)
      // does not model the HTML spec's "footer loses contentinfo when nested in
      // sectioning content/main" ancestor constraint — queryAllByRole('contentinfo')
      // still (incorrectly) matches a nested <footer> here. Asserting DOM structure
      // directly is the real regression guard: there is exactly one <footer>, and
      // it lives inside <main>, not as a top-level sibling (which is what would
      // restore a genuine contentinfo landmark in real browsers/axe).
      const footers = document.querySelectorAll('footer');
      expect(footers).toHaveLength(1);
      expect(footers[0].closest('main')).not.toBeNull();
    });
  });

  describe('AC-13 — Full-height section navigation', () => {
    it('applies section--snap to Builder, Featured Systems and Connect only', () => {
      renderHomePage();
      expect(document.getElementById('the-builder')).toHaveClass('section--snap');
      expect(document.getElementById('featured-systems')).toHaveClass('section--snap');
      expect(document.getElementById('connect')).toHaveClass('section--snap');
      expect(document.querySelector('main > .section:not(.section--snap)')).toBeInTheDocument();
    });
  });
});
