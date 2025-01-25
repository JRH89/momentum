"use client";

import React, { useEffect, useState } from "react";
import { CustomerTable } from "../../../../components/customer-table";
import { useParams } from "next/navigation";
import { useStripeIntegration } from "../../../hooks/use-stripe-integration";
import { db, auth } from "../../../../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { AddCustomerForm } from "../../../../components/add-customer-form";
import { LoaderPinwheel, Plus, Users } from "lucide-react";
import { useRouter } from "next/navigation";

const Page = () => {
  const { uid } = useParams(); // Get the user ID from the route params
  const [userData, setUserData] = useState(null);
  const [userStripe, setUserStripe] = useState(null);
  const [openModal, setOpenModal] = useState(false);
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
      setLoading(false); // Auth state is determined
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, [router]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!uid) {
        console.error("User ID is missing");
        return;
      }

      try {
        // Reference the user document in the Firestore database
        const userRef = doc(db, "users", uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const fetchedUserData = userSnap.data(); // Fetch user data
          setUserData(fetchedUserData); // Set user data
          setUserStripe(fetchedUserData.stripeAccountId || null); // Set Stripe account ID
        } else {
          console.warn(`No document found for user ID: ${uid}`);
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };

    fetchUserData();
  }, [uid]);

  // Hook to fetch Stripe customers based on user data
  const { customers, loadingCustomers, setCustomers } = useStripeIntegration({
    user,
    userData,
    userStripe,
  });

  const handleCustomerAdded = (customerData) => {
    console.log("New customer added:", customerData);
    setCustomers((prevCustomers) => [...prevCustomers, customerData]); // Update the customer list
  };

  const handleDeleteCustomer = (customerId) => {
    setCustomers((prevCustomers) =>
      prevCustomers.filter(
        (customer) => customer.stripeCustomerId !== customerId
      )
    );
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
        <div className="flex items-center justify-start gap-4 mb-2">
          <h1 className="text-3xl px-0 sm:px-4 my-auto flex flex-row items-center font-bold gap-2">
            <Users className="w-8 h-8" /> Customers
            <span>
              <button
                className="flex text-xl font-semibold flex-row items-center"
                onClick={() => setOpenModal(true)}
              >
                [
                <Plus className="w-6 h-6 flex flex-row  text-green-500 hover:rotate-90 duration-300" />
                ]
              </button>
            </span>
          </h1>
        </div>

        {loadingCustomers ? (
          <p className="px-4 text-gray-600">Loading customers...</p>
        ) : (
          <CustomerTable
            onDeleteCustomer={handleDeleteCustomer}
            customers={customers}
            userId={uid}
            itemsPerPage={userData?.customersPerPage || 8}
          />
        )}
        {openModal && (
          <AddCustomerForm
            onClose={() => setOpenModal(false)}
            user={user}
            userStripe={userStripe}
            onCustomerAdded={handleCustomerAdded}
          />
        )}
      </div>
    </>
  );
};

export default Page;
