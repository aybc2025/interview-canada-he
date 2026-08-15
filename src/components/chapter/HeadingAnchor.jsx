import { useState } from 'react';
import { Spans } from '../../lib/Bidi';

/**
 * Every sub-heading is linkable. This is what lets someone send a colleague a
 * link to "שאלות אסורות" rather than to the whole guide.
 */
export default function HeadingAnchor({ block }) {
  const [copied, setCopied] = useState(false);
  const Tag = block.level === 2 ? 'h2' : 'h3';

  const copy = async () => {
    const url = `${window.location.href.split('#').slice(0, 2).join('#')}#${block.id}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard blocked – the anchor still works as a normal link */
    }
  };

  return (
    <Tag
      id={block.id}
      className={
        block.level === 2
          ? 'group font-display font-bold text-2xl text-petrol-mid mt-10 mb-3 scroll-mt-24'
          : 'group font-display font-bold text-lg text-ink mt-7 mb-2 scroll-mt-24'
      }
    >
      <Spans spans={block.spans} />
      <button
        type="button"
        onClick={copy}
        className="no-print ms-2 align-middle font-util text-[11px] font-normal text-ink-soft opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
        aria-label={`העתקת קישור ל${block.plain}`}
      >
        {copied ? 'הקישור הועתק' : 'העתקת קישור'}
      </button>
    </Tag>
  );
}
