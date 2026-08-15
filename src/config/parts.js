// The four parts follow the chronology of the process, which is why the
// numbering carries information rather than decorating it.
export const PARTS = [
  { id: 'a', letter: 'א', title: 'המגרש', blurb: 'להבין למה קנדה שונה' },
  { id: 'b', letter: 'ב', title: 'התשובות', blurb: 'איך בונים תשובה שנספרת' },
  { id: 'c', letter: 'ג', title: 'בחדר', blurb: 'התנהלות בזמן אמת' },
  { id: 'd', letter: 'ד', title: 'אחרי', blurb: 'סגירה, לקחים והכנה אחרונה' },
];

export const PART_BY_ID = Object.fromEntries(PARTS.map((p) => [p.id, p]));

export const APPENDIX_PART = {
  id: 'appendix',
  letter: 'נספח',
  title: 'שיטת הכנה',
  blurb: 'העבודה שלפני הראיון',
};
