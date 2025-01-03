"use client";

import React, { useState, useEffect } from "react";
import { auth, db } from "../../../../firebase";
import { useAuth } from "../../../context/AuthProvider";
import { redirect } from "next/navigation";
import Navbar from "../../../components/customer/Navbar";
import { Footer } from "../../../components/landing-page/Footer";
import { signInWithEmailAndPassword } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";

const CustomerLogin = () => {
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uid, setUid] = useState(""); // This will be the document ID where the customer is found

  useEffect(() => {
    const fetchCustomerUid = async () => {
      if (user) {
        try {
          // Query the 'users' collection to find documents with 'customers' array
          const usersRef = collection(db, "users");
          const querySnapshot = await getDocs(usersRef);

          // Iterate through all user documents to check for the matching customer UID
          let found = false;
          querySnapshot.forEach((doc) => {
            const customers = doc.data().customers || [];
            const customer = customers.find(
              (customer) => customer.uid === user.uid
            );

            if (customer) {
              // If a match is found, set the document ID (uid)
              setUid(doc.id);
              found = true;
            }
          });

          if (!found) {
            console.log("No matching customer found in any users collection.");
          }
        } catch (error) {
          console.error("Error fetching user document: ", error);
        }
      }
    };

    // Fetch customer UID only when the user is authenticated
    if (user) {
      fetchCustomerUid();
    }
  }, [user]);

  // Redirect if the user is already logged in
  useEffect(() => {
    if (user && uid) {
      // Redirect using the fetched customer UID and current user's UID
      redirect(`/Customer/${uid}/${user.uid}`);
    }
  }, [user, uid]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col pb-24 min-h-screen h-full justify-center my-auto mx-auto w-full gap-5 px-10 pt-12 sm:px-5 text-center">
        <h1 className="-mt-">Customer Login</h1>
        {error && <div className="text-red-500">{error}</div>}
        <form
          className="flex flex-col gap-5 max-w-lg mx-auto"
          onSubmit={handleLogin}
        >
          <input
            className="border border-gray-300 rounded-md px-4 py-2"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="border border-gray-300 rounded-md px-4 py-2"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            className="duration-300 bg-confirm hover:bg-confirm/60 text-white font-bold py-2 px-4 rounded"
            type="submit"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default CustomerLogin;
