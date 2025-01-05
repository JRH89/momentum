import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_TEST_SECRET || "", {
  apiVersion: "2024-06-20",
});

interface invoiceItem {
  description: string;
  amount: string;
  currency: string;
  priceId: string;
}

export async function POST(req: NextRequest) {
  try {
    const { stripeCustomerId, stripeAccountId, items, dueDate } = await req.json();

    if (!stripeCustomerId || !stripeAccountId || !items || items.length === 0 || !dueDate) {
      return NextResponse.json(
        { error: "Stripe Customer ID, Stripe Account ID, valid items, and due date are required" },
        { status: 400 }
      );
    }

    const invoiceItems: invoiceItem[] = [];

    for (const item of items) {
      const unitAmountInCents = parseInt(item.amount, 10);
      if (isNaN(unitAmountInCents) || unitAmountInCents <= 0) {
        return NextResponse.json(
          { error: "Invalid amount. Please ensure the amount is greater than 0." },
          { status: 400 }
        );
      }

      const price = await stripe.prices.create(
        {
          unit_amount: unitAmountInCents,
          currency: item.currency,
          product_data: {
            name: item.description,
          },
        },
        { stripeAccount: stripeAccountId }
      );

      console.log(`Price created with ID: ${price.id}`);

      invoiceItems.push({
        description: item.description,
        amount: item.amount,
        currency: item.currency,
        priceId: price.id,
      });

      const invoiceItem = await stripe.invoiceItems.create(
        {
          customer: stripeCustomerId,
          price: price.id,
          quantity: 1,
        },
        { stripeAccount: stripeAccountId }
      );

      console.log(`Invoice Item created: ${invoiceItem.id} for price ID: ${price.id}`);
    }

    // Create the invoice with auto_advance: false
    const invoice = await stripe.invoices.create(
      {
        customer: stripeCustomerId,
        due_date: dueDate,
        collection_method: "send_invoice",
        auto_advance: false, // Disable auto-advance until all items are added
      },
      { stripeAccount: stripeAccountId }
    );

    console.log(`Invoice created with ID: ${invoice.id}`);

    // List invoice items associated with this invoice (for debugging)
    const invoiceItemsList = await stripe.invoiceItems.list({ invoice: invoice.id }, { stripeAccount: stripeAccountId });
    console.log("Invoice Items List:", invoiceItemsList);

    // Manually finalize the invoice once all items are added
    await stripe.invoices.finalizeInvoice(invoice.id, { stripeAccount: stripeAccountId });
    console.log(`Invoice finalized with ID: ${invoice.id}`);

    return NextResponse.json({ invoice, invoiceItems }, { status: 200 });
  } catch (error) {
    console.error("Error creating invoice:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
