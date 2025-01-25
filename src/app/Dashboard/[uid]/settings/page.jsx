"use client";

import React, { useEffect, useState } from "react";
import { db, auth } from "../../../../../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { LoaderPinwheel, Settings } from "lucide-react";

const Page = () => {
  const [userData, setUserData] = useState(null);
  const [invoicesPerPage, setInvoicesPerPage] = useState("");
  const [customersPerPage, setCustomersPerPage] = useState("");
  const [projectsPerPage, setProjectsPerPage] = useState("");
  const [milestonesPerPage, setMilestonesPerPage] = useState("");
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
            setMilestonesPerPage(data.milestonesPerPage || 5);
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
            milestonesPerPage,
          });
          console.log("User data updated successfully");
        } catch (error) {
          console.error("Error updating user data:", error);
        }
      }
    };

    updateUserData();
  }, [
    invoicesPerPage,
    customersPerPage,
    projectsPerPage,
    milestonesPerPage,
    userData,
    user,
  ]);

  if (loading)
    return (
      <div className="min-h-screen my-auto items-center justify-center max-w-6xl mx-auto h-full w-full p-4 pt-4 text-black flex flex-col pb-24">
        <LoaderPinwheel className="animate-spin duration-300 w-8 h-8" />
      </div>
    );

  return (
    <>
      <div className="min-h-screen max-w-6xl mx-auto h-full w-full p-4 pt-4 text-black flex flex-col pb-12">
        <h1 className="text-3xl font-bold flex flex-row items-center gap-2">
          <Settings className="w-8 h-8" /> User Settings
        </h1>
        <div className="p-4 pt-2 px-1 sm:px-4 mt-2 gap-5 flex flex-col">
          <div className="justify-start flex flex-col">
            <h2 className="text-2xl font-bold mb-2">Invoices</h2>
            <div className="flex flex-col p-4 rounded-lg border-2 border-black">
              <p className="mb-1 text-black">Invoices per page:</p>
              <div className="flex items-center gap-2">
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
                  className="w-full p-2 font-bold border border-black rounded-md text-center"
                />
                <button
                  onClick={() => setInvoicesPerPage(invoicesPerPage + 1)}
                  className="p-2 bg-green-500 font-extrabold hover:bg-opacity-60 duration-300 border-2 border-black rounded-md"
                >
                  +
                </button>
              </div>
            </div>
          </div>
          <div className="">
            <h2 className="text-2xl font-bold mb-2">Customers</h2>
            <div className="flex flex-col p-4 rounded-lg border-2 border-black">
              <p className="mb-1">Customers per page:</p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCustomersPerPage(customersPerPage - 1)}
                  className="p-2 bg-green-500 font-extrabold hover:bg-opacity-60 duration-300 border-2 border-black rounded-md"
                >
                  -
                </button>
                <input
                  type="text"
                  value={customersPerPage}
                  onChange={(e) =>
                    setCustomersPerPage(parseInt(e.target.value))
                  }
                  className="w-full p-2 border font-bold border-black rounded-md text-center"
                />
                <button
                  onClick={() => setCustomersPerPage(customersPerPage + 1)}
                  className="p-2 bg-green-500 font-extrabold hover:bg-opacity-60 duration-300 border-2 border-black rounded-md"
                >
                  +
                </button>
              </div>
            </div>
          </div>
          <div className="">
            <h2 className="text-2xl font-bold mb-2">Projects</h2>
            <div className="flex flex-col p-4 rounded-lg border-2 border-black">
              <p className="mb-1">Projects per page:</p>
              <div className="flex items-center gap-2">
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
                  className="w-full font-bold p-2 border border-black rounded-md text-center"
                />
                <button
                  onClick={() => setProjectsPerPage(projectsPerPage + 1)}
                  className="p-2 bg-green-500 font-extrabold hover:bg-opacity-60 duration-300 border-2 border-black rounded-md"
                >
                  +
                </button>
              </div>
              <div className="">
                <p className="mt-2 mb-1">Milestones per page:</p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setMilestonesPerPage(milestonesPerPage - 1)}
                    className="p-2 bg-green-500 font-extrabold hover:bg-opacity-60 duration-300 border-2 border-black rounded-md"
                  >
                    -
                  </button>
                  <input
                    type="text"
                    value={milestonesPerPage}
                    onChange={(e) =>
                      setMilestonesPerPage(parseInt(e.target.value))
                    }
                    className="w-full font-bold p-2 border border-black rounded-md text-center"
                  />
                  <button
                    onClick={() => setMilestonesPerPage(milestonesPerPage + 1)}
                    className="p-2 bg-green-500 font-extrabold hover:bg-opacity-60 duration-300 border-2 border-black rounded-md"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
