"use client";

import React, { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Firebase Storage imports
import { db, storage } from "../../../../../firebase"; // Ensure this is your Firebase config
import { useParams, useRouter } from "next/navigation";
import { Footer } from "../../../../components/landing-page/Footer";
import Navbar from "../../../../components/customer/Navbar";
import { useAuth } from "../../../../context/AuthProvider";
import { signInWithEmailAndPassword } from "firebase/auth"; // Import Firebase authentication
import { auth } from "../../../../../firebase"; // Ensure your firebase config is properly set

const CustomerDashboard = () => {
  const { userId, customerId } = useParams();
  const [customerData, setCustomerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const [file, setFile] = useState(null); // State for file upload
  const [uploadError, setUploadError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(null);

  const { user } = useAuth();
  const router = useRouter();

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

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!file || !user) {
      setUploadError("Please select a file and ensure you are logged in.");
      return;
    }

    try {
      setUploadError(null);
      setUploadSuccess(null);

      const fileRef = ref(storage, `uploads/${user.uid}/${file.name}`);
      await uploadBytes(fileRef, file);
      const downloadURL = await getDownloadURL(fileRef);

      setUploadSuccess(`File uploaded successfully: ${downloadURL}`);
    } catch (error) {
      console.error("Upload error:", error);
      setUploadError("Failed to upload the file. Please try again.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user || user.uid !== customerId) {
    return (
      <>
        <Navbar />
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
      <Navbar />
      <div className="flex flex-col p-6 max-w-6xl mx-auto w-full min-h-screen h-full pb-24">
        <h1 className="text-2xl font-bold text-black mb-6">
          Customer Dashboard
        </h1>
        {customerData ? (
          <div className="bg-white shadow-md rounded-lg p-6">
            <p className="text-lg medium ">Name: {customerData.name}</p>
            <p className="text-lg medium ">Email: {customerData.email}</p>
            <p className="text-lg medium mb-4">ID: {customerData.uid}</p>
            {customerData.projects && (
              <>
                <h2 className="text-xl font-bold text-gray-700 mb-4">
                  Projects
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {customerData.projects.map((project, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 border border-gray-200 rounded-lg shadow-md p-4 hover:shadow-lg transition duration-300"
                    >
                      <h3 className="text-lg font-bold text-gray-800 mb-2">
                        {project.name}
                      </h3>
                      <p className="text-gray-600 text-sm">ID: {project.id}</p>
                      <p className="text-gray-600 text-sm mb-4">
                        Descripion: {project.description}
                      </p>
                      <a
                        href={`/Customer/${userId}/${customerId}/${project.id}`}
                        className="text-blue-500 text-sm hover:text-blue-700"
                      >
                        View Details
                      </a>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        ) : (
          <p className="text-gray-500 text-center">No customer data found.</p>
        )}
      </div>
      <Footer />
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
