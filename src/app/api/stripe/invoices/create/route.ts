import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-06-20',
});

interface InvoiceItem {
  price: string;
  quantity: number;
}

export async function POST(req: NextRequest) {
  try {
    const { stripeCustomerId, stripeAccountId, items } = await req.json();

    if (!stripeCustomerId || !stripeAccountId || !items || items.length === 0) {
      return NextResponse.json(
        { error: 'Stripe Customer ID, Stripe Account ID, and valid items are required' },
        { status: 400 }
      );
    }

    // Create invoice items
    for (const item of items as InvoiceItem[]) {
      await stripe.invoiceItems.create(
        {
          customer: stripeCustomerId,
          price: item.price,
          quantity: item.quantity,
        },
        { stripeAccount: stripeAccountId }
      );
    }

    // Create invoice
    const invoice = await stripe.invoices.create(
      {
        customer: stripeCustomerId,
        auto_advance: true,
      },
      { stripeAccount: stripeAccountId }
    );

    return NextResponse.json(invoice, { status: 200 });
  } catch (error) {
    console.error('Error creating invoice:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
