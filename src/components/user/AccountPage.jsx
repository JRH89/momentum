"use client";

import { useAuth } from "../../context/AuthProvider";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getPremiumStatus } from "../payments/account/GetPremiumStatus";
import { getAuth, sendPasswordResetEmail, deleteUser } from "@firebase/auth";
import { db, initFirebase } from "../../../firebase";
import { getFirestore, updateDoc } from "firebase/firestore";
import { getDoc, doc, collection } from "firebase/firestore";
import Link from "next/link";
import LoginForm from "./SignIn";
import { Blocks, Loader2, LoaderPinwheel } from "lucide-react";
import { toast } from "react-toastify";

const Account = () => {
  const app = initFirebase();
  const auth = getAuth(app);
  const firestore = getFirestore(app);
  const [isPremium, setIsPremium] = useState(false);
  const [userIsPremium, setUserIsPremium] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loadingPortal, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [userData, setUserData] = useState(null);
  const [userStripe, setUserStripe] = useState(null);
  const [loading, setLoadingState] = useState(true); // Set initial loading state
  const [isConnected, setIsConnected] = useState(false);

  const [user, setUser] = useState(null);

  const router = useRouter();

  useEffect(() => {
    // Listener for auth state changes
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setLoadingState(false); // Auth state is determined
      } else {
        router.push("/Dashboard/login"); // Redirect if not authenticated
      }
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, [router]);

  // Fetch premium status
  useEffect(() => {
    const fetchPremiumStatus = async () => {
      try {
        if (user) {
          const newPremiumStatus = await getPremiumStatus(app);
          setIsPremium(newPremiumStatus);
          setUserIsPremium(newPremiumStatus);
          setIsAdmin(newPremiumStatus);
        }
      } catch (error) {
        console.error("Error fetching premium status:", error.message);
      }
    };

    fetchPremiumStatus();
  }, [user, app]);

  useEffect(() => {
    if (user) {
      setLoadingState(true);
      const docRef = doc(firestore, "users", auth.currentUser.uid);
      getDoc(docRef)
        .then((doc) => {
          if (doc.exists()) {
            setUserData(doc.data());
            setUserStripe(doc.data().stripeAccountId || null);
            setIsConnected(doc.data().stripeConnected || false);
            setLoadingState(false);
          }
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
    }
  }, [user, firestore]);

  const sendResetEmail = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Password reset email sent");
      setTimeout(() => {
        setAlert(null);
      }, 4000);
    } catch (error) {
      console.error("Error sending password reset email:", error);
    }
  };

  const loadPortal = async () => {
    setLoading(true); // Optional: Handle loading state

    try {
      const db = getFirestore(); // Initialize Firestore
      const userId = auth.currentUser?.uid; // Ensure current user is authenticated

      if (!userId) {
        throw new Error("User is not authenticated");
      }

      // Fetch the Stripe Customer ID from Firestore
      const customerRef = doc(collection(db, "customers"), userId);
      const customerDoc = await getDoc(customerRef);

      if (!customerDoc.exists()) {
        throw new Error("User document not found");
      }

      const customerData = customerDoc.data();
      const stripeCustomerId = customerData?.stripeId;

      if (!stripeCustomerId) {
        throw new Error("Stripe customer ID not found");
      }

      // Call the API to create the Stripe portal session
      const { url } = await fetch("/api/stripe/createPortal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: stripeCustomerId }),
      }).then((res) => {
        if (!res.ok) {
          throw new Error(`Error: ${res.statusText}`);
        }
        return res.json();
      });

      router.push(url); // Redirect the user to the Stripe billing portal
    } catch (error) {
      toast.error("Error loading portal:", error);
    } finally {
      setLoading(false); // Optional: Reset loading state
    }
  };

  const deleteAccount = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      toast.error("No user found");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );

    if (confirmDelete) {
      try {
        await deleteUser(user);
        toast.success("User account deleted successfully.");
      } catch (error) {
        toast.error("Error deleting user account:", error);
      }
    } else {
      toast.error("Account deletion canceled.");
    }
  };

  const handleDisconnectStripe = async () => {
    if (!user) {
      toast.error("No user found");
      return;
    }

    if (
      window.confirm("Are you sure you want to disconnect your Stripe account?")
    ) {
      try {
        const response = await fetch("/api/stripe/disconnect-stripe", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ stripe_user_id: userStripe }),
        });

        if (!response.ok) {
          throw new Error("Failed to deauthorize Stripe account");
        }

        const result = await response.json();

        // Update Firestore (if applicable)
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, {
          stripeAccountId: null,
          stripeConnected: false,
        });

        toast.success("Stripe account successfully unlinked");
      } catch (error) {
        toast.error("Failed to disconnect Stripe account", error);
      }
    }
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
        <h1 className=" text-3xl text-left font-bold mb-4 flex flex-row items-center w-full gap-2 sm:px-4">
          <Blocks className="w-8 h-8" /> Account
        </h1>
        {user ? (
          <div className="flex flex-col text-lg gap-0 w-full px-0 sm:px-4">
            <p className="capitalize flex flex-row gap-1 w-full justify-start">
              Subscribed:
              <span className="font-bold">{userIsPremium.toString()}</span>
            </p>
            <p className="capitalize flex flex-row gap-1 w-full justify-start">
              Stripe Connected:
              <span className="font-bold">{isConnected.toString()}</span>
            </p>
            <p className="capitalize flex flex-row gap-1 w-full justify-start">
              Stripe ID:
              <span className="font-bold">{userStripe}</span>
            </p>
            {alert && (
              <p className="text-red-600 font-semibold text-center my-2 p-2 rounded-lg bg-white">
                {alert}
              </p>
            )}
            <div className="flex flex-col gap-1 w-full justify-center mx-auto max-w-xl pt-16 sm:pt-12 px-5 sm:px-0 text-lg sm:text-2xl">
              <div className="flex flex-col  gap-1 w-full justify-center mx-auto ">
                <button
                  className="bg-confirm  border-2 border-black duration-300 shadow-black shadow-md hover:shadow-black hover:shadow-lg hover:bg-confirm/80  font-bold py-2 px-4 rounded-lg mt-4 text-slate-900 mx-auto flex w-full justify-center"
                  onClick={() => sendResetEmail(user.email)}
                >
                  Reset Password
                </button>
                {isPremium && (
                  <button
                    className="bg-green-400 border-2 border-black duration-300 shadow-black shadow-md hover:shadow-black hover:shadow-lg hover:bg-green-400/80  font-bold py-2 px-4 rounded-lg mt-4 text-slate-900 mx-auto flex w-full justify-center"
                    onClick={() => {
                      loadPortal();
                    }}
                  >
                    {loadingPortal ? (
                      <Loader2 className="w-6 h-6 animate-spin duration-300" />
                    ) : (
                      "Manage Subscription"
                    )}
                  </button>
                )}
                {!isPremium && (
                  <Link
                    href="/Dashboard/subscribe"
                    className="bg-confirm duration-300  border-2 border-black shadow-black shadow-md hover:shadow-black hover:shadow-lg hover:bg-confirm/80  font-bold py-2 px-4 rounded-lg mt-4 text-slate-900 mx-auto flex w-full justify-center"
                  >
                    Upgrade to Premium
                  </Link>
                )}
                {userData?.stripeConnected && (
                  <button
                    className="bg-yellow-300  border-2 border-black duration-300 shadow-black shadow-md hover:shadow-black hover:shadow-lg hover:bg-yellow-300/80  font-bold py-2 px-4 rounded-lg mt-4 text-slate-900 mx-auto flex w-full justify-center"
                    onClick={() => {
                      handleDisconnectStripe();
                    }}
                  >
                    Disconnect Stripe
                  </button>
                )}
                <button
                  className="bg-destructive duration-300  border-2 border-black shadow-black shadow-md hover:shadow-black hover:shadow-lg hover:bg-destructive/80  font-bold py-2 px-4 rounded-lg mt-4 text-black mx-auto flex w-full justify-center"
                  onClick={() => {
                    deleteAccount();
                  }}
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        ) : (
          <LoginForm route="/Dashboard/account" />
        )}
      </div>
    </>
  );
};

export default Account;
