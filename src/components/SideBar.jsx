"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation"; // Import usePathname
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
  LoaderPinwheel,
} from "lucide-react";
import { auth, db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";

const Sidebar = ({ uid }) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname(); // Get the current path

  const toggleSidebar = () => setIsOpen(!isOpen);

  const [userData, setUserData] = useState(null);
  const [photo, setPhoto] = useState(null);

  const links = [
    {
      href: `/Dashboard/${uid}`,
      label: "Home",
      icon: HomeIcon,
      disabled: false,
    },
    {
      href: `/Dashboard/${uid}/invoices`,
      label: "Invoices",
      icon: FileTextIcon,
      disabled: userData?.stripeConnected === false,
    },
    {
      href: `/Dashboard/${uid}/projects`,
      label: "Projects",
      icon: BriefcaseIcon,
      disabled: userData?.stripeConnected === false,
    },
    {
      href: `/Dashboard/${uid}/customers`,
      label: "Customers",
      icon: UsersIcon,
      disabled: userData?.stripeConnected === false,
    },
    {
      href: `/Dashboard/account`,
      label: "Account",
      icon: Blocks,
      disabled: false,
    },
    {
      href: `/Dashboard/${uid}/support`,
      label: "Support",
      icon: Bug,
      disabled: false,
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
    <div className="flex lg:mr-4">
      <div
        className={`fixed inset-y-0 left-0 z-50 w-52 rounded-r-xl border-2 border-black text-black transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
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
          <nav className="flex flex-col bg-backgroundPrimary px-2 h-full my-auto justify-evenly py-6 space-y-0">
            {links.map((link) => (
              <div
                key={link.href}
                className="w-full mx-auto justify-center items-center"
              >
                <Link
                  onClick={toggleSidebar}
                  key={link.href}
                  href={link.href}
                  className={`flex items-center px-4 py-2 text-lg font-medium justify-start text-left rounded-md  duration-300 ${
                    link.disabled
                      ? "opacity-50 pointer-events-none"
                      : pathname === link.href // Highlight if current page
                      ? "bg-white"
                      : "cursor-pointer hover:ml-4"
                  }`}
                >
                  <link.icon className="w-5 h-5 mr-3" />
                  {link.label}
                </Link>
              </div>
            ))}
          </nav>
          <div className="p-4 px-2 rounded-br-xl bg-white border-t-2 border-black">
            <button
              onClick={() => {
                auth
                  .signOut()
                  .then(() => {
                    router.push("/Dashboard/login");
                  })
                  .catch((error) => {
                    console.error("Logout error:", error.message);
                  });
                toggleSidebar();
              }}
              className="flex items-center px-4 py-2 text-lg font-medium rounded-md hover:ml-4 duration-300 w-full"
            >
              <DoorOpen className="w-5 h-5 mr-3" />
              Logout
            </button>
            <Link
              onClick={toggleSidebar}
              href={`/Dashboard/${uid}/settings`}
              className="flex items-center px-4 py-2 text-lg font-medium rounded-md hover:ml-4 duration-300"
            >
              <SettingsIcon className="w-5 h-5 mr-3" />
              Settings
            </Link>
          </div>
        </div>
      </div>
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
      <div className="flex-1 z-40 top-0 left-0 ml-0 transition-all duration-300 lg:ml-48 bg-white"></div>
    </div>
  );
};

export default Sidebar;
