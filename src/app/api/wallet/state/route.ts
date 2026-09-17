import { NextRequest, NextResponse } from 'next/server';
import { horizon, USDC_ISSUER, USDC } from '@/lib/wallet';

export async function GET(req: NextRequest) {
  const address = req.nextUrl.searchParams.get('address') || '';
  if (!address.startsWith('G') || address.length !== 56) {
    return NextResponse.json({ error: 'invalid address' }, { status: 400 });
  }
  try {
    const server = horizon();
    const account = await server.loadAccount(address);
    const usdc = account.balances.find(
      (b: any) => b.asset_type === 'credit_alphanum4' && b.asset_code === 'USDC' && b.asset_issuer === USDC_ISSUER
    );
    const xlm = account.balances.find((b: any) => b.asset_type === 'native');

    const paymentsRes = await server
      .payments()
      .forAccount(address)
      .order('desc')
      .limit(8)
      .call();
    const history = paymentsRes.records.map((p: any) => ({
      id: p.id,
      asset: p.asset_type === 'native' ? 'XLM' : p.asset_code,
      amount: p.amount,
      from: p.from,
      to: p.to,
      incoming: p.to === address,
      date: p.created_at,
    }));

    return NextResponse.json({
      publicKey: address,
      usdc: usdc ? parseFloat(usdc.balance).toFixed(2) : '0.00',
      xlm: xlm ? parseFloat(xlm.balance).toFixed(2) : '0.00',
      history,
    });
  } catch {
    return NextResponse.json({ error: 'account_not_found' }, { status: 404 });
  }
}
