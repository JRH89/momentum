import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_TEST_SECRET || '', {
  apiVersion: '2024-06-20',
});

export async function GET(req: Request) {
  const url = new URL(req.url);
  const stripeAccountId = url.searchParams.get('stripeAccountId');

  // Check for missing parameters
  if (!stripeAccountId) {
    return NextResponse.json(
      {
        error: 'Stripe Account ID is required',
      },
      { status: 400 }
    );
  }

  try {
    console.log('Fetching invoices for:', stripeAccountId);

    // List invoices with stripeAccount in options
    const invoices = await stripe.invoices.list(
      { limit: 100 }, // Adjust limit as needed
      { stripeAccount: stripeAccountId } // Specify the connected account
    );

    // Format invoice data
    const formattedInvoices = invoices.data.map((invoice) => ({
      id: invoice.id,
      status: invoice.status,
      amount_due: (invoice.amount_due / 100).toFixed(2), // Convert from cents to dollars
      currency: invoice.currency.toUpperCase(),
      due_date: invoice.due_date
        ? new Date(invoice.due_date * 1000).toLocaleDateString()
        : 'N/A', // Convert Unix timestamp to readable date
      number: invoice.number,
      hosted_invoice_url: invoice.hosted_invoice_url,
    }));

    return NextResponse.json(
      {
        success: true,
        invoices: formattedInvoices,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error fetching invoices:', error.message);

    return NextResponse.json(
      {
        error: 'Failed to fetch invoices',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
