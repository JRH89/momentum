import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_TEST_SECRET as string, {
    apiVersion: '2024-06-20',
});

export const updateStripeCustomerEmail = async (
    customerId: string,
    email: string,
    stripeAccountId: string
): Promise<Stripe.Customer> => {
    return stripe.customers.update(
        customerId,
        { email },
        { stripeAccount: stripeAccountId }
    );
}; 