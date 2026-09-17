'use client';

import { usePollar } from '@pollar/react';

export default function Landing() {
  const { login, configStatus } = usePollar();

  return (
    <main className="flex-1 relative z-10 flex flex-col items-center px-4">
      {/* top nav */}
      <nav className="nav-blur fixed top-0 inset-x-0 z-20">
        <div className="max-w-5xl mx-auto px-5 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#1d1d1f] text-white text-[13px] flex items-center justify-center font-semibold">N</span>
            <span className="font-semibold tracking-tight">NairaBridge</span>
          </div>
          <span className="chip flex items-center gap-1.5">
            <span className="live-dot inline-block w-1.5 h-1.5 rounded-full bg-[color:var(--emerald)]" />
            Stellar Testnet
          </span>
        </div>
      </nav>

      <div className="w-full max-w-xl pt-28 pb-14 space-y-10">
        {/* hero */}
        <div className="text-center space-y-5 fade-up">
          <h1 className="text-[3.1rem] leading-[1.02] font-bold tracking-[-0.03em]">
            Naira in.
            <br />
            <span className="grad-text">Bolivianos out.</span>
          </h1>
          <p className="text-[color:var(--ink-2)] text-[16px] leading-relaxed max-w-md mx-auto">
            The African leg of the Pollar corridor. Fund with naira through local rails —
            bank transfer, mobile money, agents — and it lands in Bolivia on Pollar&apos;s
            live BOB ramp. Minutes, not days. No seed phrases.
          </p>
          <div className="flex items-center justify-center gap-2 text-[12px] text-[color:var(--ink-2)] fade-up fade-up-1">
            <span className="chip">NGN</span>
            <span>→</span>
            <span className="chip">USDC · Stellar</span>
            <span>→</span>
            <span className="chip">BOB · Live ramp</span>
          </div>
        </div>

        {/* corridor visual */}
        <div className="glass p-6 fade-up fade-up-2">
          <div className="flex items-center justify-between">
            <div className="text-center">
              <div className="text-[26px]">🇳🇬</div>
              <div className="text-[11px] text-[color:var(--ink-2)] mt-1 font-medium">Lagos</div>
              <div className="text-[10px] text-[color:var(--ink-2)]">Bank · MoMo · Agent</div>
            </div>
            <div className="flex-1 mx-4 relative">
              <svg viewBox="0 0 100 12" className="w-full h-3" preserveAspectRatio="none">
                <line x1="0" y1="6" x2="100" y2="6" stroke="rgba(0,0,0,0.08)" strokeWidth="1.5" />
                <line x1="0" y1="6" x2="100" y2="6" stroke="#1d1d1f" strokeWidth="1.5" className="flow-dash" />
              </svg>
              <div className="absolute -top-4 inset-x-0 text-center">
                <span className="chip">seconds</span>
              </div>
            </div>
            <div className="text-center">
              <div className="text-[26px]">🇧🇴</div>
              <div className="text-[11px] text-[color:var(--ink-2)] mt-1 font-medium">La Paz</div>
              <div className="text-[10px] text-[color:var(--ink-2)]">Any Bolivian bank</div>
            </div>
          </div>
        </div>

        {/* login card */}
        <div className="glass p-7 space-y-5 fade-up fade-up-3">
          <div className="space-y-1.5">
            <h2 className="font-semibold text-lg tracking-tight">Create your wallet</h2>
            <p className="text-sm text-[color:var(--ink-2)] leading-relaxed">
              One Google sign-in creates a real Stellar wallet on Pollar — secured by
              AWS&nbsp;KMS, fully non-custodial. No seed phrase to write down or lose.
            </p>
          </div>
          <button
            onClick={() => login({ provider: 'google' })}
            className="btn-primary w-full py-3.5 flex items-center justify-center gap-3 text-[15px]"
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47a5.57 5.57 0 0 1-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"/>
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.27 21.3 7.31 24 12 24z"/>
              <path fill="#FBBC05" d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z"/>
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.27 2.7 1.29 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"/>
            </svg>
            Continue with Google
          </button>
          <div className="flex items-center justify-center">
            <a href="/demo" className="text-[12px] text-[color:var(--ink-2)] hover:text-[color:var(--ink)] transition-colors">
              Take a look inside →
            </a>
          </div>
          <p className="text-center text-[11px] text-[color:var(--ink-2)]">
            Free testnet demo · keys stay encrypted · powered by Pollar
            {configStatus === 'error' && ' · retrying config…'}
          </p>
        </div>

        {/* how the corridor works */}
        <div className="space-y-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[color:var(--ink-2)] fade-up fade-up-3">
            The corridor
          </p>
          <div className="space-y-3">
            {[
              { icon: '🏦', title: 'Fund in Lagos', text: 'Pay naira by bank transfer, mobile money or a local agent to your bridge account.' },
              { icon: '⚡', title: 'Instant USDC rail', text: 'Pollar credits spendable USDC to your Stellar wallet in seconds.' },
              { icon: '🇧🇴', title: 'Cash out in La Paz', text: "Pollar's live BOB ramp lands bolivianos in any Bolivian bank — same day." },
            ].map((step, i) => (
              <div key={step.title} className={`glass p-4 flex items-start gap-4 fade-up fade-up-${i + 4}`}>
                <span className="text-xl">{step.icon}</span>
                <div>
                  <div className="font-semibold text-[14px]">{step.title}</div>
                  <div className="text-[12px] text-[color:var(--ink-2)] leading-relaxed">{step.text}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-center text-[11px] text-[color:var(--ink-2)] fade-up fade-up-5">
          Built for the Boundless × Pollar Hackathon · Africa ↔ Latin America corridor
        </p>
      </div>
    </main>
  );
}
