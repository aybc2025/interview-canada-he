import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, Navigate, useLocation } from 'react-router-dom';
import { bySlug } from '../lib/content';
import ChapterView from '../components/chapter/ChapterView';
import ChapterNavButtons from '../components/chapter/ChapterNavButtons';
import AppBar from '../components/shared/AppBar';
import ArcRail from '../components/shared/ArcRail';
import Breadcrumb from '../components/shared/Breadcrumb';
import ReadingProgress from '../components/shared/ReadingProgress';
import TocDrawer from '../components/toc/TocDrawer';
import useChapterNav from '../hooks/useChapterNav';
import useReadingProgress from '../hooks/useReadingProgress';
import useLastRead from '../hooks/useLastRead';

export default function ChapterPage() {
  const { slug } = useParams();
  const location = useLocation();
  const chapter = bySlug(slug);
  const { prev, next } = useChapterNav(slug);
  const [tocOpen, setTocOpen] = useState(false);
  const bodyRef = useRef(null);
  const pct = useReadingProgress(bodyRef);
  const { remember } = useLastRead();

  useEffect(() => {
    if (chapter) remember(chapter.id);
  }, [chapter?.id, remember]);

  // Scroll to top on chapter change, or to the anchor when one is present.
  useEffect(() => {
    if (location.hash) {
      const el = document.getElementById(location.hash.slice(1));
      if (el) {
        el.scrollIntoView({ block: 'start' });
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [slug, location.hash]);

  const title = useMemo(() => {
    if (!chapter) return '';
    return chapter.part === 'appendix'
      ? chapter.title
      : `${chapter.number}. ${chapter.title}`;
  }, [chapter]);

  useEffect(() => {
    if (chapter) document.title = `${chapter.title} · ראיון בקנדה`;
    return () => {
      document.title = 'ראיון בקנדה';
    };
  }, [chapter]);

  if (!chapter) return <Navigate to="/" replace />;

  return (
    <>
      <AppBar
        title={title}
        crumb={<Breadcrumb chapter={chapter} />}
        showToc
        onOpenToc={() => setTocOpen(true)}
      />
      <ArcRail activePart={chapter.part} />
      <ReadingProgress pct={pct} />

      <main ref={bodyRef} className="max-w-3xl mx-auto px-4 py-6">
        <ChapterView chapter={chapter} />
        <ChapterNavButtons prev={prev} next={next} />
      </main>

      <TocDrawer
        open={tocOpen}
        onClose={() => setTocOpen(false)}
        currentId={chapter.id}
      />
    </>
  );
}
