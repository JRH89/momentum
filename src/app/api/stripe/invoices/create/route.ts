import { NextResponse } from 'next/server';
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_TEST_SECRET || "", {
  apiVersion: "2024-06-20",
});

export async function POST(req: Request) {
  try {
    const { stripeCustomerId, stripeAccountId, items, dueDate } = await req.json();

    if (!stripeCustomerId || !stripeAccountId || !items || items.length === 0) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create invoice items first and store their IDs
    const createdItems = [];
    for (const item of items) {
      const unitAmountInCents = parseInt(item.amount, 10);
      console.log(`Creating invoice item: ${unitAmountInCents} ${item.currency}`);

      // Create invoice item directly without creating a price first
      const invoiceItem = await stripe.invoiceItems.create(
        {
          customer: stripeCustomerId,
          amount: unitAmountInCents,
          currency: item.currency,
          description: item.description,
        },
        { stripeAccount: stripeAccountId }
      );

      console.log(`Created invoice item: ${invoiceItem.id}`);
      createdItems.push(invoiceItem);
    }

    // Verify invoice items were created
    if (createdItems.length === 0) {
      throw new Error('No invoice items were created');
    }

    // Create the invoice
    const invoice = await stripe.invoices.create(
      {
        customer: stripeCustomerId,
        due_date: dueDate,
        collection_method: "send_invoice",
        auto_advance: true,
        pending_invoice_items_behavior: 'include',
      },
      { stripeAccount: stripeAccountId }
    );

    // Verify the invoice amount
    const draftInvoice = await stripe.invoices.retrieve(invoice.id, {
      stripeAccount: stripeAccountId,
    });

    console.log('Draft Invoice Amount:', draftInvoice.amount_due);
    console.log('Invoice Items:', draftInvoice.lines.data);

    if (draftInvoice.amount_due === 0) {
      // Instead of throwing an error, let's get more information
      console.log('Invoice creation details:', {
        invoiceId: draftInvoice.id,
        items: createdItems,
        amount: draftInvoice.amount_due,
        lines: draftInvoice.lines.data
      });
    }

    // Finalize the invoice
    const finalizedInvoice = await stripe.invoices.finalizeInvoice(
      invoice.id,
      { stripeAccount: stripeAccountId }
    );

    return NextResponse.json({ 
      invoice: finalizedInvoice,
      items: createdItems 
    });

  } catch (error) {
    console.error("Error creating invoice:", error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : "Internal Server Error",
      details: error
    }, { status: 500 });
  }
}

