"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { doc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { Lock, PlusIcon } from "lucide-react";
import { useAuth } from "../../context/AuthProvider";
import { initFirebase } from "../../../firebase";
import { db } from "../../../firebase";
import { usePremiumStatus } from "../../app/hooks/use-premium-status";
import { useStripeIntegration } from "../../app/hooks/use-stripe-integration";
import { CustomerTable } from "../../components/customer-table";
import { AddCustomerForm } from "../../components/add-customer-form";
import Announcements from "./Announcements";
import UserTickets from "./UserTickets";
import Image from "next/image";

export default function Dashboard() {
  const { user, loading: userLoading } = useAuth();
  const [userData, setUserData] = useState(null);
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState(null);
  const [userStripe, setUserStripe] = useState();
  const [isAddingCustomer, setIsAddingCustomer] = useState(false);

  const router = useRouter();
  const app = initFirebase();
  const auth = getAuth(app);
  const isPremium = usePremiumStatus(app, user);
  const [photo, setPhoto] = useState(null);

  const {
    customers,
    loadingCustomers,
    isDisconnecting,
    handleDisconnectStripe,
  } = useStripeIntegration({ user, userData, userStripe });

  useEffect(() => {
    if (user) {
      const docRef = doc(db, "users", auth.currentUser.uid);
      getDoc(docRef)
        .then((doc) => {
          if (doc.exists()) {
            const data = doc.data();
            setEmail(data.email);
            setUserId(auth.currentUser.uid);
            setUserStripe(data.stripeAccountId);
          }
        })
        .catch((error) => {
          console.error("Error getting document:", error);
        });
    }
  }, [user, auth.currentUser]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (authUser) => {
      if (authUser) {
        const userRef = doc(db, "users", authUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUserData({ ...authUser, ...userSnap.data() });
          setPhoto(authUser.photoURL);
        }
      } else {
        setUserData(null);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) {
      router.push("/"); // Redirect to home if user is not logged in
    }
  }, [user, router]);

  return (
    <div className="min-h-screen max-w-6xl mx-auto h-full w-full px-3 sm:px-5 text-black flex flex-col pb-24">
      <Announcements />
      <div className="flex flex-col pt-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-0 mb-0">
          <h1 className="text-2xl lg:text-3xl font-semibold text-black">
            Dashboard
          </h1>
          <div className="flex flex-row items-center gap-2">
            <h2 className="flex items-baseline gap-1 text-sm sm:text-lg md:text-xl justify-between lg:text-xl text-black">
              Welcome back, {userData?.name}
            </h2>
            {userData?.photoURL && (
              <img
                className="rounded-full"
                src={userData?.photoURL || ""}
                alt="Profile"
                width={25}
                height={25}
              />
            )}
          </div>
        </div>
        <div className="p-5 pt-2 px-0 pb-0">
          <div className="flex flex-col gap-5">
            {!isPremium ? (
              <div className="bg-white p-4 rounded-lg shadow-md h-full flex flex-col shadow-black mx-auto w-full">
                <div className="flex flex-row w-full">
                  <h3 className="text-2xl font-bold mb-4 text-black flex flex-row gap-1 items-center">
                    <Lock className="w-5 h-5 text-destructive" />
                    Upgrade to Premium
                  </h3>
                </div>
                <p className="text-gray-700 my-auto h-auto text-xs sm:text-base font-semibold">
                  Unlock all features!!!
                </p>
                <div className="mt-2 flex mx-auto w-full justify-start">
                  <Link
                    href="/Dashboard/subscribe"
                    className="bg-confirm font-semibold duration-300 text-black py-2 px-4 shadow-md hover:shadow-lg hover:shadow-black shadow-black text-xs sm:text-lg rounded"
                  >
                    Upgrade
                  </Link>
                </div>
              </div>
            ) : (
              <div className="bg-white p-4 rounded-lg shadow-md h-full flex flex-col shadow-black mx-auto w-full">
                {user && userData?.stripeConnected && (
                  <div className="">
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center text-left">
                        <h3 className="text-2xl font-semibold text-black flex flex-row gap-2 my-auto items-center">
                          Customers{" "}
                          <button
                            onClick={() => setIsAddingCustomer(true)}
                            className="text-black text-lg flex flex-row items-baseline  hover:underline"
                          >
                            [
                            <PlusIcon className="w-5 h-5 text-green-500 hover:rotate-90 duration-300 my-auto items-center" />
                            ]
                          </button>
                        </h3>
                        <div className="flex items-center sm:pt-0 pt-2 space-x-4">
                          {userData.stripeConnected && (
                            <button
                              onClick={handleDisconnectStripe}
                              disabled={isDisconnecting}
                              className="px-4 py-2 bg-destructive text-white rounded hover:bg-confirm duration-300 disabled:opacity-50"
                            >
                              {isDisconnecting
                                ? "Disconnecting..."
                                : "Disconnect Stripe Account"}
                            </button>
                          )}
                        </div>
                      </div>
                      {loadingCustomers ? (
                        <p className="text-gray-600">Loading customers...</p>
                      ) : (
                        <CustomerTable
                          customers={customers}
                          userId={user.uid}
                        />
                      )}
                    </div>
                  </div>
                )}
                {isAddingCustomer && (
                  <AddCustomerForm
                    onClose={() => setIsAddingCustomer(false)}
                    user={user}
                    userStripe={userStripe}
                  />
                )}
              </div>
            )}
            <div className="flex flex-row gap-5 w-full">
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
  );
}
