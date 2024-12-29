'use client';

import React, { useState, useEffect } from "react";
import { db } from "../../../../../../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import NavBar from "../../../../../components/navbar";
import Footer from "../../../../../components/footer";
import { useParams } from "next/navigation";

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
      <div className="project-page p-4 pt-12 min-h-screen h-full max-w-6xl mx-auto">
        <h1 className="text-4xl font-semibold">{project.name}</h1>
        <p className="mt-2 text-lg">{project.description}</p>
        <div className="mt-4">
          <a href={project.link} className="text-blue-500 hover:underline">
            View Project Link
          </a>
        </div>

        {/* Milestones Section */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold">Milestones</h2>
          {milestones.length > 0 ? (
            <ul className="mt-4">
              {milestones.map((milestone) => (
                <li key={milestone.id} className="border-b py-2">
                  <h3 className="text-lg font-semibold">{milestone.title}</h3>
                  <p className="text-gray-600">{milestone.description}</p>
                  <p>Status: {milestone.status}</p>
                  <div className="mt-2">
                    <button
                      onClick={() => handleChangeStatus(milestone.id, "in-progress")}
                      className="bg-yellow-500 text-white py-1 px-4 rounded-md mr-2"
                    >
                      In Progress
                    </button>
                    <button
                      onClick={() => handleChangeStatus(milestone.id, "completed")}
                      className="bg-green-500 text-white py-1 px-4 rounded-md"
                    >
                      Completed
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No milestones yet.</p>
          )}
        </div>
        <div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-500 text-white py-2 px-4 rounded-md"
          >
            Add Milestone
          </button>
        </div>
        {showForm && (
          <div className="top-32 w-full  px-4 mx-auto inset-0 bg-black/90 absolute z-50 my-auto min-h-screen h-full items-center justify-center flex flex-col">
            <div className="bg-white rounded-md p-4 w-full max-w-xl">
              <h1 className="text-2xl font-semibold mb-4 text-center">Add a New Milestone</h1>
              <input
                type="text"
                placeholder="Milestone Title"
                value={newMilestone.title}
                onChange={(e) => setNewMilestone({ ...newMilestone, title: e.target.value })}
                className="flex w-full p-2 mb-2 border rounded-md"
              />
              <textarea
                placeholder="Milestone Description"
                value={newMilestone.description}
                onChange={(e) => setNewMilestone({ ...newMilestone, description: e.target.value })}
                className="block w-full p-2 mb-2 border rounded-md"
              />
              <input
                type="date"
                placeholder="Deadline"
                value={newMilestone.deadline}
                onChange={(e) => setNewMilestone({ ...newMilestone, deadline: e.target.value })}
                className="flex w-full p-2 mb-2 border rounded-md"
              />
              <select
                value={newMilestone.priority}
                onChange={(e) => setNewMilestone({ ...newMilestone, priority: e.target.value })}
                className="flex w-full p-2 mb-2 border rounded-md"
              >
                <option value="">Priority</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
              {milestoneError && <p className="text-red-500">{milestoneError}</p>}
              <div className="flex justify-end mt-4">
                <button
                  onClick={handleAddMilestone}
                  className="bg-blue-500 text-white py-2 px-4 rounded-md"
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
