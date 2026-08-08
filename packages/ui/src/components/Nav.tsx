import { type ReactNode, useLayoutEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import './nav.css';

export type NavProps = {
  brand: ReactNode;
  links: { label: string; to: string }[];
  cta?: ReactNode;
  menuLabel?: string;
  activeTo?: string;
};

export function Nav({ brand, links, cta, menuLabel = 'Menu', activeTo }: NavProps) {
  const linksWrapRef = useRef<HTMLDivElement>(null);
  const linkRefs = useRef(new Map<string, HTMLAnchorElement>());
  const [indicator, setIndicator] = useState({ x: 0, width: 0 });

  useLayoutEffect(() => {
    // NavLink's own isActive/aria-current always fires "page" for hash-only
    // `to`s against this app's single route (`/`) — set it explicitly here
    // instead, driven by `activeTo`, rather than NavLink's inert matching.
    for (const [to, el] of linkRefs.current) {
      if (to === activeTo) el.setAttribute('aria-current', 'page');
      else el.removeAttribute('aria-current');
    }

    const measure = () => {
      const wrap = linksWrapRef.current;
      const activeLink = activeTo ? linkRefs.current.get(activeTo) : undefined;
      if (!wrap || !activeLink) {
        setIndicator({ x: 0, width: 0 });
        return;
      }
      const wrapRect = wrap.getBoundingClientRect();
      const linkRect = activeLink.getBoundingClientRect();
      setIndicator({ x: linkRect.left - wrapRect.left, width: linkRect.width });
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [activeTo, links]);

  return (
    <nav className="nav">
      <div className="nav__brand">{brand}</div>
      <details className="nav__disclosure">
        {/* No role="button" here: <summary> inside <details> is already a
            disclosure and exposes aria-expanded natively. Overriding the role
            throws that state away — a screen reader would announce "Menu,
            button" with no open/closed state. */}
        <summary className="nav__toggle" aria-label={menuLabel}>
          <span className="nav__toggle-icon" aria-hidden="true" />
        </summary>
        <div className="nav__collapsible">
          <div className="nav__links-wrap" ref={linksWrapRef}>
            <ul className="nav__links">
              {links.map((link) => (
                <li key={link.to}>
                  <NavLink
                    className="nav__link"
                    to={link.to}
                    ref={(el) => {
                      if (el) linkRefs.current.set(link.to, el);
                      else linkRefs.current.delete(link.to);
                    }}
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
            <span
              className="nav__indicator"
              aria-hidden="true"
              // scaleX off a 1px base rather than animating `width`: width is
              // not a compositable property, so transitioning it forced layout
              // and paint on every frame. Both values now ride one transform.
              style={{ transform: `translateX(${indicator.x}px) scaleX(${indicator.width})` }}
            />
          </div>
          {cta && <div className="nav__cta">{cta}</div>}
        </div>
      </details>
    </nav>
  );
}
