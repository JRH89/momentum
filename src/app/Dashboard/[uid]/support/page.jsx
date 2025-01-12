"use client";

import React, { useEffect } from "react";
import UserTickets from "../../../../components/user/UserTickets";
import { useAuth } from "../../../../context/AuthProvider";
import { useRouter } from "next/navigation";

const Page = () => {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/Dashboard/login"); // Redirect to home if user is not logged in
    }
  }, [user, router]);

  return (
    <div className="min-h-screen max-w-6xl mx-auto h-full w-full p-4 pt-4 text-black flex flex-col pb-24">
      <UserTickets />
    </div>
  );
};

export default Page;
