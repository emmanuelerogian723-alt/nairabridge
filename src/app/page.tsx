'use client';

import { usePollar } from '@pollar/react';
import WalletCard from '@/components/WalletCard';
import FundFromNigeria from '@/components/FundFromNigeria';
import CashOutBolivia from '@/components/CashOutBolivia';

export default function Home() {
  const { isAuthenticated } = usePollar();

  return (
    <main className="flex-1 max-w-xl w-full mx-auto px-4 py-10 space-y-6">
      <header className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">NairaBridge</h1>
        <p className="text-neutral-400">
          Fund from Nigeria. Cash out in Bolivia. Powered by Pollar on Stellar.
        </p>
      </header>

      <WalletCard />

      {isAuthenticated && (
        <>
          <FundFromNigeria />
          <CashOutBolivia />
        </>
      )}

      <p className="text-center text-xs text-neutral-600">
        Built for the Pollar Hackathon — Southeast Blockchain &amp; Games Week
      </p>
    </main>
  );
}
