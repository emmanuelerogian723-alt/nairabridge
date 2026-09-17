'use client';

import { usePollar } from '@pollar/react';
import { useSession } from './Providers';
import WalletCard from './WalletCard';
import FundFromNigeria from './FundFromNigeria';
import CashOutBolivia from './CashOutBolivia';
import SendAgent from './SendAgent';
import ActivityFeed from './ActivityFeed';

export default function Dashboard({ demo = false }: { demo?: boolean }) {
  const { login } = usePollar();
  const { user, logout } = useSession();

  return (
    <main className="flex-1 relative z-10 flex flex-col items-center px-4">
      <nav className="nav-blur fixed top-0 inset-x-0 z-20">
        <div className="max-w-5xl mx-auto px-5 h-14 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#1d1d1f] text-white text-[13px] flex items-center justify-center font-semibold">N</span>
            <span className="font-semibold tracking-tight">NairaBridge</span>
          </a>
          <div className="flex items-center gap-2">
            {demo ? (
              <>
                <a href="/" className="btn-ghost px-3.5 py-1.5 text-xs">Create wallet</a>
                <button onClick={() => login({ provider: 'google' })} className="btn-ghost px-3.5 py-1.5 text-xs">
                  Sign in
                </button>
              </>
            ) : (
              <>
                {user?.email && (
                  <span className="text-[11px] text-[color:var(--ink-2)] max-w-[180px] truncate hidden sm:inline">{user.email}</span>
                )}
                <button onClick={logout} className="btn-ghost px-3.5 py-1.5 text-xs">Log out</button>
              </>
            )}
          </div>
        </div>
      </nav>

      <div className="w-full max-w-xl pt-24 pb-14 space-y-5">
        {demo && (
          <div className="glass p-4 text-[13px] text-[color:var(--ink-2)] flex items-center justify-between gap-3 fade-up">
            <span>Preview mode — create a wallet to move real testnet money.</span>
            <a href="/" className="btn-ghost px-3 py-1.5 text-xs whitespace-nowrap">Create wallet</a>
          </div>
        )}

        <div className="fade-up fade-up-1">
          <WalletCard demo={demo} />
        </div>
        <div className="fade-up fade-up-2">
          <FundFromNigeria demo={demo} />
        </div>
        <div className="fade-up fade-up-3">
          <SendAgent demo={demo} />
        </div>
        <div className="fade-up fade-up-4">
          <CashOutBolivia demo={demo} />
        </div>
        <div className="fade-up fade-up-5">
          <ActivityFeed demo={demo} />
        </div>

        <p className="text-center text-[11px] text-[color:var(--ink-2)]">
          Testnet demo — real Stellar transactions, no real value.
        </p>
      </div>
    </main>
  );
}
