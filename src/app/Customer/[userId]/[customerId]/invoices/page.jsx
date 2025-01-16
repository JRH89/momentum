"use client";

import React, { useEffect, useState } from "react";
import InvoicesTable from "../../../../../components/customer/InvoiceTable";
import { useParams, useRouter } from "next/navigation";
import { db, auth } from "../../../../../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { FileTextIcon } from "lucide-react";

const Page = () => {
  const { userId, customerId } = useParams();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stripeAccountId, setStripeAccountId] = useState(null);
  const [stripeCustomerId, setStripeCustomerId] = useState(null);
  const [customerData, setCustomerData] = useState(null);

  const [user, setUser] = useState(null);

  const router = useRouter();

  useEffect(() => {
    // Listener for auth state changes
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        router.push("/Customer/login"); // Redirect if not authenticated
      }
      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, [user, router]);

  useEffect(() => {
    const fetchCustomerData = async () => {
      if (user && userId && customerId) {
        try {
          const userRef = doc(db, "users", userId);
          const userDoc = await getDoc(userRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();

            const customer = userData.customers?.find(
              (c) => c.uid === customerId
            );

            if (customer) {
              setCustomerData(customer);
              setStripeCustomerId(customer.stripeCustomerId);
              setStripeAccountId(userData.stripeAccountId);
            } else {
              console.log("Customer not found in the customers array.");
            }
          } else {
            console.log("User document not found");
          }
        } catch (error) {
          console.error("Error fetching customer data:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchCustomerData();
  }, [userId, customerId, user]);

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
          setLoading(false);
        } else {
          setError(data.error || "Failed to fetch invoices");
        }
      } catch (err) {
        console.error("Error fetching invoices:", err);
        setError("Failed to fetch invoices.");
      }
    };

    if (stripeAccountId && stripeCustomerId) fetchInvoices();
  }, [stripeAccountId, stripeCustomerId]);

  if (loading) {
    return (
      <div className="min-h-screen max-w-6xl mx-auto h-full w-full p-4 pt-4 text-black flex flex-col pb-24">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-6xl mx-auto h-full w-full p-4 pt-4 text-black flex flex-col pb-24">
      <h3 className="text-3xl font-bold mb-4 flex flex-row gap-2 items-center">
        <FileTextIcon className="w-8 h-8" />
        Invoices
      </h3>
      <InvoicesTable itemsPerPage={10} invoices={invoices} />
    </div>
  );
};

export default Page;
