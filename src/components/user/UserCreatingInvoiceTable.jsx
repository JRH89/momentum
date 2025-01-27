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
    const processedEmails = new Set();
    const customerUpdates = []; // Array to collect all customer updates

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

      try {
        // Process all invoices first
        for (const invoice of openInvoices) {
          const { email } = invoice;

          if (!email || processedEmails.has(email)) {
            continue;
          }

          processedEmails.add(email);

          try {
            // First check if user exists
            const methods = await fetchSignInMethodsForEmail(
              secondaryAuth,
              email
            );

            if (methods.length > 0) {
              console.log(
                `Skipping user creation for existing email: ${email}`
              );
              continue; // Skip to next invoice
            }

            // Only attempt to create user if they don't exist
            const newUserCredential = await createUserWithEmailAndPassword(
              secondaryAuth,
              email,
              "DefaultSecurePassword123!"
            );
            const userUid = newUserCredential.user.uid;
            console.log(
              `Created new user with UID: ${userUid} for email: ${email}`
            );
            customerUpdates.push({ email, uid: userUid });
          } catch (err) {
            // If we somehow missed catching an existing user, log and continue
            if (err.code === "auth/email-already-in-use") {
              console.log(`Skipping existing user: ${email}`);
              continue;
            }
            // Log other errors but don't throw
            console.error(`Error processing email ${email}:`, err);
          }
        }

        // After all users are created, update Firestore in a single operation
        if (customerUpdates.length > 0) {
          await updateCustomerDataInFirestore(customerUpdates);
        }
      } catch (error) {
        toast.error("Error in batch user creation:", error);
      } finally {
        try {
          await deleteApp(secondaryApp);
        } catch (error) {
          console.error("Error deleting secondary app:", error);
        }
      }
    }
  };

  const updateCustomerDataInFirestore = async (customerUpdates) => {
    try {
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        const updatedCustomers = [...(userData?.customers || [])];

        // Process each customer update
        customerUpdates.forEach((update) => {
          const existingIndex = updatedCustomers.findIndex(
            (customer) => customer.email === update.email
          );

          if (existingIndex !== -1) {
            // Update existing customer
            if (update.uid) {
              updatedCustomers[existingIndex] = {
                ...updatedCustomers[existingIndex],
                uid: update.uid,
              };
            }
          } else {
            // Add new customer
            updatedCustomers.push({
              email: update.email,
              uid: update.uid || null,
            });
          }
        });

        // Update Firestore with the complete updated array
        await updateDoc(userRef, {
          customers: updatedCustomers,
        });
        console.log("Customer data updated successfully");
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
