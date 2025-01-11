"use client";

import React, { useEffect, useState } from "react";
import { db } from "../../../../../firebase";
import { useAuth } from "../../../../context/AuthProvider";
import { collection, doc, getDoc, updateDoc } from "firebase/firestore";
import Footer from "../../../../components/footer";

const Page = () => {
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);
  const [invoicesPerPage, setInvoicesPerPage] = useState("");
  const [customersPerPage, setCustomersPerPage] = useState("");

  useEffect(() => {
    if (user) {
      const docRef = doc(db, "users", user.uid);
      getDoc(docRef)
        .then((doc) => {
          if (doc.exists()) {
            setUserData(doc.data());
            setInvoicesPerPage(doc.data().invoicesPerPage);
            setCustomersPerPage(doc.data().customersPerPage);
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
      })
        .then(() => {
          console.log("User data updated successfully");
        })
        .catch((error) => {
          console.error("Error updating user data:", error);
        });
    }
  }, [invoicesPerPage, customersPerPage, userData, user]);

  return (
    <>
      <div className="min-h-screen max-w-6xl mx-auto h-full w-full p-4 pt-0 text-black flex flex-col pb-24">
        <h1 className="text-3xl font-bold">User Settings</h1>

        <div className="mt-5 justify-start flex flex-col">
          <h2 className="text-2xl font-bold">Invoices</h2>
          <p className="mt-2">Invoices per page: {invoicesPerPage}</p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setInvoicesPerPage(invoicesPerPage - 1)}
              className="p-2 bg-gray-300 rounded-md"
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
              className="p-2 bg-gray-300 rounded-md"
            >
              +
            </button>
          </div>
        </div>

        <div className="mt-5">
          <h2 className="text-2xl font-bold">Customers</h2>
          <p className="mt-2">Customers per page: {customersPerPage}</p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCustomersPerPage(customersPerPage - 1)}
              className="p-2 bg-gray-300 rounded-md"
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
              className="p-2 bg-gray-300 rounded-md"
            >
              +
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Page;
