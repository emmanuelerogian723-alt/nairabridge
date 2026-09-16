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

// Circle's real Stellar testnet USDC issuer (confirmed via developers.circle.com).
// Confirm/replace with the exact USDC issuer your Pollar app has configured under
// Treasury -> Tokens & Trustlines before a live demo.
const USDC_ISSUER = process.env.TESTNET_USDC_ISSUER || 'GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5';

const HORIZON_URL = 'https://horizon-testnet.stellar.org';

export async function POST(req: NextRequest) {
  try {
    const { walletAddress, ngnAmount, reference } = await req.json();

    if (!walletAddress || typeof walletAddress !== 'string' || !walletAddress.startsWith('G')) {
      return NextResponse.json({ error: 'Missing or invalid walletAddress' }, { status: 400 });
    }
    if (!ngnAmount || ngnAmount <= 0) {
      return NextResponse.json({ error: 'Missing or invalid ngnAmount' }, { status: 400 });
    }
    if (!reference) {
      return NextResponse.json({ error: 'Missing transaction reference' }, { status: 400 });
    }

    const treasurySecret = process.env.TREASURY_SECRET_KEY;
    if (!treasurySecret) {
      // No treasury configured yet — return a simulated "pending manual review" response
      // so the UI flow is fully demoable before the real testnet treasury is funded.
      return NextResponse.json({
        simulated: true,
        usdcSent: (ngnAmount / NGN_PER_USD).toFixed(2),
        txHash: 'SIMULATED-' + reference,
        note: 'TREASURY_SECRET_KEY not set — this is a mocked confirmation. Set it to send real testnet USDC.',
      });
    }

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
