import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialize Stripe with the secret key
const stripe = new Stripe(process.env.STRIPE_TEST_SECRET!, {
  apiVersion: '2024-06-20',
});

export async function POST(req: NextRequest) {
  try {
    // Parse the incoming request body
    const { email, name, description, connectId } = await req.json();

    // Ensure we have a connected account ID
    if (!connectId) {
      return NextResponse.json(
        { error: 'Missing connected account ID' },
        { status: 400 }
      );
    }

    // Create the customer on the connected account
    const customer = await stripe.customers.create(
      {
        email,
        name,
        description,
      },
      {
        stripeAccount: connectId, // Specify the connected account here
      }
    );

    // Return the customer object in the response
    return NextResponse.json(customer);
  } catch (error: any) {
    console.error('Error creating Stripe customer:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
