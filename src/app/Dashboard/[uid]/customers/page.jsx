"use client";

import React, { useEffect, useState } from "react";
import { CustomerTable } from "../../../../components/customer-table";
import { useParams } from "next/navigation";
import { useStripeIntegration } from "../../../hooks/use-stripe-integration";
import { useAuth } from "../../../../context/AuthProvider";
import { db } from "../../../../../firebase";
import { doc, getDoc } from "firebase/firestore";
import Footer from "../../../../components/footer";
import { AddCustomerForm } from "../../../../components/add-customer-form";
import { Plus } from "lucide-react";

const Page = () => {
  const { uid } = useParams(); // Get the user ID from the route params
  const { user } = useAuth(); // Get the authenticated user
  const [userData, setUserData] = useState(null);
  const [userStripe, setUserStripe] = useState(null);
  const [openModal, setOpenModal] = useState(false);

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
  const { customers, loadingCustomers } = useStripeIntegration({
    user,
    userData,
    userStripe,
  });

  return (
    <>
      <div className="min-h-screen max-w-6xl mx-auto h-full w-full p-4 pt-0 text-black flex flex-col pb-24">
        <div className="flex items-center justify-start gap-4 mb-2">
          <h1 className="text-3xl px-4 my-auto flex flex-row items-center font-bold ">
            Customers
          </h1>
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
        </div>

        {loadingCustomers ? (
          <p className="px-4 text-gray-600">Loading customers...</p>
        ) : (
          <CustomerTable
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
          />
        )}
      </div>
      <Footer />
    </>
  );
};

export default Page;
