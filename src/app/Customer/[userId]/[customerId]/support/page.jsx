"use client";

import React, { useState, useEffect } from "react";
import UserTickets from "../../../../../components/user/UserTickets";
import { useParams, useRouter } from "next/navigation";
import { auth } from "../../../../../../firebase";

const Page = () => {
  const { userId, customerId } = useParams();

  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    // Listener for auth state changes
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        router.push("/Customer/login"); // Redirect if not authenticated
      }
      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, [router]);

  if (loading) {
    return <div>Loading...</div>; // Show loading state while auth is initializing
  }

  return (
    <div className="min-h-screen max-w-6xl mx-auto h-full w-full p-4 pt-6 text-black flex flex-col pb-24">
      <UserTickets userId={userId} customerId={customerId} />
    </div>
  );
};

export default Page;
