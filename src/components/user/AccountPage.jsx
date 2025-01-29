"use client";

import { useAuth } from "../../context/AuthProvider";
import { useEffect, useState } from "react";
import { redirect, useRouter } from "next/navigation";
import { getPremiumStatus } from "../payments/account/GetPremiumStatus";
import { getAuth, sendPasswordResetEmail, deleteUser } from "@firebase/auth";
import { db, initFirebase } from "../../../firebase";
import { getFirestore, updateDoc } from "firebase/firestore";
import { getDoc, doc, collection, deleteDoc } from "firebase/firestore";
import Link from "next/link";
import LoginForm from "./SignIn";
import { Blocks, ExternalLink, Loader2, LoaderPinwheel } from "lucide-react";
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
  const [loading, setLoadingState] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const router = useRouter();

  const handleConnect = () => {
    if (termsAccepted) {
      window.location.href = "/api/stripe/oauth";
    }
  };

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
            setEmail(doc.data().email);
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
        // Handle Stripe disconnection if necessary
        if (isConnected) {
          handleDisconnectStripe();
        }

        // Delete user account
        await deleteUser(user);

        // Check and delete 'users' document
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnapshot = await getDoc(userDocRef);
        if (userDocSnapshot.exists()) {
          await deleteDoc(userDocRef);
        }

        // Check and delete 'customers' document
        const customerDocRef = doc(db, "customers", user.uid);
        const customerDocSnapshot = await getDoc(customerDocRef);
        if (customerDocSnapshot.exists()) {
          await deleteDoc(customerDocRef);
        }

        toast.success("User account deleted successfully.");
      } catch (error) {
        console.error("Error deleting user account:", error);
        toast.error(`Error deleting user account: ${error.message}`);
      }
    } else {
      return;
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
        const userRef = doc(db, "users", user?.uid);
        await updateDoc(userRef, {
          stripeAccountId: null,
          stripeConnected: false,
          customers: [],
        });

        toast.success("Stripe account successfully unlinked");
        setIsConnected(false);
        setUserStripe(null);
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
            <p className="break-words flex flex-row gap-1 w-full justify-start">
              Email:
              <span className="font-bold">{user.email}</span>
            </p>
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
                  className="bg-confirm  border-2 border-black duration-300 shadow-black shadow-md hover:shadow-black hover:shadow-lg hover:bg-confirm/80  font-bold py-2 px-4 rounded-lg mt-4 text-black mx-auto flex w-full justify-center"
                  onClick={() => sendResetEmail(user.email)}
                >
                  Reset Password
                </button>
                {isPremium && (
                  <button
                    className="bg-green-400 border-2 border-black duration-300 shadow-black shadow-md hover:shadow-black hover:shadow-lg hover:bg-green-400/80  font-bold py-2 px-4 rounded-lg mt-4 text-black mx-auto flex w-full justify-center"
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
                    className="bg-confirm duration-300  border-2 border-black shadow-black shadow-md hover:shadow-black hover:shadow-lg hover:bg-confirm/80  font-bold py-2 px-4 rounded-lg mt-4 text-black mx-auto flex w-full justify-center"
                  >
                    Upgrade to Premium
                  </Link>
                )}
                {isPremium && isConnected && (
                  <button
                    className="bg-yellow-300  border-2 border-black duration-300 shadow-black shadow-md hover:shadow-black hover:shadow-lg hover:bg-yellow-300/80  font-bold py-2 px-4 rounded-lg mt-4 text-black mx-auto flex w-full justify-center"
                    onClick={() => {
                      handleDisconnectStripe();
                    }}
                  >
                    Disconnect Stripe
                  </button>
                )}
                {isPremium && !isConnected && (
                  <button
                    onClick={() => setIsPopupVisible(true)}
                    className="bg-yellow-300  border-2 border-black duration-300 shadow-black shadow-md hover:shadow-black hover:shadow-lg hover:bg-yellow-300/80  font-bold py-2 px-4 rounded-lg mt-4 text-black mx-auto flex w-full justify-center"
                  >
                    Connect Stripe
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
      {/* Terms Pop-up */}
      {isPopupVisible && (
        <div className="fixed inset-0 bg-black/95 flex justify-center items-center z-50">
          <div className="bg-white border-2 border-black p-6 rounded-lg shadow-lg max-w-md w-full text-center">
            <h2 className="text-xl font-semibold mb-4">Terms and Conditions</h2>
            <div
              className="text-gray-700 mb-4 p-4 border-2 border-black rounded max-h-60 overflow-y-auto text-left"
              style={{ maxHeight: "15rem" }}
            >
              <p>
                <strong>Introduction:</strong> By accessing or using our
                services, you agree to comply with these terms and conditions.
              </p>
              <p>
                <strong>Eligibility:</strong> You must be at least 18 years old
                to use this platform. It is your responsibility to ensure
                compliance with local laws.
              </p>
              <p>
                <strong>Stripe Connection:</strong> By connecting your Stripe
                account, you grant us permission to access your account data to
                facilitate transactions. Your use of Stripe is subject to{" "}
                <a
                  href="https://stripe.com/legal/connect-account"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Stripe Connect Account Agreement
                </a>
                .
              </p>
              <p>
                <strong>Privacy:</strong> We are committed to protecting your
                personal information in accordance with our privacy policy.
                Payment information is processed securely through Stripe, and
                you agree to{" "}
                <a
                  href="https://stripe.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Stripe Privacy Policy
                </a>
                .
              </p>
              <p>
                <strong>Termination:</strong> We reserve the right to terminate
                your access to our services if you violate these terms.
              </p>
              <p>
                <strong>Limitation of Liability:</strong> We are not liable for
                any damages resulting from the use of our services.
              </p>
              <p className="">
                For the full terms, please refer to our{" "}
                <Link
                  target="_blank"
                  className="text-blue-600 inline-flex flex-row gap-1 hover:underline items-center"
                  href="/Policies"
                >
                  Terms of Service{" "}
                  <ExternalLink className="w-4 h-4 inline-flex" />
                </Link>
                .
              </p>
            </div>
            <div className="flex items-center justify-center mb-4">
              <input
                type="checkbox"
                id="acceptTerms"
                className="mr-2"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
              />
              <label htmlFor="acceptTerms" className="text-gray-700">
                I accept the terms and conditions
              </label>
            </div>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 text-destructive hover:text-destructive/60 duration-300"
                onClick={() => setIsPopupVisible(false)}
              >
                Cancel
              </button>
              <button
                className={`px-4 py-2 rounded-lg ${
                  termsAccepted
                    ? "bg-confirm text-black font-semibold border-2 border-black shadow-md shadow-black hover:shadow-lg hover:shadow-black duration-300"
                    : "bg-gray-300 text-gray-600 cursor-not-allowed"
                }`}
                onClick={handleConnect}
                disabled={!termsAccepted}
              >
                Proceed
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Account;
