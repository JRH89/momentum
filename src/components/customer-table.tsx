"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import ReactPaginate from "react-paginate";
import { useEffect, useState } from "react";
import { addDoc, collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { toast } from "react-toastify";
import { deleteApp, initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signOut,
} from "@firebase/auth";

interface StripeCustomer {
  email: string;
  name: string;
  description: string;
  stripeCustomerId: string;
}

interface CustomerTableProps {
  customers: StripeCustomer[];
  userId: string;
  itemsPerPage?: number;
  stripeAccountId?: string;
  onDeleteCustomer: (customerId: string) => void;
}

interface ProjectsProps {
  uid: string;
  stripeCustomerId: string;
  customerEmail: string;
}

export function CustomerTable({
  onDeleteCustomer,
  customers,
  userId,
  itemsPerPage = 7,
}: CustomerTableProps) {
  const [newProjectName, setNewProjectName] = useState<string>("");
  const [newProjectDescription, setNewProjectDescription] =
    useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [showForm, setShowForm] = useState(false);
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(0);
  const [stripeAccountId, setStripeAccountId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);
  const [invoiceData, setInvoiceData] = useState({
    amount: "",
    currency: "usd",
    description: "",
    dueDate: "",
  });
  const [selectedCustomer, setSelectedCustomer] =
    useState<StripeCustomer | null>(null);
  const [customerId, setCustomerId] = useState<string>("");
  const [newProjectLink, setNewProjectLink] = useState<string>("");

  const [sortConfig, setSortConfig] = useState<{
    key: keyof StripeCustomer;
    direction: "asc" | "desc";
  }>({
    key: "email",
    direction: "asc",
  });

  useEffect(() => {
    const fetchUserStripeAccountId = async () => {
      try {
        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setStripeAccountId(userSnap.data().stripeAccountId || null);
        } else {
          setError("User document not found");
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to fetch user data.");
      }
    };

    fetchUserStripeAccountId();
  }, [userId]);

  const handleSort = (key: keyof StripeCustomer) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handlePageChange = (selectedPage: { selected: number }) => {
    setCurrentPage(selectedPage.selected);
  };

  const [invoiceDueDate, setInvoiceDueDate] = useState<string>("");
  const [invoiceCurrency, setInvoiceCurrency] = useState<string>("usd");

  const [items, setItems] = useState([
    { amount: "", currency: "usd", description: "" },
  ]);

  const addItem = () => {
    setItems([...items, { description: "", amount: "", currency: "usd" }]);
  };

  const removeItem = (index: number) => {
    const updatedItems: any = items.filter((_, idx) => idx !== index);
    setItems(updatedItems);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    field: string
  ) => {
    const updatedItems: any = [...items];
    updatedItems[index][field] = e.target.value;
    setItems(updatedItems);
  };

  const handleCreateInvoice = async (
    e: React.FormEvent,
    { stripeCustomerId, customerEmail }: ProjectsProps,
    customerId: string
  ) => {
    if (!stripeAccountId) {
      setError("Stripe account not found");
      return;
    }

    try {
      const itemsData = items.map((item: any) => ({
        amount: Math.round(parseFloat(item.amount) * 100), // Convert to cents and ensure it's a number
        currency: invoiceCurrency.toLowerCase(),
        description: item.description,
        quantity: parseInt(item.quantity, 10),
      }));

      const response = await fetch(`/api/stripe/invoices/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          stripeAccountId,
          stripeCustomerId,
          items: itemsData,
          dueDate: Math.floor(new Date(invoiceDueDate).getTime() / 1000),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create invoice");
      }

      setLoading(true);
      let newCustomerUid: string | null = null;

      try {
        // Fetch user document
        const userRef = doc(db, "users", userId);
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
                "DefaultSecurePassword123!"
              );

              await signOut(tempAuth);
              newCustomerUid = userCredential.user.uid;
              await deleteApp(tempApp);
            } catch (authError: any) {
              if (authError.code !== "auth/email-already-in-use") {
                throw authError;
              } else {
                const existingUserRef = await getDoc(
                  doc(db, "users", customerEmail)
                );
                if (existingUserRef.exists()) {
                  newCustomerUid = existingUserRef.id;
                }
              }
            }

            // If a new customer UID was created, update the customer
            if (newCustomerUid) {
              const updatedCustomers = customers.map(
                (cust: { stripeCustomerId: string; uid: string }) => {
                  if (cust.stripeCustomerId === stripeCustomerId) {
                    return { ...cust, uid: newCustomerUid };
                  }
                  return cust;
                }
              );

              await updateDoc(userRef, {
                customers: updatedCustomers,
              });
            }
          }
        }
      } catch (err) {
        console.error("Error updating projects:", err);
        setError("Failed to update projects");
      }

      setShowInvoiceForm(false);
      setInvoiceData({
        amount: "",
        currency: "usd",
        description: "",
        dueDate: "",
      });
      setInvoiceDueDate("");
      setItems([{ description: "", amount: "", currency: "usd" }]);
      toast.success("Invoice created successfully!");
    } catch (err) {
      console.error("Error creating invoice:", err);
      setError(err instanceof Error ? err.message : "Failed to create invoice");
      toast.error("Failed to create invoice");
    }
  };

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
  const handleCreateProject = async (
    e: React.FormEvent,
    { uid, stripeCustomerId, customerEmail }: ProjectsProps
  ) => {
    e.preventDefault();

    if (!newProjectName || !newProjectDescription) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    let newCustomerUid: string | null = null;
    let projectLink: string | null = null; // Track the link locally

    try {
      // Fetch user document
      const userRef = doc(db, "users", userId);
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
              "DefaultSecurePassword123!"
            );

            await signOut(tempAuth);
            newCustomerUid = userCredential.user.uid;
            await deleteApp(tempApp);
          } catch (authError: any) {
            if (authError.code !== "auth/email-already-in-use") {
              throw authError;
            } else {
              const existingUserRef = await getDoc(
                doc(db, "users", customerEmail)
              );
              if (existingUserRef.exists()) {
                newCustomerUid = existingUserRef.id;
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
              ? `/Dashboard/${uid}/${stripeCustomerId}/${newProjectName}`
              : "",
          };

          // Add new project to Firestore
          const projectRef = await addDoc(
            collection(db, "users", userId, "projects"),
            newProject
          );

          // Update project link with auto-generated ID
          if (newProject.link) {
            newProject.link = `/Dashboard/${userId}/${stripeCustomerId}/${projectRef.id}`;
            projectLink = newProject.link; // Store the link locally
          }

          // Update state only after we have the final link
          setNewProjectLink(
            `/Dashboard/${userId}/${stripeCustomerId}/${projectRef.id}`
          );

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

          // If a new customer UID was created, update the customer
          if (newCustomerUid) {
            const updatedCustomers = customers.map(
              (cust: { stripeCustomerId: string; uid: string }) => {
                if (cust.stripeCustomerId === stripeCustomerId) {
                  return {
                    ...cust,
                    uid: newCustomerUid,
                    projects: updatedProjects,
                  };
                }
                return cust;
              }
            );

            await updateDoc(userRef, {
              customers: updatedCustomers,
            });
          }

          // send email
          try {
            const response = await fetch("/api/send-new-project-email", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                customerName: userData?.name,
                customerEmail: customerEmail,
                projectName: newProjectName,
                projectLink: `${process.env.NEXT_PUBLIC_BASE_URL}/Customer/${uid}/${customerId}/${projectRef.id}`,
              }),
            });

            if (response.ok) {
              const data = await response.json();
              toast.success("Email sent successfully!");
              console.log(data);
            } else {
              const error = await response.json();
              toast.error("Failed to send email. Please try again.");
              console.error(error);
            }
          } catch (err) {
            console.error("Error:", err);
          }

          // Reset form state
          setNewProjectName("");
          setNewProjectDescription("");
          setShowForm(false);
          setFeatures({
            fileUploads: false,
            colorPallette: false,
            liveChat: false,
          });

          // Show success toast
          toast.success("Project created successfully!");

          // Only redirect if we have a valid project link
          if (projectLink) {
            router.push(projectLink);
          } else {
            toast.error(
              "Project created but navigation failed. Please refresh the page."
            );
          }
        }
      }
    } catch (err) {
      console.error("Error creating project:", err);
      setError("Failed to create project.");
      toast.error("Failed to create project.");
    } finally {
      setLoading(false);
    }
  };

  const deleteCustomer = async (
    stripeCustomerId: string,
    stripeAccountId: string,
    userId: string
  ) => {
    if (!stripeAccountId) return alert("Stripe account not found");
    if (window.confirm("Are you sure you want to delete this customer?")) {
      const response = await fetch("/api/stripe/customers/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ stripeCustomerId, stripeAccountId, userId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete customer");
      }
      toast.success("Customer deleted successfully!");
      onDeleteCustomer(stripeCustomerId);
    }
  };

  const offset = currentPage * itemsPerPage;
  const currentCustomers = customers.slice(offset, offset + itemsPerPage);

  const sortedCustomers = [...currentCustomers].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key])
      return sortConfig.direction === "asc" ? -1 : 1;
    if (a[sortConfig.key] > b[sortConfig.key])
      return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  if (!customers.length) {
    return (
      <p className="text-gray-600 mt-1 px-4 md:px-6">
        No customers found. Click the &apos;+&apos; icon above to create your
        first customer.
      </p>
    );
  }

  return (
    <>
      <div className="overflow-x-auto py-2 pb-4 px-0 sm:px-4 h-full flex flex-col">
        <div className="border-2 border-black rounded-lg overflow-x-auto shadow-md shadow-black">
          <table className="min-w-full h-full">
            <thead>
              <tr className="bg-backgroundPrimary font-semibold border-b-2 border-black">
                <th
                  className="py-3 px-4 md:px-6 cursor-pointer hover:underline text-left text-md text-black"
                  onClick={() => handleSort("name")}
                >
                  Name
                </th>
                <th
                  className="py-3 px-4 md:px-6 cursor-pointer hover:underline text-left text-md text-black"
                  onClick={() => handleSort("email")}
                >
                  Email
                </th>
                <th
                  className="py-3 px-4 md:px-6 cursor-pointer hover:underline text-left text-md text-black"
                  onClick={() => handleSort("description")}
                >
                  ID
                </th>
                <th className="py-3 px-4 md:px-6 text-left text-md text-black">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-black space-y-2">
              {sortedCustomers.map((customer) => (
                <tr
                  key={customer.stripeCustomerId}
                  className="py-3 hover:bg-yellow-50"
                >
                  <td className="py-3 px-4 md:px-6 text-sm font-bold text-black">
                    {customer.name}
                  </td>
                  <td className="py-3 font-medium px-4 md:px-6 text-sm text-black">
                    <Link href={`mailto:${customer.email}`}>
                      {customer.email}
                    </Link>
                  </td>
                  <td className="py-3 px-4 md:px-6 text-sm font-medium text-black">
                    {customer.stripeCustomerId || "N/A"}
                  </td>
                  <td className="py-2 px-2 text-sm">
                    <div className="flex items-center space-x-4">
                      <select
                        aria-label="Actions"
                        className="border border-black rounded-md px-2 py-1 text-sm text-black"
                        onChange={(e) => {
                          const action = e.target.value;

                          if (action === "createInvoice") {
                            setSelectedCustomer(customer);
                            setCustomerId(customer.stripeCustomerId);
                            setShowInvoiceForm(true);
                          } else if (action === "view") {
                            router.push(
                              `/Dashboard/${userId}/${customer.stripeCustomerId}`
                            );
                          } else if (action === "createProject") {
                            setShowForm(true);
                            setSelectedCustomer(customer);
                          } else if (action === "delete") {
                            // Ensure stripeAccountId is available
                            if (!stripeAccountId) {
                              alert(
                                "Stripe account ID is missing. Unable to delete customer."
                              );
                              return;
                            }

                            deleteCustomer(
                              customer.stripeCustomerId,
                              stripeAccountId,
                              userId
                            );
                          }

                          e.target.value = "Actions";
                        }}
                      >
                        <option value="Actions">Actions</option>
                        <option value="createInvoice">Create Invoice</option>
                        <option value="createProject">Create Project</option>
                        <option value="view">View Details</option>
                        <option value="delete">Delete Customer</option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* New Project Form */}
        {showForm && selectedCustomer && (
          <div className="inset-0 fixed border-2 border-black bg-black bg-opacity-95 flex items-center justify-center mx-auto px-4">
            <div className=" p-6 w-full max-w-xl">
              <h3 className="text-2xl lg:text-3xl text-white text-center font-semibold">
                Create Project
              </h3>
              <form>
                <div className="mt-2">
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
                    className="flex bg-white text-black p-2 rounded-md items-center w-full"
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
                    className="flex bg-white text-black p-2 rounded-md items-center w-full"
                  />
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-white mb-2">
                    File Uploads
                  </label>
                  <div className="flex bg-white text-black p-2 rounded-md items-center space-x-4">
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
                  <div className="flex bg-white text-black p-2 rounded-md items-center space-x-4">
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
                  <div className="flex bg-white text-black p-2 rounded-md items-center space-x-4">
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
              </form>
              <div className="flex flex-row items-center justify-end">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="mt-4 px-4 py-2 text-destructive rounded-lg font-semibold hover:opacity-60 duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={(e) => {
                    if (selectedCustomer) {
                      handleCreateProject(e, {
                        uid: userId,
                        stripeCustomerId: selectedCustomer.stripeCustomerId,
                        customerEmail: selectedCustomer.email,
                      });
                      setShowForm(false);
                    }
                  }}
                  type="submit"
                  className="mt-4 hover:bg-opacity-60 duration-300 bg-confirm py-2 px-4 font-semibold rounded-md"
                  disabled={loading} // Disable button when loading
                >
                  {loading ? "Creating..." : "Create"}
                </button>
              </div>
            </div>
          </div>
        )}
        {customers.length > itemsPerPage && (
          <ReactPaginate
            previousLabel={"Previous"}
            nextLabel={"Next"}
            breakLabel={"..."}
            pageCount={Math.ceil(customers.length / itemsPerPage)}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={handlePageChange}
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
        )}
      </div>
      {showInvoiceForm && (
        <div className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center">
          <div className="p-6 max-w-md w-full">
            <h2 className="text-2xl text-white lg:text-3xl text-center font-bold mb-4">
              Create Invoice
            </h2>
            <form
              className="fixed z-40 inset-0 bg-black/95 flex items-center justify-center min-h-screen h-full w-full flex-col px-4"
              onSubmit={(e) => {
                e.preventDefault();
                if (selectedCustomer) {
                  handleCreateInvoice(
                    e,
                    {
                      uid: userId,
                      stripeCustomerId: selectedCustomer.stripeCustomerId,
                      customerEmail: selectedCustomer.email,
                    },
                    customerId
                  );
                }
              }}
            >
              <div className="p-6 rounded-lg scrollbar-thin overflow-y-auto shadow-md py-24 w-full max-w-xl">
                <h2 className="text-2xl lg:text-3xl text-white text-center font-bold mb-4">
                  Create Invoice
                </h2>

                {/* Multiple Items */}
                {items.map((item, index) => (
                  <div key={index} className="mt-4">
                    <div className="flex flex-col sm:flex-row gap-2 w-full items-center">
                      <div className="w-full">
                        <input
                          placeholder="Currency"
                          id={`currency-${index}`}
                          type="text"
                          value={item.currency}
                          onChange={(e) => handleChange(e, index, "currency")}
                          required
                          className="w-full flex mx-auto self-center p-2 border border-black rounded-md"
                        />
                      </div>
                      <div className="w-full">
                        <input
                          placeholder="Amount"
                          id={`amount-${index}`}
                          type="number"
                          value={item.amount}
                          onChange={(e) => handleChange(e, index, "amount")}
                          required
                          className="w-full p-2 border border-black rounded-md"
                        />
                      </div>

                      <div className="w-full">
                        <input
                          placeholder="Item Name"
                          id={`description-${index}`}
                          type="text"
                          value={item.description}
                          onChange={(e) =>
                            handleChange(e, index, "description")
                          }
                          required
                          className="w-full flex p-2 border border-black rounded-md"
                        />
                      </div>
                    </div>

                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="mt-2 text-sm text-destructive hover:underline"
                      >
                        Remove this item
                      </button>
                    )}
                  </div>
                ))}

                {/* Add new item button */}
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={addItem}
                    className="text-sm text-confirm hover:underline"
                  >
                    + Add Another Item
                  </button>
                </div>

                {/* Due Date */}
                <div className="mt-4">
                  <label
                    htmlFor="dueDate"
                    className="flex justify-end w-full text-sm font-medium text-white mb-2"
                  >
                    Due Date
                  </label>
                  <input
                    id="dueDate"
                    type="date"
                    value={invoiceDueDate}
                    onChange={(e) => setInvoiceDueDate(e.target.value)}
                    required
                    min={new Date().toISOString().split("T")[0]} // Set today's date as the minimum
                    className="w-full p-2 border border-black rounded-md"
                  />
                </div>

                {/* Submit buttons */}
                <div className="flex mt-6 flex-row justify-end">
                  <button
                    type="button"
                    onClick={() => setShowInvoiceForm(false)}
                    className=" px-4 py-2 text-destructive rounded-lg font-semibold hover:opacity-60 duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className=" hover:bg-opacity-60 duration-300 bg-confirm py-2 px-4 font-semibold rounded-md"
                  >
                    Create Invoice
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
