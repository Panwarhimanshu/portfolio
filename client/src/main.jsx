import React, { Suspense, lazy } from 'react';
import { createRoot } from 'react-dom/client';



// The admin panel is loaded only on /admin, so visitors never download it.
const Admin = lazy(() => import('./admin/Admin.jsx'));
const Demos = lazy(() => import('./demos/Demos.jsx'));
const Site = lazy(() => import('./site/Site.jsx'));
const Glass = lazy(() => import('./glass/Glass.jsx'));
const App = lazy(() => import('./App.jsx'));
const Pro = lazy(() => import('./pro/Pro.jsx'));
const path = window.location.pathname.replace(/\/+$/, '');
const isAdmin = path === '/admin';
const isDemo = path === '/demo' || path.startsWith('/demo/');
const isClassic = path === '/classic';
const isStudio = path === '/studio';
const isGlass = path === '/glass';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {isAdmin ? (
      <Suspense fallback={null}><Admin /></Suspense>
    ) : isDemo ? (
      <Suspense fallback={null}><Demos /></Suspense>
    ) : isClassic ? (
      <Suspense fallback={null}><App /></Suspense>
    ) : isStudio ? (
      <Suspense fallback={<div style={{ minHeight: "100vh", background: "#0d0d0d" }} />}><Site /></Suspense>
    ) : isGlass ? (
      <Suspense fallback={<div style={{ minHeight: "100vh", background: "#07071a" }} />}><Glass /></Suspense>
    ) : (
      <Suspense fallback={null}><Pro /></Suspense>
    )}
  </React.StrictMode>
);
