import { NextRequest, NextResponse } from 'next/server';
import { horizon, NGN_PER_USD, USDC_ISSUER, verifySessionToken, sessionCookie } from '@/lib/wallet';

const ADDR_RE = /G[A-Z2-7]{55}/;
const AMOUNT_RE = /(\d[\d,]*(?:\.\d+)?)/;

export async function POST(req: NextRequest) {
  try {
    const session = verifySessionToken(req.cookies.get(sessionCookie())?.value);
    if (!session) {
      return NextResponse.json({ error: 'not_signed_in' }, { status: 401 });
    }
    const { message } = await req.json();
    const text = (message || '').trim();
    const lower = text.toLowerCase();

    /* ---- direct send command (agent-executed) ---- */
    if (/(^|\s)(send|transfer|pay)\b/.test(lower) && ADDR_RE.test(text)) {
      const to = text.match(ADDR_RE)![0];
      const amtMatch = text.replace(/,/g, '').match(/(\d+(?:\.\d+)?)\s*usdc/i);
      const amount = amtMatch ? amtMatch[1] : null;
      if (!amount) {
        return NextResponse.json({
          reply: `I found the destination ${to.slice(0, 10)}… but no amount. Try: "send 10 USDC to ${to.slice(0, 8)}…"`,
        });
      }
      return NextResponse.json({
        reply: `Ready to send *${amount} USDC* to \`${to.slice(0, 14)}…${to.slice(-6)}\`. Confirm with your password to authorize the transfer.`,
        confirm: { to, amount: String(parseFloat(amount)) },
      });
    }

    /* ---- balance ---- */
    if (/balance|how much do i have|what.s in my wallet/.test(lower)) {
      const account = await horizon().loadAccount(session.publicKey);
      const usdc = account.balances.find(
        (b: any) => b.asset_type === 'credit_alphanum4' && b.asset_code === 'USDC' && b.asset_issuer === USDC_ISSUER
      );
      const xlm = account.balances.find((b: any) => b.asset_type === 'native');
      return NextResponse.json({
        reply: `You hold *${usdc ? parseFloat(usdc.balance).toFixed(2) : '0.00'} USDC* and ${xlm ? parseFloat(xlm.balance).toFixed(2) : '0.00'} XLM.`,
      });
    }

    /* ---- naira conversion ---- */
    if (/naira|ngn|₦/.test(lower)) {
      const m = text.replace(/,/g, '').match(AMOUNT_RE);
      if (m) {
        const ngn = parseFloat(m[1]);
        const usdc = (ngn / NGN_PER_USD).toFixed(2);
        return NextResponse.json({
          reply: `₦${ngn.toLocaleString()} at ₦${NGN_PER_USD.toLocaleString()}/USD ≈ *${usdc} USDC*. Use the Fund card above to make the transfer.`,
        });
      }
    }

    /* ---- cash out / Bolivia ---- */
    if (/bolivia|bob|cash ?out|la paz/.test(lower)) {
      return NextResponse.json({
        reply: `Cash-out runs through Pollar's BOB ramp: your USDC sells on Stellar and bolivianos land in any Bolivian bank account by QR or ACH. The corridor switch on Pollar's side is the one thing pending — once it's enabled, the "Cash Out in Bolivia" card goes live.`,
      });
    }

    /* ---- help ---- */
    return NextResponse.json({
      reply: `I can move money for you. Try:
• "send 10 USDC to G…" — I'll transfer it after your password
• "how much is 50000 naira" — instant USDC conversion
• "balance" — what's in your wallet
• "cash out in Bolivia" — how the BOB ramp works`,
    });
  } catch (err) {
    console.error('Agent error:', err);
    return NextResponse.json({ reply: 'Something went wrong on my side — try that again.' });
  }
}
