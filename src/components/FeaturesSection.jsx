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
    description:
      "Organize and oversee all your projects in one centralized system.",
    icon: FolderPlus,
    points: [
      "Set clear milestones and deadlines",
      "Keep files organized and accessible",
      "Provide progress updates to clients",
    ],
  },
  {
    title: "Send Invoices",
    description: "Create and track invoices to ensure timely payments.",
    icon: Receipt,
    points: [
      "Generate professional invoices",
      "Track payments and balances",
      "Get paid on time",
    ],
  },
  {
    title: "User Dashboard",
    description:
      "Manage customers, projects, and invoices from a unified dashboard.",
    icon: LayoutDashboard,
    points: [
      "Oversee project details",
      "Send and track invoices",
      "Access customer information quickly",
    ],
  },
  {
    title: "Customer Dashboard",
    description:
      "Allow customers to stay informed and manage their interactions.",
    icon: LayoutTemplate,
    points: [
      "View project updates in real time",
      "Upload important files",
      "Make secure payments online",
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
              className="relative h-auto max-w-md w-full min-h-[22rem] border-2 border-black bg-confirm p-8 rounded-lg shadow-lg shadow-black text-center flex flex-col items-center"
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
                <p className="text-base md:text-lg font-medium text-black leading-relaxed">
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
