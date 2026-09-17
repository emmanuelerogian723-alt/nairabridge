import { NextRequest, NextResponse } from 'next/server';
import { deriveKeypair, provisionWallet, horizon, makeSessionToken, sessionCookie } from '@/lib/wallet';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !EMAIL_RE.test(email)) {
      return NextResponse.json({ error: 'Enter a valid email address' }, { status: 400 });
    }
    if (!password || password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
    }

    // Deterministic wallet: same email+password => same keypair.
    const userKeypair = deriveKeypair(email, password);

    // Already provisioned? Then this is really a sign-in.
    const exists = await horizon()
      .loadAccount(userKeypair.publicKey())
      .then(() => true)
      .catch(() => false);
    if (exists) {
      return NextResponse.json(
        { error: 'A wallet already exists for these credentials — sign in instead.' },
        { status: 409 }
      );
    }

    await provisionWallet(userKeypair);

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
    console.error('Signup error:', err);
    return NextResponse.json({ error: 'Could not create your wallet. Try again.' }, { status: 500 });
  }
}
