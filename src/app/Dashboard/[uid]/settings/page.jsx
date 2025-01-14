"use client";

import React, { useEffect, useState } from "react";
import { db } from "../../../../../firebase";
import { useAuth } from "../../../../context/AuthProvider";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { Settings } from "lucide-react";

const Page = () => {
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);
  const [invoicesPerPage, setInvoicesPerPage] = useState("");
  const [customersPerPage, setCustomersPerPage] = useState("");
  const [projectsPerPage, setProjectsPerPage] = useState("");

  const router = useRouter();

  useEffect(() => {
    if (user) {
      const docRef = doc(db, "users", user.uid);
      getDoc(docRef)
        .then((doc) => {
          if (doc.exists()) {
            setUserData(doc.data());
            setInvoicesPerPage(doc.data().invoicesPerPage);
            setCustomersPerPage(doc.data().customersPerPage);
            setProjectsPerPage(doc.data().projectsPerPage);
          } else {
            console.warn("User document does not exist");
          }
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
    }
  }, [user]);

  useEffect(() => {
    if (userData && user) {
      const userRef = doc(db, "users", user.uid);
      updateDoc(userRef, {
        invoicesPerPage,
        customersPerPage,
        projectsPerPage,
      })
        .then(() => {
          console.log("User data updated successfully");
        })
        .catch((error) => {
          console.error("Error updating user data:", error);
        });
    }
  }, [invoicesPerPage, customersPerPage, projectsPerPage, userData, user]);

  useEffect(() => {
    if (!user) {
      router.push("/Dashboard/login"); // Redirect to home if user is not logged in
    }
  }, [user, router]);

  return (
    <>
      <div className="min-h-screen max-w-6xl mx-auto h-full w-full p-4 pt-0 text-black flex flex-col pb-24">
        <h1 className="text-3xl font-bold flex flex-row items-center gap-2">
          <Settings className="w-8 h-8" /> User Settings
        </h1>
        <div className="p-4 mt-2 gap-5 flex  flex-col border-black border-2 rounded-lg shadow-md shadow-black">
          <div className="justify-start flex flex-col">
            <h2 className="text-2xl font-bold">Invoices</h2>
            <p className="my-2">Invoices per page: {invoicesPerPage}</p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setInvoicesPerPage(invoicesPerPage - 1)}
                className="p-2 bg-green-500 font-extrabold hover:bg-opacity-60 duration-300 border border-black rounded-md"
              >
                -
              </button>
              <input
                type="text"
                value={invoicesPerPage}
                onChange={(e) => setInvoicesPerPage(parseInt(e.target.value))}
                className="w-full p-2 border rounded-md text-center"
              />
              <button
                onClick={() => setInvoicesPerPage(invoicesPerPage + 1)}
                className="p-2 bg-green-500 font-extrabold hover:bg-opacity-60 duration-300 border border-black rounded-md"
              >
                +
              </button>
            </div>
          </div>
          <div className="mt-5">
            <h2 className="text-2xl font-bold">Customers</h2>
            <p className="my-2">Customers per page: {customersPerPage}</p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCustomersPerPage(customersPerPage - 1)}
                className="p-2 bg-green-500 font-extrabold hover:bg-opacity-60 duration-300 border border-black rounded-md"
              >
                -
              </button>
              <input
                type="text"
                value={customersPerPage}
                onChange={(e) => setCustomersPerPage(parseInt(e.target.value))}
                className="w-full p-2 border rounded-md text-center"
              />
              <button
                onClick={() => setCustomersPerPage(customersPerPage + 1)}
                className="p-2 bg-green-500 font-extrabold hover:bg-opacity-60 duration-300 border border-black rounded-md"
              >
                +
              </button>
            </div>
          </div>
          <div className="mt-5">
            <h2 className="text-2xl font-bold">Projects</h2>
            <p className="my-2">Projects per page: {projectsPerPage}</p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setProjectsPerPage(projectsPerPage - 1)}
                className="p-2 bg-green-500 font-extrabold hover:bg-opacity-60 duration-300 border border-black rounded-md"
              >
                -
              </button>
              <input
                type="text"
                value={projectsPerPage}
                onChange={(e) => setProjectsPerPage(parseInt(e.target.value))}
                className="w-full p-2 border rounded-md text-center"
              />
              <button
                onClick={() => setProjectsPerPage(projectsPerPage + 1)}
                className="p-2 bg-green-500 font-extrabold hover:bg-opacity-60 duration-300 border border-black rounded-md"
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
