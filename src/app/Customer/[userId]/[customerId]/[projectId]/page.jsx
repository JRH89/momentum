"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc, updateDoc, onSnapshot } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db } from "../../../../../../firebase";
import { useAuth } from "../../../../../context/AuthProvider";
import Link from "next/link";
import { PlusIcon, Upload } from "lucide-react";
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
      const userDocRef = doc(db, "users", userId);
      const unsubscribe = onSnapshot(userDocRef, (doc) => {
        if (doc.exists()) {
          const userData = doc.data();
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
      });
      return () => unsubscribe(); // Cleanup the listener when the component unmounts
    }
  }, [user, userId, customerId, projectId]);

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
      <div className="p-6 pt-4 max-w-6xl mx-auto w-full flex flex-col min-h-screen h-full pb-24">
        <h2 className="text-3xl capitalize font-bold">{projectData?.name}</h2>
        <p className="">ID: {projectData?.id}</p>
        <p className="">Summary: {projectData?.description}</p>
        {projectData && (
          <div>
            <div className="mt-4 bg-white p-4 border-2 border-black rounded-lg shadow-md shadow-black">
              <h3 className="text-2xl font-bold mb-2">Milestones</h3>
              {milestones.length > 0 ? (
                <div className="max-h-[calc(3*4rem)] overflow-y-auto">
                  <table className="min-w-full bg-white shadow-md text-xs sm:text-base">
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
            <div className="mt-4 bg-white p-4 border-2 border-black rounded-lg shadow-md shadow-black">
              <div className="flex flex-row gap-2 mb-2">
                <h3 className="text-2xl font-bold">Uploads</h3>
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
                <div className="mb-4 gap-2 flex flex-col">
                  <input
                    type="file"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="border rounded p-2 bg-white"
                  />
                  <button
                    onClick={handleUpload}
                    disabled={!file || isLoading}
                    className="w-full px-4 border-2 border-black py-2 bg-gradient-to-r from-green-600 to-green-500 text-black font-semibold rounded-lg shadow-md hover:shadow-md hover:shadow-black flex items-center duration-300 justify-center gap-2"
                  >
                    {isLoading ? (
                      "Uploading..."
                    ) : (
                      <p className="flex items-center gap-2">
                        <Upload className="w-5 h-5 text-center" />
                        Upload file
                      </p>
                    )}
                  </button>
                </div>
              )}

              {uploads.length > 0 ? (
                <div>
                  <ul className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 gap-4">
                    {currentUploads.map((upload, index) => (
                      <li
                        key={index}
                        className="border border-black bg-[#EAEEFE] p-2 rounded shadow-md flex items-center gap-2"
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
                          className="text-destructive hover:underline truncate"
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
        )}
      </div>
    </>
  );
};

export default CustomerProjectPage;
