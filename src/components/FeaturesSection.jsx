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
            We provide a comprehensive suite of features to help you keep
            projects organized, stay on schedule, and get paid.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-12 mt-12">
          {featuresData.map((feature, index) => (
            <div
              key={index}
              className="relative h-auto max-w-md w-full min-h-[22rem] border-2 border-black bg-confirm p-4 lg:p-8 rounded-lg shadow-lg shadow-black text-center flex flex-col items-center"
            >
              {/* Icon Wrapper */}
              <div className="absolute -top-8 flex items-center justify-center">
                <div className="bg-white border-2 border-black shadow-md shadow-black rounded-full w-16 h-16 flex items-center justify-center">
                  <feature.icon className="text-destructive w-8 h-8" />
                </div>
              </div>

              {/* Content Wrapper */}
              <div className="flex flex-col items-center justify-between text-center h-full mt-10 space-y-6">
                {/* Title */}
                <h3 className="text-2xl md:text-3xl font-bold text-black">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-lg md:text-lg font-medium text-black leading-relaxed">
                  {feature.description}
                </p>

                {/* Points List */}
                <ul className="w-full text-left space-y-3 flex-grow">
                  {feature.points.map((point, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <CircleCheckIcon className="text-destructive w-5 h-5 bg-white rounded-full shadow-md shadow-black" />
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
