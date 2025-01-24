"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { doc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { ExternalLink, Home, PlusIcon, Users } from "lucide-react";
import { useAuth } from "../../context/AuthProvider";
import { initFirebase } from "../../../firebase";
import { db } from "../../../firebase";
import { usePremiumStatus } from "../../app/hooks/use-premium-status";
import { useStripeIntegration } from "../../app/hooks/use-stripe-integration";
import { CustomerTable } from "../../components/customer-table";
import { AddCustomerForm } from "../../components/add-customer-form";
import Announcements from "./Announcements";
import UserCreatingInvoiceTable from "./UserCreatingInvoiceTable";

export default function Dashboard() {
  const { user, loading: userLoading } = useAuth();
  const [userData, setUserData] = useState(null);
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState(null);
  const [userStripe, setUserStripe] = useState();
  const [isAddingCustomer, setIsAddingCustomer] = useState(false);
  const [invoices, setInvoices] = useState([]);

  const router = useRouter();
  const app = initFirebase();
  const auth = getAuth(app);
  const isPremium = usePremiumStatus(app, user);
  const [photo, setPhoto] = useState(null);
  const [error, setError] = useState(null);
  const [stripeAccountId, setStripeAccountId] = useState(null);

  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const {
    customers,
    loadingCustomers,
    isDisconnecting,
    handleDisconnectStripe,
    setCustomers,
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
    const fetchUserStripeAccountId = async (userId) => {
      try {
        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUserData(userSnap.data());
          setStripeAccountId(userSnap.data().stripeAccountId || null);
        } else {
          setError("User document not found");
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to fetch user data.");
      }
    };

    if (user) {
      fetchUserStripeAccountId(user.uid);
    }
  }, [user]);

  useEffect(() => {
    const fetchInvoices = async () => {
      if (!stripeAccountId) return;

      try {
        const response = await fetch(
          `/api/stripe/invoices/all?stripeAccountId=${stripeAccountId}`
        );
        const data = await response.json();

        if (response.ok && data.invoices) {
          setInvoices(data.invoices || []);
        } else {
          setError(data.error || "Failed to fetch invoices");
        }
      } catch (err) {
        console.error("Error fetching invoices:", err);
        setError("Failed to fetch invoices.");
      }
    };

    if (stripeAccountId) fetchInvoices();
  }, [stripeAccountId]);

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

  const handleConnect = () => {
    if (termsAccepted) {
      window.location.href = "/api/stripe/oauth"; // API endpoint that redirects to Stripe
    }
  };

  const handleCustomerAdded = (customerData) => {
    setCustomers((prevCustomers) => [...prevCustomers, customerData]); // Update the customer list
  };

  const handleDeleteCustomer = (customerId) => {
    setCustomers((prevCustomers) =>
      prevCustomers.filter(
        (customer) => customer.stripeCustomerId !== customerId
      )
    );
  };

  return (
    <>
      <div className="min-h-screen max-w-6xl mx-auto h-full w-full p-4 pt-0 text-black flex flex-col pb-0">
        <Announcements />
        <div className="flex flex-col">
          <div className="p-4 pt-4 px-0 pb-0">
            <div className="justify-between flex flex-row items-baseline">
              <h1 className="text-3xl lg:text-3xl flex flex-row items-center gap-2 font-bold px-0 text-black ">
                <Home className="w-8 h-8" /> User Dashboard
              </h1>
            </div>
            <div className="flex flex-col gap-5 mt-4 sm:mt-6">
              <div className=" h-full flex flex-col shadow-black mx-auto w-full">
                {user && userData?.stripeConnected && (
                  <div className="flex flex-col gap-0">
                    <h3 className="text-2xl font-semibold text-black flex flex-row gap-2 my-auto px-0 sm:px-4 items-center">
                      <Users className="w-6 h-6 sm:w-7 sm:h-7" />
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
                      <p className="text-gray-600 px-6">Loading customers...</p>
                    ) : (
                      <CustomerTable
                        onDeleteCustomer={handleDeleteCustomer}
                        customers={customers}
                        userId={user.uid}
                        itemsPerPage={userData?.customersPerPage || 7}
                      />
                    )}
                  </div>
                )}
                {user && !userData?.stripeConnected && (
                  <div className="flex my-auto justify-center items-center flex-col -mt-24 h-full min-h-screen gap-2">
                    <h2 className="text-2xl max-w-xl w-full mx-auto text-center font-bold">
                      Step 2: Connect your Stripe Account
                    </h2>
                    <p className="text-gray-600 max-w-lg w-full mx-auto text-center mb-4">
                      If you do not have a stripe account, you will have the
                      opportunity to create one during the connection process.
                    </p>
                    <button
                      onClick={() => setIsPopupVisible(true)}
                      className="flex items-center justify-center gap-1.5 px-6 duration-300 bg-white border-2 border-black shadow-md shadow-black max-w-xs mx-auto text-black rounded-lg hover:shadow-lg hover:shadow-black focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
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
                    onClose={() => {
                      setIsAddingCustomer(false);
                    }}
                    user={user}
                    userStripe={userStripe}
                    onCustomerAdded={handleCustomerAdded}
                  />
                )}
                {user && userData?.stripeConnected && (
                  <div className=" max-w-6xl mx-auto w-full px-0 p-4 pt-2 text-black flex flex-col ">
                    <UserCreatingInvoiceTable />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Terms Pop-up */}
      {isPopupVisible && (
        <div className="fixed inset-0 bg-black/95 flex justify-center items-center z-50">
          <div className="bg-white border-2 border-black p-6 rounded-lg  shadow-lg max-w-md w-full text-center">
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
                facilitate transactions.
              </p>
              <p>
                <strong>Privacy:</strong> We are committed to protecting your
                personal information in accordance with our privacy policy.
              </p>
              <p>
                <strong>Termination:</strong> We reserve the right to terminate
                your access to our services if you violate these terms.
              </p>
              <p>
                <strong>Limitation of Liability:</strong> We are not liable for
                any damages resulting from the use of our services.
              </p>
              <p>
                For the full terms, please refer to our{" "}
                <Link
                  target="_blank"
                  className="text-blue-600 flex flex-row gap-1 hover:underline items-center "
                  href="/Policies"
                >
                  Terms of Service <ExternalLink className="w-4 h-4" />
                </Link>
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
                    ? "bg-confirm text-black font-semibold border-2 border-black  shadow-md shadow-black hover:shadow-lg hover:shadow-black duration-300"
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
}
