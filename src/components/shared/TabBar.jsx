import { NavLink } from 'react-router-dom';

const TABS = [
  { to: '/', label: 'המדריך', end: true },
  { to: '/search', label: 'חיפוש' },
  { to: '/about', label: 'אודות' },
];

export default function TabBar() {
  return (
    <nav
      className="no-print fixed bottom-0 inset-x-0 z-30 bg-white border-t border-line"
      aria-label="ניווט ראשי"
    >
      <ul className="flex max-w-3xl mx-auto">
        {TABS.map((t) => (
          <li key={t.to} className="flex-1">
            <NavLink
              to={t.to}
              end={t.end}
              className={({ isActive }) =>
                [
                  'flex items-center justify-center h-16 font-util text-sm',
                  'min-h-[44px] transition-colors',
                  isActive ? 'text-petrol font-bold' : 'text-ink-soft',
                ].join(' ')
              }
            >
              {t.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
