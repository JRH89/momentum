// app/api/stripe/oauth/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  const stripeOAuthUrl = `https://connect.stripe.com/oauth/authorize?response_type=code&client_id=${process.env.NEXT_PUBLIC_STRIPE_CLIENT_ID}&scope=read_write`;

  return NextResponse.redirect(stripeOAuthUrl);
}
