import { PART_BY_ID, APPENDIX_PART } from '../../config/parts';

export default function Breadcrumb({ chapter }) {
  if (!chapter) return null;
  const isAppendix = chapter.part === 'appendix';
  const part = isAppendix ? APPENDIX_PART : PART_BY_ID[chapter.part];
  if (!part) return null;

  const label = isAppendix
    ? 'נספח א'
    : `חלק ${part.letter} · ${part.title} · פרק ${chapter.number}`;

  return (
    <p className="font-util text-[11px] tracking-wide text-[#8FBFC4]">{label}</p>
  );
}
