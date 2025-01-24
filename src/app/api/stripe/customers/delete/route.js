// src/app/api/stripe/customers/delete/route.js

import Stripe from "stripe";
import { db } from "../../../../../../firebase"; // Adjust the path if needed
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { NextResponse } from "next/server"; // Import NextResponse

const stripe = new Stripe(process.env.STRIPE_TEST_SECRET, {
  apiVersion: "2023-08-16",
});

export async function DELETE(req) {
  try {
    const { stripeCustomerId, stripeAccountId, userId } = await req.json(); // Parse the request body

    // Delete the customer in Stripe
    await stripe.customers.del(stripeCustomerId, {
      stripeAccount: stripeAccountId,
    });

    // Reference the user's Firestore document
    const userDocRef = doc(db, "users", userId); // Use userId from request

    // Fetch user data
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
      throw new Error("User document not found");
    }

    const userData = userDocSnap.data();

    // Filter out the customer from the "customers" array
    const updatedCustomers = userData.customers?.filter(
      (customer) => customer.stripeCustomerId !== stripeCustomerId
    );

    // Update the user's document with the modified customers array
    await updateDoc(userDocRef, {
      customers: updatedCustomers,
    });

    // Return a proper NextResponse
    return NextResponse.json({ message: "Customer deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting customer:", error);
    return NextResponse.json(
      { error: "Failed to delete customer" },
      { status: 500 }
    );
  }
}
