"use client";

import React, { useState } from "react";
import ArrowRight from "../../assets/arrow-right.svg";
import MenuIcon from "../../assets/menu.svg";
import Link from "next/link";
import { motion } from "framer-motion";
import LogoImage from "../Logo";

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
    { text: "About", href: "/#about" },
    { text: "The Docs", href: "/About" },
    { text: "Start Now", href: "/Signup", isPrimary: true },
  ],
};

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
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
                className="flex  flex-row items-center"
                href={pageData.logoHref}
              >
                <LogoImage width={40} height={40} />
                <p className="text-2xl flex md:text-3xl font-bold ">omentum</p>
              </Link>
            </div>
            <div
              className="md:hidden cursor-pointer hover:text-destructive duration-300"
              onClick={toggleMenu}
            >
              <MenuIcon className="h-10 w-10 " />
            </div>
            {/* Desktop Menu */}
            <nav className="hidden font-bold md:flex gap-6 text-black items-center">
              {pageData.menuItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className={
                    item.isPrimary
                      ? "bg-confirm border-2 border-black shadow-md font-bold shadow-black hover:shadow-lg hover:shadow-black duration-300 text-black px-4 py-2 rounded-lg inline-flex tracking-tight"
                      : "hover:pb-2 duration-300"
                  }
                >
                  {item.text}
                </Link>
              ))}
            </nav>
          </div>
          {/* Mobile Menu */}
          <motion.nav
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: isMenuOpen ? 1 : 0, y: isMenuOpen ? 0 : -100 }}
            transition={{
              opacity: { duration: 0.7 },
              y: { duration: 1, ease: [0.42, 0, 0.58, 1], type: "easeInOut" }, // Smooth easing for both up and down
            }}
            className={`md:hidden sticky w-full h-full text-black flex flex-col items-center justify-center font-bold space-y-4 ${
              isMenuOpen ? "sticky" : "hidden"
            }`}
            style={{ zIndex: 10 }}
          >
            {pageData.menuItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className={
                  item.isPrimary
                    ? "bg-confirm border-2 border-black text-black px-4 py-2 rounded-lg font-bold inline-flex tracking-tight shadow-md shadow-black hover:shadow-lg hover:shadow-black duration-300"
                    : "hover:pr-2 duration-300"
                }
                onClick={toggleMenu}
              >
                {item.text}
              </Link>
            ))}
          </motion.nav>
        </div>
      </div>
    </header>
  );
};
