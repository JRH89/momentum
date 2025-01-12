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
import NavBar from "../navbar";
import Footer from "../footer";

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
    <>
      <div className="min-h-screen max-w-6xl mx-auto h-full w-full p-4 pt-2 text-black flex flex-col pb-24">
        <Announcements />
        <div className="flex flex-col">
          <div className="p-5 pt-0 px-0 pb-0">
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
                        <p className="text-gray-600 px-4">
                          Loading customers...
                        </p>
                      ) : (
                        <CustomerTable
                          customers={customers}
                          userId={user.uid}
                          itemsPerPage={userData?.customersPerPage || 8}
                        />
                      )}
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
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
