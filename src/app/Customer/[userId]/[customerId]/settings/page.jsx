"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "../../../../../context/AuthProvider";
import { redirect, useParams } from "next/navigation";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../../../../firebase";
import { Settings } from "lucide-react";

const Page = () => {
  const [loading, setLoading] = useState(true);
  const { userId, customerId } = useParams();
  const [stripeCustomerId, setStripeCustomerId] = useState(null);
  const [stripeAccountId, setStripeAccountId] = useState(null);
  const [invoicesPerPage, setInvoicesPerPage] = useState("");
  const [projectsPerPage, setProjectsPerPage] = useState("");
  const [customerData, setCustomerData] = useState(null);

  const { user } = useAuth();

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
            setInvoicesPerPage(customer.invoicesPerPage || 0); // Fallback to 0
            setProjectsPerPage(customer.projectsPerPage || 0); // Fallback to 0
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

  useEffect(() => {
    fetchCustomerData();
  }, [userId, customerId, user]);

  useEffect(() => {
    const updateCustomerData = async () => {
      if (customerData && userId && customerId) {
        try {
          const userRef = doc(db, "users", userId);

          const userDoc = await getDoc(userRef); // Re-fetch the user document
          if (userDoc.exists()) {
            const userData = userDoc.data();

            // Find the customer again to ensure it's the latest data
            const customer = userData.customers?.find(
              (c) => c.uid === customerId
            );

            if (customer) {
              const updatedCustomers = userData.customers.map((c) =>
                c.uid === customerId
                  ? {
                      ...customer,
                      invoicesPerPage: invoicesPerPage || 0, // Fallback to 0
                      projectsPerPage: projectsPerPage || 0, // Fallback to 0
                    }
                  : c
              );

              await updateDoc(userRef, { customers: updatedCustomers });
              console.log("User data updated successfully");
            } else {
              console.log("Customer not found in the customers array.");
            }
          }
        } catch (error) {
          console.error("Error updating user data:", error);
        }
      }
    };

    updateCustomerData();
  }, [invoicesPerPage, projectsPerPage, customerData, userId, customerId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user || user.uid !== customerId) {
    redirect("/Customer/login");
  }

  return (
    <div className="min-h-screen max-w-6xl mx-auto h-full w-full p-4 pt-4 text-black flex flex-col pb-24">
      <h1 className="text-3xl font-bold items-center text-left flex flex-row gap-2">
        <Settings className="w-8 h-8" /> Settings
      </h1>
      <div className="p-4 mt-2 gap-5 flex flex-col border-black border-2 rounded-lg shadow-md shadow-black">
        <div className="justify-start flex flex-col">
          <h2 className="text-2xl font-bold">Invoices</h2>
          <p className="my-2">Invoices per page: {invoicesPerPage}</p>
          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                setInvoicesPerPage(Math.max(invoicesPerPage - 1, 0))
              }
              className="p-2 bg-green-500 font-extrabold hover:bg-opacity-60 duration-300 border border-black rounded-md"
            >
              -
            </button>
            <input
              type="text"
              value={invoicesPerPage}
              onChange={(e) =>
                setInvoicesPerPage(parseInt(e.target.value) || 0)
              }
              className="w-full p-2 border rounded-md text-center"
            />
            <button
              onClick={() => setInvoicesPerPage(invoicesPerPage + 1)}
              className="p-2 bg-green-500 font-extrabold hover:bg-opacity-60 duration-300 border border-black rounded-md"
            >
              +
            </button>
          </div>
        </div>
        <div className="mt-5">
          <h2 className="text-2xl font-bold">Projects</h2>
          <p className="my-2">Projects per page: {projectsPerPage}</p>
          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                setProjectsPerPage(Math.max(projectsPerPage - 1, 0))
              }
              className="p-2 bg-green-500 font-extrabold hover:bg-opacity-60 duration-300 border border-black rounded-md"
            >
              -
            </button>
            <input
              type="text"
              value={projectsPerPage}
              onChange={(e) =>
                setProjectsPerPage(parseInt(e.target.value) || 0)
              }
              className="w-full p-2 border rounded-md text-center"
            />
            <button
              onClick={() => setProjectsPerPage(projectsPerPage + 1)}
              className="p-2 bg-green-500 font-extrabold hover:bg-opacity-60 duration-300 border border-black rounded-md"
            >
              +
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
