'use client'

import { useRef, useState } from 'react'
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore'
import { db } from '../../firebase'  

interface AddCustomerFormProps {
  onClose: () => void
  user: any
  userStripe: string
}

export function AddCustomerForm({ onClose, user, userStripe }: AddCustomerFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const nameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const descriptionRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    const name = nameRef.current?.value
    const email = emailRef.current?.value
    const description = descriptionRef.current?.value

    if (!name || !email || !description) {
      alert("All fields (name, email, description) are required.")
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/stripe/add-customer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          name,
          description,
          connectId: userStripe,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to add customer to Stripe")
      }

      const stripeCustomer = await response.json()

      if (!stripeCustomer?.id) {
        throw new Error("Failed to retrieve Stripe customer ID")
      }

      const userRef = doc(db, "users", user.uid)
      await updateDoc(userRef, {
        customers: arrayUnion({
          email,
          name,
          description,
          stripeCustomerId: stripeCustomer.id,
          createdAt: new Date(),
        }),
      })

      alert("Customer added successfully!")
      onClose()
    } catch (error) {
      console.error("Error adding customer:", error)
      alert("Failed to add customer. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-500 bg-opacity-50">
      <div className="bg-white p-6 mt-8 shadow-md rounded-lg w-full max-w-xl">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">Add Customer</h3>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-600">
                Name
              </label>
              <input
                id="name"
                ref={nameRef}
                type="text"
                className="mt-2 p-2 border border-gray-300 rounded-md w-full"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-600">
                Email
              </label>
              <input
                id="email"
                ref={emailRef}
                type="email"
                className="mt-2 p-2 border border-gray-300 rounded-md w-full"
                required
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-600">
                Description
              </label>
              <textarea
                id="description"
                ref={descriptionRef}
                className="mt-2 p-2 border border-gray-300 rounded-md w-full"
                required
              />
            </div>
            <div className="flex justify-start gap-6">
              <button
                type="submit"
                disabled={isLoading}
                className="mt-4 px-6 py-2 bg-confirm text-white rounded-md hover:bg-destructive duration-300 disabled:opacity-50"
              >
                {isLoading ? "Adding..." : "Add Customer"}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="mt-4 text-destructive hover:text-confirm duration-300 rounded-md"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

