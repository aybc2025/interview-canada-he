import React from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';
import './styles/index.css';

/*
  HashRouter, not BrowserRouter: GitHub Pages serves static files only, so a
  deep link like /chapter/star-to-start would 404 on refresh without a router
  that keeps the path in the fragment. This keeps deep links shareable, which
  the guide depends on.
*/
createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
);
