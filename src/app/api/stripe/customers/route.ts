import Stripe from 'stripe';

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_TEST_SECRET as string, {
  apiVersion: '2024-06-20', // Use the appropriate API version
});

// Define the request handler
export async function GET(req: Request) {
  try {
    // Get query parameters from the request URL
    const url = new URL(req.url);
    const stripeAccountId = url.searchParams.get('stripeAccountId');

    if (!stripeAccountId) {
      return new Response(
        JSON.stringify({ error: 'Missing stripeAccountId' }),
        { status: 400 }
      );
    }

    // Retrieve customers for the given account
    const customers = await stripe.customers.list(
      {
        limit: 10, // You can change this limit
      },
      {
        stripeAccount: stripeAccountId, // Specify the connected Stripe account
      }
    );

    // Return the list of customers
    return new Response(JSON.stringify(customers.data), { status: 200 });
  } catch (error) {
    console.error('Error fetching customers:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch customers' }),
      { status: 500 }
    );
  }
}
