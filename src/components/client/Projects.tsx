import React, { useState, useEffect } from 'react';
import { db } from "../../../firebase";
import { doc, getDoc, updateDoc, collection, addDoc } from 'firebase/firestore';
import { Plus } from 'lucide-react';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import { signOut } from 'firebase/auth';
import { initializeApp, getApp, deleteApp } from "firebase/app";

interface Project {
  id: string;
  name: string;
  description: string;
  link: string;
}

interface ProjectsProps {
  uid: string;
  stripeCustomerId: string;
  customerEmail: string;
}

const Projects: React.FC<ProjectsProps> = ({ uid, stripeCustomerId, customerEmail }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [newProjectName, setNewProjectName] = useState<string>('');
  const [newProjectDescription, setNewProjectDescription] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const [showForm, setShowForm] = useState(false);

  // Todo: Add uid to users/uid/customers

  // Fetch the customer's projects
  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const userRef = doc(db, 'users', uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          const customer = (userData.customers || []).find(
            (cust: { stripeCustomerId: string }) => cust.stripeCustomerId === stripeCustomerId
          );
          if (customer && Array.isArray(customer.projects)) {
            setProjects(customer.projects);
          }
        }
      } catch (err) {
        console.error("Error fetching projects:", err);
        setError("Failed to fetch projects.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [uid, stripeCustomerId]);

  // Handle creating a new project
const handleCreateProject = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!newProjectName || !newProjectDescription) {
    setError("Please fill in all fields");
    return;
  }

  setLoading(true);
  let newCustomerUid: string | null = null; // To store the newly created customer's UID

  try {
    // Fetch user document
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const userData = userSnap.data();
      const customers = Array.isArray(userData.customers) ? userData.customers : [];
      const customer = customers.find(
        (cust: { stripeCustomerId: string }) => cust.stripeCustomerId === stripeCustomerId
      );

      if (customer) {
        try {
          // Initialize a temporary Firebase app instance
          const tempApp = initializeApp({
            apiKey: process.env.NEXT_PUBLIC_APIKEY,
            authDomain: process.env.NEXT_PUBLIC_AUTHDOMAIN,
            projectId: process.env.NEXT_PUBLIC_PROJECTID,
            storageBucket: process.env.NEXT_PUBLIC_STORAGEBUCKET,
            messagingSenderId: process.env.NEXT_PUBLIC_MESSAGINGSENDERID,
            appId: process.env.NEXT_PUBLIC_APPID,
          }, "new-app");

          const tempAuth = getAuth(tempApp);

          // Create a Firebase Auth user for the customer
          const userCredential = await createUserWithEmailAndPassword(
            tempAuth,
            customerEmail,
            'DefaultSecurePassword123!' // You can change this to something more secure
          );

          // Immediately sign out to prevent auto sign-in
          await signOut(tempAuth);

          newCustomerUid = userCredential.user.uid; // Store the new customer's UID

          // Clean up by deleting the temporary app instance
          await deleteApp(tempApp);
        } catch (authError: any) {
          if (authError.code !== 'auth/email-already-in-use') {
            throw authError;
          } else {
            // If the user already exists, retrieve their UID
            const existingUserRef = await getDoc(doc(db, 'users', customerEmail));
            if (existingUserRef.exists()) {
              newCustomerUid = existingUserRef.id; // Retrieve existing UID
            }
          }
        }

        // Add new project
        const newProject = {
          name: newProjectName,
          description: newProjectDescription,
          link: newProjectName
            ? `/Dashboard/${uid}/${stripeCustomerId}/${newProjectName}` // Optional link
            : '',
        };

        // Add new project to Firestore
        const projectRef = await addDoc(collection(db, 'users', uid, 'projects'), newProject);

        // Update project link with auto-generated ID
        if (newProject.link) {
          newProject.link = `/Dashboard/${uid}/${stripeCustomerId}/${projectRef.id}`;
        }

        // Update projects in Firestore
        const updatedProjects = [...(customer.projects || []), { id: projectRef.id, ...newProject }];
        await updateDoc(userRef, {
          customers: customers.map((cust: { stripeCustomerId: string }) =>
            cust.stripeCustomerId === stripeCustomerId ? { ...cust, projects: updatedProjects } : cust
          ),
        });

        // If a new customer UID was created, update the customer with the matching stripeCustomerId
        if (newCustomerUid) {
          const updatedCustomers = customers.map((cust: { stripeCustomerId: string; uid: string }) => {
            if (cust.stripeCustomerId === stripeCustomerId) {
              return { ...cust, uid: newCustomerUid, projects: updatedProjects }; // Add updated projects
            }
            return cust; // Keep other customers unchanged
          });

          // Update Firestore with the modified customers array
          await updateDoc(userRef, {
            customers: updatedCustomers,
          });
        }

        // Update local state
        setProjects(updatedProjects);
        setNewProjectName('');
        setNewProjectDescription('');
        setShowForm(false);
      }
    }
  } catch (err) {
    console.error("Error creating project:", err);
    setError("Failed to create project.");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="mt-6">
      <div className="flex flex-row items-center justify-start">
        <h3 className="text-xl font-semibold">Projects</h3>
        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 flex flex-row items-center justify-center text-lg duration-300 text-black font-semibold rounded-md hover:bg-opacity-60"
        >
         [<Plus className="w-6 h-6 text-green-500 hover:rotate-90 duration-300" />]
        </button>
      </div>

      {/* Error message */}
      {error && <p className="text-red-500">{error}</p>}

      {/* Loading state */}
      {loading && <p className="text-blue-500">Loading...</p>}

      {/* Existing Projects List */}
      <div className="mb-4">
        {projects.length > 0 ? (
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
             <div
                      key={index}
                      className="bg-white flex flex-col my-auto h-full border-2 shadow-black border-black rounded-lg shadow-md p-4"
                    >
                      <h3 className="text-lg flex flex-col my-auto h-full font-bold text-black mb-2">
                        {project.name}
                      </h3>
                      <p className="text-gray-600 text-sm flex flex-col my-auto h-full">ID: {project.id}</p>
                      <p className="text-gray-600 text-sm mb-2 flex flex-col my-auto h-full">
                        Descripion: {project.description}
                      </p>
                      <a
                        href={project.link}
                        className="text-confirm text-sm hover:opacity-60 duration-300 font-semibold "
                      >
                        View Details
                      </a>
                    </div>
            ))}
          </div>
        ) : (
          <p>No projects found.</p>
        )}
      </div>

      {/* New Project Form */}
      {showForm && (
        <div className="inset-0 fixed bg-black bg-opacity-90 flex items-center justify-center mx-auto px-4">
          <div className="bg-white p-6 w-full rounded-md shadow-lg max-w-xl">
              <h3 className="text-xl text-center font-semibold">Create Project</h3>
            <form >
              <div className="mt-2">
                <label htmlFor="name" className="block text-gray-700">Project Name</label>
                <input
                  id="name"
                  type="text"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mt-2">
                <label htmlFor="description" className="block text-gray-700">Project Description</label>
                <input
                  id="description"
                  type="text"
                  value={newProjectDescription}
                  onChange={(e) => setNewProjectDescription(e.target.value)}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
            </form>
            <div className='flex flex-row items-center justify-end'>
              <button
              type="button"
              onClick={() => setShowForm(false)}
              className="mt-4 px-4 py-2 text-destructive  rounded-lg  font-semibold hover:opacity-60 duration-300"
            >
              Cancel
            </button>
              <button
                onClick={handleCreateProject}
                type="submit"
                className="mt-4  hover:bg-opacity-60 duration-300 bg-confirm py-2 px-4 font-semibold rounded-md"
                disabled={loading} // Disable button when loading
              >
                {loading ? 'Creating...' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
