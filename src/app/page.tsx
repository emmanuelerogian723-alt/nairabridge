'use client';

import { useEffect, useState } from 'react';
import { usePollar } from '@pollar/react';
import Landing from '@/components/Landing';
import Dashboard from '@/components/Dashboard';

export default function Home() {
  const { isAuthenticated } = usePollar();
  const [demo, setDemo] = useState(false);

  useEffect(() => {
    setDemo(new URLSearchParams(window.location.search).get('demo') === '1');
  }, []);

  return isAuthenticated ? <Dashboard /> : demo ? <Dashboard demo /> : <Landing />;
}
