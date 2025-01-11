"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { db } from "../../../../../firebase";
import { collection, getDoc, doc } from "firebase/firestore";
import Footer from "../../../../components/footer";

const Page = () => {
  const { uid } = useParams();
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      if (!uid) return; // Ensure `uid` is valid.

      try {
        // Reference the user document in the Firestore database.
        const userRef = doc(db, "users", uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          const customers = Array.isArray(userData.customers)
            ? userData.customers
            : [];

          // Extract and combine all projects from each customer.
          const allProjects = customers.flatMap((customer) =>
            Array.isArray(customer.projects) ? customer.projects : []
          );

          setProjects(allProjects); // Set the combined projects list.
        } else {
          console.warn("User document does not exist!");
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, [uid]);

  return (
    <>
      <div className="min-h-screen max-w-6xl mx-auto h-full w-full p-4 pt-0 text-black flex flex-col pb-24">
        <h1 className="text-3xl font-semibold">Projects</h1>
        {projects.length > 0 ? (
          <div className="grid gap-4 mt-4">
            {projects.map((project, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-4">
                <h2 className="text-lg font-semibold">{project.name}</h2>
                <p className="text-gray-600">{project.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-gray-500">No projects found.</p>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Page;
