import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { normalise, tokenize } from '../lib/hebrew';
import { SEARCH_MAX_RESULTS, SEARCH_MIN_CHARS } from '../config/constants';

/**
 * Client-side search over the build-time index.
 *
 * The index is loaded lazily on first use rather than bundled into the initial
 * download – most visitors read rather than search, and the guide should open
 * fast on a phone.
 */
export default function useSearch() {
  const [index, setIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const requested = useRef(false);

  const load = useCallback(async () => {
    if (requested.current) return;
    requested.current = true;
    setLoading(true);
    try {
      const mod = await import('../generated/search-index.json');
      setIndex((mod.default || mod).index);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (query.length >= SEARCH_MIN_CHARS) load();
  }, [query, load]);

  const results = useMemo(() => {
    if (!index || query.trim().length < SEARCH_MIN_CHARS) return [];
    const terms = tokenize(query);
    if (!terms.length) return [];

    const scored = [];
    for (const rec of index) {
      let score = 0;
      let allPresent = true;
      for (const t of terms) {
        const inText = rec.norm.includes(t);
        const inHeading = normalise(rec.h).includes(t);
        const inTitle = normalise(rec.ct).includes(t);
        if (!inText && !inHeading && !inTitle) {
          allPresent = false;
          break;
        }
        // A hit in a heading or chapter title says more about relevance than
        // one buried in body text.
        if (inHeading) score += 6;
        if (inTitle) score += 4;
        if (inText) score += 1;
      }
      if (allPresent) scored.push({ rec, score });
    }

    scored.sort((a, b) => b.score - a.score || a.rec.i - b.rec.i);
    return scored.slice(0, SEARCH_MAX_RESULTS).map((s) => s.rec);
  }, [index, query]);

  const grouped = useMemo(() => {
    const map = new Map();
    for (const r of results) {
      if (!map.has(r.c)) map.set(r.c, []);
      map.get(r.c).push(r);
    }
    return [...map.values()];
  }, [results]);

  return { query, setQuery, results, grouped, loading, ready: !!index };
}

/**
 * Builds a short excerpt around the first matching term, so a result shows the
 * sentence the word actually appears in rather than the start of the section.
 */
export function excerpt(text, query, radius = 90) {
  const terms = tokenize(query);
  if (!terms.length) return text.slice(0, radius * 2);
  const norm = normalise(text);
  let at = -1;
  for (const t of terms) {
    const i = norm.indexOf(t);
    if (i !== -1 && (at === -1 || i < at)) at = i;
  }
  if (at === -1) return text.slice(0, radius * 2);
  const start = Math.max(0, at - radius);
  const end = Math.min(text.length, at + radius);
  return (start > 0 ? '…' : '') + text.slice(start, end).trim() + (end < text.length ? '…' : '');
}

/** Splits a string into matched / unmatched parts for highlighting. */
export function highlight(text, query) {
  const terms = tokenize(query).filter((t) => t.length >= SEARCH_MIN_CHARS);
  if (!terms.length) return [{ hit: false, s: text }];

  const norm = normalise(text);
  const marks = new Array(text.length).fill(false);

  // normalise() can change length, so only mark when lengths align; otherwise
  // fall back to a plain scan on the original text.
  const aligned = norm.length === text.length;
  const hay = aligned ? norm : text.toLowerCase();

  for (const t of terms) {
    let from = 0;
    for (;;) {
      const i = hay.indexOf(t, from);
      if (i === -1) break;
      for (let k = i; k < i + t.length && k < marks.length; k++) marks[k] = true;
      from = i + t.length;
    }
  }

  const parts = [];
  let cur = '';
  let curHit = marks[0] || false;
  for (let i = 0; i < text.length; i++) {
    const hit = marks[i] || false;
    if (hit !== curHit) {
      if (cur) parts.push({ hit: curHit, s: cur });
      cur = '';
      curHit = hit;
    }
    cur += text[i];
  }
  if (cur) parts.push({ hit: curHit, s: cur });
  return parts;
}
