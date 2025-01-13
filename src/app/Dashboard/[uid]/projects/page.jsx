"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { db } from "../../../../../firebase";
import { doc, getDoc } from "firebase/firestore";
import Link from "next/link";
import ReactPaginate from "react-paginate";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../../context/AuthProvider";
import { Briefcase } from "lucide-react";

const Page = () => {
  const { uid } = useParams();
  const [projects, setProjects] = useState([]);
  const [projectsPerPage, setProjectsPerPage] = useState(10); // Default projects per page
  const [currentPage, setCurrentPage] = useState(0); // Tracks the current page
  const router = useRouter();
  const { user } = useAuth();
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

    fetchProjects();
  }, [uid]);

  // Get the current projects for the page
  const offset = currentPage * projectsPerPage;
  const currentProjects = projects.slice(offset, offset + projectsPerPage);
  const pageCount = Math.ceil(projects.length / projectsPerPage);

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  useEffect(() => {
    if (!user) {
      router.push("/Dashboard/login"); // Redirect to home if user is not logged in
    }
  }, [user, router]);

  return (
    <>
      <div className="min-h-screen max-w-6xl mx-auto h-full w-full p-4 pt-4 sm:pt-0 text-black flex flex-col pb-24">
        <h1 className="text-3xl font-semibold flex flex-row gap-2 items-center">
          <Briefcase className="w-8 h-8" /> Projects
        </h1>
        {currentProjects.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 mt-2">
            {currentProjects.map((project, index) => (
              <Link
                href={`${project.link}`}
                key={index}
                className="bg-white flex flex-col rounded-lg border-2 hover:bg-[#EAEEFE] duration-300 border-black shadow-black shadow-md p-4"
              >
                <h2 className="text-sm sm:text-lg font-semibold h-full flex pb-2">
                  {project.name}
                </h2>
                <p className="text-gray-600 flex h-full text-xs sm:text-md">
                  {project.description}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-gray-500">No projects found.</p>
        )}

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
