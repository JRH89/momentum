// app/api/stripe/callback/route.ts
import { NextResponse } from 'next/server';
import { db } from '../../../../../firebase';
import { doc, setDoc } from 'firebase/firestore';

export async function POST(req: Request) {
    try {
        const { code, user } = await req.json();

        if (!code || !user || !user.uid) {
            return NextResponse.json({ error: 'Authorization code or user UID missing' }, { status: 400 });
        }

        const response = await fetch('https://connect.stripe.com/oauth/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                grant_type: 'authorization_code',
                client_id: process.env.NEXT_PUBLIC_STRIPE_CLIENT_ID!,
                client_secret: process.env.STRIPE_TEST_SECRET!,
                code,
            }),
        });

        const data = await response.json();

        if (response.ok) {
            const stripeAccountId = data.stripe_user_id;

            // Save Stripe account info to Firebase Firestore
            const userDocRef = doc(db, 'users', user.uid);
            await setDoc(userDocRef, {
                stripeAccountId: stripeAccountId,
                stripeConnected: true,
            }, { merge: true });

            console.log(`Successfully linked Stripe Account: ${stripeAccountId}`);
            return NextResponse.json({ success: true });
        } else {
            console.error('Failed to link Stripe Account:', data);
            return NextResponse.json({ error: data.error_description || 'Failed to link Stripe Account' }, { status: 500 });
        }
    } catch (error) {
        console.error('Error processing Stripe OAuth:', error);
        return NextResponse.json({ error: 'Failed to process Stripe OAuth' }, { status: 500 });
    }
}
