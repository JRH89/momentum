"use client";

import { useAuth } from "../../context/AuthProvider";
import { initFirebase } from "../../../firebase";
import { Lock, Unlock } from "lucide-react";
import { getPremiumStatus } from "../payments/account/GetPremiumStatus";
import { getAuth } from "@firebase/auth";
import LoginForm from "./SignIn";
import Announcements from "./Announcements";
import UserTickets from "./UserTickets";

import React, { useState, useEffect, FormEvent, useRef } from "react";
import { db } from "../../../firebase";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getFirestore,
  updateDoc,
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus, PlusIcon } from "lucide-react";

const Dashboard = () => {
  const { user, loading: userLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);

  // User info
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState(null);

  // Subscription stuff
  const app = initFirebase();
  const auth = getAuth(app);
  const firestore = getFirestore(app);
  const [isPremium, setIsPremium] = useState(false);

  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  const [isAddingCustomer, setIsAddingCustomer] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [userStripe, setUserStripe] = useState();

  const router = useRouter();
  const stripeClientId = process.env.NEXT_PUBLIC_STRIPE_CLIENT_ID;

  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const descriptionRef = useRef(null);

  // Fetch premium status
  useEffect(() => {
    const fetchPremiumStatus = async () => {
      try {
        const newPremiumStatus = user ? await getPremiumStatus(app) : false;
        setIsPremium(newPremiumStatus);
      } catch (error) {
        console.error("Error fetching premium status:", error.message);
      }
    };

    fetchPremiumStatus();
  });

  useEffect(() => {
    if (user) {
      const docRef = doc(firestore, "users", auth.currentUser.uid);
      getDoc(docRef)
        .then((doc) => {
          if (doc.exists()) {
            const data = doc.data();
            setEmail(data.email);
            setUserId(auth.currentUser.uid);
            setUserStripe(data.stripeAccountId);
          } else {
            console.log("No such document!");
          }
        })
        .catch((error) => {
          console.log("Error getting document:", error);
        });
    }
  }, [user]);

  // Get the current user state from Firebase
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (authUser) => {
      if (authUser) {
        const userRef = doc(db, "users", authUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          setUserData({ ...authUser, ...userData });
        } else {
          console.log("No such document!");
        }
      } else {
        setUserData(null);
      }
    });
    return () => unsubscribe();
  }, []);

  // Fetch Stripe customers once the user is logged in and has a connected Stripe account
  useEffect(() => {
    const fetchStripeCustomers = async () => {
      console.log(userData?.stripeAccountId);
      if (user && userData?.stripeAccountId) {
        setLoadingCustomers(true);

        try {
          const response = await fetch(
            `/api/stripe/customers?stripeAccountId=${userData?.stripeAccountId}`
          );
          const data = await response.json();
          if (response.ok) {
            setCustomers(data);
          } else {
            console.error("Error fetching customers:", data);
          }
        } catch (error) {
          console.error("Error fetching customers:", error);
        } finally {
          setLoadingCustomers(false);
        }
      }
    };

    fetchStripeCustomers();
  }, [userData]);

  const handleDisconnectStripe = async () => {
    if (!user) {
      alert("No user found");
      return;
    }
    setIsDisconnecting(true);
    try {
      await revokeStripeConnection(user.stripeAccountId);
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        stripeAccountId: null,
        stripeConnected: false,
      });
      setIsDisconnecting(false);
      alert("Stripe account successfully unlinked");
    } catch (error) {
      setIsDisconnecting(false);
      console.error("Error disconnecting Stripe account:", error);
      alert("There was an error disconnecting your Stripe account.");
    }
  };

  const revokeStripeConnection = async () => {
    try {
      const response = await fetch(
        "https://connect.stripe.com/oauth/deauthorize",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            client_id: process.env.NEXT_PUBLIC_STRIPE_CLIENT_ID,
            stripe_user_id: stripeUserId,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        console.log("Successfully deauthorized the Stripe account");
      } else {
        console.error("Failed to deauthorize the Stripe account:", data);
      }
    } catch (error) {
      console.error("Error revoking Stripe OAuth token:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleAddCustomerClick = () => {
    setIsAddingCustomer(true);
  };

  const handleAddCustomer = async (event) => {
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
      console.log("Adding customer with:", { name, email, description });

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
      console.log("Stripe customer response:", stripeCustomer);

      if (!stripeCustomer?.id) {
        throw new Error("Failed to retrieve Stripe customer ID");
      }

      const userRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        throw new Error("User does not exist.");
      }

      const userData = userDoc.data();
      console.log("Existing user data:", userData);

      await updateDoc(userRef, {
        customers: arrayUnion({
          email,
          name,
          description,
          stripeCustomerId: stripeCustomer.id,
          createdAt: new Date(),
        }),
      });

      alert("Customer added successfully!");
      nameRef.current.value = "";
      emailRef.current.value = "";
      descriptionRef.current.value = "";
      setIsAddingCustomer(false);
    } catch (error) {
      console.error("Error adding customer:", error);
      alert("Failed to add customer. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen max-w-6xl mx-auto h-full w-full px-3 sm:px-5 text-black flex flex-col ">
      {loading ? (
        <div>Loading...</div>
      ) : user ? (
        <div>
          <Announcements />
          <div className="px-5 pt-6">
            <div className="flex flex-row items-center border-b justify-between">
              <h1 className="text-2xl lg:text-3xl font-semibold text-gray-800">
                Dashboard
              </h1>
              <h2 className="flex items-baseline gap-1 text-sm sm:text-md md:text-lg lg:text-xl text-gray-800">
                Welcome back, {user?.name || user?.email} [
                <button
                  onClick={handleLogout}
                  className="text-xs text-red-500 hover:underline rounded"
                >
                  Sign Out
                </button>
                ]
              </h2>
            </div>
            <div className="p-5 px-0 pb-0">
              <div className="flex flex-col gap-5">
                {!isPremium && (
                  <div className="bg-white p-4 rounded-lg shadow-md h-full flex flex-col shadow-black mx-auto w-full">
                    <div className="flex flex-row w-full">
                      <h3 className="text-2xl font-bold mb-4 text-black flex flex-row gap-1 items-center">
                        <Lock size={20} className="text-destructive" />
                        Upgrade to Premium
                      </h3>
                    </div>
                    <p className="text-gray-700 my-auto h-auto text-xs sm:text-base font-semibold">
                      Unlock all features!!!
                    </p>
                    <div className="mt-2 flex mx-auto w-full justify-start">
                      <Link
                        href="/Dashboard/subscribe"
                        className="bg-confirm font-semibold duration-300 text-black py-2 px-4  shadow-md hover:shadow-lg hover:shadow-black shadow-black text-xs sm:text-lg rounded"
                      >
                        Upgrade
                      </Link>
                    </div>
                  </div>
                )}
                {isPremium && (
                  <div className="bg-white p-4 rounded-lg shadow-md h-full flex flex-col shadow-black mx-auto w-full">
                    {user && userData?.stripeConnected && (
                      <div className="bg-white shadow-md rounded-lg p-6">
                        <div className="flex flex-col gap-4">
                          <div className="flex justify-between items-center">
                            <h3 className="text-2xl font-semibold text-gray-800 flex flex-row gap-2">
                              Customers{" "}
                              <button
                                onClick={handleAddCustomerClick}
                                className="text-gray-800 text-lg flex flex-row items-baseline gap-1 hover:underline"
                              >
                                [
                                <PlusIcon className="w-5 h-5 text-green-500 hover:rotate-90 duration-300 my-auto items-center " />
                                ]
                              </button>
                            </h3>

                            <div className="flex items-center space-x-4">
                              {userData.stripeConnected ? (
                                <button
                                  onClick={handleDisconnectStripe}
                                  disabled={isDisconnecting}
                                  className="px-4 py-2 bg-destructive text-white rounded hover:bg-confirm duration-300 disabled:opacity-50"
                                >
                                  {isDisconnecting
                                    ? "Disconnecting..."
                                    : "Disconnect Stripe Account"}
                                </button>
                              ) : (
                                <p className="text-sm text-gray-500">
                                  No Stripe account connected
                                </p>
                              )}
                            </div>
                          </div>

                          {loadingCustomers ? (
                            <p className="text-gray-600">
                              Loading customers...
                            </p>
                          ) : customers.length > 0 ? (
                            <div className="overflow-x-auto">
                              <table className="min-w-full bg-white border border-gray-300 rounded-md">
                                <thead>
                                  <tr className="bg-gray-100">
                                    <th className="py-3 px-6 text-left text-sm font-medium text-gray-600 border-b">
                                      Email
                                    </th>
                                    <th className="py-3 px-6 text-left text-sm font-medium text-gray-600 border-b">
                                      Name
                                    </th>
                                    <th className="py-3 px-6 text-left text-sm font-medium text-gray-600 border-b">
                                      Description
                                    </th>
                                    <th className="py-3 px-6 text-left text-sm font-medium text-gray-600 border-b">
                                      Actions
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 space-y-2">
                                  {customers.map((customer, index) => (
                                    <tr key={index} className="py-2">
                                      <td className="py-3 px-6 text-sm text-gray-600">
                                        {customer.email}
                                      </td>
                                      <td className="py-3 px-6 text-sm text-gray-600">
                                        {customer.name}
                                      </td>
                                      <td className="py-3 px-6 text-sm text-gray-600">
                                        {customer.description}
                                      </td>
                                      <td className="py-3 px-6 text-sm">
                                        <Link
                                          className="px-4 py-2 text-white text-center rounded items-center bg-confirm hover:bg-destructive duration-300"
                                          href={`/Dashboard/${user.uid}/${customer.id}`}
                                        >
                                          View
                                        </Link>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          ) : (
                            <p>No customers found</p>
                          )}
                        </div>
                      </div>
                    )}
                    {/* Add Customer Form */}
                    {isAddingCustomer && (
                      <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-500 bg-opacity-50">
                        <div className="bg-white p-6 mt-8 shadow-md rounded-lg w-full max-w-xl">
                          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                            Add Customer
                          </h3>
                          <form onSubmit={handleAddCustomer}>
                            <div className="space-y-4">
                              <div>
                                <label
                                  htmlFor="name"
                                  className="block text-sm font-medium text-gray-600"
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
                                  className="block text-sm font-medium text-gray-600"
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
                                  className="block text-sm font-medium text-gray-600"
                                >
                                  Description
                                </label>
                                <textarea
                                  id="description"
                                  ref={descriptionRef}
                                  className="mt-2 p-2 border border-gray-300 rounded-md w-full"
                                  required
                                ></textarea>
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
                                  onClick={() => setIsAddingCustomer(false)}
                                  className="mt-4 text-destructive hover:text-confirm duration-300 rounded-md "
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          </form>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                <div className="flex flex-row gap-5 w-full ">
                  <div className="border border-gray-300 shadow-md shadow-black p-4 rounded-lg bg-white w-full">
                    <h2 className="text-2xl font-bold mb-4">User Info</h2>
                    <div className="p-5 bg-[#EAEEFE] flex flex-col rounded-lg border w-full border-gray-300">
                      <p className="text-lg font-semibold">
                        User Email: <span className="font-normal">{email}</span>
                      </p>
                      <p className="text-lg break-words font-semibold">
                        User Id: <span className="font-normal">{userId}</span>
                      </p>
                      <p className="text-lg font-semibold">
                        Is Premium:{" "}
                        <span className="capitalize font-normal">
                          {isPremium ? "Yes" : "No"}
                        </span>
                      </p>
                    </div>
                  </div>
                  <UserTickets />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        router.push("/")
      )}
    </div>
  );
};

export default Dashboard;
