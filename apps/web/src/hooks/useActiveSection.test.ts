import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useActiveSection } from './useActiveSection';

// Assumes the default 72px header height (jsdom reports '' for the
// custom property, so the hook's `|| 72` fallback applies) and a
// window.innerHeight of 900 (jsdom default), giving an active band of
// [72, 450] in viewport coordinates.

function mockRect(el: Element, top: number, bottom: number) {
  el.getBoundingClientRect = () => ({ top, bottom, height: bottom - top }) as DOMRect;
}

beforeEach(() => {
  document.body.innerHTML = '';
  // Run rAF synchronously so scroll/resize-driven recomputation is
  // observable without waiting on a real animation frame.
  vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
    cb(0);
    return 0;
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('useActiveSection', () => {
  it('returns null when none of the ids exist in the DOM', () => {
    const { result } = renderHook(() => useActiveSection(['missing']));
    expect(result.current).toBeNull();
  });

  it('picks the section overlapping the active band on mount', () => {
    document.body.innerHTML = '<div id="a"></div><div id="b"></div>';
    mockRect(document.getElementById('a')!, 72, 900); // fully overlaps the band
    mockRect(document.getElementById('b')!, 900, 1728); // below the band entirely

    const { result } = renderHook(() => useActiveSection(['a', 'b']));
    expect(result.current).toBe('a');
  });

  it('recomputes on scroll — the section with the most band overlap wins, not a stale prior pick', () => {
    document.body.innerHTML = '<div id="a"></div><div id="b"></div>';
    const a = document.getElementById('a')!;
    const b = document.getElementById('b')!;
    mockRect(a, 72, 900);
    mockRect(b, 900, 1728);

    const { result } = renderHook(() => useActiveSection(['a', 'b']));
    expect(result.current).toBe('a');

    // scroll so `b` now fully occupies the band and `a` has scrolled past it
    mockRect(a, -828, 44);
    mockRect(b, 44, 872);
    act(() => {
      window.dispatchEvent(new Event('scroll'));
    });
    expect(result.current).toBe('b');
  });

  it('returns null once every section has scrolled past the active band', () => {
    document.body.innerHTML = '<div id="a"></div>';
    const a = document.getElementById('a')!;
    mockRect(a, 72, 900);

    const { result } = renderHook(() => useActiveSection(['a']));
    expect(result.current).toBe('a');

    mockRect(a, -2000, -1200);
    act(() => {
      window.dispatchEvent(new Event('scroll'));
    });
    expect(result.current).toBeNull();
  });

  it('recomputes on resize', () => {
    document.body.innerHTML = '<div id="a"></div><div id="b"></div>';
    const a = document.getElementById('a')!;
    const b = document.getElementById('b')!;
    mockRect(a, 72, 900);
    mockRect(b, 900, 1728);

    const { result } = renderHook(() => useActiveSection(['a', 'b']));
    expect(result.current).toBe('a');

    mockRect(a, -828, 44);
    mockRect(b, 44, 872);
    act(() => {
      window.dispatchEvent(new Event('resize'));
    });
    expect(result.current).toBe('b');
  });
});
