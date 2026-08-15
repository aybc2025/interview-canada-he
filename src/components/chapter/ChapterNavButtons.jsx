import { Link } from 'react-router-dom';

function label(ch) {
  return ch.part === 'appendix' ? 'נספח א' : `פרק ${ch.number}`;
}

export default function ChapterNavButtons({ prev, next }) {
  return (
    <nav
      className="no-print mt-12 pt-6 border-t border-line flex gap-3"
      aria-label="ניווט בין פרקים"
    >
      {prev ? (
        <Link
          to={`/chapter/${prev.slug}`}
          className="flex-1 border-2 border-petrol text-petrol rounded-xl px-4 py-3 min-h-[44px] hover:bg-petrol-tint transition-colors"
        >
          <span className="block font-util text-[11px] text-ink-soft mb-0.5">
            הקודם
          </span>
          <span className="block font-bold text-sm">
            {label(prev)} · {prev.title}
          </span>
        </Link>
      ) : (
        <span className="flex-1" />
      )}

      {next ? (
        <Link
          to={`/chapter/${next.slug}`}
          className="flex-1 bg-petrol text-white rounded-xl px-4 py-3 min-h-[44px] hover:bg-petrol-mid transition-colors"
        >
          <span className="block font-util text-[11px] text-[#8FBFC4] mb-0.5">
            הבא
          </span>
          <span className="block font-bold text-sm">
            {label(next)} · {next.title}
          </span>
        </Link>
      ) : (
        <span className="flex-1" />
      )}
    </nav>
  );
}
