import { NextResponse } from 'next/server';
import { sessionCookie } from '@/lib/wallet';

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(sessionCookie(), '', { httpOnly: true, sameSite: 'lax', secure: true, maxAge: 0, path: '/' });
  return res;
}
