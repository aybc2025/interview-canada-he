import { Spans } from '../../../lib/Bidi';

/*
  Variants never rely on colour alone – each carries a text label as well, so
  the distinction survives greyscale printing and colour-blind readers.
*/
const VARIANTS = {
  note: {
    box: 'bg-petrol-tint border-petrol-mid',
    label: 'שימו לב',
    labelClass: 'text-petrol-mid',
  },
  key: {
    box: 'bg-tie-tint border-tie',
    label: 'כלל מרכזי',
    labelClass: 'text-tie',
  },
  example: {
    box: 'bg-sand border-[#B99F6B]',
    label: 'דוגמה',
    labelClass: 'text-[#6B5730]',
  },
  checklist: {
    box: 'bg-white border-petrol-mid',
    label: 'רשימת בדיקה',
    labelClass: 'text-petrol-mid',
  },
};

export default function CalloutBox({ block }) {
  const v = VARIANTS[block.variant] || VARIANTS.note;
  const isChecklist = block.variant === 'checklist';

  return (
    <aside
      className={`max-w-prose mb-6 border-s-4 rounded-e-xl px-4 py-3 ${v.box}`}
    >
      <p
        className={`font-util text-[11px] uppercase tracking-widest font-bold mb-1.5 ${v.labelClass}`}
      >
        {v.label}
      </p>
      {block.paragraphs.map((spans, i) =>
        isChecklist ? (
          <p key={i} className="flex gap-2 leading-relaxed py-1">
            <span
              className="mt-1 w-4 h-4 shrink-0 border-2 border-petrol-mid rounded"
              aria-hidden="true"
            />
            <span>
              <Spans spans={spans} />
            </span>
          </p>
        ) : (
          <p key={i} className="leading-relaxed mb-1.5 last:mb-0">
            <Spans spans={spans} />
          </p>
        )
      )}
    </aside>
  );
}
