"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc, updateDoc, onSnapshot } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, db } from "../../../../../../firebase";
import { LoaderPinwheel, PlusIcon, Upload } from "lucide-react";
import ReactPaginate from "react-paginate";
import CustomerPallete from "../../../../../components/customer/CustomerPallete";
import MilestoneProgress from "../../../../../components/ProgressBar";
import { toast } from "react-toastify";
import InvoicesTable from "../../../../../components/project/InvoiceTable";

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
  const [user, setUser] = useState(null);
  const itemsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(0);
  const [uploadLimit, setUploadLimit] = useState(10);

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

    // File size and type validation
    const maxFileSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/x-icon",
      "image/gif",
      "application/pdf",
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error(
        "Invalid file type. Only images (JPG, PNG, WebP, etc.) and PDFs are allowed."
      );
      return;
    }

    if (file.size > maxFileSize) {
      toast.error("File size exceeds the 5MB limit.");
      return;
    }

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

        // Show success message
        toast.success("File uploaded successfully");

        // Clear file input
        setFile(null);
      } else {
        toast.error("User document does not exist");
        throw new Error("User document does not exist");
      }
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

  useEffect(() => {
    // Listener for auth state changes
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        router.push("/Customer/login"); // Redirect if not authenticated
      }
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, [user, router]);

  const deleteUpload = async (index) => {
    try {
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
        const updatedUploads = userData.customers[customerIndex].projects[
          projectIndex
        ].uploads.filter((_, i) => i !== index);

        // Update the Firestore document
        const updatedData = { ...userData };
        updatedData.customers[customerIndex].projects[projectIndex].uploads =
          updatedUploads;

        await updateDoc(userDocRef, updatedData);

        // Update local state
        setUploads(updatedUploads);
        toast.success("Upload deleted successfully!");
      } else {
        toast.error("User document does not exist");
        throw new Error("User document does not exist");
      }
    } catch (error) {
      console.error("Error deleting upload:", error);
      toast.error("Error deleting upload");
    }

    // Reset the file input
    const fileInput = document.getElementById("fileInput");
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const [loading, setLoading] = useState(false);
  const [invoices, setInvoices] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInvoices = async () => {
      if (!userId || !customerId || !projectId) return;

      setLoading(true);
      try {
        // Reference to the user's document
        const userRef = doc(db, "users", userId);

        // Fetch the user's document
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          throw new Error("User document not found.");
        }

        const userData = userSnap.data();
        const customers = Array.isArray(userData.customers)
          ? userData.customers
          : [];
        const customerIndex = customers.findIndex(
          (cust) => cust.uid === customerId
        );

        if (customerIndex === -1) {
          throw new Error("Customer not found.");
        }

        const projectIndex = customers[customerIndex].projects.findIndex(
          (p) => p.id === projectId
        );

        if (projectIndex === -1) {
          throw new Error("Project not found.");
        }

        const project = customers[customerIndex].projects[projectIndex];
        setInvoices(project.invoices || []); // Set invoices or an empty array if undefined
      } catch (err) {
        console.error("Error fetching invoices:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, [userId, customerId, projectId]);

  if (loading)
    return (
      <div className="min-h-screen my-auto items-center justify-center max-w-6xl mx-auto h-full w-full p-4 pt-4 text-black flex flex-col pb-24">
        <LoaderPinwheel className="animate-spin duration-300 w-8 h-8" />
      </div>
    );

  return (
    <>
      <div className="p-6 pt-8 max-w-6xl mx-auto w-full flex flex-col min-h-screen h-full pb-24">
        <div className="flex flex-col">
          <div className="flex flex-col sm:flex-row items-baseline w-full  justify-between">
            <h1 className="text-3xl border-b-2 border-black lg:text-4xl font-bold justify-between w-full flex flex-row items-baseline capitalize gap-1">
              {projectData?.name}
              <span className="hidden sm:flex text-xl text-gray-600">
                ID: {projectData?.id}
              </span>
            </h1>
          </div>
          <p className="text-lg capitalize text-gray-700">
            {projectData?.description}
          </p>
        </div>
        {projectData && (
          <div className="flex flex-col">
            <div className="mt-4 bg-white flex flex-col">
              <div className="flex flex-row items-end w-full justify-between">
                <h3 className="text-2xl font-bold mb-2">Milestones</h3>
                <div className="w-full max-w-xs flex-row justify-end hidden sm:flex">
                  <MilestoneProgress milestones={projectData.milestones} />
                </div>
              </div>
              {milestones.length > 0 ? (
                <div className="border-l-2 border-r-2 border-t-2 border-black overflow-x-auto rounded-lg shadow-md shadow-black">
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
                <p className="text-gray-600 px-2 border border-black rounded-lg p-2">
                  No milestones yet
                </p>
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
            <div className="mt-4">
              <h2 className="text-2xl font-bold mb-2">Invoices</h2>
              <InvoicesTable itemsPerPage={10} invoices={invoices} />
            </div>
            <div className="lg:flex items-center lg:flex-row">
              <div className="grid grid-cols-2 w-full gap-4">
                {/* Uploads section */}
                <div className="mt-4">
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
                        disabled={
                          !file || isLoading || uploads.length >= uploadLimit
                        }
                        className={`w-full px-4 border-2 border-black py-2 bg-gradient-to-r from-green-600 to-green-500 text-black font-semibold rounded-lg shadow-md hover:shadow-md hover:shadow-black flex items-center duration-300 justify-center gap-2 ${
                          !file || isLoading || uploads.length >= uploadLimit
                            ? "cursor-not-allowed opacity-50"
                            : ""
                        }`}
                      >
                        {uploads.length >= uploadLimit ? (
                          "Upload Limit Reached"
                        ) : isLoading ? (
                          "Uploading..."
                        ) : (
                          <p className="flex items-center gap-2">
                            <Upload className="w-5 h-5 text-center" />
                            Upload
                          </p>
                        )}
                      </button>
                    </div>
                  )}
                  {uploads.length > 0 ? (
                    <div className="">
                      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 border-2 shadow-black border-black p-2 bg-white mt-1 rounded-lg shadow-md">
                        {currentUploads.map((upload, index) => (
                          <li
                            key={index}
                            className="p-2 relative border border-black rounded-lg flex shadow-md items-center gap-2"
                          >
                            {/* Delete Button */}
                            <button
                              type="button"
                              onClick={() => deleteUpload(index)}
                              className="absolute top-0 right-0 bg-destructive text-black font-bold border-b border-l border-black rounded-bl-lg rounded-tr-md p-1 py-0.5 text-xs hover:bg-opacity-60"
                            >
                              X
                            </button>
                            {/* Image preview (if it's an image) */}
                            {upload.url &&
                              (upload.name.match(
                                /\.(jpeg|jpg|gif|png|webp|svg|ico)$/i
                              ) ? (
                                <img
                                  src={upload.url}
                                  alt={upload.name || `Upload ${index + 1}`}
                                  className="w-16 h-16 border border-black object-cover rounded-md"
                                  loading="lazy"
                                />
                              ) : null)}

                            {/* File link */}
                            <a
                              href={upload.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-destructive font-medium hover:underline truncate"
                            >
                              {upload.name || `File ${index + 1}`}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <p className="text-gray-600 px-2 border border-black rounded-lg p-2">
                      No uploads yet
                    </p>
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
                <div className="w-full">
                  <CustomerPallete
                    userId={userId}
                    customerId={customerId}
                    projectId={projectId}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CustomerProjectPage;
