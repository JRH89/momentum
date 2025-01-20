import React from "react";
import SignIn from "../../../components/user/SignIn";

const Page = () => {
  return (
    <div className="min-h-screen max-w-6xl mx-auto h-full w-full p-4 pt-4 justify-center items-center text-black flex flex-col pb-24">
      <h1 className="text-4xl lg:text-5xl text-center font-bold mb-4">Login</h1>
      <SignIn />
    </div>
  );
};

export default Page;
