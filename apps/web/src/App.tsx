import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import './index.css';
import { HomePage } from './pages/HomePage';

export default function App() {
  return (
    <BrowserRouter>
      {/* No <Suspense> wrapper: translations are bundled, so useTranslation
          never suspends. The old `fallback={null}` was what rendered a blank
          page while the locale JSON was still in flight. */}
      <Routes>
          <Route path="/" element={<HomePage />} />
          {/* vercel.json rewrites every unknown path to index.html, so without
              this an unknown URL rendered a blank page. Note this does not fix
              the soft-404 for crawlers: the response is still 200: a real 404
              status is not reachable through an SPA catch-all rewrite. */}
          <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
