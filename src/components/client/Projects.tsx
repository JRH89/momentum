import React, { useState, useEffect } from "react";
import { db } from "../../../firebase";
import { doc, getDoc, updateDoc, collection, addDoc } from "firebase/firestore";
import { LoaderPinwheel, Plus } from "lucide-react";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { signOut } from "firebase/auth";
import { initializeApp, getApp, deleteApp } from "firebase/app";
import Link from "next/link";
import MilestoneProgress from "../ProgressBar";
import { toast } from "react-toastify";

interface Project {
  id: string;
  name: string;
  description: string;
  link: string;
  isCompleted?: boolean;
  milestones?: any;
}

interface ProjectsProps {
  uid: string;
  stripeCustomerId: string;
  customerEmail: string;
}

const Projects: React.FC<ProjectsProps> = ({
  uid,
  stripeCustomerId,
  customerEmail,
}) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [newProjectName, setNewProjectName] = useState<string>("");
  const [newProjectDescription, setNewProjectDescription] =
    useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const [showForm, setShowForm] = useState(false);

  // Fetch the customer's projects
  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const userRef = doc(db, "users", uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          const customer = (userData.customers || []).find(
            (cust: { stripeCustomerId: string }) =>
              cust.stripeCustomerId === stripeCustomerId
          );
          if (customer && Array.isArray(customer.projects)) {
            setProjects(customer.projects);
          }
        }
      } catch (err) {
        console.error("Error fetching projects:", err);
        toast.error("Failed to fetch projects.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [uid, stripeCustomerId]);

  const [features, setFeatures] = useState<{
    fileUploads: boolean;
    colorPallette: boolean;
    liveChat: boolean;
  }>({
    fileUploads: false,
    colorPallette: false,
    liveChat: false,
  });

  // Handle creating a new project
  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newProjectName || !newProjectDescription) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    let newCustomerUid: string | null = null; // To store the newly created customer's UID

    try {
      // Fetch user document
      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        const customers = Array.isArray(userData.customers)
          ? userData.customers
          : [];
        const customer = customers.find(
          (cust: { stripeCustomerId: string }) =>
            cust.stripeCustomerId === stripeCustomerId
        );

        if (customer) {
          try {
            // Initialize a temporary Firebase app instance
            const tempApp = initializeApp(
              {
                apiKey: process.env.NEXT_PUBLIC_APIKEY,
                authDomain: process.env.NEXT_PUBLIC_AUTHDOMAIN,
                projectId: process.env.NEXT_PUBLIC_PROJECTID,
                storageBucket: process.env.NEXT_PUBLIC_STORAGEBUCKET,
                messagingSenderId: process.env.NEXT_PUBLIC_MESSAGINGSENDERID,
                appId: process.env.NEXT_PUBLIC_APPID,
              },
              "new-app"
            );

            const tempAuth = getAuth(tempApp);

            // Create a Firebase Auth user for the customer
            const userCredential = await createUserWithEmailAndPassword(
              tempAuth,
              customerEmail,
              "DefaultSecurePassword123!" // You can change this to something more secure
            );

            // Immediately sign out to prevent auto sign-in
            await signOut(tempAuth);

            newCustomerUid = userCredential.user.uid; // Store the new customer's UID

            // Clean up by deleting the temporary app instance
            await deleteApp(tempApp);
          } catch (authError: any) {
            if (authError.code !== "auth/email-already-in-use") {
              throw authError;
            } else {
              // If the user already exists, retrieve their UID
              const existingUserRef = await getDoc(
                doc(db, "users", customerEmail)
              );
              if (existingUserRef.exists()) {
                newCustomerUid = existingUserRef.id; // Retrieve existing UID
              }
            }
          }

          // Add new project
          const newProject = {
            name: newProjectName,
            isCompleted: false,
            features,
            description: newProjectDescription,
            link: newProjectName
              ? `/Dashboard/${uid}/${stripeCustomerId}/${newProjectName}` // Optional link
              : "",
          };

          // Add new project to Firestore
          const projectRef = await addDoc(
            collection(db, "users", uid, "projects"),
            newProject
          );

          // Update project link with auto-generated ID
          if (newProject.link) {
            newProject.link = `/Dashboard/${uid}/${stripeCustomerId}/${projectRef.id}`;
          }

          // Update projects in Firestore
          const updatedProjects = [
            ...(customer.projects || []),
            { id: projectRef.id, ...newProject },
          ];
          await updateDoc(userRef, {
            customers: customers.map((cust: { stripeCustomerId: string }) =>
              cust.stripeCustomerId === stripeCustomerId
                ? { ...cust, projects: updatedProjects }
                : cust
            ),
          });

          // If a new customer UID was created, update the customer with the matching stripeCustomerId
          if (newCustomerUid) {
            const updatedCustomers = customers.map(
              (cust: { stripeCustomerId: string; uid: string }) => {
                if (cust.stripeCustomerId === stripeCustomerId) {
                  return {
                    ...cust,
                    uid: newCustomerUid,
                    projects: updatedProjects,
                  }; // Add updated projects
                }
                return cust; // Keep other customers unchanged
              }
            );

            // Update Firestore with the modified customers array
            await updateDoc(userRef, {
              customers: updatedCustomers,
            });
          }

          // Update local state
          setProjects(updatedProjects);
          setNewProjectName("");
          setNewProjectDescription("");
          setFeatures({
            fileUploads: false,
            colorPallette: false,
            liveChat: false,
          });
          setShowForm(false);
        }
      }
    } catch (err) {
      console.error("Error creating project:", err);
      toast.error("Failed to create project.");
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen my-auto items-center justify-center max-w-6xl mx-auto h-full w-full p-4 pt-4 text-black flex flex-col pb-24">
        <LoaderPinwheel className="animate-spin duration-300 w-8 h-8" />
      </div>
    );

  return (
    <div className="mt-6">
      <div className="flex flex-row items-center justify-start">
        <h3 className="text-2xl font-semibold">Projects</h3>
        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 flex flex-row items-center justify-center text-lg duration-300 text-black font-semibold rounded-md hover:bg-opacity-60"
        >
          [
          <Plus className="w-6 h-6 text-green-500 hover:rotate-90 duration-300" />
          ]
        </button>
      </div>

      {/* Existing Projects List */}
      <div className="mb-4">
        {projects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <Link href={project.link} key={index}>
                <div
                  className={`bg-[#EAEEFE] hover:shadow-lg hover:shadow-black duration-300 flex flex-col my-auto h-full border-2 shadow-black border-black rounded-lg shadow-md p-4`}
                >
                  <h3 className="text-lg flex flex-col my-auto h-full font-bold text-black mb-2">
                    {project.name}
                  </h3>

                  <p className="text-black text-sm flex flex-col my-auto h-full">
                    ID: {project.id}
                  </p>
                  <p className="text-black text-sm mb-2 flex flex-col my-auto h-full">
                    Descripion: {project.description}
                  </p>
                  <div className="">
                    <MilestoneProgress milestones={project.milestones} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p>No projects found.</p>
        )}
      </div>

      {/* New Project Form */}
      {showForm && (
        <div className="inset-0 fixed border-2 border-black bg-black bg-opacity-95 flex items-center justify-center mx-auto px-4">
          <div className="p-6 w-full rounded-md shadow-lg max-w-xl">
            <h3 className="text-2xl lg:text-3xl text-center font-semibold text-white">
              Create Project
            </h3>
            <form>
              <div className="mt-4">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-white mb-2"
                >
                  Project Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  required
                  className="w-full p-2 border-2 border-black rounded-md"
                />
              </div>
              <div className="mt-4">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-white mb-2"
                >
                  Project Description
                </label>
                <input
                  id="description"
                  type="text"
                  value={newProjectDescription}
                  onChange={(e) => setNewProjectDescription(e.target.value)}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
                <div className="mt-4">
                  <label className="block text-sm font-medium text-white mb-2">
                    File Uploads
                  </label>
                  <div className="flex items-center bg-white rounded-lg p-2 space-x-4">
                    <label className="text-black">
                      <input
                        type="radio"
                        name="fileUploads"
                        value="true"
                        onChange={() =>
                          setFeatures((prev) => ({
                            ...prev,
                            fileUploads: true,
                          }))
                        }
                        checked={features.fileUploads === true}
                        className="mr-2"
                      />
                      Enabled
                    </label>
                    <label className="text-black">
                      <input
                        type="radio"
                        name="fileUploads"
                        value="false"
                        onChange={() =>
                          setFeatures((prev) => ({
                            ...prev,
                            fileUploads: false,
                          }))
                        }
                        checked={features.fileUploads === false}
                        className="mr-2"
                      />
                      Disabled
                    </label>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-white mb-2">
                    Color Palette
                  </label>
                  <div className="flex items-center bg-white rounded-lg p-2 space-x-4">
                    <label className="text-black">
                      <input
                        type="radio"
                        name="colorPallette"
                        value="true"
                        onChange={() =>
                          setFeatures((prev) => ({
                            ...prev,
                            colorPallette: true,
                          }))
                        }
                        checked={features.colorPallette === true}
                        className="mr-2"
                      />
                      Enabled
                    </label>
                    <label className="text-black">
                      <input
                        type="radio"
                        name="colorPallette"
                        value="false"
                        onChange={() =>
                          setFeatures((prev) => ({
                            ...prev,
                            colorPallette: false,
                          }))
                        }
                        checked={features.colorPallette === false}
                        className="mr-2"
                      />
                      Disabled
                    </label>
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-white mb-2">
                    Live Chat
                  </label>
                  <div className="flex items-center bg-white rounded-lg p-2 space-x-4">
                    <label className="text-black">
                      <input
                        type="radio"
                        name="liveChat"
                        value="true"
                        onChange={() =>
                          setFeatures((prev) => ({
                            ...prev,
                            liveChat: true,
                          }))
                        }
                        checked={features.liveChat === true}
                        className="mr-2"
                      />
                      Enabled
                    </label>
                    <label className="text-black">
                      <input
                        type="radio"
                        name="liveChat"
                        value="false"
                        onChange={() =>
                          setFeatures((prev) => ({
                            ...prev,
                            liveChat: false,
                          }))
                        }
                        checked={features.liveChat === false}
                        className="mr-2"
                      />
                      Disabled
                    </label>
                  </div>
                </div>
              </div>
            </form>
            <div className="flex mt-6 flex-row items-center justify-end">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className=" px-4 py-2 text-destructive  rounded-lg  font-semibold hover:opacity-60 duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateProject}
                type="submit"
                className=" hover:bg-opacity-60 duration-300 bg-confirm py-2 px-4 font-semibold rounded-md"
                disabled={loading} // Disable button when loading
              >
                {loading ? "Creating..." : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
