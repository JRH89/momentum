"use client";

import React, { useState, useEffect } from "react";
import { db, storage } from "../../../../../../firebase";
import {
  arrayRemove,
  doc,
  getDoc,
  runTransaction,
  updateDoc,
} from "firebase/firestore";
import { useParams } from "next/navigation";
import { Plus, Upload } from "lucide-react";
import ColorPaletteGenerator from "../../../../../components/customer/ColorPalleteGenerator";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { toast } from "react-toastify";
import ReactPaginate from "react-paginate";
import MilestoneProgress from "../../../../../components/ProgressBar";
import confetti from "canvas-confetti";

interface Milestone {
  id: string;
  title: string;
  description: string;
  status: string; // 'pending', 'in-progress', 'completed'
  deadline: string;
  priority: string;
}

const ProjectPage = () => {
  const { uid, stripeCustomerId, projectId } = useParams() as {
    uid: string;
    stripeCustomerId: string;
    projectId: string;
  };

  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [newMilestone, setNewMilestone] = useState({
    title: "",
    description: "",
    deadline: "",
    priority: "",
  });
  const [milestoneError, setMilestoneError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [project, setProject] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploads, setUploads] = useState<{ name: string; url: string }[]>([]);
  const [userData, setUserData] = useState<any>(null);

  const [showUploadForm, setShowUploadForm] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        // Fetch the user document from Firestore
        const userRef = doc(db, "users", uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const userData = userSnap.data();
          const customer = (userData.customers || []).find(
            (cust: { stripeCustomerId: string }) =>
              cust.stripeCustomerId === stripeCustomerId
          );

          if (customer && Array.isArray(customer.projects)) {
            // Find the project by its ID
            const foundProject =
              customer.projects.find(
                (p: { id: string }) => p.id === projectId
              ) || null;
            if (foundProject) {
              setUserData(userData);
              setProject(foundProject);
              setMilestones(foundProject.milestones || []);
              setUploads(foundProject.uploads || []);
              setIsCompleted(foundProject.isCompleted || false);
            }
          }
        }
      } catch (err) {
        console.error("Error fetching project:", err);
        setError("Failed to fetch project.");
      }
    };

    fetchProject();
  }, [uid, stripeCustomerId, projectId]);

  const handleAddMilestone = async () => {
    if (
      !newMilestone.title ||
      !newMilestone.description ||
      !newMilestone.deadline ||
      !newMilestone.priority
    ) {
      setMilestoneError(
        "Please provide a title, description, deadline, and priority for the milestone."
      );
      return;
    }

    try {
      const milestone = {
        id: crypto.randomUUID(),
        title: newMilestone.title,
        description: newMilestone.description,
        status: "pending",
        deadline: newMilestone.deadline,
        priority: newMilestone.priority,
      };

      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        const customers = Array.isArray(userData.customers)
          ? userData.customers
          : [];
        const customerIndex = customers.findIndex(
          (cust: { stripeCustomerId: string }) =>
            cust.stripeCustomerId === stripeCustomerId
        );

        if (customerIndex >= 0) {
          const projectIndex = customers[customerIndex].projects.findIndex(
            (p: { id: string }) => p.id === projectId
          );

          if (projectIndex >= 0) {
            const existingMilestones = Array.isArray(
              customers[customerIndex].projects[projectIndex].milestones
            )
              ? customers[customerIndex].projects[projectIndex].milestones
              : [];
            const updatedMilestones = [...existingMilestones, milestone];

            customers[customerIndex].projects[projectIndex].milestones =
              updatedMilestones;

            await updateDoc(userRef, {
              customers,
            });

            setMilestones(updatedMilestones);
            setNewMilestone({
              title: "",
              description: "",
              deadline: "",
              priority: "",
            });
            setMilestoneError(null);
          }
        }
      }
    } catch (err) {
      console.error("Error adding milestone:", err);
      setMilestoneError("Failed to add milestone.");
    }
  };

  const handleChangeStatus = async (milestoneId: string, newStatus: string) => {
    try {
      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        const customers = Array.isArray(userData.customers)
          ? userData.customers
          : [];
        const customerIndex = customers.findIndex(
          (cust: { stripeCustomerId: string }) =>
            cust.stripeCustomerId === stripeCustomerId
        );

        if (customerIndex >= 0) {
          const projectIndex = customers[customerIndex].projects.findIndex(
            (p: { id: string }) => p.id === projectId
          );

          if (projectIndex >= 0) {
            const project = customers[customerIndex].projects[projectIndex];
            const updatedMilestones = project.milestones.map(
              (milestone: Milestone) =>
                milestone.id === milestoneId
                  ? { ...milestone, status: newStatus }
                  : milestone
            );

            customers[customerIndex].projects[projectIndex].milestones =
              updatedMilestones;

            await updateDoc(userRef, {
              customers,
            });

            setMilestones(updatedMilestones); // Update local state with the updated milestones
          }
        }
      }
    } catch (err) {
      console.error("Error updating milestone status:", err);
    }
  };

  // Handle file upload
  const handleUpload = async () => {
    if (!file) return;
    setIsLoading(true);

    try {
      const storageRef = ref(
        storage,
        `uploads/${uid}/${stripeCustomerId}/${projectId}/${file.name}`
      );
      await uploadBytes(storageRef, file);

      const fileUrl = await getDownloadURL(storageRef);
      const userDocRef = doc(db, "users", uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        const customerIndex = userData.customers.findIndex(
          (cust: any) => cust.stripeCustomerId === stripeCustomerId
        );
        const projectIndex = userData.customers[
          customerIndex
        ].projects.findIndex((proj: any) => proj.id === projectId);

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

  const deleteUpload = async (index: number) => {
    try {
      const userDocRef = doc(db, "users", uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        const customerIndex = userData.customers.findIndex(
          (cust: any) => cust.stripeCustomerId === stripeCustomerId
        );
        const projectIndex = userData.customers[
          customerIndex
        ].projects.findIndex((proj: any) => proj.id === projectId);

        // Ensure customer and project exist
        if (customerIndex === -1 || projectIndex === -1) {
          throw new Error("Customer or project not found");
        }

        // Update project uploads as an array of objects
        const updatedUploads = userData.customers[customerIndex].projects[
          projectIndex
        ].uploads.filter((_: any, i: number) => i !== index);

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
    const fileInput = document.getElementById("fileInput") as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const handleMarkProjectComplete = async () => {
    try {
      const userRef = doc(db, "users", uid);

      await runTransaction(db, async (transaction) => {
        const userSnap = await transaction.get(userRef);

        if (!userSnap.exists()) {
          throw new Error("User document not found.");
        }

        const userData = userSnap.data();
        const customers = Array.isArray(userData.customers)
          ? userData.customers
          : [];
        const customerIndex = customers.findIndex(
          (cust) => cust.stripeCustomerId === stripeCustomerId
        );

        if (customerIndex === -1) {
          throw new Error("Customer not found.");
        }

        const projectIndex = customers[customerIndex].projects.findIndex(
          (p: { id: string }) => p.id === projectId
        );

        if (projectIndex === -1) {
          throw new Error("Project not found.");
        }

        // Safely update isCompleted field
        customers[customerIndex].projects[projectIndex].isCompleted = true;

        // Update the entire customers array
        transaction.update(userRef, { customers });
      });

      toast.success("Project marked as complete!");
      setIsCompleted(true);
      confetti({ particleCount: 300, spread: 160, origin: { y: 0.6 } });
    } catch (error) {
      console.error("Error marking project as complete:", error);
      toast.error("Failed to mark project as complete. Please try again.");
    }
  };

  const deleteMilestone = async (milestoneId: string) => {
    try {
      const userDocRef = doc(db, "users", uid);

      // Get the current user document
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        throw new Error("User document not found.");
      }

      // Extract data from Firestore
      const userData = userDoc.data();
      const customers = userData.customers || [];

      // Find the target customer and project
      const updatedCustomers = customers.map((customer: any) => {
        if (customer.stripeCustomerId === stripeCustomerId) {
          return {
            ...customer,
            projects: customer.projects.map((project: any) => {
              if (project.id === projectId) {
                return {
                  ...project,
                  milestones: project.milestones.filter(
                    (milestone: Milestone) => milestone.id !== milestoneId
                  ),
                };
              }
              return project;
            }),
          };
        }
        return customer;
      });

      // Update Firestore with the modified data
      await updateDoc(userDocRef, {
        customers: updatedCustomers,
      });

      // Update local state
      setMilestones(
        milestones.filter((milestone) => milestone.id !== milestoneId)
      );

      toast.success("Milestone deleted successfully!");
    } catch (error) {
      console.error("Error deleting milestone:", error);
      toast.error("Failed to delete milestone. Please try again.");
    }
  };

  const handleMarkProjectIncomplete = async () => {
    try {
      const userRef = doc(db, "users", uid);

      await runTransaction(db, async (transaction) => {
        const userSnap = await transaction.get(userRef);

        if (!userSnap.exists()) {
          throw new Error("User document not found.");
        }

        const userData = userSnap.data();
        const customers = Array.isArray(userData.customers)
          ? userData.customers
          : [];
        const customerIndex = customers.findIndex(
          (cust) => cust.stripeCustomerId === stripeCustomerId
        );

        if (customerIndex === -1) {
          throw new Error("Customer not found.");
        }

        const projectIndex = customers[customerIndex].projects.findIndex(
          (p: { id: string }) => p.id === projectId
        );

        if (projectIndex === -1) {
          throw new Error("Project not found.");
        }

        // Safely update isCompleted field
        customers[customerIndex].projects[projectIndex].isCompleted = false;

        // Update the entire customers array
        transaction.update(userRef, { customers });
      });

      toast.success("Project marked as incomplete!");
      setIsCompleted(false);
    } catch (error) {
      console.error("Error marking project as incomplete:", error);
      toast.error("Failed to mark project as incomplete. Please try again.");
    }
  };

  // PAGINATION
  const [currentPage, setCurrentPage] = useState(0);
  const milestonesPerPage = userData?.milestonesPerPage || 5;

  // Calculate the milestones to display on the current page
  const startIndex = currentPage * milestonesPerPage;
  const selectedMilestones = milestones.slice(
    startIndex,
    startIndex + milestonesPerPage
  );

  // Handle page change
  const handlePageClick = (data: any) => {
    setCurrentPage(data.selected);
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!project) {
    return <div>Project not found.</div>;
  }

  return (
    <>
      <div className="min-h-screen max-w-6xl mx-auto h-full w-full p-4 pt-4 text-black flex flex-col pb-24">
        <div className="flex flex-col">
          <div className="flex flex-col sm:flex-row items-baseline w-full  justify-between">
            <h1 className="text-3xl border-b-2 border-black lg:text-4xl font-bold justify-between w-full flex flex-row items-baseline capitalize gap-1">
              {project.name}
              <span className="hidden sm:flex text-xl text-gray-600">
                ID: {project.id}
              </span>
            </h1>
          </div>

          <p className="text-lg capitalize text-gray-700">
            {project.description}
          </p>
        </div>

        {/* Milestones Section */}
        <div className="">
          <div className="flex justify-between items-center">
            <div className="flex items-end my-auto">
              <h2 className="text-2xl font-semibold">Milestones</h2>
              <button
                type="button"
                onClick={() => setShowForm(!showForm)}
                className="hover:bg-opacity-60 duration-300 font-semibold items-end pb-1 py-2 px-4 text-xl flex flex-row text-black rounded-md"
              >
                [
                <Plus className="w-7 h-7 text-green-500 hover:rotate-90 duration-300" />
                ]
              </button>
            </div>

            {!isCompleted &&
              milestones.length > 0 &&
              !milestones.every(
                (milestone) => milestone.status === "completed"
              ) && (
                <div className="mb-2 hidden sm:flex w-full max-w-xs justify-end text-center">
                  <div className="w-full flex flex-col">
                    <MilestoneProgress milestones={milestones} />
                  </div>
                </div>
              )}

            {/* Conditional Button for Marking Project Complete */}
            {!isCompleted &&
              milestones.length > 0 &&
              milestones.every(
                (milestone) => milestone.status === "completed"
              ) && (
                <div className="mb-2 flex w-full justify-end text-center">
                  <button
                    type="button"
                    onClick={handleMarkProjectComplete}
                    className="bg-green-500 duration-300 hover:bg-green-600 text-white py-2 px-4 rounded-md font-semibold shadow-md"
                  >
                    Mark Project as Complete
                  </button>
                </div>
              )}

            {isCompleted &&
              milestones.length > 0 &&
              milestones.every(
                (milestone) => milestone.status === "completed"
              ) && (
                <div className="mb-2 flex w-full justify-end text-center">
                  <button
                    type="button"
                    onClick={handleMarkProjectIncomplete}
                    className="bg-destructive duration-300 hover:bg-opacity-60 text-white py-2 px-4 rounded-md font-semibold shadow-md"
                  >
                    Mark Project as Incomplete
                  </button>
                </div>
              )}
          </div>
          {milestones.length > 0 ? (
            <>
              <div className="border-2 shadow-md shadow-black border-black rounded-lg overflow-x-auto">
                <table className="bg-white w-full table-auto">
                  <thead className="bg-backgroundPrimary rounded-t-lg">
                    <tr className="border-b border-t border-black">
                      <th className="p-1 px-4 text-left text-lg font-semibold border-l border-black">
                        Milestone
                      </th>
                      <th className="p-1 px-4 text-left text-lg font-semibold">
                        Description
                      </th>
                      <th className="p-1 px-4 text-left text-lg font-semibold">
                        Priority
                      </th>
                      <th className="p-1 px-4 text-left text-lg font-semibold">
                        Deadline
                      </th>
                      <th className="p-1 px-4 text-left text-lg font-semibold">
                        Status
                      </th>
                      <th className="p-1 px-4 text-left text-lg font-semibold border-r border-black">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedMilestones.map((milestone) => (
                      <tr
                        key={milestone.id}
                        className="border-b hover:bg-yellow-50 border-black"
                      >
                        <td className="p-1 px-4 border-l font-medium border-black">
                          {milestone.title}
                        </td>
                        <td className="p-1 px-4">{milestone.description}</td>
                        <td
                          className={`p-1 px-4 text-sm capitalize font-semibold ${
                            milestone.priority === "high"
                              ? "text-red-500"
                              : milestone.priority === "medium"
                              ? "text-yellow-500"
                              : "text-green-500"
                          }`}
                        >
                          {milestone.priority}
                        </td>
                        <td className="p-1 px-4">{milestone.deadline}</td>
                        <td className="p-1 px-4 text-sm text-gray-500">
                          <span
                            className={`text-sm capitalize font-semibold ${
                              milestone.status === "completed"
                                ? "text-confirm"
                                : milestone.status === "pending"
                                ? "text-destructive"
                                : "text-green-500"
                            }`}
                          >
                            {milestone.status}
                          </span>
                        </td>
                        <td className="p-1 px-4 border-r border-black">
                          <div className="p-1">
                            <select
                              name="status"
                              id="status"
                              aria-label="status"
                              onChange={(e) => {
                                if (e.target.value === "delete") {
                                  if (window.confirm("Are you sure?")) {
                                    deleteMilestone(milestone.id); // Call delete function
                                  } else {
                                    handleChangeStatus(milestone.id, "pending");
                                  }
                                } else {
                                  handleChangeStatus(
                                    milestone.id,
                                    e.target.value
                                  ); // Call status change function
                                }
                              }}
                              value={milestone.status}
                              className="bg-gray-50 border border-gray-300 text-gray-900 py-1 px-2 rounded-md"
                            >
                              <option value="pending" className="text-black">
                                Pending
                              </option>
                              <option
                                value="in-progress"
                                className="text-green-500"
                              >
                                In-Progress
                              </option>
                              <option
                                value="completed"
                                className="text-confirm"
                              >
                                Completed
                              </option>
                              <option
                                value="delete"
                                className="text-destructive"
                              >
                                Delete
                              </option>
                            </select>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {milestones.length > milestonesPerPage && (
                <div className="mt-2">
                  <ReactPaginate
                    previousLabel={"Previous"}
                    nextLabel={"Next"}
                    breakLabel={"..."}
                    pageCount={Math.ceil(milestones.length / milestonesPerPage)}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    onPageChange={handlePageClick}
                    containerClassName={
                      "pagination flex mt-2 flex-row w-full justify-between px-4"
                    }
                    activeClassName={"active text-confirm font-extrabold"}
                    pageClassName={"page font-medium hover:underline"}
                    breakClassName={"break"}
                    previousClassName={
                      "previous font-medium text-xl text-green-500 hover:underline"
                    }
                    nextClassName={
                      "next font-medium text-xl text-green-500 hover:underline"
                    }
                  />
                </div>
              )}
            </>
          ) : (
            <p className="text-gray-600 p-2 border-2 border-black rounded-lg shadow-md shadow-black">
              No milestones yet
            </p>
          )}
        </div>
        <div className="lg:flex items-center lg:flex-row">
          <div className="grid grid-cols-2 w-full gap-4">
            {/* Uploads section */}
            <div className="mt-4">
              <div className="flex flex-row items-center justify-start my-auto">
                <h2 className="text-2xl font-bold">Uploads</h2>
                <button
                  type="button"
                  onClick={() => setShowUploadForm(!showUploadForm)}
                  className="hover:bg-opacity-60 duration-300 font-semibold items-center py-2 px-4 text-xl flex flex-row text-black rounded-md"
                >
                  [
                  <Plus className="w-7 h-7 text-green-500 hover:rotate-90 duration-300" />
                  ]
                </button>
              </div>
              {showUploadForm && (
                <div className="mb-4 border border-black p-4 rounded-lg gap-2 flex flex-col">
                  <input
                    aria-label="Upload file"
                    type="file"
                    onChange={(e) => {
                      const files = e.target.files;
                      if (files && files[0]) {
                        setFile(files[0]);
                      }
                    }}
                    className="border rounded p-2 bg-white"
                  />
                  <button
                    type="button"
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
                <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 border-2 shadow-black border-black p-2 bg-white mt-1 rounded-lg shadow-md">
                  {uploads.map((upload, index) => (
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
                            className="w-8 h-8 sm:w-16 sm:h-16 border border-black object-cover rounded-md"
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
              ) : (
                <p className="text-gray-600 p-2 mt-1 border-2 border-black rounded-lg shadow-md shadow-black">
                  No uploads yet
                </p>
              )}
            </div>
            <div>
              <div className="mt-3">
                <ColorPaletteGenerator
                  userId={uid}
                  customerId={stripeCustomerId}
                  projectId={projectId}
                />
              </div>
            </div>
          </div>
        </div>
        {showForm && (
          <div className="fixed w-full px-4 mx-auto inset-0 bg-black/95  z-40 my-auto min-h-screen h-full items-center justify-center flex flex-col">
            <div className=" p-4 w-full max-w-xl">
              <h1 className="text-2xl sm:text-3xl text-white font-semibold mb-4 text-center">
                Create New Milestone
              </h1>
              <label
                htmlFor="title"
                className="block text-white font-semibold mb-2"
              >
                Title
              </label>
              <input
                id="title"
                type="text"
                placeholder="Milestone Title"
                value={newMilestone.title}
                onChange={(e) =>
                  setNewMilestone({ ...newMilestone, title: e.target.value })
                }
                className="flex w-full p-2 mb-2 border rounded-md"
              />
              <label
                htmlFor="description"
                className="block text-white font-semibold mb-2"
              >
                Description
              </label>
              <textarea
                id="description"
                placeholder="Milestone Description"
                value={newMilestone.description}
                onChange={(e) =>
                  setNewMilestone({
                    ...newMilestone,
                    description: e.target.value,
                  })
                }
                className="block w-full p-2 mb-2 border rounded-md"
              />
              <label
                htmlFor="deadline"
                className="block text-white font-semibold mb-2"
              >
                Deadline
              </label>
              <input
                id="deadline"
                type="date"
                placeholder="Deadline"
                value={newMilestone.deadline}
                onChange={(e) =>
                  setNewMilestone({ ...newMilestone, deadline: e.target.value })
                }
                className="flex w-full p-2 mb-2 border rounded-md"
              />
              <label
                htmlFor="priority"
                className="block text-white font-semibold mb-2"
              >
                Priority
              </label>
              <select
                id="priority"
                value={newMilestone.priority}
                onChange={(e) =>
                  setNewMilestone({ ...newMilestone, priority: e.target.value })
                }
                className="flex w-full p-2 mb-2 border rounded-md"
              >
                <option value="select-priority">Select Priority</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
              {milestoneError && (
                <p className="text-red-500">{milestoneError}</p>
              )}
              <div className="flex justify-end mt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="text-destructive hover:text-destructive/60 duration-300 font-medium py-2 px-4 rounded-md mr-2"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddMilestone}
                  className="bg-confirm hover:bg-opacity-60 duration-300 text-black font-semibold py-2 px-4 rounded-md"
                >
                  Add Milestone
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ProjectPage;
