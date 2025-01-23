"use client";

import { FirebaseApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  addDoc,
  collection,
  getFirestore,
  onSnapshot,
} from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";
import siteMetadata from "../../../../siteMetadata";

const isDev = process.env.NODE_ENV === "development";
const BASE_URL = isDev ? "http://localhost:3000" : siteMetadata?.siteUrl;

export const getCheckoutUrl = async (
  app: FirebaseApp,
  priceId: string
): Promise<string> => {
  const auth = getAuth(app);
  const userId = auth.currentUser?.uid;
  console.log("User ID:", userId);
  if (!userId) throw new Error("User is not authenticated");

  const db = getFirestore(app);
  const checkoutSessionRef = collection(
    db,
    "customers",
    userId,
    "checkout_sessions"
  );

  console.log("Adding checkout session document...");
  const docRef = await addDoc(checkoutSessionRef, {
    price: priceId,
    allow_promotion_codes: true,
    success_url: `${BASE_URL}/Dashboard/${auth.currentUser?.uid}` || `${BASE_URL}/Dashboard/subscribe`,
    cancel_url: `${BASE_URL}/Dashboard/subscribe`,
  });

  console.log("Checkout session document added. DocRef:", docRef.id);

  console.log("Waiting for snapshot...");
  return new Promise<string>((resolve, reject) => {
    const unsubscribe = onSnapshot(docRef, (snap) => {
      console.log("Snapshot data:", snap.data()); // Log the entire snapshot data
      const { error, url } = snap.data() as {
        error?: { message: string };
        url?: string;
      };
      if (error) {
        unsubscribe();
        console.error("Error in snapshot data:", error.message);
        reject(new Error(`An error occurred: ${error.message}`));
      }
      if (url) {
        console.log("Stripe Checkout URL:", url);
        unsubscribe();
        resolve(url);
      } else {
        console.log("URL is undefined in snapshot data");
      }
    });
  });
};

export const getPortalUrl = async (app: FirebaseApp): Promise<string> => {
  const auth = getAuth(app);
  const user = auth.currentUser;

  let dataWithUrl: any;
  try {
    const functions = getFunctions(app, "us-central1");
    const functionRef = httpsCallable(
      functions,
      "ext-firestore-stripe-payments-createPortalLink"
    );
    const { data } = await functionRef({
      customerId: user?.uid,
      returnUrl: BASE_URL,
    });

    // Add a type to the data
    dataWithUrl = data as { url: string };
    console.log("Reroute to Stripe portal: ", dataWithUrl.url);
    console.log("Reroute to Stripe portal: ", dataWithUrl);
  } catch (error) {
    console.error(error);
  }

  return new Promise<string>((resolve, reject) => {
    if (dataWithUrl.url) {
      resolve(dataWithUrl.url);
    } else {
      reject(new Error("No url returned"));
    }
  });
};
