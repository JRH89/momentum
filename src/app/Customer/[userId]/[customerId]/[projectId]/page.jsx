"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
// Import db and auth from your Firebase setup
import { db, auth } from "../../../../../../firebase"; // Adjust the path as per your Firebase setup
import NavBar from "../../../../../components/navbar";
import Footer from "../../../../../components/footer";
import Image from "next/image";

const CustomerProjectPage = () => {
  const router = useRouter();
  const { userId, customerId, projectId } = useParams();

  const [projectData, setProjectData] = useState(null);
  const [uploads, setUploads] = useState([]);
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [milestones, setMilestones] = useState([]);

  const storage = getStorage();

  // Fetch project data
  useEffect(() => {
    if (userId && customerId && projectId) {
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
        }
      };

      fetchData();
    }
  }, [userId, customerId, projectId]);

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
      <NavBar />
      <div className="p-6 max-w-6xl mx-auto w-full flex flex-col min-h-screen h-full">
        <h1 className="text-2xl font-bold">Project Details</h1>

        {projectData ? (
          <div>
            <h2 className="text-xl">{projectData.name}</h2>
            <p>{projectData.description}</p>

            <div className="mt-4">
              <h3 className="text-lg font-semibold">Milestones</h3>
              {milestones.length > 0 ? (
                <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {milestones.map((milestone, index) => (
                    <li key={index} className="border p-2 rounded shadow-md">
                      <h4 className="font-bold">{milestone.title}</h4>
                      <p className="text-sm text-gray-600">
                        {milestone.description}
                      </p>
                      <p>
                        Status:{" "}
                        <span
                          className={`font-medium ${
                            milestone.status === "completed"
                              ? "text-green-500"
                              : "text-red-500"
                          } `}
                        >
                          {milestone.status}
                        </span>
                      </p>
                      <p>
                        Priority:{" "}
                        <span
                          className={`${
                            milestone.priority === "high" && "text-red-500"
                          } ${
                            milestone.priority === "medium" && "text-yellow-500"
                          } ${
                            milestone.priority === "low" && "text-green-500"
                          } font-medium capitalize`}
                        >
                          {milestone.priority}
                        </span>
                      </p>
                      <p>
                        Deadline:{" "}
                        <span className="font-medium">
                          {milestone.deadline}
                        </span>
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No milestones yet.</p>
              )}
            </div>

            <div className="mt-4">
              <h3 className="text-lg font-semibold">Uploads</h3>
              {uploads.length > 0 ? (
                <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {uploads.map((upload, index) => (
                    <li key={index} className="border p-2 rounded shadow-md">
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

            <div className="mt-4">
              <input
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
                className="border rounded p-2"
              />
              <button
                onClick={handleUpload}
                disabled={!file || isLoading}
                className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
              >
                {isLoading ? "Uploading..." : "Upload File"}
              </button>
            </div>
          </div>
        ) : (
          <p>Loading project data...</p>
        )}
      </div>
      <Footer />
    </>
  );
};

export default CustomerProjectPage;
