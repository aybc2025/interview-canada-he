import { Link } from 'react-router-dom';

export default function ChapterRow({ chapter, current = false, compact = false }) {
  const num = chapter.part === 'appendix' ? '·' : String(chapter.number).padStart(2, '0');

  return (
    <Link
      to={`/chapter/${chapter.slug}`}
      aria-current={current ? 'page' : undefined}
      className={[
        'flex gap-3 items-baseline py-2.5 px-2 -mx-2 rounded-lg min-h-[44px]',
        'border-b border-line last:border-0 transition-colors',
        current ? 'bg-petrol-tint' : 'hover:bg-petrol-tint/50',
      ].join(' ')}
    >
      <span
        className={[
          'font-util text-xs font-bold shrink-0 w-5',
          chapter.part === 'appendix' ? 'text-tie' : 'text-petrol-mid',
        ].join(' ')}
      >
        {num}
      </span>
      <span className="min-w-0">
        <span className={`block ${current ? 'font-bold' : ''}`}>{chapter.title}</span>
        {!compact && chapter.summary ? (
          <span className="block text-sm text-ink-soft mt-0.5 leading-snug">
            {chapter.summary}
          </span>
        ) : null}
      </span>
    </Link>
  );
}
