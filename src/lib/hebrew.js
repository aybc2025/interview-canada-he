/**
 * Hebrew-aware normalisation for search.
 * Strips niqqud and cantillation, unifies the several quote characters that
 * appear in Hebrew text, and drops punctuation — so a query typed with a
 * straight quote still matches text written with a gershayim, and partially
 * vocalised text stays findable.
 */
export function normalise(s) {
  return String(s)
    .replace(/[\u0591-\u05C7]/g, '')
    .replace(/[\u2018\u2019\u05F3']/g, '')
    .replace(/[\u201C\u201D\u05F4"]/g, '')
    .replace(/[.,;:!?()[\]{}<>/\\|*_~`]/g, ' ')
    .replace(/[-\u2013\u2014]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

export function tokenize(s) {
  return normalise(s).split(' ').filter(Boolean);
}
