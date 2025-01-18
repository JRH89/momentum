import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_TEST_SECRET);

export async function POST(req) {
    try {
        const body = await req.json();

        const { stripe_user_id } = body;

        if (!stripe_user_id) {
            return new Response(
                JSON.stringify({ error: "Missing Stripe user ID" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        const response = await stripe.oauth.deauthorize({
            client_id: process.env.NEXT_PUBLIC_STRIPE_CLIENT_ID,
            stripe_user_id,
        });

        return new Response(
            JSON.stringify({ success: true, response }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    } catch (error) {
        console.error("Error during Stripe deauthorization:", error);
        return new Response(
            JSON.stringify({ error: "Failed to deauthorize Stripe account" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}
