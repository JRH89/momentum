'use client';

import React, { useState, useEffect } from "react";
import { db } from "../../../../../../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import NavBar from "../../../../../components/navbar";
import Footer from "../../../../../components/footer";
import { useParams } from "next/navigation";
import { Plus } from "lucide-react";

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
      <NavBar />
      <div className=" pt-6 min-h-screen h-full w-full max-w-6xl mx-auto">
        <h1 className="text-4xl font-semibold">{project.name}</h1>
        <p className="mt-2 text-lg">{project.description}</p>
        <div className="">
          <a href={project.link} className="text-blue-500 hover:underline">
            View Project
          </a>
        </div>

        {/* Milestones Section */}
        <div className="mt-8">
          <div className="flex justify-start items-center">
            <h2 className="text-2xl font-semibold">
              Milestones
            </h2>
            <button
              type="button"
              onClick={() => setShowForm(!showForm)}
              className=" hover:bg-opacity-60 duration-300 font-semibold items-center py-2 px-4 flex flex-row text-black rounded-md"
            >
              [<Plus className="w-5 h-5 text-green-500 hover:rotate-90 duration-300" />]
            </button>
          </div>
          {milestones.length > 0 ? (
            <ul className="mt-4 bg-white rounded-lg p-6">
              {milestones.map((milestone) => (
                <li key={milestone.id} className="border-b p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-semibold">{milestone.title}</h3>
                      <p className="text-gray-600">{milestone.description}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Status: <span className="font-medium">{milestone.status}</span>
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={() => handleChangeStatus(milestone.id, "in-progress")}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-4 rounded-md"
                      >
                        In Progress
                      </button>
                      <button
                        type="button"
                        onClick={() => handleChangeStatus(milestone.id, "completed")}
                        className="bg-green-500 hover:bg-green-600 text-white py-1 px-4 rounded-md"
                      >
                        Completed
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No milestones yet.</p>
          )}
        </div>
        {showForm && (
          <div className="fixed w-full  px-4 mx-auto inset-0 bg-black/90  z-50 my-auto min-h-screen h-full items-center justify-center flex flex-col">
            <div className="bg-white rounded-md p-4 w-full max-w-xl">
              <h1 className="text-2xl font-semibold mb-4 text-center">
                Create New Milestone
              </h1>
              <label htmlFor="title" className="block text-gray-700 font-semibold mb-2">
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
              <label htmlFor="description" className="block text-gray-700 font-semibold mb-2">
                Description
              </label>
              <textarea
                id="description"
                placeholder="Milestone Description"
                value={newMilestone.description}
                onChange={(e) => setNewMilestone({ ...newMilestone, description: e.target.value })}
                className="block w-full p-2 mb-2 border rounded-md"
              />
              <label htmlFor="deadline" className="block text-gray-700 font-semibold mb-2">
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
              <label htmlFor="priority" className="block text-gray-700 font-semibold mb-2">
                Priority
              </label>
              <select
                id="priority"
                value={newMilestone.priority}
                onChange={(e) => setNewMilestone({ ...newMilestone, priority: e.target.value })}
                className="flex w-full p-2 mb-2 border rounded-md"
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
              {milestoneError && <p className="text-red-500">{milestoneError}</p>}
              <div className="flex justify-end mt-4">
                <button 
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="text-destructive hover:text-destructive/60 duration-300 py-2 px-4 rounded-md mr-2"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddMilestone}
                  className="bg-confirm hover:bg-opacity-60 duration-300 text-white py-2 px-4 rounded-md"
                >
                  Add Milestone
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default ProjectPage;
