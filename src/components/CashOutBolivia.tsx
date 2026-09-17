'use client';

import { useState } from 'react';
import { usePollar } from '@pollar/react';
import { useActiveWallet } from './useActiveWallet';

export default function CashOutBolivia({ demo = false }: { demo?: boolean }) {
  const { openRampModal } = usePollar();
  const { wallet } = useActiveWallet(demo);
  const [open, setOpen] = useState(false);

  const isPollar = wallet?.source === 'pollar';

  return (
    <div className="glass p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-[15px] flex items-center gap-2">
          <span className="text-lg">🇧🇴</span> Cash Out in Bolivia
        </h3>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border chip">USDC → BOB</span>
      </div>

      <p className="text-[13px] text-[color:var(--ink-2)] leading-relaxed">
        Live corridor via Stereum: sell USDC on Stellar and receive bolivianos by bank QR or
        straight to a Bolivian bank account — same day.
      </p>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-[color:var(--hairline)] bg-black/[0.02] p-3">
          <div className="text-[11px] text-[color:var(--ink-2)]">Bank QR</div>
          <div className="text-[13px] font-medium mt-0.5">Buy in Bolivia</div>
        </div>
        <div className="rounded-xl border border-[color:var(--hairline)] bg-black/[0.02] p-3">
          <div className="text-[11px] text-[color:var(--ink-2)]">ACH transfer</div>
          <div className="text-[13px] font-medium mt-0.5">Sell to bank</div>
        </div>
      </div>

      {isPollar ? (
        <button onClick={openRampModal} className="btn-primary w-full py-3.5 text-[15px]">
          Deposit / Withdraw · BOB ⇄ USDC
        </button>
      ) : open ? (
        <div className="rounded-xl border border-[color:var(--hairline)] bg-black/[0.02] p-3.5 space-y-2">
          <p className="text-[12.5px] leading-relaxed">
            The BOB ramp runs on Pollar&apos;s rails and works with Google (Pollar) wallets.{' '}
            {demo
              ? 'Create a wallet to try the full corridor.'
              : 'Sign in with Google to open the live BOB ramp, or keep your USDC in this wallet until you cash out.'}
          </p>
          <button onClick={() => setOpen(false)} className="text-[11.5px] text-[color:var(--ink-2)] hover:text-[color:var(--ink)] transition-colors">
            Close
          </button>
        </div>
      ) : (
        <button onClick={() => setOpen(true)} className="btn-primary w-full py-3.5 text-[15px]">
          How cash-out works
        </button>
      )}
    </div>
  );
}
