import { useEffect, useRef } from 'react';
import { PARTS, APPENDIX_PART } from '../../config/parts';
import { chaptersInPart, APPENDIX } from '../../lib/content';
import ChapterRow from './ChapterRow';

/** Opens from the start side (right in RTL). Closes on Escape or backdrop click. */
export default function TocDrawer({ open, onClose, currentId }) {
  const panelRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    panelRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="no-print fixed inset-0 z-40">
      <div
        className="absolute inset-0 bg-ink/45"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label="תוכן העניינים"
        className="absolute inset-y-0 start-0 w-[86%] max-w-sm bg-paper shadow-2xl overflow-y-auto"
      >
        <div className="sticky top-0 bg-paper px-4 py-3 border-b border-line flex items-center justify-between">
          <h2 className="font-display text-xl font-bold">תוכן העניינים</h2>
          <button
            type="button"
            onClick={onClose}
            className="font-util text-sm text-ink-soft min-h-[44px] min-w-[44px]"
            aria-label="סגירה"
          >
            סגירה
          </button>
        </div>

        <div className="px-4 py-4" onClick={onClose}>
          {PARTS.map((part) => {
            const chapters = chaptersInPart(part.id);
            if (!chapters.length) return null;
            return (
              <section key={part.id} className="mb-5">
                <h3 className="flex items-baseline gap-2 mb-1">
                  <span className="font-util text-[11px] font-bold text-tie">
                    {part.letter}
                  </span>
                  <span className="font-display font-bold">{part.title}</span>
                </h3>
                <div className="bg-white border border-line rounded-lg px-3">
                  {chapters.map((c) => (
                    <ChapterRow
                      key={c.id}
                      chapter={c}
                      current={c.id === currentId}
                      compact
                    />
                  ))}
                </div>
              </section>
            );
          })}

          {APPENDIX ? (
            <section className="mt-6 pt-4 border-t-2 border-dashed border-tie">
              <h3 className="flex items-baseline gap-2 mb-1">
                <span className="font-util text-[11px] font-bold text-tie">
                  {APPENDIX_PART.letter}
                </span>
                <span className="font-display font-bold">
                  {APPENDIX_PART.title}
                </span>
              </h3>
              <div className="bg-white border border-line rounded-lg px-3">
                <ChapterRow
                  chapter={APPENDIX}
                  current={APPENDIX.id === currentId}
                  compact
                />
              </div>
            </section>
          ) : null}
        </div>
      </div>
    </div>
  );
}
