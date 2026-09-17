'use client';

import { PollarProvider } from '@pollar/react';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';

type User = { email: string; publicKey: string } | null;

type SessionCtx = {
  user: User;
  loading: boolean;
  signup: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const Ctx = createContext<SessionCtx>({
  user: null,
  loading: true,
  signup: async () => {},
  login: async () => {},
  logout: async () => {},
});

async function post(url: string, body: any) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Something went wrong');
  return data;
}

function SessionProviderInner({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((d) => setUser(d.user || null))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const signup = useCallback(async (email: string, password: string) => {
    const d = await post('/api/auth/signup', { email, password });
    setUser({ email: d.email, publicKey: d.publicKey });
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const d = await post('/api/auth/login', { email, password });
    setUser({ email: d.email, publicKey: d.publicKey });
  }, []);

  const logout = useCallback(async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
  }, []);

  return <Ctx.Provider value={{ user, loading, signup, login, logout }}>{children}</Ctx.Provider>;
}

export function useSession() {
  return useContext(Ctx);
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PollarProvider
      client={{
        apiKey: process.env.NEXT_PUBLIC_POLLAR_PUBLISHABLE_KEY!,
        stellarNetwork: 'testnet',
      }}
    >
      <SessionProviderInner>{children}</SessionProviderInner>
    </PollarProvider>
  );
}
