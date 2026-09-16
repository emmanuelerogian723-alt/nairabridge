'use client';

import { usePollar } from '@pollar/react';

export default function CashOutBolivia() {
  const { openRampModal, wallet } = usePollar();

  return (
    <div className="glass p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-[15px] flex items-center gap-2">
          <span className="text-lg">🇧🇴</span> Cash Out in Bolivia
        </h3>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-amber-400/30 bg-amber-400/10 text-amber-300">
          USDC → BOB
        </span>
      </div>

      <p className="text-[13px] text-[color:var(--muted)] leading-relaxed">
        Live corridor via Stereum: sell USDC on Stellar and receive bolivianos by bank QR or
        straight to a Bolivian bank account — same day.
      </p>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-white/8 bg-black/25 p-3">
          <div className="text-[11px] text-[color:var(--muted)]">Bank QR</div>
          <div className="text-[13px] font-medium mt-0.5">Buy in Bolivia</div>
        </div>
        <div className="rounded-xl border border-white/8 bg-black/25 p-3">
          <div className="text-[11px] text-[color:var(--muted)]">ACH transfer</div>
          <div className="text-[13px] font-medium mt-0.5">Sell to bank</div>
        </div>
      </div>

      <button
        onClick={openRampModal}
        disabled={!wallet?.address}
        className="btn-primary w-full py-3.5 text-[15px]"
      >
        Deposit / Withdraw · BOB ⇄ USDC
      </button>
    </div>
  );
}
