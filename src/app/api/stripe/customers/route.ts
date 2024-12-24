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
    
    // Handle pagination and set defaults for limit and page
    const limit = parseInt(url.searchParams.get('limit') || '10', 10); // Default limit is 10
    const page = parseInt(url.searchParams.get('page') || '1', 10); // Default page is 1
    const startingAfter = url.searchParams.get('starting_after') ?? undefined; // Convert null to undefined

    if (!stripeAccountId) {
      return new Response(
        JSON.stringify({ error: 'Missing stripeAccountId' }),
        { status: 400 }
      );
    }

    // Retrieve customers for the given account with pagination
    const customers = await stripe.customers.list(
      {
        limit, // Set the number of customers per page
        starting_after: startingAfter, // Pagination: get the next page of results
      },
      {
        stripeAccount: stripeAccountId, // Specify the connected Stripe account
      }
    );

    // Get the next page starting_after (if exists) for pagination
    const nextStartingAfter = customers.has_more
      ? customers.data[customers.data.length - 1].id
      : null;

    // Return the list of customers along with pagination info
    return new Response(
      JSON.stringify({
        customers: customers.data,
        nextPage: nextStartingAfter,
        hasMore: customers.has_more,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching customers:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch customers' }),
      { status: 500 }
    );
  }
}
