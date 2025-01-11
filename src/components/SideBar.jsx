"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  HomeIcon,
  FileTextIcon,
  BriefcaseIcon,
  UsersIcon,
  SettingsIcon,
  MenuIcon,
  XIcon,
  Blocks,
  DoorOpen,
  Bug,
} from "lucide-react";
import { auth, db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";

const Sidebar = ({ uid }) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const toggleSidebar = () => setIsOpen(!isOpen);

  const [userData, setUserData] = useState(null);
  const [photo, setPhoto] = useState(null);

  const links = [
    { href: `/Dashboard/${uid}`, label: "Home", icon: HomeIcon },
    {
      href: `/Dashboard/${uid}/invoices`,
      label: "Invoices",
      icon: FileTextIcon,
    },
    {
      href: `/Dashboard/${uid}/projects`,
      label: "Projects",
      icon: BriefcaseIcon,
    },
    {
      href: `/Dashboard/${uid}/customers`,
      label: "Customers",
      icon: UsersIcon,
    },
    {
      href: `/Dashboard/account`,
      label: "Account",
      icon: Blocks,
    },
    {
      href: `/Dashboard/${uid}/support`,
      label: "Support",
      icon: Bug,
    },
  ];

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (authUser) => {
      if (authUser) {
        const userRef = doc(db, "users", authUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUserData({ ...authUser, ...userSnap.data() });
          setPhoto(authUser.photoURL);
        }
      } else {
        setUserData(null);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="flex mr-4">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-52  border-r-2 border-black bg-[#EAEEFE] text-black transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* Logo and Close Button */}
          <div className="flex gap-2 px-4 items-center justify-center w-full mx-auto border-b-2 border-black p-4 bg-[#EAEEFE]">
            {userData?.photoURL && (
              <img
                className="rounded-full flex items-center justify-center"
                src={userData?.photoURL || ""}
                alt="Profile"
                width={25}
                height={25}
              />
            )}
            <h2 className="flex items-baseline gap-1 text-md font-semibold  mx-auto w-full  text-black">
              {userData?.name}
            </h2>

            <button
              className="lg:hidden focus:outline-none"
              onClick={toggleSidebar}
            >
              <XIcon className="w-6 h-6 text-destructive hover:rotate-90 duration-300" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col px-2 h-full my-auto  justify-evenly py-6 space-y-0">
            {links.map((link) => (
              <div
                key={link.href}
                className="w-full mx-auto justify-center items-center"
              >
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center px-8 py-2  text-md font-medium justify-start text-left rounded-md hover:bg-white"
                >
                  <link.icon className="w-5 h-5 mr-3" />
                  {link.label}
                </Link>
              </div>
            ))}
          </nav>

          {/* Settings Link */}
          <div className="p-4 px-2 border-t-2 border-black">
            <button
              onClick={() => auth.signOut()}
              className="flex items-center px-8 py-2 text-md font-medium rounded-md hover:bg-white w-full"
            >
              <DoorOpen className="w-5 h-5 mr-3" />
              Logout
            </button>
            <Link
              href={`/Dashboard/${uid}/settings`}
              className="flex items-center px-8 py-2 text-md font-medium rounded-md hover:bg-white"
            >
              <SettingsIcon className="w-5 h-5 mr-3" />
              Settings
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Menu Button */}
      <button
        className={`${
          isOpen ? "hidden" : "block"
        } fixed z-50 p-2 text-white bg-confirm rounded-md lg:hidden top-4 left-4 focus:outline-none`}
        onClick={toggleSidebar}
      >
        <MenuIcon className="w-6 h-6" />
      </button>

      {/* Main Content */}
      <div className="flex-1 z-50 top-0 left-0 ml-0 transition-all duration-300 lg:ml-48 bg-white"></div>
    </div>
  );
};

export default Sidebar;
