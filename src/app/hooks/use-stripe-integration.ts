'use client'

import { useState, useEffect } from 'react'
import { doc, getDoc, updateDoc, arrayUnion, setDoc } from 'firebase/firestore'
import { db } from '../../../firebase'
import type { User } from 'firebase/auth'

interface UseStripeIntegrationProps {
  user: User | null
  userData: any
  userStripe: string
}

export function useStripeIntegration({ user, userData, userStripe }: UseStripeIntegrationProps) {
  const [customers, setCustomers] = useState([]) // Firestore customers
  const [loadingCustomers, setLoadingCustomers] = useState(false)
  const [isDisconnecting, setIsDisconnecting] = useState(false)

  useEffect(() => {
    const fetchAndSyncCustomers = async () => {
      if (!user || !userData?.stripeAccountId) return
      setLoadingCustomers(true)
      try {
        // Fetch customers from Stripe
        const response = await fetch(`/api/stripe/customers?stripeAccountId=${userData?.stripeAccountId}`)
        const stripeCustomers = await response.json()

        if (response.ok) {
          await syncCustomersWithFirestore(stripeCustomers)
        } else {
          console.error('Error fetching Stripe customers:', stripeCustomers)
        }

        await fetchFirestoreCustomers()
      } catch (error) {
        console.error('Error fetching and syncing customers:', error)
      } finally {
        setLoadingCustomers(false)
      }
    }

const syncCustomersWithFirestore = async (stripeCustomers: any) => {
  if (!user) return;
  const userRef = doc(db, "users", user.uid);

  try {
    // Log the structure of stripeCustomers to verify its contents
    console.log("stripeCustomers:", stripeCustomers);

    // Access the customers array correctly
    const customersData = stripeCustomers?.customers || []; // Accessing the 'customers' field in stripeCustomers

    // Check if customersData is an array
    if (Array.isArray(customersData)) {
      const userSnapshot = await getDoc(userRef);
      if (userSnapshot.exists()) {
        const userDoc = userSnapshot.data();
        const existingCustomerIds =
          userDoc?.customers?.map((customer: any) => customer.stripeCustomerId) || [];

        // Filter out existing customers
        const newCustomers = customersData.filter(
          (stripeCustomer: any) => !existingCustomerIds.includes(stripeCustomer.id)
        );

        if (newCustomers.length > 0) {
          await updateDoc(userRef, {
            customers: arrayUnion(
              ...newCustomers.map((customer: any) => ({
                stripeCustomerId: customer.id,
                email: customer.email,
                name: customer.name || "",
                created: customer.created,
              }))
            ),
          });
        }
      }
    } else {
      console.error("stripeCustomers.customers is not an array:", customersData);
    }
  } catch (error) {
    console.error("Error syncing customers with Firestore:", error);
  }
};


    const fetchFirestoreCustomers = async () => {
      if (!user) return
      const userRef = doc(db, 'users', user.uid)

      try {
        const userSnapshot = await getDoc(userRef)
        if (userSnapshot.exists()) {
          setCustomers(userSnapshot.data()?.customers || [])
        } else {
          console.warn('User document does not exist.')
          setCustomers([])
        }
      } catch (error) {
        console.error('Error fetching Firestore customers:', error)
      }
    }

    fetchAndSyncCustomers()
  }, [user, userData])

  const handleDisconnectStripe = async () => {
    if (!user) {
      alert('No user found')
      return
    }
   
    if (window.confirm('Are you sure you want to disconnect your Stripe account?')) {
        setIsDisconnecting(true)
      try {
      const response = await fetch('https://connect.stripe.com/oauth/deauthorize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: process.env.NEXT_PUBLIC_STRIPE_CLIENT_ID!,
          stripe_user_id: userStripe,
        }),
      })

      if (response.ok) {
        const userRef = doc(db, 'users', user.uid)
        await updateDoc(userRef, {
          stripeAccountId: null,
          stripeConnected: false,
        })
        alert('Stripe account successfully unlinked')
      } else {
        throw new Error('Failed to deauthorize Stripe account')
      }
    } catch (error) {
      console.error('Error disconnecting Stripe account:', error)
      alert('There was an error disconnecting your Stripe account.')
    } finally {
      setIsDisconnecting(false)
    }
  }
    }
   
  return {
    customers,
    loadingCustomers,
    isDisconnecting,
    handleDisconnectStripe,
  }
}
