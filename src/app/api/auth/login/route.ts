import { NextRequest, NextResponse } from 'next/server';
import { deriveKeypair, horizon, makeSessionToken, sessionCookie } from '@/lib/wallet';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }
    const userKeypair = deriveKeypair(email, password);
    const exists = await horizon()
      .loadAccount(userKeypair.publicKey())
      .then(() => true)
      .catch(() => false);
    if (!exists) {
      return NextResponse.json(
        { error: 'No wallet found for these credentials — create one first.' },
        { status: 401 }
      );
    }
    const res = NextResponse.json({ publicKey: userKeypair.publicKey(), email });
    res.cookies.set(sessionCookie(), makeSessionToken(email, userKeypair.publicKey()), {
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    });
    return res;
  } catch (err) {
    console.error('Login error:', err);
    return NextResponse.json({ error: 'Could not sign you in. Try again.' }, { status: 500 });
  }
}
