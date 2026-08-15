import AppBar from '../components/shared/AppBar';
import SearchInput from '../components/search/SearchInput';
import SearchResult from '../components/search/SearchResult';
import useSearch from '../hooks/useSearch';
import { SEARCH_MIN_CHARS } from '../config/constants';

export default function SearchPage() {
  const { query, setQuery, results, loading } = useSearch();
  const short = query.trim().length < SEARCH_MIN_CHARS;

  const chapterCount = new Set(results.map((r) => r.c)).size;

  return (
    <>
      <AppBar title="חיפוש" />
      <main className="max-w-3xl mx-auto px-4 py-6">
        <SearchInput value={query} onChange={setQuery} />

        {short ? (
          <p className="text-ink-soft leading-relaxed max-w-prose">
            הקלידו מילה או שתיים כדי לחפש בכל המדריך — למשל <b>שכר</b>,{' '}
            <b>פנקס</b>, <b>שאלות אסורות</b> או <b>משוב</b>.
          </p>
        ) : loading ? (
          <p className="font-util text-sm text-ink-soft">טוען…</p>
        ) : results.length === 0 ? (
          <div className="max-w-prose">
            <p className="font-bold mb-2">אין תוצאות ל"{query}".</p>
            <p className="text-ink-soft leading-relaxed">
              נסו מילה אחת במקום צירוף, או מונח כללי יותר. החיפוש מתעלם מניקוד
              ומגרשיים, אך לא מזהה שורשים — "ראיון" ו"ראיונות" יחזירו תוצאות
              שונות.
            </p>
          </div>
        ) : (
          <>
            <p className="font-util text-xs text-ink-soft mb-3">
              {results.length} תוצאות ב-{chapterCount} פרקים
            </p>
            <ul className="space-y-2.5">
              {results.map((r) => (
                <SearchResult key={r.i} record={r} query={query} />
              ))}
            </ul>
          </>
        )}
      </main>
    </>
  );
}
