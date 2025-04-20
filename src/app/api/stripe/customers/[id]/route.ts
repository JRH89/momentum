import Stripe from 'stripe';
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

const stripe = new Stripe(process.env.STRIPE_TEST_SECRET as string, {
    apiVersion: '2024-06-20',
});

export const POST = async (
    request: NextRequest,
    context: { params: { id: string } }
) => {
    try {
        const { email, stripeAccountId } = await request.json();

        if (!email || !stripeAccountId) {
            return NextResponse.json(
                { error: 'Email and stripeAccountId are required' },
                { status: 400 }
            );
        }

        // Update the customer in Stripe
        const updatedCustomer = await stripe.customers.update(
            context.params.id,
            { email },
            { stripeAccount: stripeAccountId }
        );

        return NextResponse.json({ customer: updatedCustomer });
    } catch (error) {
        console.error('Error updating Stripe customer:', error);
        return NextResponse.json(
            { error: 'Failed to update customer' },
            { status: 500 }
        );
    }
} 