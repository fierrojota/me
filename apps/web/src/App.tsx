import { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import { HomePage } from './pages/HomePage';

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          {/* vercel.json rewrites every unknown path to index.html, so without
              this an unknown URL rendered a blank page. Note this does not fix
              the soft-404 for crawlers: the response is still 200: a real 404
              status is not reachable through an SPA catch-all rewrite. */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
