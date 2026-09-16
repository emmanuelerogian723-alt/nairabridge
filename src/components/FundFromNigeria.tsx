'use client';

import { useState } from 'react';
import { usePollar } from '@pollar/react';

const NGN_PER_USD = 1650; // demo FX rate — swap for a live quote before mainnet

export default function FundFromNigeria() {
  const { wallet } = usePollar();
  const [ngnAmount, setNgnAmount] = useState('50000');
  const [reference, setReference] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'confirmed' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const usdcEstimate = (parseFloat(ngnAmount || '0') / NGN_PER_USD).toFixed(2);

  async function handleConfirm() {
    if (!wallet?.address) return;
    setStatus('submitting');
    setMessage('');
    try {
      const res = await fetch('/api/fund', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress: wallet.address,
          ngnAmount: parseFloat(ngnAmount),
          reference,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Funding failed');
      setStatus('confirmed');
      setMessage(`✓ Credited ${data.usdcSent} USDC to your Pollar wallet. Tx: ${data.txHash?.slice(0, 12)}...`);
    } catch (e) {
      setStatus('error');
      setMessage(e instanceof Error ? e.message : 'Something went wrong');
    }
  }

  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-5 space-y-4">
      <h3 className="font-semibold text-lg">🇳🇬 Fund from Nigeria</h3>
      <p className="text-sm text-neutral-400">
        Local rails aren&apos;t wired to a live payment processor for this demo — pay via bank
        transfer or mobile money below, then confirm with your reference. NairaBridge credits
        the USDC equivalent to your Pollar wallet.
      </p>

      <div className="rounded-lg bg-neutral-800 p-3 text-sm space-y-1">
        <p><span className="text-neutral-400">Bank transfer:</span> GTBank · 0123456789 · NairaBridge Demo Ltd</p>
        <p><span className="text-neutral-400">Mobile money:</span> OPay · 0812 345 6789</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <label className="text-sm">
          Amount (NGN)
          <input
            type="number"
            value={ngnAmount}
            onChange={(e) => setNgnAmount(e.target.value)}
            className="mt-1 w-full rounded-md bg-neutral-800 border border-neutral-700 px-3 py-2 text-white"
          />
        </label>
        <label className="text-sm">
          Transaction reference
          <input
            type="text"
            placeholder="e.g. bank ref / OPay txn ID"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            className="mt-1 w-full rounded-md bg-neutral-800 border border-neutral-700 px-3 py-2 text-white"
          />
        </label>
      </div>

      <p className="text-sm text-emerald-400">≈ {usdcEstimate} USDC at ₦{NGN_PER_USD}/$</p>

      <button
        onClick={handleConfirm}
        disabled={!wallet?.address || !reference || status === 'submitting'}
        className="w-full rounded-md bg-emerald-500 disabled:bg-neutral-700 disabled:text-neutral-500 py-2 font-medium text-black"
      >
        {status === 'submitting' ? 'Confirming…' : "I've sent it — credit my wallet"}
      </button>

      {message && (
        <p className={`text-sm ${status === 'error' ? 'text-red-400' : 'text-emerald-400'}`}>{message}</p>
      )}
    </div>
  );
}
