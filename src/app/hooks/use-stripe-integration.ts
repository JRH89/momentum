'use client'

import { useState, useEffect } from 'react'
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore'
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
      if (user && userData?.stripeAccountId) {
        setLoadingCustomers(true)
        try {
          // Fetch customers from Stripe
          const response = await fetch(`/api/stripe/customers?stripeAccountId=${userData?.stripeAccountId}`)
          const stripeCustomers = await response.json()

          if (response.ok) {
            // Synchronize with Firestore
            await syncCustomersWithFirestore(stripeCustomers)
          } else {
            console.error("Error fetching customers:", stripeCustomers)
          }

          // Fetch Firestore customers after syncing
          await fetchFirestoreCustomers()
        } catch (error) {
          console.error("Error fetching customers:", error)
        } finally {
          setLoadingCustomers(false)
        }
      }
    }

    const syncCustomersWithFirestore = async (stripeCustomers: any[]) => {
      if (!user) return
      const userRef = doc(db, "users", user.uid)

      try {
        // Get current user data from Firestore
        const userSnapshot = await getDoc(userRef)
        if (userSnapshot.exists()) {
          const userDoc = userSnapshot.data()
          const existingCustomerIds = userDoc?.customers?.map((customer: any) => customer.stripeCustomerId) || []

          // Add missing customers to Firestore
          const newCustomers = stripeCustomers.filter((stripeCustomer: any) =>
            !existingCustomerIds.includes(stripeCustomer.id)
          )

          if (newCustomers.length > 0) {
            await updateDoc(userRef, {
              customers: arrayUnion(
                ...newCustomers.map((customer: any) => ({
                  stripeCustomerId: customer.id, // Map `id` to `stripeCustomerId`
                  email: customer.email,
                  name: customer.name || '',
                  created: customer.created,
                }))
              ),
            })
          }
        }
      } catch (error) {
        console.error("Error syncing customers with Firestore:", error)
      }
    }

    const fetchFirestoreCustomers = async () => {
      if (!user) return
      const userRef = doc(db, "users", user.uid)

      try {
        const userSnapshot = await getDoc(userRef)
        if (userSnapshot.exists()) {
          const userDoc = userSnapshot.data()
          setCustomers(userDoc?.customers || []) // Update Firestore customers
        }
      } catch (error) {
        console.error("Error fetching Firestore customers:", error)
      }
    }

    fetchAndSyncCustomers()
  }, [userData, user])

  const handleDisconnectStripe = async () => {
    if (!user) {
      alert("No user found")
      return
    }
    setIsDisconnecting(true)
    try {
      const response = await fetch("https://connect.stripe.com/oauth/deauthorize", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          client_id: process.env.NEXT_PUBLIC_STRIPE_CLIENT_ID!,
          stripe_user_id: userStripe,
        }),
      })

      if (response.ok) {
        const userRef = doc(db, "users", user.uid)
        await updateDoc(userRef, {
          stripeAccountId: null,
          stripeConnected: false,
        })
        alert("Stripe account successfully unlinked")
      } else {
        throw new Error("Failed to deauthorize Stripe account")
      }
    } catch (error) {
      console.error("Error disconnecting Stripe account:", error)
      alert("There was an error disconnecting your Stripe account.")
    } finally {
      setIsDisconnecting(false)
    }
  }

  return {
    customers, // Firestore customers
    loadingCustomers,
    isDisconnecting,
    handleDisconnectStripe,
  }
}
