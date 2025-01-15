"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { XIcon, User } from "lucide-react";

const AboutSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const toggleSidebar = () => setIsOpen(!isOpen);

  const links = [
    {
      href: `/About/welcomeToMomentum`,
      label: "Welcome",
    },
    {
      href: `/About/accountCreation`,
      label: "Account Creation",
    },
    {
      href: `/About/connectingStripe`,
      label: "Connecting Stripe",
    },
    {
      href: `/About/userDashboard`,
      label: "User Dashboard",
    },
    {
      href: `/About/customerDashboard`,
      label: "Customer Dashboard",
    },
    {
      href: `/About/invoicing`,
      label: "Invoicing",
    },
    {
      href: `/About/projectPages`,
      label: "Project Pages",
    },
  ];

  return (
    <div className="flex lg:mr-4">
      {/* Sidebar */}
      <div
        className={`fixed  inset-y-0 left-0 z-50 w-52 rounded-r-xl border-2 border-black text-black transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 lg:translate-x-0`}
      >
        <div className="flex flex-col  h-full">
          {/* Logo and Close Button */}
          <div className="flex rounded-tr-lg gap-2 px-4 items-center justify-between w-full mx-auto border-b-2 border-black p-4 bg-confirm">
            <Link
              className="flex hover:scale-105 duration-300 mx-auto flex-row items-center"
              href="/"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 349.2 320"
                width="25"
                height="25"
                className=""
              >
                <defs>
                  <style>
                    {`
          .cls-1 {
            fill: none;
            stroke-linejoin: round;
          }
          .cls-1, .cls-2 {
            stroke: #000;
            stroke-linecap: round;
            stroke-width: 40px;
          }
          .cls-2 {
            fill: #fff;
            stroke-miterlimit: 10;
          }
        `}
                  </style>
                </defs>
                <g data-name="Layer_1">
                  <line className="cls-2" x1="50" y1="270" x2="50" y2="20" />
                  <line className="cls-2" x1="150" y1="120" x2="150" y2="270" />
                  <line
                    className="cls-2"
                    x1="250"
                    y1="20"
                    x2="299.19"
                    y2="265.11"
                  />
                  <circle cx="50" cy="270" r="50" />
                  <circle cx="150" cy="270" r="50" />
                  <circle cx="299.19" cy="265.11" r="50" />
                  <polyline className="cls-1" points="50 20 150 120 250 20" />
                </g>
              </svg>
              <p className="text-xl font-bold">omentum</p>
            </Link>
            <button
              className="lg:hidden justify-end bg-black rounded-md focus:outline-none"
              onClick={toggleSidebar}
            >
              <XIcon className="w-6 h-6 p-1 text-destructive hover:rotate-90 duration-300" />
            </button>
          </div>
          {/* Navigation Links */}
          <nav className="flex flex-col bg-backgroundPrimary px-2 h-full my-auto  justify-evenly py-6 space-y-0">
            {links.map((link) => (
              <div
                key={link.href}
                className="w-full mx-auto justify-center items-center"
              >
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center px-4 py-2  text-lg font-medium justify-start text-left rounded-md hover:underline duration-300 ${
                    link.disabled
                      ? "opacity-50 pointer-events-none"
                      : "cursor-pointer"
                  }`}
                >
                  {link.label}
                </Link>
              </div>
            ))}
          </nav>
          {/* Settings Link */}
          <div className="p-4 px-2 rounded-br-xl bg-white border-t-2 border-black">
            <Link
              href="/Signup"
              className="flex items-center px-4 py-2 text-lg font-medium rounded-md hover:underline duration-300 w-full"
            >
              <User className="w-5 h-5 mr-3" />
              Signup
            </Link>
          </div>
        </div>
      </div>
      {/* Mobile Menu Button */}
      <button
        className={`${
          isOpen ? "hidden" : "block"
        } fixed shadow-md shadow-black hover:shadow-lg hover:shadow-black duration-300 z-50 p-2 text-white bg-confirm rounded-md lg:hidden border-2 border-black top-4 left-4 focus:outline-none`}
        onClick={toggleSidebar}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 349.2 320"
          width="25"
          height="25"
        >
          <defs>
            <style>
              {`
          .cls-1 {
            fill: none;
            stroke-linejoin: round;
          }
          .cls-1, .cls-2 {
            stroke: #000;
            stroke-linecap: round;
            stroke-width: 40px;
          }
          .cls-2 {
            fill: #fff;
            stroke-miterlimit: 10;
          }
        `}
            </style>
          </defs>
          <g data-name="Layer_1">
            <line className="cls-2" x1="50" y1="270" x2="50" y2="20" />
            <line className="cls-2" x1="150" y1="120" x2="150" y2="270" />
            <line className="cls-2" x1="250" y1="20" x2="299.19" y2="265.11" />
            <circle cx="50" cy="270" r="50" />
            <circle cx="150" cy="270" r="50" />
            <circle cx="299.19" cy="265.11" r="50" />
            <polyline className="cls-1" points="50 20 150 120 250 20" />
          </g>
        </svg>
      </button>
      {/* Main Content */}
      <div className="flex-1 z-50 top-0 left-0 ml-0 transition-all duration-300 lg:ml-48 bg-white"></div>
    </div>
  );
};

export default AboutSidebar;
