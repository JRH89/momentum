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

  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  // Define items per page
  const itemsPerPages = 3;

  // Calculate current page items
  const itemOffset = currentPageIndex * itemsPerPages;
  const currentMilestones = milestones.slice(
    itemOffset,
    itemOffset + itemsPerPages
  );
  const totalPages = Math.ceil(milestones.length / itemsPerPages);

  // Handle page change
  const handlePageChanges = ({ selected }) => {
    setCurrentPageIndex(selected);
  };

  return (
    <>
      <div className="p-6 pt-8 max-w-6xl mx-auto w-full flex flex-col min-h-screen h-full pb-24">
        <h2 className="text-3xl capitalize font-bold">{projectData?.name}</h2>
        <p className="">ID: {projectData?.id}</p>
        <p className="border-b-2 border-black">
          Summary: {projectData?.description}
        </p>
        {projectData && (
          <div>
            <div className="mt-4 bg-white">
              <h3 className="text-2xl font-bold mb-2">Milestones</h3>
              {milestones.length > 0 ? (
                <div className="border-l-2 border-r-2 border-t-2 border-black rounded-lg shadow-md shadow-black">
                  <table className="min-w-full shadow-md text-xs sm:text-base">
                    <thead className="border-b-2 border-black bg-backgroundPrimary">
                      <tr>
                        <th className="px-4 py-2 text-left font-bold rounded-tl-md">
                          Title
                        </th>
                        <th className="px-4 py-2 text-left font-bold">
                          Description
                        </th>
                        <th className="px-4 py-2 text-left font-bold">
                          Status
                        </th>
                        <th className="px-4 py-2 text-left font-bold">
                          Priority
                        </th>
                        <th className="px-4 py-2 text-left font-bold rounded-tr-md">
                          Deadline
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentMilestones.map((milestone, index) => (
                        <tr key={index} className="border-b-2 border-black">
                          <td className="font-medium px-4 py-2">
                            {milestone.title}
                          </td>
                          <td className="px-4 py-2 text-black">
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
            {milestones.length > itemsPerPages && (
              <ReactPaginate
                previousLabel={"Previous"}
                nextLabel={"Next"}
                breakLabel={"..."}
                pageCount={totalPages}
                marginPagesDisplayed={2}
                pageRangeDisplayed={3}
                onPageChange={handlePageChanges}
                containerClassName="flex justify-between items-center pt-0 space-x-2 w-full px-4"
                pageClassName=" px-3 py-1"
                activeClassName=" text-confirm font-semibold"
                previousClassName="text-green-500 text-lg font-semibold px-3 py-1"
                nextClassName="text-green-500 text-lg font-semibold px-3 py-1"
                disabledClassName="cursor-not-allowed"
              />
            )}
            <div className="mt-4 ">
              <div className="flex flex-row gap-4 mb-2">
                <h3 className="text-2xl font-bold">Uploads</h3>
                <button
                  onClick={() => setShowUploadMenu(!showUploadMenu)}
                  className="hover:bg-opacity-60 duration-300 font-semibold items-center text-xl flex flex-row text-black rounded-md"
                >
                  [
                  <PlusIcon className="w-7 h-7 text-green-500 hover:rotate-90 duration-300" />
                  ]
                </button>
              </div>
              {showUploadMenu && (
                <div className="mb-4 p-4 border border-black rounded-lg gap-2 flex flex-col">
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
                <div className="border-2 border-black rounded-lg shadow-md shadow-black p-4 mb-4">
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
                </div>
              ) : (
                <p className="px-4">No uploads yet.</p>
              )}
            </div>
            {uploads.length > itemsPerPage && (
              <ReactPaginate
                previousLabel={"Previous"}
                nextLabel={"Next"}
                pageCount={pageCount}
                onPageChange={handlePageChange}
                containerClassName="flex justify-between items-center pt-0 space-x-2 w-full px-4"
                pageClassName=" px-3 py-1"
                activeClassName=" text-confirm font-semibold"
                previousClassName="text-green-500 text-lg font-semibold px-3 py-1"
                nextClassName="text-green-500 text-lg font-semibold px-3 py-1"
                disabledClassName="cursor-not-allowed"
              />
            )}
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
