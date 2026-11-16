import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop ensures seamless, smooth viewport resetting to top
 * whenever the user changes routes or deep-linked categories.
 */
export default function ScrollToTop() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    // Immediate scroll to top on path/category transition to prevent disorientation
    try {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant'
      });
    } catch {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
}

