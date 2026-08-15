import React from 'react';

/**
 * Isolates runs of Latin text inside Hebrew paragraphs.
 *
 * Without this, "שיטת START." renders the full stop on the wrong side of the
 * Latin word, because the punctuation adopts the neighbouring run's direction.
 * The guide contains dozens of Latin terms (START, STAR, PWA, InDesign), so
 * this is applied centrally at render time rather than marked up by hand in
 * the content files — content authors shouldn't have to think about it.
 */

// Matches a whole run of Latin text, including the spaces *between* Latin
// words. Capturing "Land acknowledgement" as one unit matters: isolating each
// word separately would place them as two independent inline boxes in the RTL
// flow, rendering the phrase back-to-front.
const LATIN_RUN = /[A-Za-z][A-Za-z0-9&'’+.\-]*(?:[ \t]+[A-Za-z][A-Za-z0-9&'’+.\-]*)*/g;

export function isolate(text) {
  if (!text) return [text];
  const out = [];
  let last = 0;
  let m;
  LATIN_RUN.lastIndex = 0;
  while ((m = LATIN_RUN.exec(text)) !== null) {
    let run = m[0];
    // Trailing punctuation (a full stop, a hyphen) belongs to the Hebrew
    // sentence, not to the Latin term — leave it outside the isolate.
    const trimmed = run.replace(/[^A-Za-z0-9]+$/, '');
    if (!trimmed) continue;
    const start = m.index;
    if (start > last) out.push(text.slice(last, start));
    out.push({ latin: trimmed });
    last = start + trimmed.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export default function Bidi({ text }) {
  const parts = isolate(text);
  return (
    <>
      {parts.map((p, i) =>
        typeof p === 'string' ? (
          <React.Fragment key={i}>{p}</React.Fragment>
        ) : (
          <bdi key={i}>{p.latin}</bdi>
        )
      )}
    </>
  );
}

/** Renders parsed inline spans ({ b: bold, s: string }) with bidi isolation. */
export function Spans({ spans, className }) {
  if (!spans) return null;
  return (
    <span className={className}>
      {spans.map((sp, i) =>
        sp.b ? (
          <strong key={i} className="font-bold">
            <Bidi text={sp.s} />
          </strong>
        ) : (
          <Bidi key={i} text={sp.s} />
        )
      )}
    </span>
  );
}

export function spansToPlain(spans) {
  return (spans || []).map((s) => s.s).join('');
}
