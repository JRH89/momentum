'use client';

import React, { useState, useEffect } from "react";
import { db } from "../../../../../../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useParams } from "next/navigation";
import { Plus } from "lucide-react";
import ColorPaletteGenerator from "../../../../../components/customer/ColorPalleteGenerator";

interface Milestone {
  id: string;
  title: string;
  description: string;
  status: string; // 'pending', 'in-progress', 'completed'
  deadline: string;
  priority: string;
}

interface ProjectPageProps {
  params: {
    uid: string;
    stripeCustomerId: string;
    projectId: string;
  };
}

const ProjectPage = () => {
  // Correctly using `useParams` without treating it as a Promise
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

  useEffect(() => {
    const fetchProject = async () => {
      try {
        // Fetch the user document from Firestore
        const userRef = doc(db, "users", uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const userData = userSnap.data();
          const customer = (userData.customers || []).find(
            (cust: { stripeCustomerId: string }) => cust.stripeCustomerId === stripeCustomerId
          );

          if (customer && Array.isArray(customer.projects)) {
            // Find the project by its ID
            const foundProject = customer.projects.find((p: { id: string }) => p.id === projectId) || null;
            if (foundProject) {
              setProject(foundProject);
              setMilestones(foundProject.milestones || []);
              setUploads(foundProject.uploads || []);
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
    if (!newMilestone.title || !newMilestone.description || !newMilestone.deadline || !newMilestone.priority) {
      setMilestoneError("Please provide a title, description, deadline, and priority for the milestone.");
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
        const customers = Array.isArray(userData.customers) ? userData.customers : [];
        const customerIndex = customers.findIndex(
          (cust: { stripeCustomerId: string }) => cust.stripeCustomerId === stripeCustomerId
        );

        if (customerIndex >= 0) {
          const projectIndex = customers[customerIndex].projects.findIndex(
            (p: { id: string }) => p.id === projectId
          );

          if (projectIndex >= 0) {
            const existingMilestones = Array.isArray(customers[customerIndex].projects[projectIndex].milestones)
              ? customers[customerIndex].projects[projectIndex].milestones
              : [];
            const updatedMilestones = [...existingMilestones, milestone];

            customers[customerIndex].projects[projectIndex].milestones = updatedMilestones;

            await updateDoc(userRef, {
              customers,
            });

            setMilestones(updatedMilestones);
            setNewMilestone({ title: "", description: "", deadline: "", priority: "" });
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
        const customers = Array.isArray(userData.customers) ? userData.customers : [];
        const customerIndex = customers.findIndex(
          (cust: { stripeCustomerId: string }) => cust.stripeCustomerId === stripeCustomerId
        );

        if (customerIndex >= 0) {
          const projectIndex = customers[customerIndex].projects.findIndex(
            (p: { id: string }) => p.id === projectId
          );

          if (projectIndex >= 0) {
            const project = customers[customerIndex].projects[projectIndex];
            const updatedMilestones = project.milestones.map((milestone: Milestone) =>
              milestone.id === milestoneId ? { ...milestone, status: newStatus } : milestone
            );

            customers[customerIndex].projects[projectIndex].milestones = updatedMilestones;

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

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!project) {
    return <div>Project not found.</div>;
  }

  return (
    <>
     <div className="min-h-screen max-w-6xl mx-auto h-full w-full p-4 pt-4 text-black flex flex-col pb-24">
        <h1 className="text-3xl font-bold mb-2 flex flex-row gap-2 items-center">{project.name}<span className="hidden md:flex text-xl">{project.id}</span></h1>
        <p className="text-lg">{project.description}</p>
        {/* Milestones Section */}
        <div className="mt-4">
          <div className="flex justify-start items-center">
            <h2 className="text-2xl font-semibold">Milestones</h2>
            <button
              type="button"
              onClick={() => setShowForm(!showForm)}
              className=" hover:bg-opacity-60 duration-300 font-semibold items-center py-2 px-4 flex flex-row text-black rounded-md"
            >
              [<Plus className="w-5 h-5 text-green-500 hover:rotate-90 duration-300" />]
            </button>
            </div>
            {milestones.length > 0 ? (
            <div className="border-2 border-black rounded-lg overflow-x-auto">
              <table className="bg-white w-full table-auto">
                <thead className="bg-backgroundPrimary rounded-t-lg">
                  <tr className="border-b border-t border-black">
                    <th className="p-1 px-4 text-left text-lg font-semibold border-l border-black">Milestone</th>
                    <th className="p-1 px-4 text-left text-lg font-semibold">Description</th>
                    <th className="p-1 px-4 text-left text-lg font-semibold">Deadline</th>
                    <th className="p-1 px-4 text-left text-lg font-semibold">Status</th>
                    <th className="p-1 px-4 text-left text-lg font-semibold border-r border-black">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {milestones.map((milestone) => (
                    <tr key={milestone.id} className="border-b hover:bg-yellow-50 border-black">
                      <td className="p-1 px-4 border-l font-medium border-black">{milestone.title}</td>
                      <td className="p-1 px-4">{milestone.description}</td>
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
                            onChange={(e) => handleChangeStatus(milestone.id, e.target.value)}
                            value={milestone.status}
                            className="bg-gray-50 border border-gray-300 text-gray-900 py-1 px-2 rounded-md"
                          >
                            <option value="pending" className="text-black">
                              Pending
                            </option>
                            <option value="in-progress" className="text-green-500">
                              In Progress
                            </option>
                            <option value="completed" className="text-confirm">
                              Completed
                            </option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-black p-2 border-2 border-black rounded-lg shadow-md shadow-black">No milestones yet.</p>
          )}
        </div>
        {/* Uploads section */}
         <div className="mt-4">
          <div className="flex justify-start items-center">
            <h2 className="text-2xl font-semibold mb-2">
              Uploads
            </h2>
            {/* <button
              type="button"
              onClick={() => setShowForm(!showForm)}
              className=" hover:bg-opacity-60 duration-300 font-semibold items-center py-2 px-4 flex flex-row text-black rounded-md"
            >
              [<Plus className="w-5 h-5 text-green-500 hover:rotate-90 duration-300" />]
            </button> */}
          </div>
          {uploads.length > 0 ? (
            <ul className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 gap-4">
                    {uploads.map((upload, index) => (
                      <li
                        key={index}
                        className="border-2 shadow-black border-black bg-white p-2 rounded shadow-md flex items-center gap-2"
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
                          className="text-destructive font-medium hover:underline truncate"
                        >
                          {upload.name || `File ${index + 1}`}
                        </a>
                      </li>
                    ))}
                  </ul>
          ) : (
            <p className="text-black p-2 border-2 border-black rounded-lg shadow-md shadow-black">No uploads yet.</p>
          )}
          <div className="mt-4">
            <h1 className="text-2xl -mb-2 font-semibold ">Project Theme</h1>
           <ColorPaletteGenerator
              userId={uid}
              customerId={stripeCustomerId}
              projectId={projectId}
            />
            </div> 
        </div>
        {showForm && (
          <div className="fixed w-full px-4 mx-auto inset-0 bg-black/95  z-40 my-auto min-h-screen h-full items-center justify-center flex flex-col">
            <div className=" p-4 w-full max-w-xl">
              <h1 className="text-2xl sm:text-3xl text-white font-semibold mb-4 text-center">
                Create New Milestone
              </h1>
              <label htmlFor="title" className="block text-white font-semibold mb-2">
                Title
              </label>
              <input
                id="title"
                type="text"
                placeholder="Milestone Title"
                value={newMilestone.title}
                onChange={(e) => setNewMilestone({ ...newMilestone, title: e.target.value })}
                className="flex w-full p-2 mb-2 border rounded-md"
              />
              <label htmlFor="description" className="block text-white font-semibold mb-2">
                Description
              </label>
              <textarea
                id="description"
                placeholder="Milestone Description"
                value={newMilestone.description}
                onChange={(e) => setNewMilestone({ ...newMilestone, description: e.target.value })}
                className="block w-full p-2 mb-2 border rounded-md"
              />
              <label htmlFor="deadline" className="block text-white font-semibold mb-2">
                Deadline
              </label>
              <input
                id="deadline"
                type="date"
                placeholder="Deadline"
                value={newMilestone.deadline}
                onChange={(e) => setNewMilestone({ ...newMilestone, deadline: e.target.value })}
                className="flex w-full p-2 mb-2 border rounded-md"
              />
              <label htmlFor="priority" className="block text-white font-semibold mb-2">
                Priority
              </label>
              <select
                id="priority"
                value={newMilestone.priority}
                onChange={(e) => setNewMilestone({ ...newMilestone, priority: e.target.value })}
                className="flex w-full p-2 mb-2 border rounded-md"
              >
                <option value="select-priority">Select Priority</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
              {milestoneError && <p className="text-red-500">{milestoneError}</p>}
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
