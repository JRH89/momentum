"use client";

import React from "react";
import { auth, db } from "../../../../firebase";
import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthProvider";
import { redirect } from "next/navigation";

const CustomerLogin = () => {
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      console.log(user);
      redirect("/Customer/" + user.uid);
    }
  }, [user]);

  return (
    <div>
      <h1>Customer Login</h1>
      <form action="">
        <input type="email" placeholder="Email" />
        <input type="password" placeholder="Password" />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default CustomerLogin;
