'use client';

import { usePollar } from '@pollar/react';

export default function CashOutBolivia() {
  const { openRampModal, wallet } = usePollar();

  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-5 space-y-3">
      <h3 className="font-semibold text-lg">🇧🇴 Cash Out in Bolivia</h3>
      <p className="text-sm text-neutral-400">
        Live corridor via Pollar&apos;s Stereum off-ramp: sell USDC on Stellar, receive BOB by bank
        QR or ACH. This calls Pollar&apos;s real ramp modal — no simulation on this side.
      </p>
      <button
        onClick={openRampModal}
        disabled={!wallet?.address}
        className="w-full rounded-md bg-blue-500 disabled:bg-neutral-700 disabled:text-neutral-500 py-2 font-medium text-white"
      >
        Deposit / Withdraw (BOB ⇄ USDC)
      </button>
    </div>
  );
}
