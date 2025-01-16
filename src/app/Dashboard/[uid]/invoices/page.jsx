"use client";

import React, { useEffect, useState } from "react";
import InvoicesTable from "../../../../components/customer/InvoiceTable";
import { db, auth } from "../../../../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { FileText } from "lucide-react";

const Page = () => {
  const [invoices, setInvoices] = useState([]);
  const [stripeAccountId, setStripeAccountId] = useState(null);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const router = useRouter();

  useEffect(() => {
    // Listener for auth state changes
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        router.push("/Dashboard/login"); // Redirect if not authenticated
      }
      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, [router]);

  useEffect(() => {
    const fetchUserStripeAccountId = async (userId) => {
      try {
        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUserData(userSnap.data());
          setStripeAccountId(userSnap.data().stripeAccountId || null);
        } else {
          setError("User document not found");
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to fetch user data.");
      }
    };

    if (user) {
      fetchUserStripeAccountId(user.uid);
    }
  }, [user]);

  useEffect(() => {
    const fetchInvoices = async () => {
      if (!stripeAccountId) return;

      try {
        const response = await fetch(
          `/api/stripe/invoices/all?stripeAccountId=${stripeAccountId}`
        );
        const data = await response.json();

        if (response.ok && data.invoices) {
          setInvoices(data.invoices || []);
        } else {
          setError(data.error || "Failed to fetch invoices");
        }
      } catch (err) {
        console.error("Error fetching invoices:", err);
        setError("Failed to fetch invoices.");
      }
    };

    if (stripeAccountId) fetchInvoices();
  }, [stripeAccountId]);

  if (loading) {
    return <div>Loading...</div>; // Show loading state while auth is initializing
  }

  return (
    <div className="min-h-screen max-w-6xl mx-auto h-full w-full p-4 pt-4 text-black flex flex-col pb-24">
      <h1 className="text-3xl px-4 font-bold mb-2 flex flex-row gap-2 items-center">
        <FileText className="w-8 h-8" /> Invoices
      </h1>
      <div className="flex flex-col px-4">
        <InvoicesTable
          invoices={invoices}
          itemsPerPage={userData?.invoicesPerPage || 10}
        />
      </div>
    </div>
  );
};

export default Page;
