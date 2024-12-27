import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-06-20',
});

export async function POST(req: Request) {
  const body = await req.json();
  const { stripeCustomerId, items, metadata } = body;

  if (!stripeCustomerId || !items || !Array.isArray(items) || items.length === 0) {
    return NextResponse.json(
      { error: 'Stripe Customer ID and valid items are required' },
      { status: 400 }
    );
  }

  try {
    // Validate items - ensuring each item has required fields
    items.forEach(item => {
      if (!item.amount || !item.currency) {
        throw new Error('Each item must include amount and currency');
      }
    });

    // Create invoice items
    for (const item of items) {
      await stripe.invoiceItems.create({
        customer: stripeCustomerId,
        amount: item.amount,
        currency: item.currency,
        description: item.description || 'No description provided',
      });
    }

    // Create the invoice
    const invoice = await stripe.invoices.create({
      customer: stripeCustomerId,
      auto_advance: true, // Automatically finalize the invoice
      metadata: metadata || {}, // Use empty object if no metadata
    });

    return NextResponse.json({ invoice }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating invoice:', error.message);
    return NextResponse.json(
      { error: error.message || 'Failed to create invoice' },
      { status: 500 }
    );
  }
}
