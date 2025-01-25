"use client";

import React, { useState, useEffect } from "react";
import { db, storage } from "../../../../../../firebase";
import { doc, getDoc, runTransaction, updateDoc } from "firebase/firestore";
import { useParams } from "next/navigation";
import { LoaderPinwheel, Plus, Save, Settings, Upload } from "lucide-react";
import ColorPaletteGenerator from "../../../../../components/customer/ColorPalleteGenerator";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { toast } from "react-toastify";
import ReactPaginate from "react-paginate";
import MilestoneProgress from "../../../../../components/ProgressBar";
import confetti from "canvas-confetti";
import InvoicesTable from "../../../../../components/project/InvoiceTable";
import { StripeCustomer } from "../../../../../components/types/stripeCustomer";

interface Milestone {
  id: string;
  title: string;
  description: string;
  status: string; // 'pending', 'in-progress', 'completed'
  deadline: string;
  priority: string;
}

const ProjectPage = () => {
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
  const [uploads, setUploads] = useState<{ name: string; url: string }[]>([]);
  const [userData, setUserData] = useState<any>(null);
  const [showUploadForm, setShowUploadForm] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [uploadLimit, setUploadLimit] = useState<number>(10);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        // Fetch the user document from Firestore
        const userRef = doc(db, "users", uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const userData = userSnap.data();
          const customer = (userData.customers || []).find(
            (cust: { stripeCustomerId: string }) =>
              cust.stripeCustomerId === stripeCustomerId
          );

          if (customer && Array.isArray(customer.projects)) {
            // Find the project by its ID
            const foundProject =
              customer.projects.find(
                (p: { id: string }) => p.id === projectId
              ) || null;
            if (foundProject) {
              setUserData(userData);
              setProject(foundProject);
              setMilestones(foundProject.milestones || []);
              setUploads(foundProject.uploads || []);
              setIsCompleted(foundProject.isCompleted || false);
              setFeatures(foundProject.features || []);
              setTitle(foundProject.title || "");
              setDescription(foundProject.invoiceDescription || "");
            }
          }
        }
      } catch (err: any) {
        toast.error("Error fetching project:", err);
        toast.error("Failed to fetch project.");
      }
    };

    fetchProject();
  }, [uid, stripeCustomerId, projectId]);

  const handleAddMilestone = async () => {
    if (
      !newMilestone.title ||
      !newMilestone.description ||
      !newMilestone.deadline ||
      !newMilestone.priority
    ) {
      setMilestoneError(
        "Please provide a title, description, deadline, and priority for the milestone."
      );
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
        const customers = Array.isArray(userData.customers)
          ? userData.customers
          : [];
        const customerIndex = customers.findIndex(
          (cust: { stripeCustomerId: string }) =>
            cust.stripeCustomerId === stripeCustomerId
        );

        if (customerIndex >= 0) {
          const projectIndex = customers[customerIndex].projects.findIndex(
            (p: { id: string }) => p.id === projectId
          );

          if (projectIndex >= 0) {
            const existingMilestones = Array.isArray(
              customers[customerIndex].projects[projectIndex].milestones
            )
              ? customers[customerIndex].projects[projectIndex].milestones
              : [];
            const updatedMilestones = [...existingMilestones, milestone];

            customers[customerIndex].projects[projectIndex].milestones =
              updatedMilestones;

            await updateDoc(userRef, {
              customers,
            });

            setMilestones(updatedMilestones);
            setNewMilestone({
              title: "",
              description: "",
              deadline: "",
              priority: "",
            });
            setMilestoneError(null);
          }
        }
      }
    } catch (err: any) {
      toast.error("Error adding milestone:", err);
      setMilestoneError("Failed to add milestone.");
    }
  };

  const handleChangeStatus = async (milestoneId: string, newStatus: string) => {
    try {
      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        const customers = Array.isArray(userData.customers)
          ? userData.customers
          : [];
        const customerIndex = customers.findIndex(
          (cust: { stripeCustomerId: string }) =>
            cust.stripeCustomerId === stripeCustomerId
        );

        if (customerIndex >= 0) {
          const projectIndex = customers[customerIndex].projects.findIndex(
            (p: { id: string }) => p.id === projectId
          );

          if (projectIndex >= 0) {
            const project = customers[customerIndex].projects[projectIndex];
            const updatedMilestones = project.milestones.map(
              (milestone: Milestone) =>
                milestone.id === milestoneId
                  ? { ...milestone, status: newStatus }
                  : milestone
            );

            customers[customerIndex].projects[projectIndex].milestones =
              updatedMilestones;

            await updateDoc(userRef, {
              customers,
            });

            setMilestones(updatedMilestones); // Update local state with the updated milestones
          }
        }
      }
    } catch (err: any) {
      toast.error("Error updating milestone status:", err);
    }
  };

  // Handle file upload
  const handleUpload = async () => {
    if (!file) return;

    // File size and type validation
    const maxFileSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/x-icon",
      "image/gif",
      "application/pdf",
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error(
        "Invalid file type. Only images (JPG, PNG, WebP, etc.) and PDFs are allowed."
      );
      return;
    }

    if (file.size > maxFileSize) {
      toast.error("File size exceeds the 5MB limit.");
      return;
    }

    setIsLoading(true);

    try {
      const storageRef = ref(
        storage,
        `uploads/${uid}/${stripeCustomerId}/${projectId}/${file.name}`
      );
      await uploadBytes(storageRef, file);

      const fileUrl = await getDownloadURL(storageRef);
      const userDocRef = doc(db, "users", uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        const customerIndex = userData.customers.findIndex(
          (cust: any) => cust.stripeCustomerId === stripeCustomerId
        );
        const projectIndex = userData.customers[
          customerIndex
        ].projects.findIndex((proj: any) => proj.id === projectId);

        // Ensure customer and project exist
        if (customerIndex === -1 || projectIndex === -1) {
          throw new Error("Customer or project not found");
        }

        // Update project uploads as an array of objects
        const updatedUploads = [
          ...(userData.customers[customerIndex].projects[projectIndex]
            .uploads || []),
          { url: fileUrl, name: file.name }, // Object format
        ];

        // Update the Firestore document
        const updatedData = { ...userData };
        updatedData.customers[customerIndex].projects[projectIndex].uploads =
          updatedUploads;

        await updateDoc(userDocRef, updatedData);

        // Update local state
        setUploads(updatedUploads);
        setFile(null);
        toast.success("File uploaded successfully!");
      } else {
        throw new Error("User document does not exist");
      }
    } catch (error: any) {
      toast.error("Error uploading file:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteUpload = async (index: number) => {
    try {
      const userDocRef = doc(db, "users", uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        const customerIndex = userData.customers.findIndex(
          (cust: any) => cust.stripeCustomerId === stripeCustomerId
        );
        const projectIndex = userData.customers[
          customerIndex
        ].projects.findIndex((proj: any) => proj.id === projectId);

        // Ensure customer and project exist
        if (customerIndex === -1 || projectIndex === -1) {
          throw new Error("Customer or project not found");
        }

        // Update project uploads as an array of objects
        const updatedUploads = userData.customers[customerIndex].projects[
          projectIndex
        ].uploads.filter((_: any, i: number) => i !== index);

        // Update the Firestore document
        const updatedData = { ...userData };
        updatedData.customers[customerIndex].projects[projectIndex].uploads =
          updatedUploads;

        await updateDoc(userDocRef, updatedData);

        // Update local state
        setUploads(updatedUploads);
        toast.success("Upload deleted successfully!");
      } else {
        toast.error("User document does not exist");
        throw new Error("User document does not exist");
      }
    } catch (error) {
      toast.error("Error deleting upload");
    }

    // Reset the file input
    const fileInput = document.getElementById("fileInput") as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const handleMarkProjectComplete = async () => {
    try {
      const userRef = doc(db, "users", uid);

      await runTransaction(db, async (transaction) => {
        const userSnap = await transaction.get(userRef);

        if (!userSnap.exists()) {
          throw new Error("User document not found.");
        }

        const userData = userSnap.data();
        const customers = Array.isArray(userData.customers)
          ? userData.customers
          : [];
        const customerIndex = customers.findIndex(
          (cust) => cust.stripeCustomerId === stripeCustomerId
        );

        if (customerIndex === -1) {
          throw new Error("Customer not found.");
        }

        const projectIndex = customers[customerIndex].projects.findIndex(
          (p: { id: string }) => p.id === projectId
        );

        if (projectIndex === -1) {
          throw new Error("Project not found.");
        }

        // Safely update isCompleted field
        customers[customerIndex].projects[projectIndex].isCompleted = true;

        // Update the entire customers array
        transaction.update(userRef, { customers });
      });

      toast.success("Project marked as complete!");
      setIsCompleted(true);
      confetti({ particleCount: 1000, spread: 180, origin: { y: 0.6 } });
    } catch (error) {
      toast.error("Failed to mark project as complete. Please try again.");
    }
  };

  const deleteMilestone = async (milestoneId: string) => {
    try {
      const userDocRef = doc(db, "users", uid);

      // Get the current user document
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        throw new Error("User document not found.");
      }

      // Extract data from Firestore
      const userData = userDoc.data();
      const customers = userData.customers || [];

      // Find the target customer and project
      const updatedCustomers = customers.map((customer: any) => {
        if (customer.stripeCustomerId === stripeCustomerId) {
          return {
            ...customer,
            projects: customer.projects.map((project: any) => {
              if (project.id === projectId) {
                return {
                  ...project,
                  milestones: project.milestones.filter(
                    (milestone: Milestone) => milestone.id !== milestoneId
                  ),
                };
              }
              return project;
            }),
          };
        }
        return customer;
      });

      // Update Firestore with the modified data
      await updateDoc(userDocRef, {
        customers: updatedCustomers,
      });

      // Update local state
      setMilestones(
        milestones.filter((milestone) => milestone.id !== milestoneId)
      );

      toast.success("Milestone deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete milestone." + error);
    }
  };

  const handleMarkProjectIncomplete = async () => {
    try {
      const userRef = doc(db, "users", uid);

      await runTransaction(db, async (transaction) => {
        const userSnap = await transaction.get(userRef);

        if (!userSnap.exists()) {
          throw new Error("User document not found.");
        }

        const userData = userSnap.data();
        const customers = Array.isArray(userData.customers)
          ? userData.customers
          : [];
        const customerIndex = customers.findIndex(
          (cust) => cust.stripeCustomerId === stripeCustomerId
        );

        if (customerIndex === -1) {
          throw new Error("Customer not found.");
        }

        const projectIndex = customers[customerIndex].projects.findIndex(
          (p: { id: string }) => p.id === projectId
        );

        if (projectIndex === -1) {
          throw new Error("Project not found.");
        }

        // Safely update isCompleted field
        customers[customerIndex].projects[projectIndex].isCompleted = false;

        // Update the entire customers array
        transaction.update(userRef, { customers });
      });

      toast.success("Project marked as incomplete!");
      setIsCompleted(false);
    } catch (error) {
      toast.error("Failed to mark project as incomplete. Please try again.");
    }
  };

  // PAGINATION
  const [currentPage, setCurrentPage] = useState(0);
  const milestonesPerPage = userData?.milestonesPerPage || 5;

  // Calculate the milestones to display on the current page
  const startIndex = currentPage * milestonesPerPage;
  const selectedMilestones = milestones.slice(
    startIndex,
    startIndex + milestonesPerPage
  );

  // Handle page change
  const handlePageClick = (data: any) => {
    setCurrentPage(data.selected);
  };

  const [loading, setLoading] = useState(true);
  const [customerData, setCustomerData] = useState(null);
  const [stripeAccountId, setStripeAccountId] = useState(null);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [invoiceAmount, setInvoiceAmount] = useState<string>("");
  const [invoiceCurrency, setInvoiceCurrency] = useState<string>("usd");
  const [invoiceDescription, setInvoiceDescription] = useState<string>("");
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);
  const [invoiceDueDate, setInvoiceDueDate] = useState<string>("");
  const [customerEmail, setCustomerEmail] = useState<string>("");

  useEffect(() => {
    const fetchUserStripeAccountId = async (userId: string) => {
      try {
        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUserData(userSnap.data());
          setStripeAccountId(userSnap.data().stripeAccountId || null);
        } else {
          toast.error("User document not found");
        }
      } catch (err) {
        toast.error("Failed to fetch user data.");
      }
    };

    if (uid) fetchUserStripeAccountId(uid);
  }, [uid]);

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        const userRef = doc(db, "users", uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          const customers = Array.isArray(userData.customers)
            ? userData.customers
            : [];
          const customer = customers.find(
            (cust: StripeCustomer) => cust.stripeCustomerId === stripeCustomerId
          );
          if (customer) {
            setCustomerData(customer);
            setCustomerEmail(customer.email || "");
          } else toast.error("Customer not found in user document.");
        } else {
          toast.error("User document not found.");
        }
      } catch (err) {
        toast.error("Failed to load customer data.");
      }
    };

    if (stripeAccountId) fetchCustomerData();
  }, [stripeAccountId, stripeCustomerId, uid]);

  useEffect(() => {
    const fetchInvoices = async () => {
      if (!uid || !stripeCustomerId || !projectId) return;

      setLoading(true);
      try {
        // Reference to the user's document
        const userRef = doc(db, "users", uid);

        // Fetch the user's document
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          throw new Error("User document not found.");
        }

        const userData = userSnap.data();
        const customers = Array.isArray(userData.customers)
          ? userData.customers
          : [];
        const customerIndex = customers.findIndex(
          (cust) => cust.stripeCustomerId === stripeCustomerId
        );

        if (customerIndex === -1) {
          throw new Error("Customer not found.");
        }

        const projectIndex = customers[customerIndex].projects.findIndex(
          (p: { id: string }) => p.id === projectId
        );

        if (projectIndex === -1) {
          throw new Error("Project not found.");
        }

        const project = customers[customerIndex].projects[projectIndex];
        setInvoices(project.invoices || []); // Set invoices or an empty array if undefined
      } catch (err: any) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, [uid, stripeCustomerId, projectId]);

  useEffect(() => {
    if (stripeAccountId || error || invoices.length > 0) {
      setLoading(false);
    }
  }, [stripeAccountId, error, invoices]);

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !invoiceAmount ||
      !invoiceCurrency ||
      !invoiceDescription ||
      !invoiceDueDate
    ) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const response = await fetch(`/api/stripe/invoices/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          stripeAccountId,
          stripeCustomerId,
          items: [
            {
              amount: Math.round(parseFloat(invoiceAmount) * 100), // Convert to cents and ensure it's a number
              currency: invoiceCurrency.toLowerCase(),
              description: invoiceDescription,
              quantity: 1,
            },
          ],
          dueDate: Math.floor(new Date(invoiceDueDate).getTime() / 1000),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create invoice");
      }

      const invoice = data.invoice.id;

      const userRef = doc(db, "users", uid);
      await runTransaction(db, async (transaction) => {
        const userSnap = await transaction.get(userRef);

        if (!userSnap.exists()) {
          throw new Error("User document not found.");
        }

        const userData: any = userSnap.data();
        const customers = Array.isArray(userData.customers)
          ? userData.customers
          : [];
        const customerIndex = customers.findIndex(
          (cust: StripeCustomer) => cust.stripeCustomerId === stripeCustomerId
        );

        if (customerIndex === -1) {
          throw new Error("Customer not found.");
        }

        const projectIndex = customers[customerIndex].projects.findIndex(
          (p: { id: string }) => p.id === projectId
        );

        if (projectIndex === -1) {
          throw new Error("Project not found.");
        }

        // Safely update isCompleted field
        if (!customers[customerIndex].projects[projectIndex].invoices) {
          customers[customerIndex].projects[projectIndex].invoices = []; // Initialize if it doesn't exist
        }

        customers[customerIndex].projects[projectIndex].invoices.push(invoice);

        await transaction.update(userRef, {
          customers: customers,
        });
      });

      setInvoices((prevInvoices) => [...prevInvoices, data.invoice]);
      setShowInvoiceForm(false);
      toast.success("Invoice created successfully!");
      // Reset form
      setInvoiceAmount("");
      setInvoiceCurrency("usd");
      setInvoiceDescription("");
      setInvoiceDueDate("");
    } catch (err: any) {
      toast.error("Error creating invoice:", err);
      toast.error(
        err instanceof Error ? err.message : "Failed to create invoice"
      );
    }
  };

  const [settingsForm, setSettingsForm] = useState(false);
  const handleSettingsForm = () => setSettingsForm(!settingsForm);
  const [features, setFeatures] = useState<{
    fileUploads: boolean;
    colorPallette: boolean;
  }>({
    fileUploads: false,
    colorPallette: false,
  });

  useEffect(() => {
    if (project) {
      setFeatures(project.features);
    }
  }, [project]);

  const submitSettingsForm = async () => {
    const userRef = doc(db, "users", uid);

    try {
      await runTransaction(db, async (transaction) => {
        const userSnap = await transaction.get(userRef);

        if (!userSnap.exists()) {
          throw new Error("User document not found.");
        }

        const userData: any = userSnap.data();
        const customers = Array.isArray(userData.customers)
          ? userData.customers
          : [];

        const customerIndex = customers.findIndex(
          (cust: StripeCustomer) => cust.stripeCustomerId === stripeCustomerId
        );

        if (customerIndex === -1) {
          throw new Error("Customer not found.");
        }

        const projectIndex = customers[customerIndex].projects.findIndex(
          (p: { id: string }) => p.id === project.id
        );

        if (projectIndex === -1) {
          throw new Error("Project not found.");
        }

        // Update the project details, including name and description
        customers[customerIndex].projects[projectIndex] = {
          ...customers[customerIndex].projects[projectIndex],
          name: project.name, // Fetch from state
          description: project.description, // Fetch from state
          features: features, // Fetch features
        };

        // Update the Firestore document
        await transaction.update(userRef, {
          customers: customers,
        });
      });

      toast.success("Project updated successfully!");
    } catch (error: any) {
      toast.error("Failed to update project: " + error.message);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen my-auto items-center justify-center max-w-6xl mx-auto h-full w-full p-4 pt-4 text-black flex flex-col pb-24">
        <LoaderPinwheel className="animate-spin duration-300 w-8 h-8" />
      </div>
    );

  if (!project) {
    return <div>Project not found.</div>;
  }

  return (
    <>
      <div className="min-h-screen max-w-6xl mx-auto h-full w-full p-4 pt-4 text-black flex flex-col pb-24">
        <div className="flex flex-col mb-2">
          <div className="flex flex-col sm:flex-row items-baseline w-full  justify-between">
            <h1 className="text-2xl md:text-2xl lg:text-3xl border-b-2 border-black xl:text-4xl font-bold justify-between w-full flex flex-row items-baseline capitalize gap-1">
              <span className="flex justify-between sm:justify-start w-full sm:w-auto items-center pb-1 gap-2">
                {project.name}
                <Settings
                  onClick={handleSettingsForm}
                  className="w-6 h-6  lg:w-8 lg:h-8 cursor-pointer text-confirm hover:rotate-90 duration-300"
                />
              </span>
              <span className="hidden sm:flex text-sm sm:text-md md:text-lg lg:text-xl text-gray-600">
                ID: {project.id}
              </span>
            </h1>
          </div>
          {settingsForm && (
            <div className="fixed z-40 inset-0 flex items-center justify-center bg-black bg-opacity-95">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  submitSettingsForm();
                  handleSettingsForm();
                }}
                className="mt-4 max-w-md mx-auto w-full flex flex-col p-4 "
              >
                <div className="mb-4 ">
                  <h3 className="text-white text-2xl sm:text-3xl text-center font-bold mb-4">
                    Project Settings
                  </h3>
                  <label className="text-lg flex flex-col font-medium text-white my-2 gap-2">
                    Project Name
                    <input
                      type="text"
                      value={project.name}
                      onChange={(e) =>
                        setProject((prev: any) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      className="bg-white p-2 rounded-lg text-black"
                    />
                  </label>
                  <label className="flex flex-col text-lg font-medium text-white my-2 gap-2">
                    Project Description
                    <textarea
                      value={project.description}
                      onChange={(e) =>
                        setProject((prev: any) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      className="bg-white p-2 rounded-lg text-black"
                    />
                  </label>

                  {/* File Uploads */}
                  <label className="block text-lg font-medium text-white my-2">
                    File Uploads
                  </label>
                  <div className="flex bg-white p-2 rounded-lg text-white gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="fileUploads"
                        value="true"
                        checked={features.fileUploads === true}
                        onChange={() =>
                          setFeatures((prev) => ({
                            ...prev,
                            fileUploads: true,
                          }))
                        }
                      />
                      <span className="text-black">Enabled</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="fileUploads"
                        value="false"
                        checked={features.fileUploads === false}
                        onChange={() =>
                          setFeatures((prev) => ({
                            ...prev,
                            fileUploads: false,
                          }))
                        }
                      />
                      <span className="text-black">Disabled</span>
                    </label>
                  </div>
                  {/* Color Palette */}
                  <label className="block text-lg font-medium text-white mt-4 mb-2">
                    Color Palette
                  </label>
                  <div className="flex bg-white p-2 rounded-lg text-white gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="colorPallette"
                        value="true"
                        checked={features.colorPallette === true}
                        onChange={() =>
                          setFeatures((prev) => ({
                            ...prev,
                            colorPallette: true,
                          }))
                        }
                      />
                      <span className="text-black">Enabled</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="colorPallette"
                        value="false"
                        checked={features.colorPallette === false}
                        onChange={() =>
                          setFeatures((prev) => ({
                            ...prev,
                            colorPallette: false,
                          }))
                        }
                      />
                      <span className="text-black">Disabled</span>
                    </label>
                  </div>
                </div>

                <div className="flex flex-row w-full justify-end">
                  <button
                    type="button"
                    onClick={handleSettingsForm}
                    className="text-destructive font-medium duration-300 hover:opacity-60 flex flex-row items-center gap-2 justify-center px-4 py-2 rounded-md mt-4"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-confirm shadow-md shadow-black hover:shadow-lg hover:bg-opacity-60 text-black font-medium flex flex-row items-center gap-2 justify-center duration-300 px-4 py-2 rounded-md mt-4"
                  >
                    <Save className="w-5 h-5" />
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}

          <p className="text-sm sm:text-md md:text-lg lg:text-xl capitalize text-gray-700">
            {project.description}
          </p>
        </div>

        {/* Milestones Section */}
        <div className="my-2">
          <div className="flex justify-between items-center">
            <div className="flex items-end my-auto">
              <h2 className="text-2xl font-semibold mb-1">Milestones</h2>
              <button
                type="button"
                onClick={() => setShowForm(!showForm)}
                className="hover:bg-opacity-60 duration-300 font-semibold items-end pb-1 py-2 px-4 text-xl flex flex-row text-black rounded-md"
              >
                [
                <Plus className="w-7 h-7 text-green-500 hover:rotate-90 duration-300" />
                ]
              </button>
            </div>

            {milestones.length > 0 &&
              !milestones.every(
                (milestone) => milestone.status === "completed"
              ) && (
                <div className="mb-2 hidden sm:flex w-full max-w-xs justify-end text-center">
                  <div className="w-full flex flex-col">
                    <MilestoneProgress milestones={milestones} />
                  </div>
                </div>
              )}

            {/* Conditional Button for Marking Project Complete */}
            {!isCompleted &&
              milestones.length > 0 &&
              milestones.every(
                (milestone) => milestone.status === "completed"
              ) && (
                <div className="mb-2 flex w-full justify-end text-center">
                  <button
                    type="button"
                    onClick={handleMarkProjectComplete}
                    className="bg-green-500 duration-300 hover:bg-green-600 text-black py-2 px-4 rounded-md font-semibold shadow-md"
                  >
                    Mark Project as Complete
                  </button>
                </div>
              )}

            {isCompleted &&
              milestones.length > 0 &&
              milestones.every(
                (milestone) => milestone.status === "completed"
              ) && (
                <div className="mb-2 flex w-full justify-end text-center">
                  <button
                    type="button"
                    onClick={handleMarkProjectIncomplete}
                    className="bg-destructive duration-300 hover:bg-opacity-60 text-black py-2 px-4 rounded-md font-semibold shadow-md"
                  >
                    Mark Project as Incomplete
                  </button>
                </div>
              )}
          </div>
          {milestones.length > 0 ? (
            <>
              <div className="border-2 shadow-md shadow-black border-black rounded-lg overflow-x-auto">
                <table className="bg-white w-full table-auto">
                  <thead className="bg-backgroundPrimary rounded-t-lg">
                    <tr className="border-b border-t border-black">
                      <th className="p-1 px-4 text-left text-lg font-semibold border-l border-black">
                        Milestone
                      </th>
                      <th className="p-1 px-4 text-left text-lg font-semibold">
                        Description
                      </th>
                      <th className="p-1 px-4 text-left text-lg font-semibold">
                        Priority
                      </th>
                      <th className="p-1 px-4 text-left text-lg font-semibold">
                        Deadline
                      </th>
                      <th className="p-1 px-4 text-left text-lg font-semibold border-r border-black">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedMilestones.map((milestone) => (
                      <tr
                        key={milestone.id}
                        className="border-b hover:bg-yellow-50 border-black"
                      >
                        <td className="p-1 px-4 border-l font-medium border-black">
                          {milestone.title}
                        </td>
                        <td className="p-1 px-4">{milestone.description}</td>
                        <td
                          className={`p-1 px-4 text-sm capitalize font-semibold ${
                            milestone.priority === "high"
                              ? "text-red-500"
                              : milestone.priority === "medium"
                              ? "text-yellow-500"
                              : "text-green-500"
                          }`}
                        >
                          {milestone.priority}
                        </td>
                        <td className="p-1 px-4">{milestone.deadline}</td>
                        <td className="p-1 px-4 border-r border-black">
                          <div className="p-1">
                            <select
                              name="status"
                              id="status"
                              aria-label="status"
                              onChange={(e) => {
                                if (e.target.value === "delete") {
                                  if (window.confirm("Are you sure?")) {
                                    deleteMilestone(milestone.id); // Call delete function
                                  } else {
                                    handleChangeStatus(milestone.id, "pending");
                                  }
                                } else {
                                  handleChangeStatus(
                                    milestone.id,
                                    e.target.value
                                  ); // Call status change function
                                }
                              }}
                              value={milestone.status}
                              className={`${
                                milestone.status === "pending" && "text-black"
                              } ${
                                milestone.status === "in-progress" &&
                                "text-green-500"
                              } ${
                                milestone.status === "completed" &&
                                "text-confirm"
                              } ${
                                milestone.status === "delete" &&
                                "text-destructive"
                              } px-2 py-1 text-sm font-semibold rounded-md text-black`}
                            >
                              <option value="pending" className="text-black">
                                Pending
                              </option>
                              <option
                                value="in-progress"
                                className="text-green-500"
                              >
                                In-Progress
                              </option>
                              <option
                                value="completed"
                                className="text-confirm"
                              >
                                Completed
                              </option>
                              <option
                                value="delete"
                                className="text-destructive"
                              >
                                Delete
                              </option>
                            </select>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {milestones.length > milestonesPerPage && (
                <div className="mt-2">
                  <ReactPaginate
                    previousLabel={"Previous"}
                    nextLabel={"Next"}
                    breakLabel={"..."}
                    pageCount={Math.ceil(milestones.length / milestonesPerPage)}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    onPageChange={handlePageClick}
                    containerClassName={
                      "pagination flex mt-2 flex-row w-full justify-between px-4"
                    }
                    activeClassName={"active text-confirm font-extrabold"}
                    pageClassName={"page font-medium hover:underline"}
                    breakClassName={"break"}
                    previousClassName={
                      "previous font-medium text-xl text-green-500 hover:underline"
                    }
                    nextClassName={
                      "next font-medium text-xl text-green-500 hover:underline"
                    }
                  />
                </div>
              )}
            </>
          ) : (
            <p className="text-gray-600 p-2 border border-black rounded-lg">
              No milestones yet
            </p>
          )}
        </div>
        {/* Invoices Section */}
        <div className="sm:mt-4">
          <div className="flex items-end my-auto">
            <h2 className="text-2xl font-semibold">Invoices</h2>
            <button
              type="button"
              onClick={() => setShowInvoiceForm(!showInvoiceForm)}
              className="hover:bg-opacity-60 duration-300 font-semibold items-end pb-1 py-2 px-4 text-xl flex flex-row text-black rounded-md"
            >
              [
              <Plus className="w-7 h-7 text-green-500 hover:rotate-90 duration-300" />
              ]
            </button>
          </div>
          <InvoicesTable itemsPerPage={10} invoices={invoices} />
          {showInvoiceForm && (
            <form
              className="fixed z-40 inset-0 bg-black/95 flex items-center justify-center min-h-screen h-full w-full flex-col px-4"
              onSubmit={handleCreateInvoice}
            >
              <div className="p-6 rounded-lg shadow-md w-full max-w-xl">
                <h2 className="text-2xl text-white text-center font-semibold mb-4">
                  Create Invoice
                </h2>
                <div className="mt-2">
                  <label htmlFor="amount" className="block text-white">
                    Amount
                  </label>
                  <input
                    id="amount"
                    type="number"
                    value={invoiceAmount}
                    onChange={(e) => setInvoiceAmount(e.target.value)}
                    required
                    className="w-full p-2 border border-black rounded-md"
                  />
                </div>
                <div className="mt-2">
                  <label htmlFor="currency" className="block text-white">
                    Currency
                  </label>
                  <input
                    id="currency"
                    type="text"
                    value={invoiceCurrency}
                    onChange={(e) => setInvoiceCurrency(e.target.value)}
                    required
                    className="w-full p-2 border border-black rounded-md"
                  />
                </div>
                <div className="mt-2">
                  <label htmlFor="description" className="block text-white">
                    Description
                  </label>
                  <input
                    id="description"
                    type="text"
                    value={invoiceDescription}
                    onChange={(e) => setInvoiceDescription(e.target.value)}
                    required
                    className="w-full p-2 border border-black rounded-md"
                  />
                </div>
                <div className="mt-2">
                  <label htmlFor="dueDate" className="block text-white">
                    Due Date
                  </label>
                  <input
                    id="dueDate"
                    type="date"
                    value={invoiceDueDate}
                    onChange={(e) => setInvoiceDueDate(e.target.value)}
                    required
                    className="w-full p-2 border border-black rounded-md"
                  />
                </div>
                <div className="flex flex-row justify-end">
                  <button
                    type="button"
                    onClick={() => setShowInvoiceForm(false)}
                    className="mt-4 text-destructive hover:opacity-60 duration-300 ease-in-out py-2 px-4 rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="mt-4 bg-confirm hover:bg-opacity-60 duration-300 ease-in-out text-black py-2 px-4 rounded-md"
                  >
                    Create Invoice
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
        <div className="lg:flex items-center lg:flex-row">
          <div className="grid grid-cols-1 sm:grid-cols-2 w-full gap-4">
            {project?.features?.fileUploads && (
              <div className="mt-3 sm:mt-4">
                <div className="flex flex-row items-center justify-start my-auto">
                  <h2 className="text-2xl font-semibold">Uploads</h2>
                  <button
                    type="button"
                    onClick={() => setShowUploadForm(!showUploadForm)}
                    className="hover:bg-opacity-60 duration-300 font-semibold items-center py-2 px-4 text-xl flex flex-row text-black rounded-md"
                  >
                    [
                    <Plus className="w-7 h-7 text-green-500 hover:rotate-90 duration-300" />
                    ]
                  </button>
                </div>
                {showUploadForm && (
                  <div className="mb-4 border border-black p-4 rounded-lg gap-2 flex flex-col">
                    <input
                      aria-label="Upload file"
                      type="file"
                      onChange={(e) => {
                        const files = e.target.files;
                        if (files && files[0]) {
                          setFile(files[0]);
                        }
                      }}
                      className="border rounded p-2 bg-white"
                    />
                    <button
                      type="button"
                      onClick={handleUpload}
                      disabled={
                        !file || isLoading || uploads.length >= uploadLimit
                      }
                      className={`w-full px-4 border-2 border-black py-2 bg-gradient-to-r from-green-600 to-green-500 text-black font-semibold rounded-lg shadow-md hover:shadow-md hover:shadow-black flex items-center duration-300 justify-center gap-2 ${
                        !file || isLoading || uploads.length >= uploadLimit
                          ? "cursor-not-allowed opacity-50"
                          : ""
                      }`}
                    >
                      {uploads.length >= uploadLimit ? (
                        "Upload Limit Reached"
                      ) : isLoading ? (
                        "Uploading..."
                      ) : (
                        <p className="flex items-center gap-2">
                          <Upload className="w-5 h-5 text-center" />
                          Upload
                        </p>
                      )}
                    </button>
                  </div>
                )}
                {uploads.length > 0 ? (
                  <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 border-2 shadow-black border-black p-2 bg-white mt-1 rounded-lg shadow-md">
                    {uploads.map((upload, index) => (
                      <li
                        key={index}
                        className="p-2 relative border border-black rounded-lg flex shadow-md items-center gap-2"
                      >
                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={() => deleteUpload(index)}
                          className="absolute top-0 right-0 bg-destructive text-black font-bold border-b border-l border-black rounded-bl-lg rounded-tr-md p-1 py-0.5 text-xs hover:bg-opacity-60"
                        >
                          X
                        </button>
                        {/* Image preview (if it's an image) */}
                        {upload.url &&
                          (upload.name.match(
                            /\.(jpeg|jpg|gif|png|webp|svg|ico)$/i
                          ) ? (
                            <img
                              src={upload.url}
                              alt={upload.name || `Upload ${index + 1}`}
                              className="w-8 h-8 sm:w-16 sm:h-16 border border-black object-cover rounded-md"
                              loading="lazy"
                            />
                          ) : null)}

                        {/* File link */}
                        <a
                          href={upload.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-destructive font-medium hover:underline truncate"
                        >
                          {upload.name || `File ${index + 1}`}
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-600 p-2 rounded-lg border border-black">
                    No uploads yet
                  </p>
                )}
              </div>
            )}
            {project?.features?.colorPallette && (
              <div>
                <div className="sm:mt-4 h-full">
                  <ColorPaletteGenerator
                    userId={uid}
                    customerId={stripeCustomerId}
                    projectId={projectId}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
        {showForm && (
          <div className="fixed w-full px-4 mx-auto inset-0 bg-black/95  z-40 my-auto min-h-screen h-full items-center justify-center flex flex-col">
            <div className=" p-4 w-full max-w-xl">
              <h1 className="text-2xl sm:text-3xl text-white font-semibold mb-4 text-center">
                Create New Milestone
              </h1>
              <label
                htmlFor="title"
                className="block text-white font-semibold mb-2"
              >
                Title
              </label>
              <input
                id="title"
                type="text"
                placeholder="Milestone Title"
                value={newMilestone.title}
                onChange={(e) =>
                  setNewMilestone({ ...newMilestone, title: e.target.value })
                }
                className="flex w-full p-2 mb-2 border rounded-md"
              />
              <label
                htmlFor="description"
                className="block text-white font-semibold mb-2"
              >
                Description
              </label>
              <textarea
                id="description"
                placeholder="Milestone Description"
                value={newMilestone.description}
                onChange={(e) =>
                  setNewMilestone({
                    ...newMilestone,
                    description: e.target.value,
                  })
                }
                className="block w-full p-2 mb-2 border rounded-md"
              />
              <label
                htmlFor="deadline"
                className="block text-white font-semibold mb-2"
              >
                Deadline
              </label>
              <input
                id="deadline"
                type="date"
                placeholder="Deadline"
                value={newMilestone.deadline}
                onChange={(e) =>
                  setNewMilestone({ ...newMilestone, deadline: e.target.value })
                }
                className="flex w-full p-2 mb-2 border rounded-md"
              />
              <label
                htmlFor="priority"
                className="block text-white font-semibold mb-2"
              >
                Priority
              </label>
              <select
                id="priority"
                value={newMilestone.priority}
                onChange={(e) =>
                  setNewMilestone({ ...newMilestone, priority: e.target.value })
                }
                className="flex w-full p-2 mb-2 border rounded-md"
              >
                <option value="select-priority">Select Priority</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
              {milestoneError && (
                <p className="text-red-500">{milestoneError}</p>
              )}
              <div className="flex justify-end mt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="text-destructive hover:text-destructive/60 duration-300 font-medium py-2 px-4 rounded-md mr-2"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddMilestone}
                  className="bg-confirm hover:bg-opacity-60 duration-300 text-black font-semibold py-2 px-4 rounded-md"
                >
                  Add Milestone
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ProjectPage;
