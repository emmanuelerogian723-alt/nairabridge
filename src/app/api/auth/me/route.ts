import { NextRequest, NextResponse } from 'next/server';
import { verifySessionToken, sessionCookie } from '@/lib/wallet';

export async function GET(req: NextRequest) {
  const session = verifySessionToken(req.cookies.get(sessionCookie())?.value);
  if (!session) return NextResponse.json({ user: null }, { status: 200 });
  return NextResponse.json({ user: { email: session.email, publicKey: session.publicKey } });
}
