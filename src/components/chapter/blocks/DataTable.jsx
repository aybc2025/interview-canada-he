import { Spans } from '../../../lib/Bidi';

/**
 * Tables are the densest thing in the guide and the hardest to fit on a phone.
 * Below the `sm` breakpoint each row becomes a stacked card with the column
 * name as a label – a horizontally scrolling table is technically intact but
 * practically unreadable one-handed.
 */
export default function DataTable({ block }) {
  const { header, rows } = block;

  return (
    <div className="mb-6">
      {/* phone: stacked cards */}
      <div className="sm:hidden space-y-3">
        {rows.map((row, ri) => (
          <div key={ri} className="border border-line rounded-xl bg-white overflow-hidden">
            <div className="bg-petrol text-white px-3 py-2 font-util text-sm font-bold">
              <Spans spans={row[0]} />
            </div>
            <dl className="px-3 py-2">
              {row.slice(1).map((cell, ci) => (
                <div key={ci} className="py-1.5 border-b border-line last:border-0">
                  <dt className="font-util text-[11px] uppercase tracking-wide text-petrol-mid mb-0.5">
                    <Spans spans={header[ci + 1]} />
                  </dt>
                  <dd className="text-sm leading-relaxed">
                    <Spans spans={cell} />
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>

      {/* tablet and up: real table */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              {header.map((h, i) => (
                <th
                  key={i}
                  scope="col"
                  className="bg-petrol text-white text-start px-3 py-2 font-util text-xs font-bold border border-line"
                >
                  <Spans spans={h} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr key={ri} className={ri % 2 ? 'bg-[#F7FAFA]' : 'bg-white'}>
                {row.map((cell, ci) => (
                  <td
                    key={ci}
                    className="px-3 py-2 align-top border border-line leading-relaxed"
                  >
                    <Spans spans={cell} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
