import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ChapterPage from './pages/ChapterPage';
import SearchPage from './pages/SearchPage';
import AboutPage from './pages/AboutPage';
import TabBar from './components/shared/TabBar';

export default function App() {
  return (
    <div className="min-h-screen pb-16">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:top-2 focus:start-2 focus:bg-white focus:text-petrol focus:px-4 focus:py-2 focus:rounded-lg"
      >
        דילוג לתוכן
      </a>

      <div id="main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/chapter/:slug" element={<ChapterPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      <TabBar />
    </div>
  );
}
