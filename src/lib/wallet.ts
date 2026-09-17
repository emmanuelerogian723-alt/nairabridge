import {
  Horizon,
  Asset,
  TransactionBuilder,
  Networks,
  Operation,
  Keypair,
  BASE_FEE,
} from '@stellar/stellar-sdk';
import crypto from 'node:crypto';

export const HORIZON_URL = 'https://horizon-testnet.stellar.org';
export const USDC_ISSUER =
  'GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5';
export const USDC = new Asset('USDC', USDC_ISSUER);
export const NGN_PER_USD = 1650;

export function horizon(): Horizon.Server {
  return new Horizon.Server(HORIZON_URL);
}

/**
 * Deterministic wallet: the user's Stellar secret is derived from
 * email + password with PBKDF2. Nothing is ever stored — the chain
 * itself is the user database. Wrong password => wrong keypair =>
 * login simply fails to find the account.
 */
export function deriveKeypair(email: string, password: string): Keypair {
  const salt = `nairabridge:v1:${email.trim().toLowerCase()}`;
  const seed = crypto.pbkdf2Sync(password, salt, 210000, 32, 'sha512');
  return Keypair.fromRawEd25519Seed(seed);
}

export function treasuryKeypair(): Keypair {
  const secret = process.env.TREASURY_SECRET_KEY;
  if (!secret) throw new Error('TREASURY_SECRET_KEY missing');
  return Keypair.fromSecret(secret);
}

/**
 * Create the account on-chain, add the USDC trustline, and credit a
 * small welcome balance so the wallet is immediately usable in demos.
 */
export async function provisionWallet(userKeypair: Keypair): Promise<void> {
  const server = horizon();
  const treasury = treasuryKeypair();

  // 1) create account with an XLM reserve
  const tAcct = await server.loadAccount(treasury.publicKey());
  const createTx = new TransactionBuilder(tAcct, {
    fee: BASE_FEE,
    networkPassphrase: Networks.TESTNET,
  })
    .addOperation(
      Operation.createAccount({
        destination: userKeypair.publicKey(),
        startingBalance: '4',
      })
    )
    .setTimeout(60)
    .build();
  createTx.sign(treasury);
  await server.submitTransaction(createTx);

  // 2) trustline for USDC, signed by the user's own key
  const uAcct = await server.loadAccount(userKeypair.publicKey());
  const trustTx = new TransactionBuilder(uAcct, {
    fee: BASE_FEE,
    networkPassphrase: Networks.TESTNET,
  })
    .addOperation(Operation.changeTrust({ asset: USDC, limit: '100000' }))
    .setTimeout(60)
    .build();
  trustTx.sign(userKeypair);
  await server.submitTransaction(trustTx);

  // 3) welcome bonus: 5 USDC from the treasury
  const tAcct2 = await server.loadAccount(treasury.publicKey());
  const bonusTx = new TransactionBuilder(tAcct2, {
    fee: BASE_FEE,
    networkPassphrase: Networks.TESTNET,
  })
    .addOperation(
      Operation.payment({
        destination: userKeypair.publicKey(),
        asset: USDC,
        amount: '5',
      })
    )
    .setTimeout(60)
    .build();
  bonusTx.sign(treasury);
  await server.submitTransaction(bonusTx);
}

/* ---------------- sessions ---------------- */

const SESSION_COOKIE = 'nb_session';
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

function hmac(payload: string): string {
  const key = process.env.TREASURY_SECRET_KEY || 'nb-insecure-dev-key';
  return crypto.createHmac('sha256', key).update(payload).digest('base64url');
}

export function makeSessionToken(email: string, publicKey: string): string {
  const payload = JSON.stringify({
    e: email.trim().toLowerCase(),
    pk: publicKey,
    exp: Date.now() + SESSION_TTL_MS,
  });
  const body = Buffer.from(payload).toString('base64url');
  return `${body}.${hmac(body)}`;
}

export function verifySessionToken(
  token: string | undefined
): { email: string; publicKey: string } | null {
  if (!token) return null;
  const [body, sig] = token.split('.');
  if (!body || !sig || hmac(body) !== sig) return null;
  try {
    const data = JSON.parse(Buffer.from(body, 'base64url').toString());
    if (!data.exp || data.exp < Date.now()) return null;
    return { email: data.e, publicKey: data.pk };
  } catch {
    return null;
  }
}

export const sessionCookie = () => SESSION_COOKIE;
