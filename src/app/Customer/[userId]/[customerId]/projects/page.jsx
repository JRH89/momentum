"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { db, auth } from "../../../../../../firebase";
import { doc, getDoc } from "firebase/firestore";
import Link from "next/link";
import { BriefcaseIcon, LoaderPinwheel } from "lucide-react";
import MilestoneProgress from "../../../../../components/ProgressBar";

const Page = () => {
  const { userId, customerId } = useParams();
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
  }, [router]);

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

  if (loading)
    return (
      <div className="min-h-screen my-auto items-center justify-center max-w-6xl mx-auto h-full w-full p-4 pt-4 text-black flex flex-col pb-24">
        <LoaderPinwheel className="animate-spin duration-300 w-8 h-8" />
      </div>
    );

  return (
    <div className="min-h-screen max-w-6xl mx-auto h-full w-full p-4 pt-4 mt-2 text-black flex flex-col pb-24">
      <h2 className="text-3xl px-0 sm:px-4 font-bold mb-2 flex flex-row items-center gap-2">
        <BriefcaseIcon className="w-8 h-8" />
        Projects
      </h2>
      {customerData && customerData.projects?.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-0 sm:px-8">
          {customerData.projects.map((project, index) => (
            <Link
              className="flex flex-col h-full my-auto"
              key={index}
              href={`/Customer/${userId}/${customerId}/${project.id}`}
            >
              <div className="bg-[#EAEEFE] h-full duration-300 hover:shadow-lg hover:shadow-black border-2 border-black shadow-black rounded-lg shadow-md p-4">
                <h3 className="text-lg font-bold text-black mb-2">
                  {project.name}
                </h3>
                <p className="text-gray-600 text-sm">ID: {project.id}</p>
                <p className="text-gray-600 text-sm mb-2">
                  Descripion: {project.description}
                </p>
                <MilestoneProgress milestones={project.milestones} />
              </div>
            </Link>
          ))}
        </div>
      )}
      {customerData &&
        (customerData.projects?.length === 0 || !customerData.projects) && (
          <p className="text-gray-600 px-0 sm:px-8 text-sm mb-2">
            No projects found.
          </p>
        )}
    </div>
  );
};

export default Page;
