'use client';

import { useRef, useState } from 'react';
import { usePollar } from '@pollar/react';
import { useActiveWallet } from './useActiveWallet';
import { refreshWallet } from './WalletCard';

const USDC_ISSUER = 'GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5';

type Msg = { from: 'you' | 'agent'; text: string };

/** Render a tiny subset of markdown: *bold*, `mono`, newlines. */
function RichText({ text }: { text: string }) {
  const parts = text.split(/(\*[^*]+\*|`[^`]+`)/g);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith('*') && p.endsWith('*') ? (
          <strong key={i}>{p.slice(1, -1)}</strong>
        ) : p.startsWith('`') && p.endsWith('`') ? (
          <code key={i} className="font-mono text-[12px] bg-black/[0.05] px-1 rounded">{p.slice(1, -1)}</code>
        ) : (
          <span key={i}>{p.replace(/•/g, '')}</span>
        )
      )}
    </>
  );
}

export default function SendAgent({ demo = false }: { demo?: boolean }) {
  const { wallet } = useActiveWallet(demo);
  const { sendPayment } = usePollar();
  const [msgs, setMsgs] = useState<Msg[]>([
    { from: 'agent', text: `Hi — I'm Nala, your money agent. Tell me things like *"send 10 USDC to G…"*, *"how much is 50000 naira"* or *"balance"*.` },
  ]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [pending, setPending] = useState<{ to: string; amount: string } | null>(null);
  const [password, setPassword] = useState('');
  const endRef = useRef<HTMLDivElement>(null);

  async function agentSend(to: string, amount: string, pwd: string) {
    if (wallet?.source === 'pollar') {
      const r = await sendPayment({
        destination: to,
        amount,
        asset: { type: 'credit_alphanum4', code: 'USDC', issuer: USDC_ISSUER },
      });
      return r.hash;
    }
    const res = await fetch('/api/wallet/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ toAddress: to, amount: parseFloat(amount), password: pwd }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Transfer failed');
    return data.txHash;
  }

  async function send(text: string) {
    setMsgs((m) => [...m, { from: 'you', text }]);
    setBusy(true);
    setInput('');
    try {
      const res = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();
      if (data.confirm) {
        setPending(data.confirm);
        setMsgs((m) => [...m, { from: 'agent', text: data.reply }]);
      } else {
        setMsgs((m) => [...m, { from: 'agent', text: data.reply }]);
      }
    } catch {
      setMsgs((m) => [...m, { from: 'agent', text: 'I hit a snag — try again.' }]);
    } finally {
      setBusy(false);
      setTimeout(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
    }
  }

  async function confirmSend() {
    if (!pending) return;
    setBusy(true);
    try {
      const hash = await agentSend(pending.to, pending.amount, password);
      setMsgs((m) => [
        ...m,
        { from: 'agent', text: `✓ Done — *${pending.amount} USDC* sent. tx \`${hash.slice(0, 16)}…\`` },
      ]);
      setPending(null);
      setPassword('');
      refreshWallet();
    } catch (e) {
      setMsgs((m) => [
        ...m,
        { from: 'agent', text: e instanceof Error ? `Transfer failed: ${e.message}` : 'Transfer failed — try again.' },
      ]);
    } finally {
      setBusy(false);
      setTimeout(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
    }
  }

  return (
    <div className="glass p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-[15px] flex items-center gap-2">
          <span className="w-7 h-7 rounded-full bg-[#1d1d1f] text-white text-[11px] flex items-center justify-center font-bold">N</span>
          Nala · your money agent
        </h3>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border chip">AI sends</span>
      </div>

      <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
        {msgs.map((m, i) => (
          <div key={i} className={`flex ${m.from === 'you' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[85%] text-[13px] leading-relaxed rounded-2xl px-3.5 py-2.5 whitespace-pre-line ${
                m.from === 'you'
                  ? 'bg-[#1d1d1f] text-white rounded-br-md'
                  : 'bg-black/[0.04] text-[color:var(--ink)] rounded-bl-md'
              }`}
            >
              <RichText text={m.text} />
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      {pending ? (
        <div className="space-y-2.5 rounded-xl border border-[color:var(--emerald)]/30 bg-emerald-50/60 p-3.5">
          <div className="text-[12.5px] font-medium">
            Confirm send of {pending.amount} USDC to <span className="font-mono text-[11.5px]">{pending.to.slice(0, 12)}…{pending.to.slice(-6)}</span>
          </div>
          {wallet?.source === 'pollar' ? (
            <button onClick={confirmSend} disabled={busy} className="btn-primary w-full py-3 text-sm">
              {busy ? 'Authorizing with Pollar…' : 'Authorize transfer'}
            </button>
          ) : (
            <>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && password && confirmSend()}
                placeholder="Password to authorize"
                className="w-full rounded-xl bg-white border border-[color:var(--hairline)] px-3.5 py-2.5 text-sm focus:border-emerald-400/60 outline-none transition-colors"
              />
              <button onClick={confirmSend} disabled={busy || !password} className="btn-primary w-full py-3 text-sm">
                {busy ? 'Signing & sending…' : 'Authorize transfer'}
              </button>
            </>
          )}
          <button onClick={() => { setPending(null); setPassword(''); }} className="w-full text-[11.5px] text-[color:var(--ink-2)] hover:text-[color:var(--ink)] transition-colors">
            Cancel
          </button>
        </div>
      ) : (
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && input.trim() && send(input.trim())}
            placeholder='e.g. "send 5 USDC to G…"'
            disabled={demo || !wallet}
            className="flex-1 rounded-xl bg-white border border-[color:var(--hairline)] px-4 py-3 text-[13px] focus:border-emerald-400/60 outline-none transition-colors disabled:opacity-50"
          />
          <button
            onClick={() => input.trim() && send(input.trim())}
            disabled={busy || !input.trim() || demo || !wallet}
            className="btn-primary px-5 py-3 text-[13px]"
          >
            {busy ? '…' : '↑'}
          </button>
        </div>
      )}
    </div>
  );
}
