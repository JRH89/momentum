"use client";

import { useState } from "react";

const LayoutWithSidebar = ({ sections, children }) => {
  const [activeSection, setActiveSection] = useState(Object.keys(sections)[0]);

  return (
    <div className="flex min-h-screen h-full">
      {/* Sidebar */}
      <aside className="fixed top-0 pt-32 h-full left-0 md:w-1/5 w-full bg-gray-100 shadow-md p-4  overflow-y-auto">
        <nav className="space-y-4">
          {Object.keys(sections).map((key) => (
            <button
              key={key}
              onClick={() => setActiveSection(key)}
              className={`block text-left py-2 px-4 rounded whitespace-nowrap ${
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
      <main className="md:ml-1/5 w-full p-8">
        <div>
          <h1 className="text-3xl font-bold mb-4">
            {sections[activeSection].title}
          </h1>
          <p className="text-lg leading-7">{sections[activeSection].content}</p>
        </div>
        {/* Render additional content */}
        {children}
      </main>
    </div>
  );
};

export default LayoutWithSidebar;
