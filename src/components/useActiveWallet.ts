'use client';

import { usePollar } from '@pollar/react';
import { useSession } from './Providers';
import { DEMO_ADDRESS } from '@/lib/demo';

export type ActiveWallet = {
  address: string;
  source: 'pollar' | 'email' | 'demo';
  email?: string;
  /** Pollar wallets sign through the SDK (KMS); email wallets need the password. */
  canSend: boolean;
};

export function useActiveWallet(demo = false): { wallet: ActiveWallet | null; loading: boolean } {
  const { wallet: pollarWallet } = usePollar();
  const { user, loading } = useSession();

  if (pollarWallet?.address) {
    return { wallet: { address: pollarWallet.address, source: 'pollar', canSend: true }, loading: false };
  }
  if (user?.publicKey) {
    return { wallet: { address: user.publicKey, source: 'email', email: user.email, canSend: true }, loading: false };
  }
  if (demo) {
    return { wallet: { address: DEMO_ADDRESS, source: 'demo', canSend: false }, loading: false };
  }
  return { wallet: null, loading };
}
