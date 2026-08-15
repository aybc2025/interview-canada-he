import data from '../generated/content.json';

export const CHAPTERS = data.chapters;

export const NUMBERED = CHAPTERS.filter((c) => c.part !== 'appendix');
export const APPENDIX = CHAPTERS.find((c) => c.part === 'appendix') || null;

export function chaptersInPart(partId) {
  return NUMBERED.filter((c) => c.part === partId);
}

export function bySlug(slug) {
  return CHAPTERS.find((c) => c.slug === slug) || null;
}

export function byId(id) {
  return CHAPTERS.find((c) => c.id === id) || null;
}

/** Reading order: chapters 1..14, then the appendix. */
export const ORDER = [...NUMBERED, ...(APPENDIX ? [APPENDIX] : [])];

export function neighbours(slug) {
  const i = ORDER.findIndex((c) => c.slug === slug);
  if (i === -1) return { prev: null, next: null };
  return {
    prev: i > 0 ? ORDER[i - 1] : null,
    next: i < ORDER.length - 1 ? ORDER[i + 1] : null,
  };
}
