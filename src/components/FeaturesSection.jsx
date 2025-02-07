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
    description: "Keep all your projects organized.",
    icon: FolderPlus,
    points: [
      "Set milestones and track deadlines",
      "Organize and access project files",
      "Share regular updates with clients",
    ],
  },
  {
    title: "Send Invoices",
    description: "Easily create and send invoices.",
    icon: Receipt,
    points: [
      "Generate and send detailed invoices",
      "Monitor payments and balances",
      "Ensure timely payments from clients",
    ],
  },
  {
    title: "User Dashboard",
    description: "All the info you need, at a glance.",
    icon: LayoutDashboard,
    points: [
      "Track projects and their progress",
      "Send and manage invoices efficiently",
      "Quickly access customer information",
    ],
  },
  {
    title: "Client Dashboard",
    description: "Keep clients up to date.",
    icon: LayoutTemplate,
    points: [
      "Stay updated on project status",
      "Upload and manage essential files",
      "Make secure online payments",
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
            Momentum provides a comprehensive suite of features to help you
            track project milestones, keep clients up to date, and get paid.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-12 mt-12">
          {featuresData.map((feature, index) => (
            <div
              key={index}
              className="relative h-full max-w-md w-full border-2 border-black bg-confirm p-4 lg:p-8 rounded-2xl shadow-lg shadow-black text-center flex flex-col items-center justify-center"
            >
              {/* Icon Wrapper */}
              <div className="absolute -top-8 flex items-center justify-center">
                <div className="bg-white border-2 border-black shadow-md shadow-black rounded-full w-16 h-16 flex items-center justify-center">
                  <feature.icon className="text-destructive w-8 h-8" />
                </div>
              </div>

              {/* Content Wrapper */}
              <div className="flex flex-col items-center justify-center  text-center h-full my-8 space-y-6">
                {/* Title */}
                <h3 className="text-2xl md:text-3xl font-bold text-black">
                  {feature.title}
                </h3>

                {/* Points List */}
                <ul className="w-full text-left space-y-3 flex-grow">
                  {feature.points.map((point, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <svg
                        className="size-4 sm:size-5 flex-shrink-0 shadow-md shadow-black rounded-full bg-black text-white"
                        viewBox="0 0 20 20"
                        fill="#ec4899"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-base md:text-lg font-medium text-black">
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
