import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Force browser's scroll restoration to manual mode to avoid browser vs app race conditions
if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual';
}

export function useScrollRestoration(loading: boolean) {
  const { pathname, search } = useLocation();
  const key = `scroll_pos_${pathname}${search}`;

  useEffect(() => {
    const handleScroll = () => {
      // Only write to session storage if the browser's actual current location
      // matches this specific list view, to prevent route transitions
      // from overwriting the position with 0.
      if (
        window.location.pathname === pathname &&
        window.location.search === search &&
        window.scrollY > 0
      ) {
        sessionStorage.setItem(key, String(window.scrollY));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [key, pathname, search]);

  // Restore scroll position when loading is complete
  useEffect(() => {
    if (!loading) {
      const saved = sessionStorage.getItem(key);
      if (saved) {
        const timer = setTimeout(() => {
          window.scrollTo({
            top: Number(saved),
            behavior: 'instant' as any
          });
          sessionStorage.removeItem(key);
        }, 120);
        return () => clearTimeout(timer);
      }
    }
  }, [loading, key]);
}
