"use client";

import React from "react";
import UserTickets from "../../../../../components/user/UserTickets";
import { useParams } from "next/navigation";

const Page = () => {
  const { userId, customerId } = useParams();
  return (
    <div className="min-h-screen max-w-6xl mx-auto h-full w-full p-4 pt-4 text-black flex flex-col pb-24">
      <UserTickets userId={userId} customerId={customerId} />
    </div>
  );
};

export default Page;
