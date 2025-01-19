"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { db } from "../../../../../firebase";
import { doc, getDoc } from "firebase/firestore";
import Link from "next/link";
import ReactPaginate from "react-paginate";
import { useRouter } from "next/navigation";
import { auth } from "../../../../../firebase"; // Adjusted for direct use of Firebase auth
import { Briefcase } from "lucide-react";
import MilestoneProgress from "../../../../components/ProgressBar";

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
        } else {
          console.warn("User document does not exist!");
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
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

  if (loading) {
    return (
      <div className="min-h-screen max-w-6xl mx-auto h-full w-full p-4 pt-4 text-black flex flex-col pb-24">
        Loading...
      </div>
    ); // Show loading state while auth is initializing
  }

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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-0 px-0 sm:px-4">
              {currentProjects
                .filter((project) => !project.isCompleted)
                .map((project, index) => (
                  <Link
                    href={`${project.link}`}
                    key={index}
                    className="bg-[#EAEEFE] flex flex-col rounded-lg border-2 hover:shadow-lg hover:shadow-black transition duration-300 border-black shadow-black shadow-md py-2 p-4"
                  >
                    <h2 className="text-md capitalize sm:text-lg font-semibold h-full flex2">
                      {project.name}
                    </h2>
                    <p className="text-black flex h-full text-sm capitalize sm:text-md">
                      {project.description}
                    </p>

                    <MilestoneProgress milestones={project.milestones} />
                  </Link>
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
            <div className="grid grid-cols-2 gap-4 mt-0 px-0 sm:px-4">
              {currentProjects
                .filter((project) => project.isCompleted)
                .map((project, index) => (
                  <Link
                    href={`${project.link}`}
                    key={index}
                    className="bg-[#EAEEFE] flex flex-col rounded-lg border-2 hover:shadow-lg hover:shadow-black transition duration-300 border-black shadow-black shadow-md py-2 p-4"
                  >
                    <h2 className="text-sm sm:text-lg font-semibold h-full flex2">
                      {project.name}
                    </h2>
                    <p className="text-black flex h-full text-xs sm:text-md">
                      {project.description}
                    </p>
                    <p className="text-black flex h-full text-xs sm:text-md">
                      {project.id}
                    </p>
                  </Link>
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
