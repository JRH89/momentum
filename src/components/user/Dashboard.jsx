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
      router.push("/Dashboard/login"); // Redirect to home if user is not logged in
    }
  }, [user, router]);

  const connectStripeAccount = () => {
    window.location.href = "/api/stripe/oauth"; // Your API endpoint that redirects to Stripe
  };

  return (
    <>
      <div className="min-h-screen max-w-6xl mx-auto h-full w-full p-4 pt-2 text-black flex flex-col pb-24">
        <Announcements />
        <div className="flex flex-col">
          <div className="p-5 pt-0 px-0 pb-0">
            <div className="flex flex-col gap-5">
              <div className=" h-full flex flex-col shadow-black mx-auto w-full">
                {user && userData?.stripeConnected && (
                  <div className="flex flex-col gap-2">
                    <h3 className="text-3xl font-semibold text-black flex flex-row gap-5 my-auto px-4 items-center">
                      Customers{" "}
                      <button
                        onClick={() => setIsAddingCustomer(true)}
                        className="text-black items-center text-xl flex flex-row align-middle my-auto hover:underline"
                      >
                        [
                        <PlusIcon className="w-6 h-6 text-green-500 hover:rotate-90 duration-300" />
                        ]
                      </button>
                    </h3>

                    {loadingCustomers ? (
                      <p className="text-gray-600 px-4">Loading customers...</p>
                    ) : (
                      <CustomerTable
                        customers={customers}
                        userId={user.uid}
                        itemsPerPage={userData?.customersPerPage || 8}
                      />
                    )}
                  </div>
                )}
                {user && !userData?.stripeConnected && (
                  <div className="flex my-auto justify-center items-center flex-col -mt-24 h-full min-h-screen gap-2">
                    <h2 className="text-2xl max-w-xl w-full mx-auto text-center font-bold mb-4">
                      Step 2: Connect your Stripe Account
                    </h2>

                    <button
                      onClick={connectStripeAccount}
                      className="flex items-center justify-center gap-1.5  px-6 duration-300 bg-white border-2 border-black shadow-md shadow-black max-w-xs mx-auto  text-black rounded-lg hover:shadow-lg hover:shadow-black focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
                    >
                      <span className="font-semibold pb-0.5">Connect to</span>
                      <img
                        src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg"
                        alt="Stripe Logo"
                        className="w-12 h-12 text-white"
                      />
                    </button>
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
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
