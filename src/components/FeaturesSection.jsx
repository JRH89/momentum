import {
  CircleCheckIcon,
  FolderPlus,
  LayoutDashboard,
  LayoutTemplate,
  Receipt,
} from "lucide-react";
import React from "react";

const featuresData = [
  {
    title: "Manage Projects",
    description: "Add projects and manage everything in one place.",
    icon: FolderPlus,
    points: [
      "Set milestones & deadlines",
      "Manage associated files",
      "Share progress with customers",
    ],
  },
  {
    title: "Send Invoices",
    description: "Create and send invoices and track payments.",
    icon: Receipt,
    points: [
      "Create and send invoices",
      "Manage and track payments",
      "Track budgets and costs",
    ],
  },
  {
    title: "User Dashboard",
    description:
      "Manage all your customers, invoices, and projects in one place.",
    icon: LayoutDashboard,
    points: [
      "Create & manage projects",
      "Send invoices & track payments",
      "Manage customers & invoices",
    ],
  },
  {
    title: "Customer Dashboard",
    description:
      "Your customers can view projects, upload files, pay invoices, and more.",
    icon: LayoutTemplate,
    points: [
      "View project status",
      "Upload files and track progress",
      "Pay invoices",
    ],
  },
];

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
          {featuresData.map((feature, index) => (
            <div
              key={index}
              className="relative max-w-md w-full border-2 border-black bg-confirm p-8 rounded-lg shadow-lg text-center flex flex-col items-center shadow-black"
            >
              <div className="absolute -top-6 flex items-center justify-center">
                <div className="bg-white border-2 border-black shadow-md shadow-black rounded-full w-16 h-16 flex items-center justify-center">
                  <feature.icon className="text-destructive w-8 h-8" />
                </div>
              </div>
              <div className="max-w-md mx-auto text-center items-center justify-center flex flex-col">
                <h3 className="text-2xl md:text-3xl font-bold mb-4 mt-8 text-black">
                  {feature.title}
                </h3>
                <p className="text-lg md:text-xl w-full font-medium text-black mb-6 text-center leading-relaxed">
                  {feature.description}
                </p>
                <ul className="text-black items-center w-full text-left text-md md:text-lg lg:text-xl font-medium space-y-2">
                  {feature.points.map((point, idx) => (
                    <li key={idx} className="flex gap-3 items-center">
                      <CircleCheckIcon className="text-destructive w-5 h-5 bg-white rounded-full shadow-md shadow-black" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
