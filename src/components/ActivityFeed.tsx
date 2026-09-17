'use client';

import { useCallback, useEffect, useState } from 'react';
import { useActiveWallet } from './useActiveWallet';

type Tx = {
  id: string;
  asset: string;
  amount: string;
  from: string;
  to: string;
  incoming: boolean;
  date: string;
};

export default function ActivityFeed({ demo = false }: { demo?: boolean }) {
  const { wallet } = useActiveWallet(demo);
  const [txs, setTxs] = useState<Tx[] | null>(null);

  const load = useCallback(() => {
    if (!wallet?.address) return;
    fetch(`/api/wallet/state?address=${wallet.address}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => d && setTxs(d.history ?? []))
      .catch(() => {});
  }, [wallet?.address]);

  useEffect(() => {
    load();
    const h = () => load();
    window.addEventListener('nb:refresh', h);
    return () => window.removeEventListener('nb:refresh', h);
  }, [load]);

  return (
    <div className="glass p-5 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-[15px]">Activity</h3>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border chip">on-chain</span>
      </div>
      {txs === null && <div className="text-[12px] text-[color:var(--ink-2)]">loading…</div>}
      {txs?.length === 0 && <div className="text-[12px] text-[color:var(--ink-2)]">No transfers yet — fund your wallet to get started.</div>}
      {txs?.map((t) => (
        <div key={t.id} className="flex items-center justify-between border-b border-[color:var(--hairline)] last:border-0 pb-2.5 last:pb-0">
          <div className="flex items-center gap-2.5">
            <span className={`w-7 h-7 rounded-full flex items-center justify-center text-[13px] ${t.incoming ? 'bg-emerald-50 text-[color:var(--emerald)]' : 'bg-black/[0.04] text-[color:var(--ink-2)]'}`}>
              {t.incoming ? '↓' : '↑'}
            </span>
            <div>
              <div className="text-[13px] font-medium">{t.incoming ? 'Received' : 'Sent'} {t.asset}</div>
              <div className="text-[11px] text-[color:var(--ink-2)] font-mono">
                {t.incoming ? `from ${t.from.slice(0, 6)}…${t.from.slice(-4)}` : `to ${t.to.slice(0, 6)}…${t.to.slice(-4)}`}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className={`text-[13px] font-semibold tabular-nums ${t.incoming ? 'text-[color:var(--emerald)]' : ''}`}>
              {t.incoming ? '+' : '−'}{parseFloat(t.amount).toFixed(2)}
            </div>
            <div className="text-[10px] text-[color:var(--ink-2)]">
              {new Date(t.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
