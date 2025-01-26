"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { db } from "../../../../../firebase";
import { doc, getDoc, updateDoc, collection, addDoc } from "firebase/firestore";
import Link from "next/link";
import ReactPaginate from "react-paginate";
import { useRouter } from "next/navigation";
import { auth } from "../../../../../firebase"; // Adjusted for direct use of Firebase auth
import { Briefcase, LoaderPinwheel, X } from "lucide-react";
import MilestoneProgress from "../../../../components/ProgressBar";
import { toast } from "react-toastify";
import { set } from "date-fns";

const Page = () => {
  const { uid } = useParams();
  const [projects, setProjects] = useState([]);
  const [projectsPerPage, setProjectsPerPage] = useState(10); // Default projects per page
  const [currentPage, setCurrentPage] = useState(0); // Tracks the current page
  const [loading, setLoading] = useState(true); // Loading state
  const [user, setUser] = useState(null);

  const router = useRouter();

  useEffect(() => {
    // Listener for auth state changes
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        router.push("/Dashboard/login"); // Redirect if not authenticated
      }
      setLoading(false); // Auth state is determined
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, [router]);

  useEffect(() => {
    setLoading(true);
    const fetchProjects = async () => {
      if (!uid) return;

      try {
        const userRef = doc(db, "users", uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          const customers = Array.isArray(userData.customers)
            ? userData.customers
            : [];

          const allProjects = customers.flatMap((customer) =>
            Array.isArray(customer.projects) ? customer.projects : []
          );

          setProjects(allProjects);
          setProjectsPerPage(userData.projectsPerPage || 10);
          setLoading(false);
        } else {
          toast.error("User document does not exist!");
        }
      } catch (error) {
        toast.error("Error fetching projects:", error);
      }
    };

    if (uid) fetchProjects();
  }, [uid]);

  // Get the current projects for the page
  const offset = currentPage * projectsPerPage;
  const currentProjects = projects.slice(offset, offset + projectsPerPage);
  const pageCount = Math.ceil(projects.length / projectsPerPage);

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm("Are you sure you want to delete this project?")) {
      toast.warning("Project deletion cancelled");
      return;
    }

    try {
      const userRef = doc(db, "users", uid);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        toast.error("User not found");
        return;
      }

      const userData = userDoc.data();
      const customers = Array.isArray(userData.customers)
        ? userData.customers
        : [];

      // Update customers array by removing the project
      const updatedCustomers = customers.map((customer) => {
        return {
          ...customer,
          projects: (customer.projects || []).filter(
            (project) => project.id !== projectId // Use `id` to match correctly
          ),
        };
      });

      // Update Firestore with modified customers
      await updateDoc(userRef, { customers: updatedCustomers });

      // Update local state
      setProjects(
        updatedCustomers.flatMap((customer) => customer.projects || [])
      );
      toast.success("Project deleted successfully");
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error(
        error instanceof Error
          ? `Failed to delete project: ${error.message}`
          : "Failed to delete project"
      );
    }
  };

  if (loading)
    return (
      <div className="min-h-screen my-auto items-center justify-center max-w-6xl mx-auto h-full w-full p-4 pt-4 text-black flex flex-col pb-24">
        <LoaderPinwheel className="animate-spin duration-300 w-8 h-8" />
      </div>
    );

  return (
    <>
      <div className="min-h-screen max-w-6xl mx-auto h-full w-full p-4 pt-4 text-black flex flex-col pb-24">
        <h1 className="text-3xl px-0 sm:px-4 font-semibold flex flex-row gap-2 items-center">
          <Briefcase className="w-8 h-8" /> Projects
        </h1>
        <div className="flex flex-col pt-2 w-full justify-start gap-2 px-0 sm:px-8">
          <h2 className="text-xl font-medium">In Progress</h2>
          {currentProjects.filter((project) => !project.isCompleted).length >
          0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-0 px-0 ">
              {currentProjects
                .filter((project) => !project.isCompleted)
                .map((project, index) => (
                  <div
                    key={index}
                    className="bg-[#EAEEFE] flex flex-col rounded-lg border-2  border-black shadow-black shadow-md py-2 p-4 relative"
                  >
                    <h2 className="text-md capitalize sm:text-lg font-semibold h-full flex2">
                      {project.name}
                    </h2>
                    <p className="text-black flex h-full text-sm capitalize sm:text-md">
                      {project.description}
                    </p>

                    <MilestoneProgress milestones={project.milestones} />
                    <div className="absolute flex p-0.5 rounded-bl-lg bg-black h-auto top-0 w-auto mx-auto right-0">
                      <button onClick={() => handleDeleteProject(project.id)}>
                        <X className="w-5 h-5 text-destructive hover:rotate-90 duration-300" />
                      </button>
                    </div>
                    <Link
                      href={`${project.link}`}
                      className="mt-2 text-gray-600 hover:underline font-semibold"
                    >
                      View Project
                    </Link>
                  </div>
                ))}
            </div>
          ) : (
            <p className="px-0 sm:px-4 text-gray-500">
              No projects in progress.
            </p>
          )}
          <h2 className="text-xl mt-2 font-medium">Completed</h2>
          {currentProjects.filter((project) => project.isCompleted).length >
          0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-0 px-0 ">
              {currentProjects
                .filter((project) => project.isCompleted)
                .map((project, index) => (
                  <div
                    key={index}
                    className="bg-green-50 h-full flex flex-col rounded-lg border-2 relative border-black shadow-black shadow-md py-2 p-4"
                  >
                    <h2 className="text-md capitalize sm:text-lg font-semibold h-full flex2">
                      {project.name}
                    </h2>
                    <p className="text-black flex h-full text-sm capitalize sm:text-md">
                      {project.description}
                    </p>

                    <MilestoneProgress milestones={project.milestones} />
                    <div className="absolute flex p-0.5 rounded-bl-lg bg-black h-auto top-0 w-auto mx-auto right-0">
                      <button onClick={() => handleDeleteProject(project.id)}>
                        <X className="w-5 h-5 text-destructive hover:rotate-90 duration-300" />
                      </button>
                    </div>
                    <Link
                      href={`${project.link}`}
                      className="mt-2 text-gray-600 hover:underline font-semibold"
                    >
                      View Project
                    </Link>
                  </div>
                ))}
            </div>
          ) : (
            <p className="px-0 sm:px-4 text-gray-500">
              No completed projects found.
            </p>
          )}
        </div>

        {/* Pagination */}
        {projects.length > projectsPerPage && (
          <ReactPaginate
            previousLabel={"Previous"}
            nextLabel={"Next"}
            breakLabel={"..."}
            pageCount={pageCount}
            marginPagesDisplayed={2}
            pageRangeDisplayed={3}
            onPageChange={handlePageChange}
            containerClassName={
              "pagination flex flex-row w-full justify-between px-4 mt-4"
            }
            activeClassName={"active text-confirm font-extrabold"}
            pageClassName={"page hover:underline"}
            breakClassName={"break"}
            previousClassName={"previous text-green-500 hover:underline"}
            nextClassName={"next text-green-500 hover:underline"}
          />
        )}
      </div>
    </>
  );
};

export default Page;
