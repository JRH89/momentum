"use client";

import React, { useEffect, useState } from "react";
import InvoicesTable from "../customer/InvoiceTable";
import { db, auth } from "../../../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { initializeApp, deleteApp, getApps } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail,
  signOut,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { FileText, LoaderPinwheel } from "lucide-react";
import { toast } from "react-toastify";

// Utility function to generate a unique app name
const generateAppName = () => `tempy-${Date.now()}`;

const UserCreatingInvoiceTable = () => {
  const [invoices, setInvoices] = useState([]);
  const [stripeAccountId, setStripeAccountId] = useState(null);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const router = useRouter();

  // Handle user state and redirection logic
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        router.push("/Dashboard/login");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  // Fetch user data from Firestore and set Stripe account ID
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
        toast.error("Error fetching user data:", err);
        setError("Failed to fetch user data.");
      }
    };

    if (user) {
      fetchUserStripeAccountId(user.uid);
    }
  }, [user]);

  // Function to create users and update Firestore
  const handleUserCreation = async (invoices) => {
    const openInvoices = invoices.filter(
      (invoice) => invoice.status === "open"
    );
    const appName = generateAppName();

    const appAlreadyExists = getApps().some((app) => app.name === appName);

    if (!appAlreadyExists) {
      const secondaryApp = initializeApp(
        {
          apiKey: process.env.NEXT_PUBLIC_APIKEY,
          authDomain: process.env.NEXT_PUBLIC_AUTHDOMAIN,
          projectId: process.env.NEXT_PUBLIC_PROJECTID,
          storageBucket: process.env.NEXT_PUBLIC_STORAGEBUCKET,
          messagingSenderId: process.env.NEXT_PUBLIC_MESSAGINGSENDERID,
          appId: process.env.NEXT_PUBLIC_APPID,
        },
        appName
      );

      const secondaryAuth = getAuth(secondaryApp);
      const processedEmails = new Set();

      try {
        const userCreationPromises = openInvoices.map(async (invoice) => {
          const { email } = invoice;

          if (!email) {
            console.warn("Skipping invoice with no email");
            return;
          }

          if (processedEmails.has(email)) {
            console.log(`Skipping duplicate email in batch: ${email}`);
            return;
          }

          processedEmails.add(email);

          try {
            // Check if the user already exists in Firebase Auth
            const methods = await fetchSignInMethodsForEmail(
              secondaryAuth,
              email
            );

            if (methods.length > 0) {
              // If the user exists, use their UID
              console.log(`User already exists for email: ${email}`);
              const user = await signInWithEmailAndPassword(
                secondaryAuth,
                email,
                "DummyPassword123!"
              );
              const userUid = user.user.uid;

              // Now, update Firestore to associate the UID with the customer's data
              await updateCustomerDataInFirestore(userUid, email);
            } else {
              // If the user does not exist, create the user in Firebase Auth
              const newUserCredential = await createUserWithEmailAndPassword(
                secondaryAuth,
                email,
                "DefaultSecurePassword123!"
              );

              const newUserUid = newUserCredential.user.uid;

              // After creating the user, update the customer's Firestore data with their UID
              await updateCustomerDataInFirestore(newUserUid, email);
            }
          } catch (err) {
            if (err.code === "auth/email-already-in-use") {
              console.log(
                `Skipping creation: User already exists for email: ${email}`
              );
            } else {
              toast.error(`Error processing email ${email}:`, err);
            }
          }
        });

        await Promise.all(userCreationPromises);
      } catch (error) {
        toast.error("Error in batch user creation:", error);
      } finally {
        try {
          await deleteApp(secondaryApp);
        } catch (error) {
          toast.error("Error deleting secondary app:", error);
        }
      }
    }
  };

  const updateCustomerDataInFirestore = async (userUid, email) => {
    try {
      // Fetch the user document in Firestore
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        const updatedCustomers = userData?.customers || [];

        // Check if the customer exists in the array
        const existingCustomer = updatedCustomers.find(
          (customer) => customer.email === email
        );

        if (existingCustomer) {
          // If customer exists, update their UID
          console.log(`Updating customer ${email} with UID ${userUid}`);
          existingCustomer.uid = userUid; // Update with new UID
        } else {
          // If the customer does not exist, add them to the array
          console.log(`Adding new customer ${email} with UID ${userUid}`);
          updatedCustomers.push({
            uid: userUid,
            email: email,
          });
        }

        // Update the customer data in Firestore
        await updateDoc(userRef, {
          customers: updatedCustomers,
        });
        console.log(`Customer data updated for ${email}`);
      } else {
        console.log("User document not found in Firestore");
      }
    } catch (err) {
      toast.error("Error updating customer data in Firestore:", err);
    }
  };

  // Fetch invoices when stripeAccountId is available
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
          await handleUserCreation(data.invoices || []);
        } else {
          setError(data.error || "Failed to fetch invoices");
        }
      } catch (err) {
        toast.error("Error fetching invoices:", err);
        setError("Failed to fetch invoices.");
      }
    };

    if (stripeAccountId) fetchInvoices();
  }, [stripeAccountId]);

  if (loading)
    return (
      <div className="min-h-screen my-auto items-center justify-center max-w-6xl mx-auto h-full w-full p-4 pt-4 text-black flex flex-col pb-24">
        <LoaderPinwheel className="animate-spin duration-300 w-8 h-8" />
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto w-full p-4 pt-2 px-0 sm:px-4 text-black flex flex-col">
      <h1 className="text-2xl font-semibold mb-1 flex flex-row gap-2 items-center">
        <FileText className="w-6 h-6 sm:w-7 sm:h-7" /> Invoices
      </h1>
      <div className="flex flex-col">
        <InvoicesTable
          invoices={invoices}
          itemsPerPage={userData?.invoicesPerPage || 10}
        />
      </div>
    </div>
  );
};

export default UserCreatingInvoiceTable;
