"use client";

import React, { useState } from "react";
import ArrowRight from "../../assets/arrow-right.svg";
import MenuIcon from "../../assets/menu.svg";
import Link from "next/link";
import { motion } from "framer-motion";
import LogoImage from "../Logo";
import { ChevronDown, ExternalLinkIcon } from "lucide-react";

// Page Data
const pageData = {
  bannerText: "Momentum: Where Every Project Gains Traction",
  bannerLinkText: "Boost Your Momentum",
  bannerLinkHref: "/Signup",
  logoHref: "/",
  menuItems: [
    { text: "Features", href: "/#features" },
    { text: "Pricing", href: "/#price" },
    { text: "Gallery", href: "/#gallery" },
    { text: "FAQ", href: "/#faq" },
    { text: "Docs", href: "/About/welcomeToMomentum", icon: ExternalLinkIcon },
    { text: "Start Now", href: "/Signup", isPrimary: true },
  ],
};

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <header className="fixed flex flex-col w-full left-0 right-0 top-0 backdrop-blur-sm z-50">
      <div className="flex justify-center items-center py-2 bg-black text-white text-sm gap-3">
        <Link
          href={pageData.bannerLinkHref}
          className="inline-flex gap-1 items-center"
        >
          <div className="inline-flex text-sm">
            <motion.span
              animate={{ backgroundPositionX: "100%" }}
              transition={{
                repeat: Infinity,
                ease: "linear",
                repeatType: "loop",
                duration: 2,
              }}
              className="bg-[linear-gradient(to_right,#DD7DDF,#E1CD86,#BBCB92,#71C2EF,#3BFFFF,#DD7DDF,#E1CD86,#BBCB92,#71C2EF,#3BFFFF)] [background-size:200%] text-transparent bg-clip-text font-semibold"
            >
              {pageData.bannerText}
            </motion.span>
          </div>
          <ArrowRight className="h-5 w-5 inline-flex justify-center items-center" />
        </Link>
      </div>
      <div className="py-3">
        <div className="px-5 md:px-10">
          <div className="flex items-center justify-between">
            <div className="flex flex-row items-center gap-0 hover:tracking-widest duration-200">
              <Link
                className="flex flex-row items-center"
                href={pageData.logoHref}
              >
                <LogoImage width={40} height={40} />
                <p className="text-2xl flex md:text-3xl font-bold ">omentum</p>
              </Link>
            </div>
            <div
              className="lg:hidden cursor-pointer hover:text-destructive duration-300"
              onClick={toggleMenu}
            >
              <MenuIcon className="h-10 w-10 " />
            </div>
            {/* Desktop Menu */}
            <nav className="hidden font-bold lg:flex gap-6 text-black items-center">
              {pageData.menuItems.slice(0, -1).map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className="hover:pb-2 flex flex-row items-center duration-300 gap-1"
                >
                  {}
                  {item.text}
                  {item.icon && <item.icon className="h-4 w-4" />}
                </Link>
              ))}
              {/* Dropdown Menu */}
              <div className="relative">
                <button
                  onClick={toggleDropdown}
                  className="hover:opacity-60 flex flex-row items-center gap-1 duration-300"
                >
                  Login{" "}
                  <ChevronDown className="h-4 w-4 flex-row flex justify-center items-center" />
                </button>
                {isDropdownOpen && (
                  <div className="absolute left-1/2 -translate-x-1/2 top-8 border-2 border-black bg-white shadow-lg shadow-black rounded-md mt-2">
                    <Link
                      href="/Dashboard/login"
                      className="block text-center rounded-md px-4 py-2 hover:bg-backgroundPrimary"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      User Portal
                    </Link>
                    <Link
                      href="/Customer/login"
                      className="block text-center rounded-md px-4 py-2 hover:bg-backgroundPrimary"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Customer Portal
                    </Link>
                  </div>
                )}
              </div>
              <Link
                href={pageData.menuItems[pageData.menuItems.length - 1].href}
                className="bg-confirm border-2 border-black shadow-md font-bold shadow-black hover:shadow-lg hover:shadow-black duration-300 text-black px-4 py-2 rounded-lg inline-flex tracking-tight"
              >
                {pageData.menuItems[pageData.menuItems.length - 1].text}
              </Link>
            </nav>
          </div>
          {/* Mobile Menu */}
          <motion.nav
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: isMenuOpen ? 1 : 0, y: isMenuOpen ? 0 : -100 }}
            transition={{
              opacity: { duration: 0.7 },
              y: { duration: 1, ease: [0.42, 0, 0.58, 1], type: "easeInOut" },
            }}
            className={`lg:hidden sticky h-full text-black flex flex-col items-center justify-center font-bold space-y-4 ${
              isMenuOpen ? "sticky" : "hidden"
            }`}
            style={{ zIndex: 10 }}
          >
            {pageData.menuItems.slice(0, -1).map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className="hover:pr-2 flex flex-row gap-1 items-center duration-300"
                onClick={toggleMenu}
              >
                {item.text}
                {item.icon && <item.icon className="h-4 w-4" />}
              </Link>
            ))}
            {/* Dropdown for Mobile */}
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="hover:pr-2 flex flex-row gap-1 items-center duration-300"
              >
                Login
                <ChevronDown className="h-4 w-4 flex-row flex justify-center items-center" />
              </button>
              {isDropdownOpen && (
                <div className="absolute border-2 border-black bg-white  shadow-lg  left-1/2 text-center -translate-x-1/2 shadow-black rounded-md mt-2">
                  <Link
                    href="/Dashboard/login"
                    className="flex px-4 py-2 hover:bg-gray-100"
                    onClick={toggleMenu}
                  >
                    User Login
                  </Link>
                  <Link
                    href="/Customer/login"
                    className="flex px-4 py-2 hover:bg-gray-100"
                    onClick={toggleMenu}
                  >
                    Customer Login
                  </Link>
                </div>
              )}
            </div>
            <Link
              href={pageData.menuItems[pageData.menuItems.length - 1].href}
              className="bg-confirm border-2 border-black text-black px-4 py-2 rounded-lg font-bold inline-flex tracking-tight shadow-md shadow-black hover:shadow-lg hover:shadow-black duration-300"
              onClick={toggleMenu}
            >
              {pageData.menuItems[pageData.menuItems.length - 1].text}
            </Link>
          </motion.nav>
        </div>
      </div>
    </header>
  );
};
