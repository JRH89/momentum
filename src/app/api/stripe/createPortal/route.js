import Stripe from "stripe";
import { NextResponse } from "next/server";

// Initialize the Stripe instance
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
    try {
        // Parse the request body
        const { userId, returnURL } = await request.json();

        // Debugging output
        console.log("Received request:", { userId, returnURL });

        // Use environment variable or default to localhost if empty or undefined
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
        const finalReturnUrl = returnURL?.trim() ? returnURL : `${baseUrl}/Dashboard/account`;
        console.log("Final Return URL:", finalReturnUrl);

        // Create a billing portal session
        const session = await stripe.billingPortal.sessions.create({
            customer: userId,
            return_url: finalReturnUrl,
        });

        console.log("Stripe session created:", session);

        return NextResponse.json({ url: session.url });
    } catch (error) {
        console.error("Error creating billing portal session:", error);
        return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
    }
}

export async function GET() {
    return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
}
