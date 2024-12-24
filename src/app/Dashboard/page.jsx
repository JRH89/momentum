"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const DashboardPage = ({ currentUser }) => {
  const router = useRouter();

  useEffect(() => {
    if (currentUser) {
      router.push(`/Dashboard/${currentUser.uid}`);
    }
  }, [currentUser, router]);

  if (!currentUser) {
    router.push("/"); // Optionally render a loader or redirect to login
  }

  return null; // You might not need any UI since you are redirecting
};

export default DashboardPage;
