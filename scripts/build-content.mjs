#!/usr/bin/env node
/**
 * Builds src/generated/content.json and src/generated/search-index.json
 * from the markdown files in content/.
 *
 * Deliberately dependency-free: the guide only uses six block types, so a
 * purpose-built parser is safer than pulling in a markdown toolchain whose
 * behaviour we'd have to constrain anyway.
 *
 * Supported syntax:
 *   ## heading            -> heading level 2
 *   ### heading           -> heading level 3
 *   - item                -> list (consecutive lines group into one block)
 *   | a | b |             -> table (second row must be the --- separator)
 *   :::note|key|example|checklist ... :::   -> callout
 *   everything else       -> paragraph
 *   **bold** inline is parsed into text spans.
 */

import { readFileSync, writeFileSync, readdirSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const CONTENT_DIR = join(ROOT, 'content');
const OUT_DIR = join(ROOT, 'src', 'generated');

const CALLOUT_VARIANTS = new Set(['note', 'key', 'example', 'checklist']);

/* ---------------- inline ---------------- */

function parseInline(raw) {
  const spans = [];
  const re = /\*\*(.+?)\*\*/g;
  let last = 0;
  let m;
  while ((m = re.exec(raw)) !== null) {
    if (m.index > last) spans.push({ b: false, s: raw.slice(last, m.index) });
    spans.push({ b: true, s: m[1] });
    last = m.index + m[0].length;
  }
  if (last < raw.length) spans.push({ b: false, s: raw.slice(last) });
  return spans.filter((sp) => sp.s !== '');
}

/* ---------------- frontmatter ---------------- */

function parseFrontmatter(text) {
  if (!text.startsWith('---')) {
    throw new Error('missing frontmatter');
  }
  const end = text.indexOf('\n---', 3);
  if (end === -1) throw new Error('unterminated frontmatter');
  const raw = text.slice(3, end).trim();
  const body = text.slice(end + 4);
  const meta = {};
  for (const line of raw.split('\n')) {
    const i = line.indexOf(':');
    if (i === -1) continue;
    const k = line.slice(0, i).trim();
    let v = line.slice(i + 1).trim();
    if (/^-?\d+$/.test(v)) v = Number(v);
    meta[k] = v;
  }
  return { meta, body };
}

/* ---------------- blocks ---------------- */

function slugifyHeading(text, used) {
  // Hebrew headings don't transliterate usefully, so anchors are positional
  // but stable: h-<index>. Stability matters because these become deep links.
  let n = used.count++;
  return `h-${n}`;
}

function parseBlocks(body, headingState) {
  const lines = body.split('\n');
  const blocks = [];
  let i = 0;

  const isTableRow = (l) => /^\s*\|.*\|\s*$/.test(l);

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed === '') {
      i++;
      continue;
    }

    // callout
    if (trimmed.startsWith(':::')) {
      const variant = trimmed.slice(3).trim() || 'note';
      const content = [];
      i++;
      while (i < lines.length && lines[i].trim() !== ':::') {
        content.push(lines[i]);
        i++;
      }
      i++; // closing :::
      const paras = content
        .join('\n')
        .split(/\n/)
        .map((l) => l.trim())
        .filter(Boolean)
        .map(parseInline);
      blocks.push({
        type: 'callout',
        variant: CALLOUT_VARIANTS.has(variant) ? variant : 'note',
        paragraphs: paras,
      });
      continue;
    }

    // heading
    if (trimmed.startsWith('###')) {
      const text = trimmed.replace(/^###\s*/, '');
      blocks.push({
        type: 'heading',
        level: 3,
        id: slugifyHeading(text, headingState),
        spans: parseInline(text),
        plain: text,
      });
      i++;
      continue;
    }
    if (trimmed.startsWith('##')) {
      const text = trimmed.replace(/^##\s*/, '');
      blocks.push({
        type: 'heading',
        level: 2,
        id: slugifyHeading(text, headingState),
        spans: parseInline(text),
        plain: text,
      });
      i++;
      continue;
    }

    // table
    if (isTableRow(line) && i + 1 < lines.length && /^\s*\|[\s\-|]+\|\s*$/.test(lines[i + 1])) {
      const splitRow = (l) =>
        l
          .trim()
          .replace(/^\|/, '')
          .replace(/\|$/, '')
          .split(/(?<!\\)\|/)
          .map((c) => c.replace(/\\\|/g, '|').trim());
      const header = splitRow(lines[i]).map(parseInline);
      i += 2;
      const rows = [];
      while (i < lines.length && isTableRow(lines[i])) {
        rows.push(splitRow(lines[i]).map(parseInline));
        i++;
      }
      blocks.push({ type: 'table', header, rows });
      continue;
    }

    // list
    if (/^\s*-\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^\s*-\s+/.test(lines[i])) {
        items.push(parseInline(lines[i].replace(/^\s*-\s+/, '').trim()));
        i++;
      }
      blocks.push({ type: 'list', items });
      continue;
    }

    // paragraph (consume until blank line or next block starter)
    const buf = [];
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !lines[i].trim().startsWith(':::') &&
      !lines[i].trim().startsWith('#') &&
      !/^\s*-\s+/.test(lines[i]) &&
      !isTableRow(lines[i])
    ) {
      buf.push(lines[i].trim());
      i++;
    }
    if (buf.length) {
      blocks.push({ type: 'paragraph', spans: parseInline(buf.join(' ')) });
    }
  }

  return blocks;
}

/* ---------------- search index ---------------- */

// Hebrew normalisation: strip niqqud/cantillation, unify quote characters,
// drop punctuation. Without this, a search for "שכר" misses "שָׂכָר" and
// searching with a straight quote misses a typographic one.
function normalise(s) {
  return s
    .replace(/[\u0591-\u05C7]/g, '')
    .replace(/[\u2018\u2019\u05F3']/g, '')
    .replace(/[\u201C\u201D\u05F4"]/g, '')
    .replace(/[.,;:!?()[\]{}<>\/\\|*_~`]/g, ' ')
    .replace(/[-–—]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

function spansToText(spans) {
  return spans.map((s) => s.s).join('');
}

function blockText(b) {
  switch (b.type) {
    case 'paragraph':
    case 'heading':
      return spansToText(b.spans);
    case 'list':
      return b.items.map(spansToText).join(' ');
    case 'table':
      return [...b.header, ...b.rows.flat()].map(spansToText).join(' ');
    case 'callout':
      return b.paragraphs.map(spansToText).join(' ');
    default:
      return '';
  }
}

/* ---------------- main ---------------- */

const files = readdirSync(CONTENT_DIR)
  .filter((f) => f.endsWith('.md'))
  .sort();

const chapters = [];

for (const file of files) {
  const raw = readFileSync(join(CONTENT_DIR, file), 'utf8');
  const { meta, body } = parseFrontmatter(raw);
  const headingState = { count: 0 };
  const blocks = parseBlocks(body, headingState);
  chapters.push({
    id: meta.id,
    number: meta.number,
    part: meta.part,
    title: meta.title,
    summary: meta.summary,
    slug: meta.slug,
    blocks,
  });
}

// order: numbered chapters first, appendix last
chapters.sort((a, b) => {
  if (a.part === 'appendix') return 1;
  if (b.part === 'appendix') return -1;
  return a.number - b.number;
});

// search index: one record per heading section
const index = [];
let uid = 0;
for (const ch of chapters) {
  let heading = null;
  let buf = [];

  const flush = () => {
    const text = buf.join(' ').trim();
    if (!text) return;
    index.push({
      i: uid++,
      c: ch.id,
      ct: ch.title,
      n: ch.number,
      p: ch.part,
      slug: ch.slug,
      h: heading ? heading.plain : '',
      hid: heading ? heading.id : '',
      t: text,
      norm: normalise(text),
    });
    buf = [];
  };

  for (const b of ch.blocks) {
    if (b.type === 'heading') {
      flush();
      heading = b;
      continue;
    }
    const t = blockText(b);
    if (t) buf.push(t);
  }
  flush();
}

mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(join(OUT_DIR, 'content.json'), JSON.stringify({ chapters }, null, 0), 'utf8');
writeFileSync(join(OUT_DIR, 'search-index.json'), JSON.stringify({ index }, null, 0), 'utf8');

const totalBlocks = chapters.reduce((n, c) => n + c.blocks.length, 0);
console.log(
  `content: ${chapters.length} chapters, ${totalBlocks} blocks, ${index.length} search records`
);
