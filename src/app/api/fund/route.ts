import { NextRequest, NextResponse } from 'next/server';
import {
  Horizon,
  Asset,
  TransactionBuilder,
  Networks,
  Operation,
  Keypair,
  BASE_FEE,
} from '@stellar/stellar-sdk';

// Demo FX rate — replace with a live quote source before mainnet.
const NGN_PER_USD = 1650;

// Circle's real Stellar testnet USDC issuer.
const USDC_ISSUER =
  process.env.TESTNET_USDC_ISSUER || 'GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5';

const HORIZON_URL = 'https://horizon-testnet.stellar.org';

/**
 * Activate the user's Pollar wallet via the Pollar Server API (deferred-funding
 * business event). 409 "already funded" is a safe no-op.
 */
async function activatePollarWallet(publicKey: string): Promise<void> {
  const pollarSecret = process.env.POLLAR_SECRET_KEY;
  if (!pollarSecret) return;
  try {
    await fetch('https://server.api.pollar.xyz/v1/wallets/fund', {
      method: 'POST',
      headers: {
        'x-pollar-api-key': pollarSecret,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ publicKey }),
      signal: AbortSignal.timeout(15000),
    });
  } catch (err) {
    // Activation is best-effort; the treasury payment below is the source of truth.
    console.warn('Pollar wallet activation failed:', err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const { walletAddress, ngnAmount, reference } = await req.json();

    if (!walletAddress || typeof walletAddress !== 'string' || !walletAddress.startsWith('G') || walletAddress.length !== 56) {
      return NextResponse.json({ error: 'Missing or invalid walletAddress' }, { status: 400 });
    }
    if (!ngnAmount || ngnAmount <= 0) {
      return NextResponse.json({ error: 'Missing or invalid ngnAmount' }, { status: 400 });
    }
    if (!reference || typeof reference !== 'string' || reference.length < 4) {
      return NextResponse.json({ error: 'Missing transaction reference' }, { status: 400 });
    }

    const treasurySecret = process.env.TREASURY_SECRET_KEY;
    if (!treasurySecret) {
      return NextResponse.json(
        { error: 'Treasury not configured — TREASURY_SECRET_KEY missing on the server.' },
        { status: 503 }
      );
    }

    // 1) Activate the user's Pollar wallet on-chain (real, sponsored reserve).
    await activatePollarWallet(walletAddress);

    // 2) Send real testnet USDC from the NairaBridge treasury to the user's wallet.
    const usdcAmount = (ngnAmount / NGN_PER_USD).toFixed(7);
    const treasuryKeypair = Keypair.fromSecret(treasurySecret);
    const USDC = new Asset('USDC', USDC_ISSUER);

    const server = new Horizon.Server(HORIZON_URL);
    const treasuryAccount = await server.loadAccount(treasuryKeypair.publicKey());

    const tx = new TransactionBuilder(treasuryAccount, {
      fee: BASE_FEE,
      networkPassphrase: Networks.TESTNET,
    })
      .addOperation(
        Operation.payment({
          destination: walletAddress,
          asset: USDC,
          amount: usdcAmount,
        })
      )
      .setTimeout(60)
      .build();

    tx.sign(treasuryKeypair);
    const result = await server.submitTransaction(tx);

    return NextResponse.json({
      simulated: false,
      usdcSent: usdcAmount,
      txHash: result.hash,
    });
  } catch (err) {
    console.error('Funding error:', err);
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
