"use client";

import React, { useState, useRef, useEffect } from "react";
import { Copy, PlusIcon, Save } from "lucide-react";
import { toast } from "react-toastify";
import { db } from "../../../firebase";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  getDoc,
  runTransaction,
} from "firebase/firestore";

export default function ColorPaletteGenerator({
  userId,
  customerId,
  projectId,
}) {
  const [loading, setLoading] = useState(false); // For loading state
  const [baseColor, setBaseColor] = useState("#3498db");
  const [palette, setPalette] = useState([]);
  const canvasRef = useRef(null);
  const [openMenuOne, setOpenMenuOne] = useState(false);
  const [projectColors, setProjectColors] = useState([]);

  useEffect(() => {
    const fetchProjectColors = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const colors = [];

        querySnapshot.forEach((userDoc) => {
          const customers = userDoc.data().customers || [];

          // Iterate over customers and their projects to get the color layouts
          customers.forEach((customer) => {
            customer.projects?.forEach((project) => {
              if (project.colorLayout && project.colorLayout.length > 0) {
                // Add all colors in the colorLayout of the project
                colors.push(...project.colorLayout);
              }
            });
          });
        });

        setProjectColors(colors);
      } catch (error) {
        console.error("Error fetching project colors:", error);
      }
    };

    fetchProjectColors();
  }, []); // Empty dependency array to run once on component mount

  const savePaletteLayout = async () => {
    try {
      // Reference to the user document using userId
      const userRef = doc(db, "users", userId);

      // Use Firestore transaction to ensure data integrity
      await runTransaction(db, async (transaction) => {
        const userDoc = await getDoc(userRef);

        if (!userDoc.exists()) {
          throw new Error("User not found.");
        }

        // Check if the customer array exists, if not create it
        const customerArray = userDoc.data().customers || [];

        // Find the customer with the matching customerId
        const customerIndex = customerArray.findIndex(
          (customer) => customer.uid === customerId
        );

        if (customerIndex === -1) {
          throw new Error("Customer not found.");
        }

        // Find the project within the customer
        const customer = customerArray[customerIndex];
        const projectIndex = customer.projects.findIndex(
          (project) => project.id === projectId
        );

        if (projectIndex === -1) {
          throw new Error("Project not found.");
        }

        // Add the new palette to the colorLayout array in the correct project
        const project = customer.projects[projectIndex];

        // Ensure colorLayout is initialized as an empty array if it doesn't exist
        if (!Array.isArray(project.colorLayout)) {
          project.colorLayout = [];
        }

        // Append new palette
        project.colorLayout = [...project.colorLayout, baseColor];

        // Save the updated data back to Firestore
        transaction.update(userRef, {
          customers: customerArray,
        });
      });

      toast.success("Palette saved successfully!");
      setProjectColors((prevColors) => [...prevColors, baseColor]);
    } catch (error) {
      console.error("Error saving palette:", error);
      toast.error("Error saving palette: " + error.message);
    }
  };

  const deleteColor = async (colorToDelete) => {
    setLoading(true); // Set loading to true when deleting
    try {
      // Update the Firestore data to remove the color
      const userQuerySnapshot = await getDocs(collection(db, "users"));
      let userUpdated = false;

      userQuerySnapshot.forEach((userDoc) => {
        const customers = userDoc.data().customers || [];

        customers.forEach((customer) => {
          customer.projects?.forEach((project) => {
            if (
              project.colorLayout &&
              project.colorLayout.includes(colorToDelete)
            ) {
              // Find the index of the colorToDelete in the specific project's colorLayout array
              const colorIndex = project.colorLayout.indexOf(colorToDelete);

              // Only remove the first occurrence of the color
              if (colorIndex !== -1) {
                project.colorLayout.splice(colorIndex, 1); // Remove the color from that specific project

                // Update the document in Firestore with the new color layout
                const userRef = doc(db, "users", userDoc.id);
                updateDoc(userRef, {
                  customers: customers,
                });

                userUpdated = true;
              }
            }
          });
        });
      });

      if (userUpdated) {
        toast.success("Color deleted successfully!");
        // Update local state to reflect the deletion
        setProjectColors((prevColors) =>
          prevColors.filter((color) => color !== colorToDelete)
        );
      } else {
        toast.error("Color not found in any project.");
      }
    } catch (error) {
      console.error("Error deleting color:", error);
      toast.error("Error deleting color: " + error.message);
    } finally {
      setLoading(false); // Set loading to false once deletion is done
    }
  };

  return (
    <div className="flex flex-col mx-auto bg-white mt-4 p-4 rounded-lg shadow-md shadow-black">
      <div className=" w-full mx-auto text-black flex flex-col items-center justify-start2">
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-2">
          <div className="flex flex-row items-center justify-start my-auto gap-2 mb-2">
            <h3 className="text-2xl font-bold">Pallete</h3>
            <button
              className="flex flex-row items-center text-lg font-medium"
              onClick={() => setOpenMenuOne(!openMenuOne)}
            >
              [
              <PlusIcon className="w-5 h-5 text-green-500 hover:rotate-90 duration-300" />
              ]
            </button>
          </div>
        </div>

        {loading && (
          <div className="mt-4 text-center text-lg text-gray-500">
            Deleting...
          </div>
        )}

        {openMenuOne && (
          <div className="bg-white rounded-lg w-full border border-black p-4 mb-4">
            <label className="block text-black mb-2">Select Color:</label>

            <div className="flex items-center gap-4 mb-4">
              <input
                type="color"
                value={baseColor}
                onChange={(e) => setBaseColor(e.target.value)}
                className="w-16 h-16 rounded-lg shadow-lg border-2 border-gray-200"
              />
              <input
                type="text"
                value={baseColor}
                onChange={(e) => setBaseColor(e.target.value)}
                className="w-full border-2 border-gray-300 text-gray-900 p-2 rounded-lg focus:ring focus:ring-blue-300  dark:border-gray-700"
              />
            </div>

            <div id="palette" className=" w-full">
              <div className="flex flex-wrap justify-center gap-6 ">
                {palette.map((color, index) => (
                  <div
                    key={index}
                    style={{ backgroundColor: color }}
                    className="w-36 h-36 p-4 flex flex-col items-center justify-center rounded-lg shadow-md cursor-pointer hover:scale-105 transform transition"
                  >
                    <span className="text-white font-semibold">
                      {color.toUpperCase()}
                    </span>
                    <Copy className="w-6 h-6 text-white mt-2" />
                  </div>
                ))}
              </div>
              <button
                onClick={savePaletteLayout}
                className="w-full px-4 py-2 bg-gradient-to-r from-green-600 to-green-500 text-black font-semibold rounded-lg shadow-md hover:shadow-md hover:shadow-black flex items-center duration-300 justify-center gap-2"
              >
                <Save className="w-5 h-5" />
                Save color to palette
              </button>
            </div>
          </div>
        )}
        <div className="flex flex-wrap gap-4 w-full justify-start">
          {projectColors.map((color, index) => (
            <div
              key={index}
              className="w-16 h-16 flex justify-center items-center rounded-md border shadow-lg border-black relative"
              style={{ backgroundColor: color }}
            >
              {/* Delete Button */}
              <button
                onClick={() => deleteColor(color)}
                className="absolute top-0 right-0 bg-destructive text-black font-bold border-b border-l border-black rounded-bl-lg rounded-tr-md p-1 py-0.5 text-xs hover:bg-opacity-60"
              >
                X
              </button>
              {/* Optionally, display the color code */}
              <span className="text-white text-xs absolute bottom-1">
                {color}
              </span>
            </div>
          ))}
        </div>
        <canvas ref={canvasRef} className="hidden"></canvas>
      </div>
    </div>
  );
}
