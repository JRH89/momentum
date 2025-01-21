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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-12 mt-12">
          {featuresData.map((feature, index) => (
            <div
              key={index}
              className="relative h-full max-w-md w-full border-2 border-black bg-confirm p-8 rounded-lg shadow-lg shadow-black text-center flex flex-col items-center"
            >
              {/* Icon Wrapper */}
              <div className="absolute -top-8 flex items-center justify-center">
                <div className="bg-white border-2 border-black shadow-md shadow-black rounded-full w-16 h-16 flex items-center justify-center">
                  <feature.icon className="text-destructive w-8 h-8" />
                </div>
              </div>

              {/* Content Wrapper */}
              <div className="flex flex-col items-center justify-center text-center h-full space-y-6 mt-10">
                {/* Title */}
                <h3 className="text-3xl md:text-4xl font-bold text-black">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-lg md:text-xl font-medium text-black leading-relaxed">
                  {feature.description}
                </p>

                {/* Points List */}
                <ul className="w-full text-left space-y-3">
                  {feature.points.map((point, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <CircleCheckIcon className="text-destructive w-5 h-5 bg-white rounded-full shadow-md shadow-black" />
                      <span className="text-lg md:text-xl font-medium text-black">
                        {point}
                      </span>
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
