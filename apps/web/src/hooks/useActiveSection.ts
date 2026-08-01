import { useEffect, useState } from 'react';

/**
 * Which of `ids`' sections currently occupies the most of the "active band"
 * (from the sticky header's bottom edge down to viewport-mid), recomputed
 * directly from live `getBoundingClientRect()` on every scroll/resize frame.
 *
 * ponytail: previously IntersectionObserver-backed. Under main-thread
 * contention (slow devices, or a burst of DOM/layout work from a fast nav
 * click across several sections), IntersectionObserver only delivers a
 * callback when a target's isIntersecting flips — so a still-intersecting
 * target's stored ratio/rect can go stale, AND the observer can simply never
 * get scheduled again once the page's smooth-scroll settles with nothing
 * else invalidating rendering, leaving the active id stuck one section
 * behind the true final scroll position. Driving this off 'scroll' (which
 * fires for every frame of a smooth-scroll animation, including its last)
 * and computing fresh on each tick has no such staleness window.
 */
export function useActiveSection(ids: readonly string[]): string | null {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    const headerHeight =
      parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--site-header-height')) || 72;

    let ticking = false;
    const computeActive = () => {
      ticking = false;
      const bandTop = headerHeight;
      const bandBottom = window.innerHeight * 0.5;
      let best: string | null = null;
      let bestOverlap = 0;
      for (const el of elements) {
        const rect = el.getBoundingClientRect();
        const overlap = Math.min(rect.bottom, bandBottom) - Math.max(rect.top, bandTop);
        if (overlap > bestOverlap) {
          bestOverlap = overlap;
          best = el.id;
        }
      }
      setActiveId(best);
    };

    const onScrollOrResize = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(computeActive);
    };

    computeActive();
    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize);
    return () => {
      window.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
    };
  }, [ids]);

  return activeId;
}
