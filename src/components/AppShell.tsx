'use client';

import { useSession } from './Providers';
import Landing from './Landing';
import Dashboard from './Dashboard';

export default function AppShell({ demo }: { demo: boolean }) {
  const { user, loading } = useSession();
  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="w-5 h-5 rounded-full border-2 border-[color:var(--hairline)] border-t-[#1d1d1f] animate-spin" />
      </div>
    );
  }
  return user ? <Dashboard /> : demo ? <Dashboard demo /> : <Landing />;
}
