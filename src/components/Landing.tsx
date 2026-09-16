'use client';

import { usePollar } from '@pollar/react';

export default function Landing() {
  const { login } = usePollar();

  return (
    <main className="flex-1 relative z-10 flex flex-col items-center px-4">
      {/* top nav */}
      <nav className="nav-blur fixed top-0 inset-x-0 z-20">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🌉</span>
            <span className="font-semibold tracking-tight">NairaBridge</span>
          </div>
          <span className="text-[11px] text-[color:var(--muted)] flex items-center gap-1.5">
            <span className="live-dot inline-block w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Stellar Testnet
          </span>
        </div>
      </nav>

      <div className="w-full max-w-lg pt-28 pb-12 space-y-8">
        {/* hero */}
        <div className="text-center space-y-4 fade-up">
          <h1 className="text-[2.6rem] leading-[1.05] font-bold tracking-tight">
            Naira in.
            <br />
            <span className="grad-text">Bolivianos out.</span>
          </h1>
          <p className="text-[color:var(--muted)] text-[15px] leading-relaxed max-w-sm mx-auto">
            The first remittance bridge between Nigeria and Bolivia.
            Send money home across two continents in minutes —
            not days, and without seed phrases or crypto knowledge.
          </p>
        </div>

        {/* corridor preview */}
        <div className="glass p-4 fade-up fade-up-1">
          <div className="flex items-center justify-between px-1">
            <div className="text-center">
              <div className="text-2xl">🇳🇬</div>
              <div className="text-[11px] text-[color:var(--muted)] mt-0.5">NGN · Bank</div>
            </div>
            <div className="flex-1 mx-3 relative">
              <svg viewBox="0 0 100 12" className="w-full h-3" preserveAspectRatio="none">
                <line x1="0" y1="6" x2="100" y2="6" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
                <line x1="0" y1="6" x2="100" y2="6" stroke="#34d399" strokeWidth="1.5" className="flow-dash" />
              </svg>
              <div className="absolute -top-4 inset-x-0 text-center">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 text-emerald-300">
                  USDC · Stellar
                </span>
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl">🇧🇴</div>
              <div className="text-[11px] text-[color:var(--muted)] mt-0.5">BOB · Bank</div>
            </div>
          </div>
        </div>

        {/* login card */}
        <div className="glass p-6 space-y-5 fade-up fade-up-2">
          <div className="space-y-1">
            <h2 className="font-semibold text-lg">Create your wallet</h2>
            <p className="text-sm text-[color:var(--muted)]">
              One Google sign-in creates a real Stellar wallet — secured by AWS KMS,
              no seed phrase to write down or lose.
            </p>
          </div>
          <button
            onClick={() => login({ provider: 'google' })}
            className="btn-ghost w-full py-3.5 flex items-center justify-center gap-3 font-medium"
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47a5.57 5.57 0 0 1-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"/>
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.27 21.3 7.31 24 12 24z"/>
              <path fill="#FBBC05" d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z"/>
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.27 2.7 1.29 6.62l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75z"/>
            </svg>
            Continue with Google
          </button>
          <p className="text-[11px] text-[color:var(--muted)] text-center">
            Free testnet demo · your keys stay encrypted · powered by Pollar
          </p>
        </div>

        {/* how it works */}
        <div className="space-y-3 fade-up fade-up-3">
          <h3 className="text-sm font-medium text-[color:var(--muted)] uppercase tracking-wider text-center">
            How the bridge works
          </h3>
          <div className="grid gap-3">
            {[
              ['🏦', 'Fund in Lagos', 'Pay naira by bank transfer or mobile money to your bridge account.'],
              ['⚡', 'Instant USDC rail', 'NairaBridge credits spendable USDC to your Stellar wallet in seconds.'],
              ['🇧🇴', 'Cash out in La Paz', 'Your family withdraws bolivianos to any Bolivian bank — same day.'],
            ].map(([icon, title, desc]) => (
              <div key={title} className="glass p-4 flex items-start gap-4">
                <span className="text-2xl shrink-0">{icon}</span>
                <div>
                  <div className="font-medium text-sm">{title}</div>
                  <div className="text-[13px] text-[color:var(--muted)] mt-0.5 leading-relaxed">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <footer className="text-center text-[11px] text-[color:var(--muted)] fade-up fade-up-4 pt-2">
          Built for the Boundless Pollar Hackathon · Stellar · Southeast Blockchain &amp; Games Week
        </footer>
      </div>
    </main>
  );
}
