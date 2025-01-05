"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../../../firebase";

const DashboardPage = () => {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.push("/"); // Redirect if user is not authenticated
      } else {
        router.push(`/Dashboard/${user.uid}`);
      }
    });
    return () => unsubscribe();
  }, [router]);

  return null; // No UI is needed as this is a redirect-only component
};

export default DashboardPage;
