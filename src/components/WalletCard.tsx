'use client';

import { usePollar } from '@pollar/react';

export default function WalletCard() {
  const { isAuthenticated, wallet, login, openTxHistoryModal } = usePollar();

  if (!isAuthenticated) {
    return (
      <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-6 text-center space-y-4">
        <p className="text-neutral-300">Sign in to create your Stellar wallet — no seed phrase, no crypto knowledge needed.</p>
        <button
          onClick={() => login({ provider: 'google' })}
          className="rounded-md bg-white text-black px-5 py-2 font-medium"
        >
          Continue with Google
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-emerald-800/50 bg-emerald-950/30 p-5 flex items-center justify-between">
      <div>
        <p className="text-sm text-neutral-400">Wallet ready</p>
        <p className="font-mono text-sm">{wallet?.address}</p>
      </div>
      <button onClick={openTxHistoryModal} className="text-sm text-emerald-400 underline">
        History
      </button>
    </div>
  );
}
