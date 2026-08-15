import { useEffect, useState } from 'react';

/** Visual only — how far through the current chapter the reader is. */
export default function useReadingProgress(ref) {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = ref.current;
      if (!el) return;
      const total = el.scrollHeight - window.innerHeight;
      if (total <= 0) {
        setPct(100);
        return;
      }
      const top = Math.max(0, window.scrollY - el.offsetTop);
      setPct(Math.min(100, Math.max(0, (top / total) * 100)));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [ref]);

  return pct;
}
