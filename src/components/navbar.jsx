"use client";

import { useAuth } from "../context/AuthProvider";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Loader2, Menu } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getPremiumStatus } from "./payments/account/GetPremiumStatus";
import { getAuth } from "@firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import Breadcrumb from "./BreadcrumbMenu";
import siteMetadata from "../../siteMetadata";
import { initFirebase } from "../../firebase";

const NavBar = () => {
  const { user, loading, logout } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const router = useRouter();
  const app = initFirebase();
  const auth = getAuth(app);
  const firestore = getFirestore(app);
  const [isPremium, setIsPremium] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loadingPortal, setLoading] = useState(false);

  // Fetch premium status
  useEffect(() => {
    const fetchPremiumStatus = async () => {
      try {
        const newPremiumStatus = user ? await getPremiumStatus(app) : false;
        setIsPremium(newPremiumStatus);
      } catch (error) {
        console.error("Error fetching premium status:", error.message);
      }
    };

    fetchPremiumStatus();
  });

  // Fetch admin status
  useEffect(() => {
    if (user) {
      const docRef = doc(firestore, "users", auth.currentUser.uid);
      getDoc(docRef)
        .then((doc) => {
          if (doc.exists()) {
            const data = doc.data();
            setIsAdmin(data.isAdmin);
          } else {
            console.log("No such document!");
          }
        })
        .catch((error) => {
          console.log("Error getting document:", error);
        });
    }
  }, [user]);

  // Handle user login
  const handleLogin = async () => {
    setShowMenu(false);
    router.push("/Signin");
  };

  // Handle user signup
  const handleSignup = async () => {
    setShowMenu(false);
    router.push("/Signup");
  };

  // Handle user logout
  const handleLogout = async () => {
    try {
      await logout();
      setShowMenu(false);
    } catch (error) {
      console.error("Logout error:", error.message);
    }
  };

  return (
    <>
      <div className="bg-white py-2 sticky font-semibold top-0 w-full flex flex-row justify-between px-2 sm:px-5 my-auto items-center z-50 h-full align-middle">
        <div className="flex shimmer-container flex-row align-middle items-center gap-1 my-auto h-full">
          <Link
            className="my-auto cursor-pointer flex items-center gap-0"
            href="/"
          >
            <div
              className=" rounded-md cursor-pointer border-black"
              style={{ width: "50px", height: "50px" }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 349.2 320"
                width="50"
                height="50"
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
            </div>
            <p className="font-bold text-2xl md:text-3xl lg:text-4xl">
              omentum
            </p>
          </Link>
        </div>
        <div className="align-middle justify-end text-xl md:text-2xl hidden lg:flex lg:flex-row">
          {user ? (
            <div className="flex flex-row justify-between gap-5 md:gap-10 align-midle items-center">
              {isAdmin && (
                <Link
                  onClick={() => setShowMenu(false)}
                  className="hover:text-confirm duration-300 justify-start rounded cursor-pointer text-black flex w-auto"
                  href="/Admin"
                >
                  <span>Admin</span>
                </Link>
              )}
              <Link
                onClick={() => setShowMenu(false)}
                className="hover:text-confirm duration-300 justify-start rounded cursor-pointer text-black flex w-auto"
                href="/Dashboard"
              >
                <span>Dashboard</span>
              </Link>
              <Link
                onClick={() => setShowMenu(false)}
                className="hover:text-confirm duration-300 cursor-pointer justify-start rounded  text-black flex w-auto"
                href="/Dashboard/account"
              >
                {loadingPortal ? (
                  <Loader2 className="w-6 h-6 ml-3 animate-spin duration-300" />
                ) : (
                  <span>Account</span>
                )}
              </Link>
              <button
                className="hover:text-destructive duration-300 justify-start rounded  text-black flex w-auto cursor-pointer"
                onClick={() => {
                  setShowMenu(false);
                  handleLogout();
                }}
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex flex-row justify-between gap-5 md:gap-10 align-midle items-center">
              <button
                className="hover:text-confirm duration-300 justify-start rounded  text-black flex cursor-pointer w-auto"
                onClick={() => {
                  setShowMenu(false);
                  handleSignup();
                }}
              >
                Sign Up
              </button>
              <button
                className="hover:text-confirm duration-300 justify-start cursor-pointer rounded  text-black flex w-auto"
                onClick={() => {
                  setShowMenu(false);
                  handleLogin();
                }}
              >
                Sign In
              </button>
            </div>
          )}
        </div>
        <Menu
          className="cursor-pointer hover:scale-95 duration-300 h-10 w-10 lg:hidden hover:text-confirm"
          onClick={() => setShowMenu(!showMenu)}
        />
      </div>
      {/* Mobile menu */}
      {showMenu && (
        <div className="w-full pb-2 mt-16 fixed h-auto flex justify-center items-center mx-auto bg-white z-50 flex-row gap-5 pt-0 p-2 border-b text-left text-lg sm:text-2xl">
          <ul className="text-left items-center text-lg sm:text-2xl flex flex-row mx-auto justify-center gap-1 w-full">
            {user ? (
              <div className="text-left mx-auto text-lg sm:text-2xl flex flex-col justify-center items-center font-semibold gap-2">
                {isAdmin && (
                  <Link
                    onClick={() => setShowMenu(false)}
                    className="hover:text-confirm duration-300 justify-start rounded cursor-pointer text-black flex w-auto"
                    href="/Admin"
                  >
                    <span>Admin</span>
                  </Link>
                )}
                <Link
                  className="hover:text-confirm duration-300 justify-start rounded text-left text-black flex w-full"
                  href={`/Dashboard`}
                >
                  Dashboard
                </Link>
                <Link
                  onClick={() => setShowMenu(false)}
                  className="hover:text-confirm duration-300 justify-start rounded  text-black flex w-auto"
                  href="/Dashboard/account"
                >
                  Account
                </Link>
                <div
                  className="hover:text-destructive duration-300 justify-center rounded  text-black flex text-center mx-auto w-full cursor-pointer"
                  onClick={() => {
                    setShowMenu(false);
                    handleLogout();
                  }}
                >
                  Sign Out
                </div>
              </div>
            ) : (
              <div className="text-center mx-auto text-lg sm:text-2xl flex flex-col justify-center items-center font-semibold gap-2">
                <li
                  className="hover:text-confirm duration-300 justify-center rounded  text-black cursor-pointer flex w-full text-center"
                  onClick={() => {
                    setShowMenu(false);
                    handleSignup();
                  }}
                >
                  Sign Up
                </li>
                <li
                  className="hover:text-confirm  duration-300 justify-center rounded  text-black flex w-full text-center mx-auto cursor-pointer"
                  onClick={() => {
                    setShowMenu(false);
                    handleLogin();
                  }}
                >
                  <Link href={"/Signin"}>Sign In</Link>
                </li>
              </div>
            )}
          </ul>
        </div>
      )}
      {/* <div className="hidden sm:flex sm:flex-wrap text-xs md:text-sm">
        <Breadcrumb
          homeElement={"Home"}
          separator={<span> / </span>}
          activeClasses="bg-gradient-to-r from-confirm to-destructive text-transparent bg-clip-text"
          containerClasses="flex flex-wrap items-center text-black px-1 sm:px-4 pt-1"
          listClasses="hover:underline items-center mx-2 font-bold flex flex-row text-xs sm:text-sm"
          capitalizeLinks
        />
      </div> */}
    </>
  );
};

export default NavBar;
