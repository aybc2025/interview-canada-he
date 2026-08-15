import { PARTS } from '../../config/parts';

/**
 * The interview arc – the site's signature element.
 *
 * It shows position within the *process* (understand → answer → the room →
 * after), not just chapter number. Deliberately not rendered on the appendix,
 * which sits outside the sequence.
 */
export default function ArcRail({ activePart }) {
  if (!activePart || activePart === 'appendix') return null;

  return (
    <div className="no-print bg-petrol/95 px-4 py-2" aria-hidden="true">
      <ol className="flex max-w-3xl mx-auto">
        {PARTS.map((p) => {
          const on = p.id === activePart;
          return (
            <li key={p.id} className="flex-1 text-center">
              <div className="relative h-3 flex items-start justify-center">
                <span className="absolute inset-x-0 top-1 h-px bg-petrol-mid" />
                <span
                  className={[
                    'relative w-2.5 h-2.5 rounded-full',
                    on ? 'bg-[#8FD3D8]' : 'bg-petrol-mid',
                  ].join(' ')}
                />
              </div>
              <span
                className={[
                  'block font-util text-[11px] mt-1',
                  on ? 'text-[#8FD3D8] font-bold' : 'text-[#7FA5AC]',
                ].join(' ')}
              >
                {p.title}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
