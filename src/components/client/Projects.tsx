import React, { useState, useEffect } from 'react';
import { db } from "../../../firebase";
import { doc, getDoc, updateDoc, collection, addDoc } from 'firebase/firestore';
import { Plus } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  description: string;
  link: string;
}

interface ProjectsProps {
  uid: string;
  stripeCustomerId: string;
}

const Projects: React.FC<ProjectsProps> = ({ uid, stripeCustomerId }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [newProjectName, setNewProjectName] = useState<string>('');
  const [newProjectDescription, setNewProjectDescription] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const [showForm, setShowForm] = useState(false);

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
    try {
      const userRef = doc(db, 'users', uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const userData = userSnap.data();
        const customers = Array.isArray(userData.customers) ? userData.customers : [];
        const customer = customers.find(
          (cust: { stripeCustomerId: string }) => cust.stripeCustomerId === stripeCustomerId
        );

        if (customer) {
          // Add new project with Firestore's auto-generated ID
          const newProject = {
            name: newProjectName,
            description: newProjectDescription,
            link: `/Dashboard/${uid}/${stripeCustomerId}/${newProjectName}`, // Will be updated with project ID
          };

          // Add new project to Firestore
          const projectRef = await addDoc(collection(db, 'users', uid, 'projects'), newProject);

          // Update the link with the Firestore-generated ID
          newProject.link = `/Dashboard/${uid}/${stripeCustomerId}/${projectRef.id}`;

          // Update local state with new project
          const updatedProjects = [...(customer.projects || []), { id: projectRef.id, ...newProject }];
          await updateDoc(userRef, {
            'customers': customers.map((cust: { stripeCustomerId: string }) =>
              cust.stripeCustomerId === stripeCustomerId ? { ...cust, projects: updatedProjects } : cust
            ),
          });

          // Update local state
          setProjects(updatedProjects);
          setNewProjectName('');
          setNewProjectDescription('');
          setShowForm(false); // Close form after success
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
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 flex flex-row items-center justify-center  duration-300 text-black font-semibold rounded-md hover:bg-opacity-60"
        >
         [<Plus className="w-5 h-5 text-green-500 hover:rotate-90 duration-300" />]
        </button>
      </div>

      {/* Error message */}
      {error && <p className="text-red-500">{error}</p>}

      {/* Loading state */}
      {loading && <p className="text-blue-500">Loading...</p>}

      {/* Existing Projects List */}
      <div className="mt-4">
        {projects.length > 0 ? (
          <ul>
            {projects.map((project) => (
              <li key={project.id} className="border-b py-2">
                <a href={project.link} className="text-blue-500 hover:underline">
                  {project.name}
                </a>
                <p className="text-gray-500">{project.description}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No projects found.</p>
        )}
      </div>

      {/* New Project Form */}
      {showForm && (
        <div className="inset-0 absolute bg-black bg-opacity-80 flex items-center justify-center mx-auto px-4">
          <div className="bg-white p-6 w-full rounded-md shadow-lg max-w-xl">
              <h3 className="text-xl text-center font-semibold">Create Project</h3>
            <form onSubmit={handleCreateProject}>
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
              <button
                type="submit"
                className="mt-4 w-full hover:bg-opacity-60 duration-300 bg-confirm py-2 px-4 font-semibold rounded-md"
                disabled={loading} // Disable button when loading
              >
                {loading ? 'Creating...' : 'Create Project'}
              </button>
            </form>
            <button
              onClick={() => setShowForm(false)}
              className="mt-4 px-4 py-2 bg-destructive  rounded-lg w-full font-semibold hover:bg-destructive/60 duration-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
