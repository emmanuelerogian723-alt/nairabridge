'use client';

import { useEffect } from 'react';
import { usePollar } from '@pollar/react';
import WalletCard from './WalletCard';
import FundFromNigeria from './FundFromNigeria';
import CashOutBolivia from './CashOutBolivia';

export default function Dashboard() {
  const { wallet, logout, refreshWalletBalance, openTxHistoryModal, verified } = usePollar();

  useEffect(() => {
    refreshWalletBalance().catch(() => {});
  }, [refreshWalletBalance, wallet?.address]);

  return (
    <main className="flex-1 relative z-10 flex flex-col items-center px-4">
      {/* top nav */}
      <nav className="nav-blur fixed top-0 inset-x-0 z-20">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🌉</span>
            <span className="font-semibold tracking-tight">NairaBridge</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={openTxHistoryModal} className="btn-ghost px-3 py-1.5 text-xs">
              History
            </button>
            <button onClick={logout} className="btn-ghost px-3 py-1.5 text-xs">
              Log out
            </button>
          </div>
        </div>
      </nav>

      <div className="w-full max-w-lg pt-24 pb-12 space-y-5">
        {!verified && (
          <div className="glass p-4 text-sm text-[color:var(--muted)] flex items-center gap-3">
            <span className="live-dot inline-block w-2 h-2 rounded-full bg-gold" />
            Syncing your wallet…
          </div>
        )}

        <div className="fade-up">
          <WalletCard />
        </div>
        <div className="fade-up fade-up-1">
          <FundFromNigeria />
        </div>
        <div className="fade-up fade-up-2">
          <CashOutBolivia />
        </div>

        <p className="text-center text-[11px] text-[color:var(--muted)]">
          Testnet demo — real Stellar transactions, no real value.
        </p>
      </div>
    </main>
  );
}
