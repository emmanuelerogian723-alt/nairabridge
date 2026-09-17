'use client';

import { usePollar } from '@pollar/react';
import Landing from './Landing';
import Dashboard from './Dashboard';

export default function AppShell({ demo }: { demo: boolean }) {
  const { isAuthenticated } = usePollar();
  return isAuthenticated ? <Dashboard /> : demo ? <Dashboard demo /> : <Landing />;
}
