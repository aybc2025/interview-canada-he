import ChapterRow from './ChapterRow';

export default function PartSection({ part, chapters, currentId, compact }) {
  if (!chapters.length) return null;

  return (
    <section className="mb-6">
      <h2 className="flex items-baseline gap-2 mb-2">
        <span className="font-util text-[11px] font-bold tracking-widest text-tie">
          חלק {part.letter}
        </span>
        <span className="font-display font-bold text-lg">{part.title}</span>
        {!compact && (
          <span className="text-sm text-ink-soft">— {part.blurb}</span>
        )}
      </h2>
      <div className="bg-white border border-line rounded-xl px-3">
        {chapters.map((c) => (
          <ChapterRow
            key={c.id}
            chapter={c}
            current={c.id === currentId}
            compact={compact}
          />
        ))}
      </div>
    </section>
  );
}
