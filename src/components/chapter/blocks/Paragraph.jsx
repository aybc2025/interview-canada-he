import { Spans } from '../../../lib/Bidi';

export default function Paragraph({ block }) {
  return (
    <p className="max-w-prose leading-relaxed mb-4">
      <Spans spans={block.spans} />
    </p>
  );
}
