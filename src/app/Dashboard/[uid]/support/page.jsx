"use client";

import React from "react";
import UserTickets from "../../../../components/user/UserTickets";

const page = () => {
  return (
    <div className="min-h-screen max-w-6xl mx-auto h-full w-full p-4 pt-0 text-black flex flex-col pb-24">
      <UserTickets />
    </div>
  );
};

export default page;
