"use client";

import Image from "next/image";
import logo from "../../../public/logo.png";
import siteMetadata from "../../../siteMetadata";
import Link from "next/link";
import {
  ChevronDown,
  Globe,
  Linkedin,
  Newspaper,
  Twitter,
  Youtube,
} from "lucide-react";
import { useState } from "react";

export const Footer = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <footer className="bg-black text-[#bcbcbc] text-sm sm:text-lg md:text-xl lg:text-2xl py-12">
      <div className="container mx-auto px-6 lg:px-20">
        {/* Logo Section */}
        <div className="flex justify-center items-center relative">
          <div className="relative inline-flex items-center before:content-[''] before:w-full before:h-full before:absolute before:top-0 before:left-0 before:right-0 before:bottom-0 before:blur before:bg-[linear-gradient(to_right,#f87bff,#fb92cf,#ffdd9b,#c2f0b1,#2fd8fe)] rounded-full">
            <Image
              src={logo}
              alt="logo"
              height={50}
              className="relative z-10 rounded-lg border-2 border-black"
            />
          </div>
        </div>
        {/* Social Media Icons */}
        <div className="flex justify-center gap-6 mt-8 items-center my-auto">
          <Link
            href="https://twitter.com/gamedevjared89"
            className="hover:text-white  transition-colors duration-300 ease-in-out"
          >
            <Twitter className="w-8 h-8" />
          </Link>
          <Link
            href="https://www.hookerhillstudios.com"
            className="hover:text-white  transition-colors duration-300 ease-in-out"
          >
            <Globe className="w-8 h-8" />
          </Link>
          <Link
            href="https://linkedin.com/in/jaredhooker"
            className="hover:text-white  transition-colors duration-300 ease-in-out"
          >
            <Linkedin className="w-8 h-8" />
          </Link>
          <Link
            href="https://www.youtube.com/@hookerhillstudios"
            className="hover:text-white  transition-colors duration-300 ease-in-out"
          >
            <Youtube className="w-8 h-8" />
          </Link>
          <Link
            href="https://www.hookerhillstudios.com/Blog"
            className="hover:text-white  transition-colors duration-300 ease-in-out"
          >
            <Newspaper className="w-8 h-8" />
          </Link>
        </div>
        {/* Navigation Section */}
        <nav className="flex flex-wrap justify-center gap-8 mt-8 text-center px-10 sm:px-0">
          <Link
            href="/Policies"
            className="hover:text-white transition duration-300 ease-in-out"
          >
            Policies
          </Link>
          <Link
            href="/#price"
            className="hover:text-white transition duration-300 ease-in-out"
          >
            Pricing
          </Link>
          <Link
            href="/About/welcomeToMomentum"
            className="hover:text-white transition duration-300 ease-in-out"
          >
            Documentation
          </Link>
          <Link
            href="/Contact"
            className="hover:text-white transition duration-300 ease-in-out"
          >
            Contact
          </Link>
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="hover:opacity-60 flex flex-row gap-1 items-center duration-300"
            >
              Login
              <ChevronDown className="h-4 w-4 flex-row flex justify-center items-center" />
            </button>
            {isDropdownOpen && (
              <div className="absolute mx-auto text-black flex flex-col  bg-white  shadow-lg  left-1/2 text-center -translate-x-1/2 w-auto text-xs shadow-black rounded-md mt-1">
                <Link
                  href="/Dashboard/login"
                  className="flex p-2 mx-auto rounded-md w-auto hover:bg-backgroundPrimary"
                  onClick={toggleMenu}
                >
                  User Portal
                </Link>
                <Link
                  href="/Customer/login"
                  className="flex p-2 mx-auto w-auto rounded-md hover:bg-backgroundPrimary"
                  onClick={toggleMenu}
                >
                  Customer Portal
                </Link>
              </div>
            )}
          </div>
        </nav>

        {/* Footer Text */}
        <p className="mt-8 text-center">
          © {new Date().getFullYear()} {siteMetadata.title}. All rights
          reserved. Momentum is a subsidiary of{" "}
          <a
            className="hover:text-white transition duration-300 ease-in-out"
            rel="noopener"
            target="_blank"
            href="https://www.hookerhillstudios.com"
          >
            Hooker Hill Studios
          </a>
          .
        </p>
      </div>
    </footer>
  );
};
