"use client";

import React, { useState, useRef, useEffect } from "react";
import { Copy, Download, PlusIcon, Save } from "lucide-react";
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

export default function CustomerPallete({ userId, customerId, projectId }) {
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
        let projectColors = [];

        querySnapshot.forEach((userDoc) => {
          const customers = userDoc.data().customers || [];

          customers.forEach((customer) => {
            customer.projects?.forEach((project) => {
              if (project.id === projectId) {
                // If the project exists but has no colorLayout, initialize it as an empty array
                if (!project.colorLayout) {
                  project.colorLayout = [];
                }

                // Assign the colorLayout to projectColors
                projectColors = [...project.colorLayout];
              }
            });
          });
        });

        setProjectColors(projectColors);
      } catch (error) {
        console.error("Error fetching project colors:", error);
      }
    };

    fetchProjectColors();
  }, [projectId]); // Add projectId as a dependency

  const savePaletteLayout = async () => {
    try {
      // Reference to the user document using userId
      const userRef = doc(db, "users", userId);

      // Use Firestore transaction to ensure atomic updates
      await runTransaction(db, async (transaction) => {
        const userDoc = await transaction.get(userRef);

        if (!userDoc.exists()) {
          throw new Error("User not found.");
        }

        // Get the user's customers array or initialize it if it doesn't exist
        const customerArray = userDoc.data().customers || [];

        // Find the index of the customer with the given customerId
        const customerIndex = customerArray.findIndex(
          (customer) => customer.uid === customerId
        );

        if (customerIndex === -1) {
          throw new Error("Customer not found.");
        }

        // Get the customer object
        const customer = customerArray[customerIndex];

        // Find the index of the project with the given projectId
        const projectIndex = customer.projects.findIndex(
          (project) => project.id === projectId
        );

        if (projectIndex === -1) {
          throw new Error("Project not found.");
        }

        // Get the project object
        const project = customer.projects[projectIndex];

        // Ensure colorLayout exists as an array
        if (!Array.isArray(project.colorLayout)) {
          project.colorLayout = [];
        }

        // Add the new palette to the colorLayout array
        project.colorLayout.push(baseColor);

        // Update Firestore with the modified customers array
        transaction.update(userRef, {
          customers: customerArray,
        });
      });

      // Update local state with the new palette
      setProjectColors((prevColors) => [...prevColors, baseColor]);

      // Show success notification
      toast.success("Palette saved successfully!");
    } catch (error) {
      // Handle errors gracefully
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

  const savePalette = async () => {
    if (projectColors.length === 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const boxWidth = 250; // Set to 50x50
    const boxHeight = 250;
    const padding = 5; // Smaller padding for better spacing
    const totalWidth =
      boxWidth * projectColors.length + padding * (projectColors.length - 1);
    const imageHeight = boxHeight + padding * 2;

    // Set canvas dimensions
    canvas.width = totalWidth + padding * 2;
    canvas.height = imageHeight;

    // Clear the canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the color boxes using projectColors
    drawPaletteBoxes(context, boxWidth, boxHeight, padding, projectColors);

    // Save the canvas as an image
    setTimeout(() => {
      const link = document.createElement("a");
      link.download = "color-palette.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    }, 100);
  };

  // Helper function to draw the color palette boxes
  const drawPaletteBoxes = (context, boxWidth, boxHeight, padding, colors) => {
    colors.forEach((color, index) => {
      const xOffset = padding + index * (boxWidth + padding); // Correct positioning
      const yOffset = padding; // Keep boxes aligned vertically

      // Draw the color box
      context.fillStyle = color;
      context.fillRect(xOffset, yOffset, boxWidth, boxHeight);

      // Add the color text (adjusted for small boxes)
      context.fillStyle = "#fff";
      context.font = "30px Arial";
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillText(
        color.toUpperCase(),
        xOffset + boxWidth / 2,
        yOffset + boxHeight / 2
      );
    });
  };

  return (
    <div className="flex flex-col mt-2 mx-auto ">
      <div className=" w-full mx-auto text-black flex flex-col items-center justify-start mt-1">
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-2">
          <div className="flex gap-2 items-center justify-between mx-auto w-full my-auto">
            <div className="flex flex-row items-center gap-2">
              <button
                onClick={() => setOpenMenuOne(!openMenuOne)}
                className="hover:bg-opacity-60 duration-300 font-semibold items-center py-2 text-xl flex flex-row text-black rounded-md"
              >
                [
                <PlusIcon className="w-7 h-7 text-green-500 hover:rotate-90 duration-300" />
                ]
              </button>
              <h3 className="text-2xl font-bold">Palette</h3>
            </div>
            {projectColors && projectColors.length > 0 && (
              <div className="flex flex-row items-center gap-2 ml-auto">
                <button
                  title="Download Palette"
                  onClick={savePalette}
                  className="w-auto mx-auto px-2 py-1 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:opacity-60 flex items-center duration-300"
                >
                  <Download className="w-5 h-5" />
                </button>
              </div>
            )}
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
                className="w-full px-4 py-2 bg-gradient-to-r from-green-600 to-green-500 text-black font-semibold rounded-lg shadow-md hover:shadow-md hover:shadow-black border-2 border-black flex items-center duration-300 justify-center gap-2"
              >
                <Save className="w-5 h-5" />
                Save
              </button>
            </div>
          </div>
        )}
        <div className="w-full">
          {projectColors.length > 0 && (
            <div className="border-2 border-black p-4 rounded-lg shadow-md shadow-black grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 h-full  gap-4 w-full justify-start">
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
          )}

          {projectColors.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full">
              <p className="text-gray-600 px-2 border border-black rounded-lg p-2 w-full flex  flex-row items-center">
                No colors yet
              </p>
            </div>
          )}
        </div>
        <canvas ref={canvasRef} className="hidden"></canvas>
      </div>
    </div>
  );
}
