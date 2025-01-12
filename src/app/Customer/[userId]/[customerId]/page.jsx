"use client";

import React, { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../../../firebase"; // Ensure this is your Firebase config
import { useParams, useRouter } from "next/navigation";
import Footer from "../../../../components/footer";
import Navbar from "../../../../components/customer/Navbar";
import { useAuth } from "../../../../context/AuthProvider";
import { signInWithEmailAndPassword } from "firebase/auth"; // Import Firebase authentication
import { auth } from "../../../../../firebase"; // Ensure your firebase config is properly set
import InvoicesTable from "../../../../components/customer/InvoiceTable";
import UserTickets from "../../../../components/user/UserTickets";
import { Home } from "lucide-react";

const CustomerDashboard = () => {
  const { userId, customerId } = useParams();
  const [customerData, setCustomerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const { user } = useAuth();
  const router = useRouter();

  const [invoices, setInvoices] = useState([]);

  const [stripeAccountId, setStripeAccountId] = useState(null);
  const [stripeCustomerId, setStripeCustomerId] = useState(null);

  useEffect(() => {
    const fetchCustomerData = async () => {
      if (user && userId && customerId) {
        try {
          const userRef = doc(db, "users", userId);
          const userDoc = await getDoc(userRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();

            const customer = userData.customers?.find(
              (c) => c.uid === customerId
            );

            if (customer) {
              setCustomerData(customer);
              setStripeCustomerId(customer.stripeCustomerId);
              setStripeAccountId(userData.stripeAccountId);
            } else {
              console.log("Customer not found in the customers array.");
            }
          } else {
            console.log("User document not found");
          }
        } catch (error) {
          console.error("Error fetching customer data:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchCustomerData();
  }, [userId, customerId, user]);

  useEffect(() => {
    const fetchInvoices = async () => {
      if (!stripeAccountId || !stripeCustomerId) return;

      try {
        const response = await fetch(
          `/api/stripe/invoices?stripeAccountId=${stripeAccountId}&stripeCustomerId=${stripeCustomerId}`
        );
        const data = await response.json();

        if (response.ok && data.invoices) {
          setInvoices(data.invoices || []);
        } else {
          setError(data.error || "Failed to fetch invoices");
        }
      } catch (err) {
        console.error("Error fetching invoices:", err);
        setError("Failed to fetch invoices.");
      }
    };

    if (stripeAccountId && stripeCustomerId) fetchInvoices();
  }, [stripeAccountId, stripeCustomerId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user || user.uid !== customerId) {
    return (
      <>
        <div className="flex -mt-16 flex-col p-4 max-w-6xl mx-auto w-full min-h-screen h-full my-auto items-center justify-center pb-24">
          <h1 className="text-lg text-center font-semibold mb-4">
            You must be logged in to access this page
          </h1>
          {error && <p className="text-red-500">{error}</p>}
          <form
            className="space-y-4 max-w-lg w-full mx-auto"
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin(e);
            }}
          >
            <div>
              <label htmlFor="email" className="block text-sm font-medium">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="mt-1 p-2 border rounded-md w-full"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="mt-1 p-2 border rounded-md w-full"
              />
            </div>
            <button
              type="submit"
              className="mt-4 p-2 bg-blue-500 text-white rounded-md w-full hover:bg-blue-600"
            >
              Login
            </button>
          </form>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <div className="flex flex-col p-6 max-w-6xl mx-auto w-full min-h-screen h-full pb-24">
        <div className="justify-between flex flex-row items-baseline">
          <h1 className="text-3xl lg:text-3xl flex flex-row items-center gap-2 font-bold text-black ">
            <Home className="w-8 h-8" /> Customer Dashboard
          </h1>
        </div>
        {customerData ? (
          <>
            <div className="mt-6">
              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-4">Invoices</h3>
                <InvoicesTable invoices={invoices} />
              </div>

              {customerData.projects && (
                <>
                  <h2 className="text-2xl font-bold mb-4">Projects</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {customerData.projects.map((project, index) => (
                      <div
                        key={index}
                        className="bg-[#EAEEFE] border-2 shadow-black border-black rounded-lg shadow-md p-4"
                      >
                        <h3 className="text-lg font-bold text-black mb-2">
                          {project.name}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          ID: {project.id}
                        </p>
                        <p className="text-gray-600 text-sm mb-2">
                          Descripion: {project.description}
                        </p>
                        <a
                          href={`/Customer/${userId}/${customerId}/${project.id}`}
                          className="text-confirm text-sm hover:underline duration-300 font-semibold "
                        >
                          View Details
                        </a>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2  mt-4 gap-4"></div>
          </>
        ) : (
          <p className="text-gray-500 text-center">No customer data found.</p>
        )}
      </div>
    </>
  );

  async function handleLogin(e) {
    try {
      setError(null);
      await signInWithEmailAndPassword(auth, email, password);
      router.push(`/Customer/${userId}/${customerId}`);
    } catch (err) {
      setError("Invalid email or password.");
      console.error("Login error:", err);
    }
  }
};

export default CustomerDashboard;
