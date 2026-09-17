'use client';

import { useState } from 'react';
import { usePollar } from '@pollar/react';

function short(addr?: string) {
  if (!addr) return '';
  return `${addr.slice(0, 8)}…${addr.slice(-6)}`;
}

export default function WalletCard() {
  const { wallet, walletBalance, refreshWalletBalance, openWalletBalanceModal } = usePollar();
  const [copied, setCopied] = useState(false);

  const balances =
    walletBalance && walletBalance.step === 'loaded' ? walletBalance.data?.balances ?? [] : [];
  const usdc = balances.find((b: any) => b.asset_code === 'USDC');
  const xlm = balances.find((b: any) => b.asset_type === 'native');

  async function copyAddress() {
    if (!wallet?.address) return;
    try {
      await navigator.clipboard.writeText(wallet.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {}
  }

  return (
    <div className="card-inverse p-5 space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs text-white/50 uppercase tracking-wider">
          Your wallet
        </span>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-white/15 bg-white/10 text-white/80">
          Stellar
        </span>
      </div>

      <button onClick={openWalletBalanceModal} className="w-full text-left space-y-1 group">
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold tracking-tight tabular-nums group-hover:opacity-80 transition-opacity">
            {usdc?.balance ? parseFloat(usdc.balance).toFixed(2) : '0.00'}
          </span>
          <span className="text-white/50 font-medium">USDC</span>
        </div>
        <div className="text-xs text-white/40">
          {xlm?.balance ? `${parseFloat(xlm.balance).toFixed(2)} XLM` : '—'} · tap for details
        </div>
      </button>

      <div className="flex items-center justify-between rounded-xl border border-white/10 bg-black/40 px-3 py-2.5">
        <span className="font-mono text-[12px] text-white/50">
          {short(wallet?.address)}
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={copyAddress}
            className="text-[11px] text-[color:var(--emerald)] hover:brightness-110 px-2 py-1 rounded-md hover:bg-white/10 transition-colors"
          >
            {copied ? '✓ Copied' : 'Copy'}
          </button>
          <button
            onClick={refreshWalletBalance}
            className="text-[11px] text-white/40 hover:text-white px-2 py-1 rounded-md hover:bg-white/10 transition-colors"
          >
            ↻
          </button>
        </div>
      </div>
    </div>
  );
}
