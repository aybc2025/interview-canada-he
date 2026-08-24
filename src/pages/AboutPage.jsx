import AppBar from '../components/shared/AppBar';
import { DOWNLOADS } from '../config/constants';

const SOURCES = [
  {
    t: 'חומרי לימוד על ראיונות עבודה בקנדה',
    d: 'חומרי הכנה מתוכנית להשתלבות בשוק העבודה הקנדי: מה מראיינים מצפים לראות, מתן תשובות טובות, תקשורת ברורה, שיטת STAR ודוגמאות לתשובות, שאלות קשות, שאלות אסורות, שאלות למראיין, טעויות נפוצות, וסיום הראיון. בנוסף חומרים על שלבי הראיון, סוגי השאלות ומטרתן, חיזוי שאלות, יצירת רושם ראשוני, ושיווק עצמי.',
  },
  {
    t: 'תיעוד של ראיונות עבודה אמיתיים',
    d: 'השאלות שנשאלו בפועל בראיונות שהמחבר עבר, כולל הניסוח המקורי שלהן ומבנה הראיון.',
  },
  {
    t: 'משוב ישיר ממראיינת',
    d: 'תחקיר שנערך עם חברת פאנל אחרי ראיון אמיתי – מה עבד, מה לא, ואיך הפאנל מדרג בפועל. פרק 13 מבוסס עליו.',
  },
  {
    t: 'שיטת ההכנה של המחבר',
    d: 'מערכת ההכנה שהמחבר בנה ועבד לפיה בפועל – בנק סיפורים, טבלת התאמה מול דרישות המשרה, בנקי שאלות, יומני תרגול ותיעוד לאחר הראיון. הנספח מתאר אותה.',
  },
];

export default function AboutPage() {
  return (
    <>
      <AppBar title="אודות" />
      <main className="max-w-3xl mx-auto px-4 py-6">
        <section className="max-w-prose mb-8">
          <h2 className="font-display text-2xl font-bold text-petrol-mid mb-3">
            מי כתב את המדריך
          </h2>
          <p className="leading-relaxed mb-4">
            המדריך והאתר נכתבו על ידי מודל בינה מלאכותית (Claude מבית Anthropic),
            בעבודה משותפת עם המחבר. הניסוח, המבנה, וקוד האתר נוצרו על ידי המודל.
          </p>
          <p className="leading-relaxed">
            זה נאמר כאן במפורש מפני שכדאי לדעת מה מקורו של חומר שקוראים –
            במיוחד כשמדובר בחומר שאמור לשמש בהחלטות אמיתיות.
          </p>
        </section>

        <section className="max-w-prose mb-8">
          <h2 className="font-display text-2xl font-bold text-petrol-mid mb-3">
            על מה המדריך מבוסס
          </h2>
          <p className="leading-relaxed mb-4">
            אלה החומרים שעמדו בפני המודל בזמן כתיבת המדריך והאתר:
          </p>
          <ul className="space-y-4">
            {SOURCES.map((s) => (
              <li
                key={s.t}
                className="bg-white border border-line rounded-xl px-4 py-3"
              >
                <p className="font-bold mb-1">{s.t}</p>
                <p className="text-sm text-ink-soft leading-relaxed">{s.d}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="max-w-prose mb-8">
          <aside className="bg-tie-tint border-s-4 border-tie rounded-e-xl px-4 py-3">
            <p className="font-util text-[11px] uppercase tracking-widest font-bold text-tie mb-1.5">
              בקרת תוכן
            </p>
            <p className="leading-relaxed">
              כל התוכן במדריך ובאתר עבר בקרה ועריכה שלי (המחבר). קראתי כל פרק, תיקנתי,
              הוספתי וחידדתי – ומה שמופיע כאן הוא מה שאישרתי.
            </p>
          </aside>
        </section>

        <section className="max-w-prose mb-8">
          <h2 className="font-display text-2xl font-bold text-petrol-mid mb-3">
            הורדת המדריך
          </h2>
          <p className="leading-relaxed mb-4 text-ink-soft">
            המדריך המלא זמין להורדה, כולל הנספח.
          </p>
          <ul className="space-y-3">
            {DOWNLOADS.map((d) => (
              <li key={d.file}>
                <a
                  href={`${import.meta.env.BASE_URL}downloads/${d.file}`}
                  download
                  className="flex items-center justify-between gap-3 bg-white border border-line rounded-xl px-4 py-3 min-h-[44px] hover:border-petrol-mid transition-colors"
                >
                  <span>
                    <span className="block font-bold">{d.label}</span>
                    <span className="block text-sm text-ink-soft">{d.note}</span>
                  </span>
                  <span className="font-util text-sm text-petrol shrink-0">
                    הורדה
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section className="max-w-prose">
          <h2 className="font-display text-2xl font-bold text-petrol-mid mb-3">
            הבהרה
          </h2>
          <p className="leading-relaxed text-ink-soft">
            המדריך מתאר נהוג ומקובל בראיונות עבודה בקנדה, ואינו מהווה ייעוץ
            משפטי או ייעוץ תעסוקתי. בנוגע לזכויות בעבודה, לשאלות אסורות או
            למקרה אישי – כדאי לפנות לגורם מוסמך.
          </p>
        </section>
      </main>
    </>
  );
}
