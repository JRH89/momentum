"use client";

import React, { useEffect, useState } from "react";
import { db, auth } from "../../../../../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { Settings } from "lucide-react";

const Page = () => {
  const [userData, setUserData] = useState(null);
  const [invoicesPerPage, setInvoicesPerPage] = useState("");
  const [customersPerPage, setCustomersPerPage] = useState("");
  const [projectsPerPage, setProjectsPerPage] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    // Listener for auth state changes
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        router.push("/Dashboard/login"); // Redirect if not authenticated
      }
      setLoading(false); // Auth state is determined
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, [router]);

  // Fetch user data when user is available
  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            setUserData(data);
            setInvoicesPerPage(data.invoicesPerPage || 8);
            setCustomersPerPage(data.customersPerPage || 10);
            setProjectsPerPage(data.projectsPerPage || 10);
          } else {
            console.warn("User document does not exist");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserData();
  }, [user]);

  // Update user data when settings change
  useEffect(() => {
    const updateUserData = async () => {
      if (userData && user) {
        try {
          const userRef = doc(db, "users", user.uid);
          await updateDoc(userRef, {
            invoicesPerPage,
            customersPerPage,
            projectsPerPage,
          });
          console.log("User data updated successfully");
        } catch (error) {
          console.error("Error updating user data:", error);
        }
      }
    };

    updateUserData();
  }, [invoicesPerPage, customersPerPage, projectsPerPage, userData, user]);

  if (loading) {
    return (
      <div className="min-h-screen max-w-6xl mx-auto h-full w-full p-4 pt-4 text-black flex flex-col pb-24">
        Loading...
      </div>
    ); // Show loading state while auth is initializing
  }

  return (
    <>
      <div className="min-h-screen max-w-6xl mx-auto h-full w-full p-4 pt-4 text-black flex flex-col pb-24">
        <h1 className="text-3xl font-bold flex flex-row items-center gap-2">
          <Settings className="w-8 h-8" /> User Settings
        </h1>
        <div className="p-4 mt-2 gap-5 flex  flex-col border-black border-2 rounded-lg shadow-md shadow-black">
          <div className="justify-start flex flex-col">
            <h2 className="text-2xl font-bold">Invoices</h2>
            <p className="my-2 px-4 text-black">
              Invoices per page: {invoicesPerPage}
            </p>
            <div className="flex items-center gap-2 px-4">
              <button
                onClick={() => setInvoicesPerPage(invoicesPerPage - 1)}
                className="p-2 bg-green-500 font-extrabold hover:bg-opacity-60 duration-300 border-2 border-black rounded-md"
              >
                -
              </button>
              <input
                type="text"
                value={invoicesPerPage}
                onChange={(e) => setInvoicesPerPage(parseInt(e.target.value))}
                className="w-full p-2 border border-black rounded-md text-center"
              />
              <button
                onClick={() => setInvoicesPerPage(invoicesPerPage + 1)}
                className="p-2 bg-green-500 font-extrabold hover:bg-opacity-60 duration-300 border-2 border-black rounded-md"
              >
                +
              </button>
            </div>
          </div>
          <div className="mt-5">
            <h2 className="text-2xl font-bold">Customers</h2>
            <p className="my-2 px-4">Customers per page: {customersPerPage}</p>
            <div className="flex items-center gap-2 px-4">
              <button
                onClick={() => setCustomersPerPage(customersPerPage - 1)}
                className="p-2 bg-green-500 font-extrabold hover:bg-opacity-60 duration-300 border-2 border-black rounded-md"
              >
                -
              </button>
              <input
                type="text"
                value={customersPerPage}
                onChange={(e) => setCustomersPerPage(parseInt(e.target.value))}
                className="w-full p-2 border border-black rounded-md text-center"
              />
              <button
                onClick={() => setCustomersPerPage(customersPerPage + 1)}
                className="p-2 bg-green-500 font-extrabold hover:bg-opacity-60 duration-300 border-2 border-black rounded-md"
              >
                +
              </button>
            </div>
          </div>
          <div className="mt-5">
            <h2 className="text-2xl font-bold">Projects</h2>
            <p className="my-2 px-4">Projects per page: {projectsPerPage}</p>
            <div className="flex items-center gap-2 px-4">
              <button
                onClick={() => setProjectsPerPage(projectsPerPage - 1)}
                className="p-2 bg-green-500 font-extrabold hover:bg-opacity-60 duration-300 border-2 border-black rounded-md"
              >
                -
              </button>
              <input
                type="text"
                value={projectsPerPage}
                onChange={(e) => setProjectsPerPage(parseInt(e.target.value))}
                className="w-full p-2 border border-black rounded-md text-center"
              />
              <button
                onClick={() => setProjectsPerPage(projectsPerPage + 1)}
                className="p-2 bg-green-500 font-extrabold hover:bg-opacity-60 duration-300 border-2 border-black rounded-md"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
