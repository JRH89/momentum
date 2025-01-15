"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../../../firebase";

const Page = () => {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      router.push(`/Customer/login`);
    });
    return () => unsubscribe();
  }, [router]);

  return null; // No UI is needed as this is a redirect-only component
};

export default Page;
