"use client";

import React, { useEffect, useState } from "react";
import InvoicesTable from "../customer/InvoiceTable";
import { db, auth } from "../../../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore"; // Added updateDoc
import { initializeApp, deleteApp, getApp, getApps } from "firebase/app"; // Handle multiple apps
import {
  getAuth,
  createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail,
  signOut,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { FileText } from "lucide-react";

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
          await handleUserCreation(data.invoices || []);
        } else {
          setError(data.error || "Failed to fetch invoices");
        }
      } catch (err) {
        console.error("Error fetching invoices:", err);
        setError("Failed to fetch invoices.");
      }
    };

    const handleUserCreation = async (invoices) => {
      const openInvoices = invoices.filter(
        (invoice) => invoice.status === "open"
      );
      const appName = generateAppName();

      // Check if the app already exists
      const appAlreadyExists = getApps().some((app) => app.name === appName);

      if (!appAlreadyExists) {
        // Initialize the app only if it doesn't already exist
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

        // Create a Set to track processed emails within this batch
        const processedEmails = new Set();

        try {
          // Create a list of promises to handle user creation
          const userCreationPromises = openInvoices.map(async (invoice) => {
            const { email } = invoice;

            if (!email) {
              console.warn("Skipping invoice with no email");
              return;
            }

            // Skip if we've already processed this email in the current batch
            if (processedEmails.has(email)) {
              console.log(`Skipping duplicate email in batch: ${email}`);
              return;
            }

            // Mark this email as processed
            processedEmails.add(email);

            try {
              // Check if the email is already in use
              const methods = await fetchSignInMethodsForEmail(
                secondaryAuth,
                email
              );

              if (methods.length > 0) {
                // Email exists, skip user creation
                console.log(
                  `Skipping creation: User already exists for email: ${email}`
                );

                return;
              }

              // Email doesn't exist, proceed with user creation
              const newUserCredential = await createUserWithEmailAndPassword(
                secondaryAuth,
                email,
                "DefaultSecurePassword123!" // Replace with your desired default password
              );

              // Sign out immediately after creating the user
              await signOut(secondaryAuth);

              const newUserUid = newUserCredential.user.uid;

              // Update Firestore to add the user to the `customers` array
              const userRef = doc(db, "users", user.uid);
              await updateDoc(userRef, {
                customers: Array.isArray(userData?.customers)
                  ? [...userData.customers, newUserUid]
                  : [newUserUid],
              });
            } catch (err) {
              // Handle specific Firebase errors
              if (err.code === "auth/email-already-in-use") {
                console.log(
                  `Skipping creation: User already exists for email: ${email}`
                );
              } else {
                console.error(`Error processing email ${email}:`, err);
              }
            }
          });

          // Wait for all user creation promises to finish
          await Promise.all(userCreationPromises);
        } catch (error) {
          console.error("Error in batch user creation:", error);
        } finally {
          // Always cleanup the secondary app
          try {
            await deleteApp(secondaryApp);
          } catch (error) {
            console.error("Error deleting secondary app:", error);
          }
        }
      }
    };

    if (stripeAccountId) fetchInvoices();
  }, [stripeAccountId]);

  if (loading) {
    return (
      <div className="min-h-screen max-w-6xl mx-auto h-full w-full p-4 pt-2 text-black flex flex-col pb-24">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-6xl mx-auto h-full w-full p-4 pt-2 text-black flex flex-col pb-24">
      <h1 className="text-2xl font-semibold mb-1 flex flex-row gap-2 items-center">
        <FileText className="w-7 h-7" /> Invoices
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
