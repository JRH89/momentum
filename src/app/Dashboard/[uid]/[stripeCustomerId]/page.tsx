"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { db } from "../../../../../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { StripeCustomer } from "../../../../components/types/stripeCustomer";
import Projects from "../../../../components/client/Projects";
import { LoaderPinwheel, Plus } from "lucide-react";
import InvoicesTable from "../../../../components/customer/InvoiceTable";
import { deleteApp, initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signOut,
} from "@firebase/auth";
import { toast } from "react-toastify";

const CustomerDetailsPage: React.FC = () => {
  const { uid, stripeCustomerId } = useParams() as {
    uid: string;
    stripeCustomerId: string;
  };
  const [stripeAccountId, setStripeAccountId] = useState<string | null>(null);
  const [customerData, setCustomerData] = useState<StripeCustomer | null>(null);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [invoiceAmount, setInvoiceAmount] = useState<string>("");
  const [invoiceCurrency, setInvoiceCurrency] = useState<string>("usd");
  const [invoiceDescription, setInvoiceDescription] = useState<string>("");
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);
  const [invoiceDueDate, setInvoiceDueDate] = useState<string>("");
  const [userData, setUserData] = useState<any>(null);
  const [customerEmail, setCustomerEmail] = useState<string>("");

  useEffect(() => {
    const fetchUserStripeAccountId = async (userId: string) => {
      try {
        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUserData(userSnap.data());
          setStripeAccountId(userSnap.data().stripeAccountId || null);
        } else {
          toast.error("User document not found");
        }
      } catch (err) {
        toast.error("Failed to fetch user data.");
      }
    };

    if (uid) fetchUserStripeAccountId(uid);
  }, [uid]);

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        const userRef = doc(db, "users", uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          const customers = Array.isArray(userData.customers)
            ? userData.customers
            : [];
          const customer = customers.find(
            (cust: StripeCustomer) => cust.stripeCustomerId === stripeCustomerId
          );
          if (customer) {
            setCustomerData(customer);
            setCustomerEmail(customer.email || "");
          } else toast.error("Customer not found in user document.");
        } else {
          toast.error("User document not found.");
        }
      } catch (err) {
        toast.error("Failed to load customer data.");
      }
    };

    if (stripeAccountId) fetchCustomerData();
  }, [stripeAccountId, stripeCustomerId, uid]);

  useEffect(() => {
    const fetchInvoices = async () => {
      if (!stripeAccountId || !stripeCustomerId) return;

      try {
        const response = await fetch(
          `/api/stripe/invoices?stripeAccountId=${stripeAccountId}&stripeCustomerId=${stripeCustomerId}`
        );
        const data = await response.json();

        if (response.ok && data.invoices) {
          setInvoices(data.invoices || []);
        } else {
          toast.error(data.error || "Failed to fetch invoices");
        }
      } catch (err) {
        toast.error("Failed to fetch invoices.");
      }
    };

    if (stripeAccountId && stripeCustomerId) fetchInvoices();
  }, [stripeAccountId, stripeCustomerId]);

  useEffect(() => {
    if (stripeAccountId || error || invoices.length > 0) {
      setLoading(false);
    }
  }, [stripeAccountId, error, invoices]);

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !invoiceAmount ||
      !invoiceCurrency ||
      !invoiceDescription ||
      !invoiceDueDate
    ) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const response = await fetch(`/api/stripe/invoices/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          stripeAccountId,
          stripeCustomerId,
          items: [
            {
              amount: Math.round(parseFloat(invoiceAmount) * 100), // Convert to cents and ensure it's a number
              currency: invoiceCurrency.toLowerCase(),
              description: invoiceDescription,
              quantity: 1,
            },
          ],
          dueDate: Math.floor(new Date(invoiceDueDate).getTime() / 1000),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create invoice");
      }

      let newCustomerUid: string | null = null; // To store the newly created customer's UID

      try {
        // Fetch user document
        const userRef = doc(db, "users", uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const userData = userSnap.data();
          const customers = Array.isArray(userData.customers)
            ? userData.customers
            : [];
          const customer = customers.find(
            (cust: { stripeCustomerId: string }) =>
              cust.stripeCustomerId === stripeCustomerId
          );

          if (customer) {
            try {
              // Initialize a temporary Firebase app instance
              const tempApp = initializeApp(
                {
                  apiKey: process.env.NEXT_PUBLIC_APIKEY,
                  authDomain: process.env.NEXT_PUBLIC_AUTHDOMAIN,
                  projectId: process.env.NEXT_PUBLIC_PROJECTID,
                  storageBucket: process.env.NEXT_PUBLIC_STORAGEBUCKET,
                  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGINGSENDERID,
                  appId: process.env.NEXT_PUBLIC_APPID,
                },
                "new-app"
              );

              const tempAuth = getAuth(tempApp);

              // Create a Firebase Auth user for the customer
              const userCredential = await createUserWithEmailAndPassword(
                tempAuth,
                customerEmail,
                "DefaultSecurePassword123!" // You can change this to something more secure
              );

              // Immediately sign out to prevent auto sign-in
              await signOut(tempAuth);

              newCustomerUid = userCredential.user.uid; // Store the new customer's UID

              // Clean up by deleting the temporary app instance
              await deleteApp(tempApp);
            } catch (authError: any) {
              if (authError.code !== "auth/email-already-in-use") {
                throw authError;
              } else {
                // If the user already exists, retrieve their UID
                const existingUserRef = await getDoc(
                  doc(db, "users", customerEmail)
                );
                if (existingUserRef.exists()) {
                  newCustomerUid = existingUserRef.id; // Retrieve existing UID
                }
              }
            }

            // If a new customer UID was created, update the customer with the matching stripeCustomerId
            if (newCustomerUid) {
              const updatedCustomers = customers.map(
                (cust: { stripeCustomerId: string; uid: string }) => {
                  if (cust.stripeCustomerId === stripeCustomerId) {
                    return { ...cust, uid: newCustomerUid }; // Add updated projects
                  }
                  return cust; // Keep other customers unchanged
                }
              );

              // Update Firestore with the modified customers array
              await updateDoc(userRef, {
                customers: updatedCustomers,
              });
            }
          }
        }
      } catch (err: any) {
        toast.error("Error updating user document: " + err.message);
      }

      setInvoices((prevInvoices) => [...prevInvoices, data.invoice]);
      setShowInvoiceForm(false);
      toast.success("Invoice created successfully!");

      // Reset form
      setInvoiceAmount("");
      setInvoiceCurrency("usd");
      setInvoiceDescription("");
      setInvoiceDueDate("");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to create invoice"
      );
    }
  };

  if (loading)
    return (
      <div className="min-h-screen my-auto items-center justify-center max-w-6xl mx-auto h-full w-full p-4 pt-4 text-black flex flex-col pb-24">
        <LoaderPinwheel className="animate-spin duration-300 w-8 h-8" />
      </div>
    );

  return (
    <>
      <div className="min-h-screen max-w-6xl mx-auto h-full w-full p-4 pt-4 text-black flex flex-col pb-24">
        {customerData && (
          <div className="flex flex-col">
            <h2 className="text-2xl lg:text-3xl font-bold text-black">
              Customer Details
            </h2>
            <p className="font-semibold">Name: {customerData.name}</p>
            <p className="font-semibold">
              Email:{" "}
              <a
                className="text-confirm hover:underline"
                href={`mailto:${customerData.email}`}
              >
                {customerData.email}
              </a>
            </p>
            <p className="font-semibold">
              Stripe Customer ID: {customerData.stripeCustomerId}
            </p>
            {customerData.uid && (
              <p className="font-semibold">User ID: {customerData.uid}</p>
            )}
          </div>
        )}
        <div className="mt-6">
          <div className="flex justify-start items-center">
            <h3 className="text-2xl font-semibold">Invoices</h3>
            <button
              type="button"
              onClick={() => setShowInvoiceForm(!showInvoiceForm)}
              className=" hover:bg-opacity-60 transition duration-300 ease-in-out items-center font-semibold flex flex-row px-4 py-2 text-lg rounded-lg"
            >
              [
              <Plus className="w-6 h-6 flex text-green-500 hover:rotate-90 duration-300" />
              ]
            </button>
          </div>
          {showInvoiceForm && (
            <form
              className="fixed z-40 inset-0 bg-black/95 flex items-center justify-center min-h-screen h-full w-full flex-col px-4"
              onSubmit={handleCreateInvoice}
            >
              <div className="p-6 rounded-lg shadow-md w-full max-w-xl">
                <h2 className="text-2xl text-white text-center font-semibold mb-4">
                  Create Invoice
                </h2>
                <div className="mt-2">
                  <label htmlFor="amount" className="block text-white">
                    Amount
                  </label>
                  <input
                    id="amount"
                    type="number"
                    value={invoiceAmount}
                    onChange={(e) => setInvoiceAmount(e.target.value)}
                    required
                    className="w-full p-2 border border-black rounded-md"
                  />
                </div>
                <div className="mt-2">
                  <label htmlFor="currency" className="block text-white">
                    Currency
                  </label>
                  <input
                    id="currency"
                    type="text"
                    value={invoiceCurrency}
                    onChange={(e) => setInvoiceCurrency(e.target.value)}
                    required
                    className="w-full p-2 border border-black rounded-md"
                  />
                </div>
                <div className="mt-2">
                  <label htmlFor="description" className="block text-white">
                    Description
                  </label>
                  <input
                    id="description"
                    type="text"
                    value={invoiceDescription}
                    onChange={(e) => setInvoiceDescription(e.target.value)}
                    required
                    className="w-full p-2 border border-black rounded-md"
                  />
                </div>
                <div className="mt-2">
                  <label htmlFor="dueDate" className="block text-white">
                    Due Date
                  </label>
                  <input
                    id="dueDate"
                    type="date"
                    value={invoiceDueDate}
                    onChange={(e) => setInvoiceDueDate(e.target.value)}
                    required
                    className="w-full p-2 border border-black rounded-md"
                  />
                </div>
                <div className="flex flex-row justify-end">
                  <button
                    type="button"
                    onClick={() => setShowInvoiceForm(false)}
                    className="mt-4 text-destructive hover:opacity-60 duration-300 ease-in-out py-2 px-4 rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="mt-4 bg-confirm hover:bg-opacity-60 duration-300 ease-in-out text-black py-2 px-4 rounded-md"
                  >
                    Create Invoice
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
        <div className="mt-0">
          <InvoicesTable
            invoices={invoices}
            itemsPerPage={userData?.invoicesPerPage || 10}
          />
        </div>
        {customerData && customerData.email ? (
          <Projects
            uid={uid}
            stripeCustomerId={stripeCustomerId}
            customerEmail={customerData.email}
          />
        ) : (
          <p>Loading or invalid customer data...</p>
        )}
      </div>
    </>
  );
};

export default CustomerDetailsPage;
