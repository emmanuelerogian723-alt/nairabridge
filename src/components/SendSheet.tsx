'use client';

import { useState } from 'react';
import { usePollar } from '@pollar/react';
import { useActiveWallet } from './useActiveWallet';

const USDC_ISSUER = 'GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5';

export default function SendSheet({
  open,
  onClose,
  onSent,
}: {
  open: boolean;
  onClose: () => void;
  onSent: () => void;
}) {
  const { wallet } = useActiveWallet();
  const { sendPayment } = usePollar();
  const [to, setTo] = useState('');
  const [amount, setAmount] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState('');

  if (!open) return null;

  async function handleSend() {
    setBusy(true);
    setError('');
    try {
      if (wallet?.source === 'pollar') {
        const r = await sendPayment({
          destination: to.trim(),
          amount: String(parseFloat(amount)),
          asset: { type: 'credit_alphanum4', code: 'USDC', issuer: USDC_ISSUER },
        });
        setDone(`Sent! tx ${String(r.hash ?? "").slice(0, 12)}…`);
      } else {
        const res = await fetch('/api/wallet/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ toAddress: to.trim(), amount: parseFloat(amount), password }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Transfer failed');
        setDone(`Sent ${data.amount} USDC · tx ${data.txHash.slice(0, 12)}…`);
      }
      onSent();
      setTimeout(() => { setDone(''); onClose(); }, 1600);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Transfer failed');
    } finally {
      setBusy(false);
    }
  }

  const valid = to.trim().startsWith('G') && to.trim().length === 56 && parseFloat(amount) > 0 && (wallet?.source === 'pollar' || password.length >= 8);

  return (
    <div className="fixed inset-0 z-40 flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-[2px]" onClick={onClose}>
      <div
        className="glass p-6 w-full max-w-md space-y-4 fade-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold tracking-tight">Send USDC</h3>
          <button onClick={onClose} className="btn-ghost px-3 py-1 text-xs">Close</button>
        </div>

        <div className="space-y-3">
          <input
            value={to}
            onChange={(e) => setTo(e.target.value.replace(/[^GA-Z2-7]/g, '').slice(0, 56))}
            placeholder="Destination address (G…)"
            className="w-full rounded-xl bg-white border border-[color:var(--hairline)] px-4 py-3 text-[13px] font-mono focus:border-emerald-400/60 outline-none transition-colors"
          />
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[color:var(--ink-2)] font-medium text-sm">$</span>
            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ''))}
              placeholder="0.00"
              inputMode="decimal"
              className="w-full rounded-xl bg-white border border-[color:var(--hairline)] pl-8 pr-4 py-3 text-lg font-semibold tabular-nums focus:border-emerald-400/60 outline-none transition-colors"
            />
          </div>
          {wallet?.source !== 'pollar' && (
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password to authorize"
              className="w-full rounded-xl bg-white border border-[color:var(--hairline)] px-4 py-3 text-sm focus:border-emerald-400/60 outline-none transition-colors"
            />
          )}
        </div>

        {error && <p className="text-[12px] text-red-600 bg-red-50 border border-red-500/20 rounded-xl px-3.5 py-2.5">{error}</p>}
        {done && <p className="text-[12px] text-[color:var(--emerald)] bg-emerald-50 border border-[color:var(--emerald)]/25 rounded-xl px-3.5 py-2.5">{done}</p>}

        <button onClick={handleSend} disabled={busy || !valid} className="btn-primary w-full py-3.5 text-[15px]">
          {busy ? 'Signing & sending…' : 'Confirm transfer'}
        </button>
      </div>
    </div>
  );
}
