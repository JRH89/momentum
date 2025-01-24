"use client";

import React, { useEffect } from "react";
import UserTickets from "../../../../components/user/UserTickets";
import { useAuth } from "../../../../context/AuthProvider";
import { useRouter } from "next/navigation";
import { auth } from "../../../../../firebase";
import { useState } from "react";
import { LoaderPinwheel } from "lucide-react";

const Page = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    // Listener for auth state changes
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        router.push("/Dashboard/login"); // Redirect if not authenticated
      }
      setLoading(false); // Auth state is determined
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
    <div className="min-h-screen max-w-6xl mx-auto h-full w-full p-4 pt-4 text-black flex flex-col pb-24 px-0 sm:px-4">
      <UserTickets />
    </div>
  );
};

export default Page;
