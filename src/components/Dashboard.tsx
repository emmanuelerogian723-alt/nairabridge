'use client';

import { useEffect } from 'react';
import { usePollar } from '@pollar/react';
import WalletCard from './WalletCard';
import FundFromNigeria from './FundFromNigeria';
import CashOutBolivia from './CashOutBolivia';

export default function Dashboard({ demo = false }: { demo?: boolean }) {
  const { wallet, logout, login, refreshWalletBalance, openTxHistoryModal, verified } = usePollar();

  useEffect(() => {
    refreshWalletBalance().catch(() => {});
  }, [refreshWalletBalance, wallet?.address]);

  return (
    <main className="flex-1 relative z-10 flex flex-col items-center px-4">
      {/* top nav */}
      <nav className="nav-blur fixed top-0 inset-x-0 z-20">
        <div className="max-w-5xl mx-auto px-5 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#1d1d1f] text-white text-[13px] flex items-center justify-center font-semibold">N</span>
            <span className="font-semibold tracking-tight">NairaBridge</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={openTxHistoryModal} className="btn-ghost px-3.5 py-1.5 text-xs">
              History
            </button>
            {demo ? (
              <button onClick={() => login({ provider: 'google' })} className="btn-ghost px-3.5 py-1.5 text-xs">
                Sign in
              </button>
            ) : (
              <button onClick={logout} className="btn-ghost px-3.5 py-1.5 text-xs">
                Log out
              </button>
            )}
          </div>
        </div>
      </nav>

      <div className="w-full max-w-xl pt-24 pb-14 space-y-5">
        {demo && !wallet && (
          <div className="glass p-4 text-[13px] text-[color:var(--ink-2)] flex items-center justify-between gap-3 fade-up">
            <span>Preview mode — create a wallet to move real testnet money.</span>
            <button onClick={() => login({ provider: 'google' })} className="btn-ghost px-3 py-1.5 text-xs whitespace-nowrap">
              Create wallet
            </button>
          </div>
        )}

        {!verified && (
          <div className="glass p-4 text-[13px] text-[color:var(--ink-2)] flex items-center gap-3 fade-up">
            <span className="live-dot inline-block w-2 h-2 rounded-full bg-[color:var(--emerald)]" />
            Syncing your wallet…
          </div>
        )}

        <div className="fade-up fade-up-1">
          <WalletCard />
        </div>
        <div className="fade-up fade-up-2">
          <FundFromNigeria />
        </div>
        <div className="fade-up fade-up-3">
          <CashOutBolivia />
        </div>

        <p className="text-center text-[11px] text-[color:var(--ink-2)]">
          Testnet demo — real Stellar transactions, no real value.
        </p>
      </div>
    </main>
  );
}
