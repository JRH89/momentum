'use server'

import { revalidatePath } from 'next/cache'

interface DisconnectResponse {
  success: boolean;
  error?: string;
}

export async function disconnectStripeAccount(stripeAccountId: string): Promise<DisconnectResponse> {
  if (!stripeAccountId) {
    return { success: false, error: 'No Stripe account ID provided' }
  }

  try {
    const response = await fetch('https://connect.stripe.com/oauth/deauthorize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.STRIPE_CLIENT_ID!,
        stripe_user_id: stripeAccountId,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return { 
        success: false, 
        error: errorData.error?.message || 'Failed to deauthorize Stripe account' 
      }
    }

    // Here you would update your database to remove the Stripe connection
    // Example with your existing Firebase code:
    // const userRef = doc(db, "users", userId)
    // await updateDoc(userRef, {
    //   stripeAccountId: null,
    //   stripeConnected: false,
    // })

    revalidatePath('/')
    return { success: true }
  } catch (error) {
    console.error('Error disconnecting Stripe account:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to disconnect Stripe account'
    }
  }
}

