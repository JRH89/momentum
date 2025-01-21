"use client";

import React, { useState, useEffect } from "react";
import { auth, db } from "../../../../firebase";
import { useAuth } from "../../../context/AuthProvider";
import { redirect } from "next/navigation";
import Navbar from "../../../components/customer/Navbar";
import { Footer } from "../../../components/landing-page/Footer";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
import { set } from "date-fns";

const CustomerLogin = () => {
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false); // Track visibility
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uid, setUid] = useState(""); // This will be the document ID where the customer is found
  const [isFirstTime, setIsFirstTime] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false); // Track reset email status

  useEffect(() => {
    const fetchCustomerUid = async () => {
      if (user) {
        try {
          const usersRef = collection(db, "users");
          const querySnapshot = await getDocs(usersRef);
          let found = false;
          querySnapshot.forEach((doc) => {
            const customers = doc.data().customers || [];
            const customer = customers.find(
              (customer) => customer.uid === user.uid
            );
            if (customer) {
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

    if (user) {
      fetchCustomerUid();
    }
  }, [user]);

  useEffect(() => {
    if (user && uid) {
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

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email);
      setResetEmailSent(true);
      setEmail("");
      toast.success("Password reset email sent.");
      setError("");
    } catch (err) {
      setError(err.message);
      setResetEmailSent(false);
      toast.error("Error sending password reset email.");
    }
  };

  return (
    <div className="flex flex-col  min-h-screen h-full justify-center my-auto mx-auto w-full gap-5 px-10 sm:px-5 text-center">
      <h1 className="text-3xl sm:text-4xl font-semibold">Customer Login</h1>
      {error && <div className="text-red-500">{error}</div>}
      {!isFirstTime ? (
        <form
          className="flex flex-col gap-5 max-w-sm w-full mx-auto"
          onSubmit={handleLogin}
        >
          <input
            className="border-2 shadow-md border-black rounded-md px-4 py-2"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <div className="relative">
            <input
              className="border-2 shadow-md border-black rounded-md px-4 py-2 w-full"
              type={passwordVisible ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div
              className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer"
              onClick={() => setPasswordVisible(!passwordVisible)}
            >
              {passwordVisible ? (
                <EyeOff className="text-gray-600" size={20} />
              ) : (
                <Eye className="text-gray-600" size={20} />
              )}
            </div>
          </div>
          <button
            className="duration-300 border-2 border-black bg-confirm shadow-md shadow-black hover:shadow-lg hover:shadow-black text-black font-bold py-2 px-4 rounded-lg"
            type="submit"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      ) : (
        <form
          className="flex flex-col gap-5 max-w-sm w-full mx-auto"
          onSubmit={handlePasswordReset}
        >
          <input
            className="border-2 shadow-md border-black rounded-md px-4 py-2"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button
            className="duration-300 border-2 border-black bg-confirm shadow-md shadow-black hover:shadow-lg hover:shadow-black text-black font-bold py-2 px-4 rounded-lg"
            type="submit"
          >
            Send Email
          </button>
        </form>
      )}
      <div className="text-sm font-semibold mt-4">
        {isFirstTime ? (
          <p>
            Already have an account?{" "}
            <button
              className="text-green-500 underline"
              onClick={() => setIsFirstTime(false)}
            >
              Sign In
            </button>
          </p>
        ) : (
          <p className="text-sm font-semibold mt-4">
            Signing in for the first time?{" "}
            <button
              className="text-green-500 underline"
              onClick={() => setIsFirstTime(true)}
            >
              Set Your Password
            </button>
          </p>
        )}
      </div>
    </div>
  );
};

export default CustomerLogin;
