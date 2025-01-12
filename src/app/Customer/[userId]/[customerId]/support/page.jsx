"use client";

import React from "react";
import UserTickets from "../../../../../components/user/UserTickets";
import { redirect, useParams } from "next/navigation";
import { useAuth } from "../../../../../context/AuthProvider";

const Page = () => {
  const { user } = useAuth();
  const { userId, customerId } = useParams();

  if (!user || user.uid !== customerId) {
    redirect("/Customer/login");
  }

  return (
    <div className="min-h-screen max-w-6xl mx-auto h-full w-full p-4 pt-4 text-black flex flex-col pb-24">
      <UserTickets userId={userId} customerId={customerId} />
    </div>
  );
};

export default Page;
