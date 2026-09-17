'use client';

import { useState } from 'react';
import { usePollar } from '@pollar/react';

const NGN_PER_USD = 1650; // demo FX rate — swap for a live quote before mainnet

export default function FundFromNigeria() {
  const { wallet, refreshWalletBalance } = usePollar();
  const [ngnAmount, setNgnAmount] = useState('50000');
  const [reference, setReference] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'confirmed' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const usdcEstimate = (parseFloat(ngnAmount || '0') / NGN_PER_USD).toFixed(2);

  async function handleConfirm() {
    if (!wallet?.address || !reference.trim()) return;
    setStatus('submitting');
    setMessage('');
    try {
      const res = await fetch('/api/fund', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress: wallet.address,
          ngnAmount: parseFloat(ngnAmount || '0'),
          reference: reference.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Funding failed');
      setStatus('confirmed');
      setMessage(`✓ ${data.usdcSent} USDC credited to your wallet`);
      refreshWalletBalance().catch(() => {});
    } catch (e) {
      setStatus('error');
      setMessage(e instanceof Error ? e.message : 'Something went wrong');
    }
  }

  return (
    <div className="glass p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-[15px] flex items-center gap-2">
          <span className="text-lg">🇳🇬</span> Fund from Nigeria
        </h3>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border chip">
          NGN → USDC
        </span>
      </div>

      {/* amount + estimate */}
      <div className="space-y-2">
        <label className="text-xs text-[color:var(--ink-2)]">Amount in Naira</label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[color:var(--ink-2)] font-medium">₦</span>
          <input
            value={ngnAmount}
            onChange={(e) => setNgnAmount(e.target.value.replace(/[^0-9]/g, ''))}
            inputMode="numeric"
            className="w-full rounded-xl bg-white border border-[color:var(--hairline)] px-9 py-3.5 text-lg font-semibold tabular-nums focus:border-emerald-400/50 transition-colors"
            placeholder="50000"
          />
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-[color:var(--ink-2)]">You receive</span>
          <span className="font-mono text-[color:var(--emerald)]">{usdcEstimate} USDC</span>
        </div>
      </div>

      {/* payment instructions */}
      <div className="rounded-xl border border-[color:var(--hairline)] bg-black/[0.02] p-3.5 space-y-1.5 text-[12px] leading-relaxed">
        <div className="flex justify-between">
          <span className="text-[color:var(--ink-2)]">Bank</span>
          <span className="font-medium">NairaBridge Ltd · GTBank</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[color:var(--ink-2)]">Account</span>
          <span className="font-mono">0123456789</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[color:var(--ink-2)]">Narration</span>
          <span className="font-mono text-[color:var(--emerald)]">NB-{wallet?.address?.slice(3, 9) ?? 'XXXXXX'}</span>
        </div>
      </div>

      {/* reference */}
      <div className="space-y-2">
        <label className="text-xs text-[color:var(--ink-2)]">
          Transfer reference from your bank
        </label>
        <input
          value={reference}
          onChange={(e) => setReference(e.target.value)}
          className="w-full rounded-xl bg-white border border-[color:var(--hairline)] px-4 py-3 text-sm font-mono focus:border-emerald-400/50 transition-colors"
          placeholder="e.g. 20260916N4K2"
        />
      </div>

      <button
        onClick={handleConfirm}
        disabled={status === 'submitting' || !reference.trim() || !wallet?.address}
        className="btn-primary w-full py-3.5 text-[15px]"
      >
        {status === 'submitting' ? 'Confirming…' : `Confirm transfer · ${usdcEstimate} USDC`}
      </button>

      {message && (
        <p
          className={`text-[13px] rounded-xl px-3.5 py-2.5 border ${
            status === 'error'
              ? 'text-red-600 border-red-500/20 bg-red-50'
              : 'text-[color:var(--emerald)] border-[color:var(--emerald)]/25 bg-emerald-50 text-[color:var(--emerald)]'
          }`}
        >
          {message}
        </p>
      )}

      <p className="text-[11px] text-[color:var(--ink-2)] leading-relaxed">
        Pay by bank transfer or mobile money, then confirm with your reference. NairaBridge
        credits spendable USDC to your Stellar wallet in seconds.
      </p>
    </div>
  );
}
