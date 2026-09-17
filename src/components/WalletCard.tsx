'use client';

import { useCallback, useEffect, useState } from 'react';
import { useActiveWallet } from './useActiveWallet';
import SendSheet from './SendSheet';

export function refreshWallet() {
  window.dispatchEvent(new CustomEvent('nb:refresh'));
}

export default function WalletCard({ demo = false }: { demo?: boolean }) {
  const { wallet } = useActiveWallet(demo);
  const [state, setState] = useState<{ usdc: string; xlm: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [sendOpen, setSendOpen] = useState(false);

  const load = useCallback(() => {
    if (!wallet?.address) return;
    fetch(`/api/wallet/state?address=${wallet.address}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => d && setState({ usdc: d.usdc, xlm: d.xlm }))
      .catch(() => {});
  }, [wallet?.address]);

  useEffect(() => {
    load();
    const h = () => load();
    window.addEventListener('nb:refresh', h);
    return () => window.removeEventListener('nb:refresh', h);
  }, [load]);

  async function copyAddress() {
    if (!wallet?.address) return;
    try {
      await navigator.clipboard.writeText(wallet.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {}
  }

  if (!wallet) return null;
  const addr = wallet.address;

  return (
    <>
      <div className="relative rounded-[1.375rem] overflow-hidden bg-[#0b0b0d] text-white transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1"
        style={{ boxShadow: '0 24px 48px rgba(0,0,0,0.28)' }}>
        {/* ambient sheen */}
        <div className="absolute -top-20 -right-16 w-72 h-72 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(closest-side, rgba(255,255,255,0.10), transparent)' }} />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-white/10" />

        <div className="relative p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-full bg-white/10 border border-white/15 flex items-center justify-center">
                <span className="w-4 h-4 rounded-full bg-gradient-to-br from-white/90 to-white/40" />
              </span>
              <div>
                <div className="text-[10px] uppercase tracking-[0.14em] text-white/45 leading-none">Your wallet</div>
                <div className="text-[11px] text-white/70 mt-1 leading-none">
                  {wallet.source === 'email' ? wallet.email : wallet.source === 'pollar' ? 'Google · Pollar' : 'Preview'}
                </div>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2.5 py-1 rounded-full border border-white/15 bg-white/[0.06] text-white/75">
              USDC · Stellar
            </span>
          </div>

          <div>
            <div className="text-[43px] leading-none font-bold tracking-tight tabular-nums">
              {state?.usdc ?? '—'}
            </div>
            <div className="text-[12px] text-white/45 mt-2">
              {state ? `${state.xlm} XLM reserve` : 'syncing…'} · testnet
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={copyAddress}
              className="flex-1 flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.05] px-3.5 py-2.5 hover:bg-white/[0.09] transition-colors group"
            >
              <span className="font-mono text-[11.5px] text-white/60 tracking-tight">
                {addr.slice(0, 10)}…{addr.slice(-8)}
              </span>
              <span className="text-[11px] text-white/45 group-hover:text-white/80 transition-colors">
                {copied ? '✓ copied' : 'copy'}
              </span>
            </button>
            <button
              onClick={load}
              className="w-10 h-10 rounded-xl border border-white/10 bg-white/[0.05] text-white/60 hover:bg-white/[0.09] hover:text-white transition-colors text-sm"
              aria-label="Refresh"
            >
              ↻
            </button>
            <button
              onClick={() => setSendOpen(true)}
              disabled={!wallet.canSend}
              className="h-10 px-4 rounded-xl bg-white text-[#0b0b0d] text-[12.5px] font-semibold hover:bg-white/90 active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </div>
        </div>
      </div>

      <SendSheet open={sendOpen} onClose={() => setSendOpen(false)} onSent={refreshWallet} />
    </>
  );
}
