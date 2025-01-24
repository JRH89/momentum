"use client";

import React, { useState, useEffect } from "react";
import UserTickets from "../../../../../components/user/UserTickets";
import { useParams, useRouter } from "next/navigation";
import { auth } from "../../../../../../firebase";
import { LoaderPinwheel } from "lucide-react";

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

  if (loading)
    return (
      <div className="min-h-screen my-auto items-center justify-center max-w-6xl mx-auto h-full w-full p-4 pt-4 text-black flex flex-col pb-24">
        <LoaderPinwheel className="animate-spin duration-300 w-8 h-8" />
      </div>
    );
  return (
    <div className="min-h-screen max-w-6xl mx-auto h-full w-full p-4 pt-6 text-black flex flex-col pb-24">
      <UserTickets userId={userId} customerId={customerId} />
    </div>
  );
};

export default Page;
