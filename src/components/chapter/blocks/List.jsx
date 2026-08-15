import { Spans } from '../../../lib/Bidi';

export default function List({ block }) {
  return (
    <ul className="max-w-prose mb-5 space-y-2">
      {block.items.map((item, i) => (
        <li key={i} className="flex gap-2 leading-relaxed">
          <span className="text-petrol-mid font-bold shrink-0" aria-hidden="true">
            •
          </span>
          <span>
            <Spans spans={item} />
          </span>
        </li>
      ))}
    </ul>
  );
}
