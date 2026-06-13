import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { BuilderPage } from '@/pages/BuilderPage';
import { HomePage } from '@/pages/HomePage';

type TransitionPhase = 'idle' | 'exiting' | 'entering';

const HOME_EXIT_MS = 220;
const DEFAULT_EXIT_MS = 180;

export function PageTransition() {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [phase, setPhase] = useState<TransitionPhase>('idle');

  const isHomeToBuilder =
    displayLocation.pathname === '/' && location.pathname === '/builder';
  const isBuilderToHome =
    displayLocation.pathname === '/builder' && location.pathname === '/';
  const isBuilder = displayLocation.pathname === '/builder';

  useEffect(() => {
    if (location.pathname === displayLocation.pathname) return;

    setPhase('exiting');
    const duration = isHomeToBuilder ? HOME_EXIT_MS : DEFAULT_EXIT_MS;
    const timer = window.setTimeout(() => {
      setDisplayLocation(location);
      setPhase('entering');
    }, duration);

    return () => window.clearTimeout(timer);
  }, [location.pathname, displayLocation.pathname, isHomeToBuilder, location]);

  useEffect(() => {
    if (phase !== 'entering') return;

    const frame = requestAnimationFrame(() => {
      requestAnimationFrame(() => setPhase('idle'));
    });

    return () => cancelAnimationFrame(frame);
  }, [phase, displayLocation.pathname]);

  return (
    <div
      className={[
        'page-transition',
        phase === 'idle' && 'page-transition-visible',
        phase === 'exiting' &&
          isHomeToBuilder &&
          'page-transition-home-exit',
        phase === 'exiting' &&
          isBuilderToHome &&
          'page-transition-builder-exit',
        phase === 'exiting' &&
          !isHomeToBuilder &&
          !isBuilderToHome &&
          'page-transition-exit',
        phase === 'entering' &&
          isBuilder &&
          'page-transition-builder-enter',
        phase === 'entering' &&
          !isBuilder &&
          'page-transition-home-enter',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <Routes location={displayLocation} key={displayLocation.pathname}>
        <Route path="/" element={<HomePage />} />
        <Route path="/builder" element={<BuilderPage />} />
      </Routes>
    </div>
  );
}
