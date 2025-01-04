"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db } from "../../../../../../firebase"; // Adjust the path as per your Firebase setup
import Navbar from "../../../../../components/customer/Navbar";
import { Footer } from "../../../../../components/landing-page/Footer";
import Image from "next/image";
import { useAuth } from "../../../../../context/AuthProvider";
import Link from "next/link";

const CustomerProjectPage = () => {
  const router = useRouter();
  const { userId, customerId, projectId } = useParams();

  const [projectData, setProjectData] = useState(null);
  const [uploads, setUploads] = useState([]);
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [milestones, setMilestones] = useState([]);

  const storage = getStorage();

  const { user } = useAuth();

  // Fetch project data only if user is authenticated
  useEffect(() => {
    if (user && userId && customerId && projectId) {
      const fetchData = async () => {
        const userDocRef = doc(db, "users", userId);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          const customer = userData.customers.find(
            (cust) => cust.uid === customerId
          );
          if (customer) {
            const project = customer.projects.find(
              (proj) => proj.id === projectId
            );
            if (project) {
              setProjectData(project);
              setUploads(project.uploads || []);
              setMilestones(project.milestones || []);
            }
          }
        } else {
          router.push("/Customer/login");
        }
      };

      fetchData();
    }
  }, [user, userId, customerId, projectId]); // Only fetch data after user is available

  // Handle file upload
  const handleUpload = async () => {
    if (!file) return;
    setIsLoading(true);

    try {
      const storageRef = ref(
        storage,
        `uploads/${userId}/${customerId}/${projectId}/${file.name}`
      );
      await uploadBytes(storageRef, file);

      const fileUrl = await getDownloadURL(storageRef);
      const userDocRef = doc(db, "users", userId);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        const customerIndex = userData.customers.findIndex(
          (cust) => cust.uid === customerId
        );
        const projectIndex = userData.customers[
          customerIndex
        ].projects.findIndex((proj) => proj.id === projectId);

        // Update project uploads
        userData.customers[customerIndex].projects[projectIndex].uploads = [
          ...(userData.customers[customerIndex].projects[projectIndex]
            .uploads || []),
          fileUrl,
        ];

        await updateDoc(userDocRef, userData);
        setUploads(
          userData.customers[customerIndex].projects[projectIndex].uploads
        );
      }

      setFile(null);
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="p-6 max-w-6xl mx-auto w-full flex flex-col min-h-screen h-full">
        <h1 className="text-2xl font-bold">Project Details</h1>
        {projectData ? (
          <div>
            <h2 className="text-xl">Title: {projectData.name}</h2>
            <p>Desc: {projectData.description}</p>
            <p>ID: {projectData.id}</p>
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Milestones</h3>
              {milestones.length > 0 ? (
                <div className="max-h-[calc(5*4rem)] overflow-y-auto">
                  <table className="min-w-full bg-white shadow-md">
                    <thead className="border border-black">
                      <tr>
                        <th className="px-4 py-2 text-left font-bold">Title</th>
                        <th className="px-4 py-2 text-left font-bold">
                          Description
                        </th>
                        <th className="px-4 py-2 text-left font-bold">
                          Status
                        </th>
                        <th className="px-4 py-2 text-left font-bold">
                          Priority
                        </th>
                        <th className="px-4 py-2 text-left font-bold">
                          Deadline
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {milestones.map((milestone, index) => (
                        <tr key={index} className="border border-black">
                          <td className="font-medium px-4 py-2">
                            {milestone.title}
                          </td>
                          <td className="px-4 py-2 text-gray-600">
                            {milestone.description}
                          </td>
                          <td
                            className={`px-4 py-2 font-medium ${
                              milestone.status === "completed"
                                ? "text-green-500"
                                : "text-red-500"
                            }`}
                          >
                            {milestone.status}
                          </td>
                          <td
                            className={`px-4 py-2 font-medium capitalize ${
                              milestone.priority === "high" && "text-red-500"
                            } ${
                              milestone.priority === "medium" &&
                              "text-yellow-500"
                            } ${
                              milestone.priority === "low" && "text-green-500"
                            }`}
                          >
                            {milestone.priority}
                          </td>
                          <td className="px-4 py-2 font-medium">
                            {milestone.deadline}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p>No milestones yet.</p>
              )}
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Uploads</h3>
              <div className="mb-4 gap-2 flex flex-row">
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="border rounded p-2 bg-white"
                />
                <button
                  onClick={handleUpload}
                  disabled={!file || isLoading}
                  className="bg-confirm text-white px-4 py-2 rounded hover:bg-opacity-60 duration-300 cursor-pointer"
                >
                  {isLoading ? "Uploading..." : "Upload File"}
                </button>
              </div>
              {uploads.length > 0 ? (
                <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {uploads.map((upload, index) => (
                    <li
                      key={index}
                      className="border bg-white p-2 rounded shadow-md"
                    >
                      <Image
                        width={200}
                        height={200}
                        src={upload}
                        alt={`Upload ${index + 1}`}
                        className="object-fit w-full h-full rounded"
                        onError={(e) => {
                          e.target.style.display = "none"; // Hide broken image
                          e.target.nextElementSibling.style.display = "block"; // Show link instead
                        }}
                      />
                      <a
                        href={upload}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 break-words underline hidden"
                      >
                        {upload.split("/").pop()}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No uploads yet.</p>
              )}
            </div>
          </div>
        ) : (
          <>
            <p>
              Please{" "}
              <Link className="underline text-green-500" href="/Customer/login">
                Login
              </Link>
            </p>
          </>
        )}
      </div>
      <Footer />
    </>
  );
};

export default CustomerProjectPage;
