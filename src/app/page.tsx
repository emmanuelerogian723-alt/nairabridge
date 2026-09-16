'use client';

import { usePollar } from '@pollar/react';
import Landing from '@/components/Landing';
import Dashboard from '@/components/Dashboard';

export default function Home() {
  const { isAuthenticated, verified } = usePollar();

  return isAuthenticated ? <Dashboard /> : <Landing />;
}
