import { Link } from 'react-router-dom';
import { excerpt, highlight } from '../../hooks/useSearch';
import Bidi from '../../lib/Bidi';
export default function SearchResult({ record, query }) {
  const where =
    record.p === 'appendix'
      ? `נספח א · ${record.ct}`
      : `פרק ${record.n} · ${record.ct}`;

  const text = excerpt(record.t, query);
  const parts = highlight(text, query);
  const to = record.hid
    ? `/chapter/${record.slug}#${record.hid}`
    : `/chapter/${record.slug}`;

  return (
    <li>
      <Link
        to={to}
        className="block bg-white border border-line rounded-xl px-4 py-3 hover:border-petrol-mid transition-colors"
      >
        <p className="font-util text-[11px] tracking-wide text-petrol-mid mb-1">
          {where}
          {record.h ? ` › ${record.h}` : ''}
        </p>
        <p className="text-sm leading-relaxed text-ink-soft">
          {parts.map((p, i) =>
            p.hit ? (
              <mark key={i} className="bg-[#FDE9B8] text-ink rounded-sm px-0.5">
                <Bidi text={p.s} />
              </mark>
            ) : (
              <Bidi key={i} text={p.s} />
            )
          )}
        </p>
      </Link>
    </li>
  );
}
