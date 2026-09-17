'use client';

import { useState } from 'react';
import { usePollar } from '@pollar/react';
import { useSession } from './Providers';

export default function Landing() {
  const { login } = usePollar();
  const { signup, login: emailLogin, loading } = useSession();
  const [mode, setMode] = useState<'create' | 'signin'>('create');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit() {
    setBusy(true);
    setError('');
    try {
      if (mode === 'create') await signup(email, password);
      else await emailLogin(email, password);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="flex-1 relative z-10 flex flex-col items-center px-4">
      <nav className="nav-blur fixed top-0 inset-x-0 z-20">
        <div className="max-w-5xl mx-auto px-5 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#1d1d1f] text-white text-[13px] flex items-center justify-center font-semibold">N</span>
            <span className="font-semibold tracking-tight">NairaBridge</span>
          </div>
          <span className="text-[11px] font-medium px-3 py-1 rounded-full border border-[color:var(--hairline)] bg-white flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[color:var(--emerald)]" />
            Stellar Testnet
          </span>
        </div>
      </nav>

      <div className="w-full max-w-2xl pt-24 pb-16 text-center space-y-8">
        <div className="space-y-5 fade-up">
          <h1 className="text-5xl sm:text-6xl font-bold tracking-[-0.03em] grad-text leading-[1.05]">
            Naira in.<br />Bolivianos out.
          </h1>
          <p className="text-[15px] sm:text-base text-[color:var(--ink-2)] leading-relaxed max-w-xl mx-auto">
            The African leg of the Pollar corridor. Fund with naira through local rails — bank
            transfer, mobile money, agents — and it lands in Bolivia on Pollar&apos;s live BOB ramp.
            Minutes, not days. No seed phrases.
          </p>
          <div className="flex items-center justify-center gap-2 text-[11px] text-[color:var(--ink-2)]">
            <span className="chip px-3 py-1">NGN</span>
            <span>→</span>
            <span className="chip px-3 py-1">USDC · Stellar</span>
            <span>→</span>
            <span className="chip px-3 py-1">BOB · Live ramp</span>
          </div>
        </div>

        <div className="glass p-4 fade-up fade-up-2 max-w-xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-[color:var(--ink-2)]">Lagos</span>
            <div className="flex-1 mx-4 relative flex items-center">
              <div className="w-full border-t border-dashed border-[color:var(--hairline)]" />
              <span className="absolute left-1/2 -translate-x-1/2 -top-2 text-[10px] px-2 bg-white text-[color:var(--ink-2)]">seconds</span>
            </div>
            <span className="text-xs font-medium text-[color:var(--ink-2)]">La Paz</span>
          </div>
        </div>

        <div className="glass p-6 space-y-5 fade-up fade-up-3 max-w-xl mx-auto text-left">
          <div className="space-y-1.5">
            <h3 className="text-xl font-bold tracking-tight">
              {mode === 'create' ? 'Create your wallet' : 'Welcome back'}
            </h3>
            <p className="text-[13px] text-[color:var(--ink-2)] leading-relaxed">
              {mode === 'create'
                ? 'One email and password creates a real Stellar wallet — secured by AWS KMS or derived keys. No seed phrase to write down or lose.'
                : 'Sign in with your email and password, or continue with Google.'}
            </p>
          </div>

          {/* Google */}
          <button
            onClick={() => login({ provider: 'google' })}
            className="btn-primary w-full py-3.5 text-[15px] flex items-center justify-center gap-2.5"
          >
            <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C6.67 13.72 14.74 9.5 24 9.5z" />
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-9.26 0-17.33-5.79-20.46-14.05l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
            </svg>
            Continue with Google
          </button>

          <div className="flex items-center gap-3">
            <div className="flex-1 border-t border-[color:var(--hairline)]" />
            <span className="text-[11px] text-[color:var(--ink-2)]">or with email</span>
            <div className="flex-1 border-t border-[color:var(--hairline)]" />
          </div>

          {/* email + password */}
          <div className="space-y-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              className="w-full rounded-xl bg-white border border-[color:var(--hairline)] px-4 py-3 text-sm focus:border-emerald-400/60 outline-none transition-colors"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder="Password (min 8 characters)"
              autoComplete={mode === 'create' ? 'new-password' : 'current-password'}
              className="w-full rounded-xl bg-white border border-[color:var(--hairline)] px-4 py-3 text-sm focus:border-emerald-400/60 outline-none transition-colors"
            />
            {error && (
              <p className="text-[12px] text-red-600 bg-red-50 border border-red-500/20 rounded-xl px-3.5 py-2.5">{error}</p>
            )}
            <button
              onClick={handleSubmit}
              disabled={busy || loading || !email || !password}
              className="btn-primary w-full py-3.5 text-[15px]"
            >
              {busy ? (mode === 'create' ? 'Creating wallet…' : 'Signing in…') : mode === 'create' ? 'Create my wallet' : 'Sign in'}
            </button>
            {busy && mode === 'create' && (
              <p className="text-[11.5px] text-[color:var(--ink-2)] text-center leading-relaxed">
                Creating a real Stellar account, USDC trustline and welcome bonus —
                this can take up to ~30 seconds. Please keep this tab open.
              </p>
            )}
          </div>

          <p className="text-[12px] text-[color:var(--ink-2)] text-center">
            {mode === 'create' ? (
              <>Already have a wallet?{' '}
                <button onClick={() => { setMode('signin'); setError(''); }} className="font-semibold underline underline-offset-2">
                  Sign in
                </button>
              </>
            ) : (
              <>New here?{' '}
                <button onClick={() => { setMode('create'); setError(''); }} className="font-semibold underline underline-offset-2">
                  Create a wallet
                </button>
              </>
            )}
            {' · '}
            <a href="/demo" className="font-semibold underline underline-offset-2">Take a look inside →</a>
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-3 fade-up fade-up-4 max-w-xl mx-auto text-left">
          {[
            ['🏦', 'Fund in Lagos', 'Bank transfer, mobile money or a local agent.'],
            ['⚡', 'Instant USDC rail', 'Spendable USDC lands in your wallet in seconds.'],
            ['🇧🇴', 'Cash out in La Paz', 'Pollar\u2019s live BOB ramp — any Bolivian bank.'],
          ].map(([icon, title, desc]) => (
            <div key={title} className="glass p-4">
              <div className="text-xl">{icon}</div>
              <div className="font-semibold text-[13px] mt-2">{title}</div>
              <div className="text-[11px] text-[color:var(--ink-2)] mt-1 leading-relaxed">{desc}</div>
            </div>
          ))}
        </div>

        <p className="text-[11px] text-[color:var(--ink-2)] fade-up fade-up-5">
          Built for the Boundless × Pollar Hackathon · Africa ↔ Latin America corridor
        </p>
      </div>
    </main>
  );
}
