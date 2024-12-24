"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const DashboardPage = ({ currentUser }) => {
  const router = useRouter();

  useEffect(() => {
    if (!currentUser) {
      router.push("/"); // Redirect to the login page if the user is not authenticated
    } else {
      router.push(`/Dashboard/${currentUser.uid}`); // Redirect to the user's dashboard
    }
  }, [currentUser, router]);

  return null; // No UI is needed as this is a redirect-only component
};

export default DashboardPage;
