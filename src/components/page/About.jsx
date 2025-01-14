"use client";

import Image from "next/image";
import { useState } from "react";

const sections = {
  userDashboard: {
    title: "User Dashboard",
    content:
      "The user dashboard provides a centralized view for managing your projects, tracking progress, and accessing essential tools.",
    image: "/dashboard.png",
  },
  customerDashboard: {
    title: "Customer Dashboard",
    content:
      "The customer dashboard allows your clients to view their project progress, pay invoices, and stay updated on milestones.",
    image: "/customer-dashboard.png",
  },
  invoicing: {
    title: "Invoicing",
    content:
      "Easily manage and send invoices with integrated Stripe support. Keep track of payments and streamline your billing process.",
  },
  connectingStripe: {
    title: "Connecting Stripe",
    content:
      "Integrate your Stripe account in a few clicks to enable seamless payment management and invoicing within Momentum.",
  },
  projectPages: {
    title: "Project Pages",
    content:
      "Create and manage projects with milestones, deadlines, and tasks. Share updates and collaborate with your team effortlessly.",
  },
};

export default function About() {
  const [activeSection, setActiveSection] = useState("userDashboard");

  return (
    <div className="min-h-screen flex mt-24">
      {/* Sidebar */}
      <aside className="w-1/4  bg-gray-100 shadow-md p-4">
        <nav className="space-y-4">
          {Object.keys(sections).map((key) => (
            <button
              key={key}
              onClick={() => setActiveSection(key)}
              className={`w-full text-left py-2 px-4 rounded ${
                activeSection === key
                  ? "bg-confirm text-black font-bold"
                  : "hover:bg-gray-200"
              }`}
            >
              {sections[key].title}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="w-3/4 p-8">
        <h1 className="text-3xl font-bold mb-4">
          {sections[activeSection].title}
        </h1>
        {sections[activeSection].image?.length > 0 && (
          <Image
            className="border-2 border-black rounded-lg"
            src={sections[activeSection].image}
            alt={sections[activeSection].title}
            width={1920}
            height={1080}
          />
        )}

        <p className="text-lg leading-7">{sections[activeSection].content}</p>
      </main>
    </div>
  );
}
