import { Link } from 'react-router-dom';
import { PARTS, APPENDIX_PART } from '../config/parts';
import { chaptersInPart, APPENDIX, byId, ORDER } from '../lib/content';
import PartSection from '../components/toc/PartSection';
import ChapterRow from '../components/toc/ChapterRow';
import useLastRead from '../hooks/useLastRead';
import { DOWNLOADS } from '../config/constants';

export default function HomePage() {
  const { lastRead } = useLastRead();
  const resume = lastRead ? byId(lastRead.chapterId) : null;
  const first = ORDER[0];

  return (
    <>
      <header className="bg-petrol text-white">
        <div className="max-w-3xl mx-auto px-4 pt-8 pb-7">
          <h1 className="font-display text-4xl font-bold mb-3">ראיון עבודה בקנדה</h1>

          <div className="flex flex-wrap gap-3">
            <Link
              to={`/chapter/${first.slug}`}
              className="bg-[#8FD3D8] text-[#0F2830] font-util font-bold rounded-xl px-5 py-3 min-h-[44px] flex items-center"
            >
              {first.title}
            </Link>
            {resume && resume.id !== first.id ? (
              <Link
                to={`/chapter/${resume.slug}`}
                className="border-2 border-[#8FD3D8] text-[#8FD3D8] font-util rounded-xl px-5 py-3 min-h-[44px] flex items-center"
              >
                חזרה ל{resume.part === 'appendix' ? 'נספח' : `פרק ${resume.number}`}
              </Link>
            ) : null}
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-7">
        {PARTS.map((part) => (
          <PartSection
            key={part.id}
            part={part}
            chapters={chaptersInPart(part.id)}
            currentId={null}
          />
        ))}

        {APPENDIX ? (
          <section className="mt-8 pt-6 border-t-2 border-dashed border-tie">
            <h2 className="flex items-baseline gap-2 mb-2">
              <span className="font-util text-[11px] font-bold tracking-widest text-tie">
                {APPENDIX_PART.letter}
              </span>
              <span className="font-display font-bold text-lg">
                {APPENDIX_PART.title}
              </span>
              <span className="text-sm text-ink-soft">
                – {APPENDIX_PART.blurb}
              </span>
            </h2>
            <div className="bg-tie-tint border border-tie rounded-xl px-3">
              <ChapterRow chapter={APPENDIX} />
            </div>
          </section>
        ) : null}

        <section className="mt-10 pt-6 border-t border-line">
          <h2 className="font-display font-bold text-lg mb-3">
            הורדת המדריך המלא
          </h2>
          <ul className="flex flex-wrap gap-3">
            {DOWNLOADS.map((d) => (
              <li key={d.file}>
                <a
                  href={`${import.meta.env.BASE_URL}downloads/${d.file}`}
                  download
                  className="inline-flex items-center bg-white border border-line rounded-xl px-4 py-3 min-h-[44px] hover:border-petrol-mid transition-colors font-util text-sm"
                >
                  {d.label}
                </a>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </>
  );
}
