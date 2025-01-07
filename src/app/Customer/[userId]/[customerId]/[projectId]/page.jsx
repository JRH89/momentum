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
import { ArrowLeft, PlusIcon } from "lucide-react";
import ReactPaginate from "react-paginate";
import ColorPaletteGenerator from "../../../../../components/customer/ColorPalleteGenerator";

const CustomerProjectPage = () => {
  const router = useRouter();
  const { userId, customerId, projectId } = useParams();

  const [projectData, setProjectData] = useState(null);
  const [uploads, setUploads] = useState([]);
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [milestones, setMilestones] = useState([]);

  const [showUploadMenu, setShowUploadMenu] = useState(false);

  const storage = getStorage();

  const { user } = useAuth();

  const itemsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(0);

  // Calculate the current uploads to display
  const offset = currentPage * itemsPerPage;
  const currentUploads = uploads.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(uploads.length / itemsPerPage);

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  // Fetch project data only if user is authenticated
  useEffect(() => {
    if (user && userId && customerId && projectId) {
      setIsLoading(true);
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
              setIsLoading(false);
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

        // Ensure customer and project exist
        if (customerIndex === -1 || projectIndex === -1) {
          throw new Error("Customer or project not found");
        }

        // Update project uploads as an array of objects
        const updatedUploads = [
          ...(userData.customers[customerIndex].projects[projectIndex]
            .uploads || []),
          { url: fileUrl, name: file.name }, // Object format
        ];

        // Update the Firestore document
        const updatedData = { ...userData };
        updatedData.customers[customerIndex].projects[projectIndex].uploads =
          updatedUploads;

        await updateDoc(userDocRef, updatedData);

        // Update local state
        setUploads(updatedUploads);
      } else {
        throw new Error("User document does not exist");
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
      <Link
        className="flex gap-1 text-sm sm:text-lg items-center px-6 pt-1 hover:underline"
        href={`/Customer/${userId}/${customerId}`}
      >
        <ArrowLeft className="w-5 h-5" /> Back to Dashboard
      </Link>
      <div className="p-6 pt-4 max-w-6xl mx-auto w-full flex flex-col min-h-screen h-full pb-24">
        <h1 className="text-lg sm:text-2xl font-bold">
          Project:
          <span className="font-normal text-gray-600 ml-2">
            {projectData?.id}
          </span>
        </h1>
        {projectData ? (
          <div>
            <h2 className="text-xl">{projectData.name}</h2>
            <p>{projectData.description}</p>
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Milestones</h3>
              {milestones.length > 0 ? (
                <div className="max-h-[calc(3*4rem)] overflow-y-auto">
                  <table className="min-w-full bg-white shadow-md">
                    <thead className="border bg-gray-200 border-black">
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
                            className={`px-4 py-2 capitalize font-medium ${
                              milestone.status === "completed"
                                ? "text-confirm"
                                : milestone.status === "in-progress"
                                ? "text-green-500"
                                : "text-destructive"
                            }`}
                          >
                            {milestone.status}
                          </td>
                          <td
                            className={`px-4 py-2 font-medium capitalize ${
                              milestone.priority === "high" &&
                              "text-destructive"
                            } ${
                              milestone.priority === "medium" &&
                              "text-yellow-400"
                            } ${
                              milestone.priority === "low" && "text-confirm"
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
              <div className="flex flex-row gap-2 mb-2">
                <h3 className="text-lg font-semibold">Uploads</h3>
                <button
                  className="flex flex-row items-center font-medium text-lg my-auto justify-center"
                  onClick={() => setShowUploadMenu(!showUploadMenu)}
                >
                  [
                  <PlusIcon className="w-5 h-5 text-green-500 hover:rotate-90 duration-300" />
                  ]
                </button>
              </div>
              {showUploadMenu && (
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
              )}

              {uploads.length > 0 ? (
                <div>
                  <ul className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 gap-4">
                    {currentUploads.map((upload, index) => (
                      <li
                        key={index}
                        className="border bg-white p-2 rounded shadow-md flex items-center gap-2"
                      >
                        {/* Image preview (if it's an image) */}
                        {upload.url &&
                          (upload.name.match(
                            /\.(jpeg|jpg|gif|png|webp|svg)$/i
                          ) ? (
                            <img
                              src={upload.url}
                              alt={upload.name || `Upload ${index + 1}`}
                              className="w-10 h-10 object-cover rounded"
                              loading="lazy"
                            />
                          ) : null)}

                        {/* File link */}
                        <a
                          href={upload.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline truncate"
                        >
                          {upload.name || `File ${index + 1}`}
                        </a>
                      </li>
                    ))}
                  </ul>

                  <ReactPaginate
                    previousLabel={"Previous"}
                    nextLabel={"Next"}
                    pageCount={pageCount}
                    onPageChange={handlePageChange}
                    containerClassName={
                      "flex flex-row justify-between px-4 items-center  w-full mx-auto mt-4"
                    }
                    previousLinkClassName={"  rounded"}
                    nextLinkClassName={"  rounded"}
                    disabledClassName={"opacity-50 cursor-not-allowed"}
                    activeClassName={"text-confirm font-extrabold text-white"}
                    pageClassName={"  rounded cursor-pointer"}
                    activeLinkClassName={"font-bold text-confirm"}
                  />
                </div>
              ) : (
                <p>No uploads yet.</p>
              )}
            </div>
            <ColorPaletteGenerator
              userId={userId}
              customerId={customerId}
              projectId={projectId}
            />
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
