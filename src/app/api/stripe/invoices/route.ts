import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_TEST_SECRET || '', {
  apiVersion: '2024-06-20',
});

export async function GET(req: Request) {
  const url = new URL(req.url);
  const stripeAccountId = url.searchParams.get('stripeAccountId');
  const stripeCustomerId = url.searchParams.get('stripeCustomerId');

  // Check for missing parameters
  if (!stripeAccountId || !stripeCustomerId) {
    return NextResponse.json(
      {
        error: 'Both Stripe Account ID and Customer ID are required',
      },
      { status: 400 }
    );
  }

  try {
    console.log('Fetching invoices for:', stripeAccountId, stripeCustomerId);

    const invoices = await stripe.invoices.list(
      {
        customer: stripeCustomerId,
        limit: 10, // You can adjust this number if needed
      },
      {
        stripeAccount: stripeAccountId, // Specify the connected account ID
      }
    );

    // Format invoice data to return only necessary fields
    const formattedInvoices = invoices.data.map((invoice) => ({
      id: invoice.id,
      status: invoice.status,
      amount_due: (invoice.amount_due / 100).toFixed(2), // Convert from cents to dollars
      currency: invoice.currency.toUpperCase(),
      due_date: invoice.due_date ? new Date(invoice.due_date * 1000).toLocaleDateString() : 'N/A', // Convert Unix timestamp to readable date
      number: invoice.number,
      hosted_invoice_url: invoice.hosted_invoice_url,
    }));

    // Log concise information for each invoice (without full invoice data)
    formattedInvoices.forEach((invoice) => {
      console.log(`Invoice ID: ${invoice.id}`);
      console.log(`Status: ${invoice.status}`);
      console.log(`Amount Due: $${invoice.amount_due}`);
      console.log(`Due Date: ${invoice.due_date}`);
      console.log(`Invoice Number: ${invoice.number}`);
      console.log(`Hosted Invoice URL: ${invoice.hosted_invoice_url}`);
      console.log('---'); // Just a separator for better readability
    });

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
        details: error.message, // Include the error message for better understanding
      },
      { status: 500 }
    );
  }
}
