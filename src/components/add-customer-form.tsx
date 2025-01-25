"use client";

import { useRef, useState } from "react";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../../firebase";
import { toast } from "react-toastify";

interface AddCustomerFormProps {
  onClose: () => void;
  user: any;
  userStripe: string;
  onCustomerAdded?: (customerData: any) => void; // Optional callback for notifying the parent
}

export function AddCustomerForm({
  onClose,
  user,
  userStripe,
  onCustomerAdded,
}: AddCustomerFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const name = nameRef.current?.value;
    const email = emailRef.current?.value;
    const description = descriptionRef.current?.value;

    if (!name || !email || !description) {
      alert("All fields (name, email, description) are required.");
      return;
    }

    setIsLoading(true);
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
      });

      if (!response.ok) {
        throw new Error("Failed to add customer to Stripe");
      }

      const stripeCustomer = await response.json();

      if (!stripeCustomer?.id) {
        throw new Error("Failed to retrieve Stripe customer ID");
      }

      const userRef = doc(db, "users", user.uid);
      const customerData = {
        email,
        name,
        description,
        stripeCustomerId: stripeCustomer.id,
        connectedStripeAccountId: userStripe,
        createdAt: new Date(),
      };

      await updateDoc(userRef, {
        customers: arrayUnion(customerData),
      });

      toast.success("Customer added successfully!");
      onCustomerAdded?.(customerData); // Call the callback function if provided
      onClose();
    } catch (error) {
      console.error("Error adding customer:", error);
      toast.error("Error adding customer. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 p-4 md:p-0 flex items-center justify-center z-40 bg-black bg-opacity-95">
      <div className=" p-6 mt-8 shadow-md rounded-lg w-full max-w-xl">
        <h3 className="text-2xl lg:text-3xl text-white text-center font-semibold mb-4">
          Add Customer
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-white"
              >
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
              <label
                htmlFor="email"
                className="block text-sm font-medium text-white"
              >
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
              <label
                htmlFor="description"
                className="block text-sm font-medium text-white"
              >
                Description
              </label>
              <textarea
                id="description"
                ref={descriptionRef}
                className="mt-2 p-2 border border-gray-300 rounded-md w-full"
                required
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="mt-4 px-4 py-2 text-destructive  rounded-lg  font-semibold hover:opacity-60 duration-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="mt-4 hover:bg-opacity-60 duration-300 bg-confirm py-2 px-4 font-semibold rounded-md disabled:opacity-50"
              >
                {isLoading ? "Adding..." : "Add Customer"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
