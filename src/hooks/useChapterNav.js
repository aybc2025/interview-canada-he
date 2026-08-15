import { useMemo } from 'react';
import { neighbours } from '../lib/content';

export default function useChapterNav(slug) {
  return useMemo(() => neighbours(slug), [slug]);
}
