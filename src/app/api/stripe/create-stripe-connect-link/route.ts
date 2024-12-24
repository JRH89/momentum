import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../../../../firebase';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const uid = searchParams.get('uid');

    if (!uid) {
      return NextResponse.json({ error: 'UID is required' }, { status: 400 });
    }

    // Check Firestore for an existing Stripe account ID
    const userDocRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userDocRef);

    let stripeAccountId = userDoc.exists() ? userDoc.data().stripeAccountId : null;

    // If no Stripe account exists, create one
    if (!stripeAccountId) {
      const account = await stripe.accounts.create({
        type: 'standard',
      });

      stripeAccountId = account.id;

      // Save the new Stripe account ID in Firestore
      await setDoc(userDocRef, { stripeAccountId }, { merge: true });
    }

    // Create Stripe Account Link
    const accountLink = await stripe.accountLinks.create({
      account: stripeAccountId,
      refresh_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/${uid}`,
      return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/${uid}`,
      type: 'account_onboarding',
    });

    return NextResponse.json({ url: accountLink.url }, { status: 200 });
  } catch (error) {
    console.error('Error handling Stripe Connect logic:', error);
    return NextResponse.json(
      { error: 'Failed to create Stripe account or account link' },
      { status: 500 }
    );
  }
}
