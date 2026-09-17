import { NextRequest, NextResponse } from 'next/server';
import {
  deriveKeypair,
  horizon,
  USDC,
  USDC_ISSUER,
  verifySessionToken,
  sessionCookie,
} from '@/lib/wallet';
import { TransactionBuilder, Networks, Operation, BASE_FEE } from '@stellar/stellar-sdk';

export async function POST(req: NextRequest) {
  try {
    const session = verifySessionToken(req.cookies.get(sessionCookie())?.value);
    if (!session) {
      return NextResponse.json({ error: 'not_signed_in' }, { status: 401 });
    }
    const { toAddress, amount, password } = await req.json();

    if (!toAddress || !toAddress.startsWith('G') || toAddress.length !== 56) {
      return NextResponse.json({ error: 'Enter a valid destination address (G…)' }, { status: 400 });
    }
    if (!amount || parseFloat(amount) <= 0) {
      return NextResponse.json({ error: 'Enter an amount' }, { status: 400 });
    }
    if (!password) {
      return NextResponse.json({ error: 'Password required to authorize the transfer' }, { status: 400 });
    }

    // Re-derive the wallet from the password — this IS the authorization.
    const userKeypair = deriveKeypair(session.email, password);
    if (userKeypair.publicKey() !== session.publicKey) {
      return NextResponse.json({ error: 'Wrong password' }, { status: 403 });
    }

    const server = horizon();

    // Destination must exist and trust USDC.
    let destAccount;
    try {
      destAccount = await server.loadAccount(toAddress);
    } catch {
      return NextResponse.json(
        { error: 'Destination wallet does not exist on-chain yet' },
        { status: 409 }
      );
    }
    const hasTrust = destAccount.balances.some(
      (b: any) => b.asset_type === 'credit_alphanum4' && b.asset_code === 'USDC' && b.asset_issuer === USDC_ISSUER
    );
    if (!hasTrust) {
      return NextResponse.json(
        { error: 'Destination wallet has no USDC trustline yet' },
        { status: 409 }
      );
    }

    const userAccount = await server.loadAccount(userKeypair.publicKey());
    const tx = new TransactionBuilder(userAccount, {
      fee: BASE_FEE,
      networkPassphrase: Networks.TESTNET,
    })
      .addOperation(
        Operation.payment({
          destination: toAddress,
          asset: USDC,
          amount: parseFloat(amount).toFixed(7),
        })
      )
      .setTimeout(60)
      .build();
    tx.sign(userKeypair);
    const result = await server.submitTransaction(tx);

    return NextResponse.json({ ok: true, txHash: result.hash, amount: parseFloat(amount).toFixed(7) });
  } catch (err: any) {
    console.error('Send error:', err?.response?.data?.extras?.result_codes || err);
    const codes = err?.response?.data?.extras?.result_codes;
    if (codes?.operations?.includes('op_underfunded')) {
      return NextResponse.json({ error: 'Not enough USDC in your wallet' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Transfer failed — try again' }, { status: 500 });
  }
}
