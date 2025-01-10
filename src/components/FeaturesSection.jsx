import {
  CircleCheckIcon,
  FolderPlus,
  LayoutDashboard,
  LayoutTemplate,
  Receipt,
} from "lucide-react";
import React from "react";

const FeaturesSection = () => {
  return (
    <section
      id="features"
      className="min-h-screen border-t-2 border-black h-full my-auto flex items-center justify-center bg-white py-24"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="section-heading w-full mx-auto flex flex-col">
          <div className="tag mx-auto justify-center w-auto text-destructive text-sm sm:text-md md:text-lg lg:text-xl">
            Features
          </div>
          <h2 className="section-title mt-5">Project Management Suite</h2>
          <p className="section-description mt-5">
            We provide a comprehensive suite of features to help you keep
            projects organized, stay on schedule, and get paid.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-10 mt-12">
          {/* Create Projects */}
          <div className="relative border-2 border-black bg-confirm p-8 rounded-lg shadow-lg text-center flex flex-col items-center shadow-black">
            <div className="absolute -top-6 flex items-center justify-center">
              <div className="bg-white border-2 border-black shadow-md shadow-black rounded-full w-16 h-16  flex items-center justify-center">
                <FolderPlus className="text-destructive w-8 h-8" />
              </div>
            </div>
            <div className="max-w-sm mx-auto text-center items-center justify-center flex flex-col">
              <h3 className="text-2xl font-semibold mb-4 mt-8 text-black">
                Manage Projects
              </h3>
              <p className="text-lg w-full font-medium text-black mb-4 text-left">
                Add projects and manage everything in one place.
              </p>
              <ul className="text-black items-center w-full text-left text-md font-medium space-y-2">
                <li className="flex gap-2">
                  <CircleCheckIcon className="text-destructive w-5 h-5 bg-white rounded-full shadow-md shadow-black" />{" "}
                  Add project milestones, deadlines, and more
                </li>
                <li className="flex gap-2">
                  <CircleCheckIcon className="text-destructive w-5 h-5 bg-white rounded-full shadow-md shadow-black" />{" "}
                  Manage associated files
                </li>
                <li className="flex gap-2">
                  <CircleCheckIcon className="text-destructive w-5 h-5 bg-white rounded-full shadow-md shadow-black" />{" "}
                  Share progress with clients
                </li>
              </ul>
            </div>
          </div>
          {/* Milestone Tracking */}
          <div className="relative border-2 border-black bg-confirm p-8 rounded-lg shadow-lg shadow-black text-center flex flex-col items-center">
            <div className="absolute -top-6 flex items-center justify-center">
              <div className="bg-white border-2 border-black shadow-md shadow-black rounded-full w-16 h-16  flex items-center justify-center">
                <Receipt className="text-destructive w-8 h-8" />
              </div>
            </div>
            <div className="max-w-sm mx-auto text-center items-center justify-center flex flex-col">
              <h3 className="text-2xl font-semibold mb-4 mt-8 text-black">
                Send Invoices
              </h3>
              <p className="text-lg w-full font-medium text-left text-black mb-4">
                Create and send invoices to clients through Stripe.
              </p>
              <ul className="text-black items-start w-full  text-left text-md font-medium space-y-2">
                <li className="flex gap-2">
                  <CircleCheckIcon className="text-destructive w-5 h-5 bg-white rounded-full shadow-md shadow-black" />{" "}
                  Create and send invoices
                </li>
                <li className="flex gap-2">
                  <CircleCheckIcon className="text-destructive w-5 h-5 bg-white rounded-full shadow-md shadow-black" />{" "}
                  Manage and track payments
                </li>
                <li className="flex gap-2">
                  <CircleCheckIcon className="text-destructive w-5 h-5 bg-white rounded-full shadow-md shadow-black" />{" "}
                  Track budgets and costs
                </li>
              </ul>
            </div>
          </div>
          {/* Project Dashboard */}
          <div className="relative border-2 border-black bg-confirm p-8 rounded-lg shadow-lg shadow-black text-center w-full flex flex-col items-center">
            <div className="absolute -top-6 flex items-center justify-center">
              <div className="bg-white shadow-md shadow-black rounded-full w-16 h-16 border-2 border-black flex items-center justify-center">
                <LayoutDashboard className="text-destructive w-8 h-8" />
              </div>
            </div>
            <div className="max-w-sm mx-auto text-center items-center justify-center flex flex-col">
              <h3 className="text-2xl font-semibold mb-4 mt-8 text-black">
                User Dashboard
              </h3>
              <p className="text-lg h-full font-medium text-left text-black mb-4">
                Manage all your customers and projects in one place.
              </p>
              <ul className="text-black items-start w-full flex flex-col h-full text-left text-md font-medium space-y-2">
                <li className="flex gap-2">
                  <CircleCheckIcon className="text-destructive w-5 h-5 bg-white rounded-full shadow-md shadow-black" />{" "}
                  Create projects
                </li>
                <li className="flex gap-2">
                  <CircleCheckIcon className="text-destructive w-5 h-5 bg-white rounded-full shadow-md shadow-black" />{" "}
                  Send invoices
                </li>
                <li className="flex gap-2">
                  <CircleCheckIcon className="text-destructive w-5 h-5 bg-white rounded-full shadow-md shadow-black" />{" "}
                  Manage customers
                </li>
              </ul>
            </div>
          </div>
          {/* Project Dashboard */}
          <div className="relative lg:flex border-2 border-black bg-confirm p-8 rounded-lg shadow-lg shadow-black text-center w-full flex flex-col items-center">
            <div className="absolute -top-6 flex items-center justify-center">
              <div className="bg-white shadow-md shadow-black rounded-full w-16 h-16 border-2 border-black flex items-center justify-center">
                <LayoutTemplate className="text-destructive w-8 h-8" />
              </div>
            </div>
            <div className="max-w-sm mx-auto text-center items-center justify-center flex flex-col">
              <h3 className="text-2xl font-semibold mb-4 mt-8 text-black">
                Client Dashboard
              </h3>
              <p className="text-lg font-medium text-left text-black mb-4">
                Your clients can view projects, upload files, pay invoices, and
                more.
              </p>
              <ul className="text-black items-start w-full  text-left text-md font-medium space-y-2">
                <li className="flex gap-2">
                  <CircleCheckIcon className="text-destructive w-5 h-5 bg-white rounded-full shadow-md shadow-black" />{" "}
                  View project status
                </li>
                <li className="flex gap-2">
                  <CircleCheckIcon className="text-destructive w-5 h-5 bg-white rounded-full shadow-md shadow-black" />{" "}
                  Upload files and track progress
                </li>
                <li className="flex gap-2">
                  <CircleCheckIcon className="text-destructive w-5 h-5 bg-white rounded-full shadow-md shadow-black" />{" "}
                  Pay invoices
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
