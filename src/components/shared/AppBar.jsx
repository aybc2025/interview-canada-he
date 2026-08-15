import { Link } from 'react-router-dom';

export default function AppBar({ title, crumb, onOpenToc, showToc = false }) {
  return (
    <header className="no-print sticky top-0 z-20 bg-petrol text-white shadow-sm">
      <div className="max-w-3xl mx-auto px-4 pt-3 pb-3 flex items-start gap-3">
        <div className="flex-1 min-w-0">
          {crumb}
          <h1 className="font-display text-xl font-bold leading-tight truncate">
            {title}
          </h1>
        </div>

        {showToc ? (
          <button
            type="button"
            onClick={onOpenToc}
            className="shrink-0 font-util text-xs bg-white/10 hover:bg-white/20 rounded-lg px-3 min-h-[44px] min-w-[44px]"
            aria-label="פתיחת תוכן העניינים"
          >
            תוכן
          </button>
        ) : (
          <Link
            to="/"
            className="shrink-0 font-util text-xs bg-white/10 hover:bg-white/20 rounded-lg px-3 flex items-center min-h-[44px]"
          >
            לעמוד הראשי
          </Link>
        )}
      </div>
    </header>
  );
}
