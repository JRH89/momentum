"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { db } from "../../../../../firebase";
import { doc, getDoc } from "firebase/firestore";
import Footer from "../../../../components/footer";
import Link from "next/link";
import ReactPaginate from "react-paginate";
import { set } from "date-fns";

const Page = () => {
  const { uid } = useParams();
  const [projects, setProjects] = useState([]);
  const [projectsPerPage, setProjectsPerPage] = useState(5); // Default projects per page
  const [currentPage, setCurrentPage] = useState(0); // Tracks the current page

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
          setProjectsPerPage(userData.projectsPerPage || 5);
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

  return (
    <>
      <div className="min-h-screen max-w-6xl mx-auto h-full w-full p-4 pt-0 text-black flex flex-col pb-24">
        <h1 className="text-3xl font-semibold">Projects</h1>
        {currentProjects.length > 0 ? (
          <div className="grid gap-4 mt-4">
            {currentProjects.map((project, index) => (
              <Link
                href={`${project.link}`}
                key={index}
                className="bg-white rounded-lg shadow-md p-4"
              >
                <h2 className="text-lg font-semibold">{project.name}</h2>
                <p className="text-gray-600">{project.description}</p>
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
      <Footer />
    </>
  );
};

export default Page;
