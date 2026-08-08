import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Nav } from './Nav';

const links = [
  { label: 'Home', to: '/' },
  { label: 'Work', to: '/work' },
];

describe('Nav', () => {
  it('renders brand, links, and optional cta', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Nav brand="me" links={links} cta={<button>Get in touch</button>} />
      </MemoryRouter>,
    );
    expect(screen.getByText('me')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Work')).toBeInTheDocument();
    expect(screen.getByText('Get in touch')).toBeInTheDocument();
  });

  it('marks the link matching activeTo with aria-current="page", and no other', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Nav brand="me" links={links} activeTo="/work" />
      </MemoryRouter>,
    );
    expect(screen.getByText('Work')).toHaveAttribute('aria-current', 'page');
    expect(screen.getByText('Home')).not.toHaveAttribute('aria-current');
  });

  it('renders the mobile disclosure closed by default and opens it on toggle click', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/']}>
        <Nav brand="me" links={links} menuLabel="Menu" />
      </MemoryRouter>,
    );
    const details = container.querySelector('details.nav__disclosure')!;
    expect(details).not.toHaveAttribute('open');
    // By label, not by role: <summary> gets its implicit button role from
    // HTML-AAM, which jsdom does not map. Real browsers expose it along with
    // aria-expanded — which is precisely what an explicit role="button"
    // would have suppressed.
    fireEvent.click(screen.getByLabelText('Menu'));
    expect(details).toHaveAttribute('open');
  });
});
