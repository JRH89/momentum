import Image from "next/image";
import logo from "../../../public/logo.png";
import siteMetadata from "../../../siteMetadata";
import Link from "next/link";
import { Globe } from "lucide-react";

export const Footer = () => {
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-8"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M22.46 6c-.77.35-1.6.58-2.46.69a4.28 4.28 0 0 0 1.88-2.36 8.57 8.57 0 0 1-2.72 1.03 4.25 4.25 0 0 0-7.23 3.88 12.04 12.04 0 0 1-8.75-4.43 4.24 4.24 0 0 0 1.31 5.67 4.16 4.16 0 0 1-1.92-.53v.05a4.24 4.24 0 0 0 3.41 4.15 4.25 4.25 0 0 1-1.92.07 4.24 4.24 0 0 0 3.96 2.94A8.53 8.53 0 0 1 2 19.09 12 12 0 0 0 8.29 21c7.41 0 11.46-6.14 11.46-11.46 0-.18-.01-.35-.02-.53a8.18 8.18 0 0 0 2.03-2.09z" />
            </svg>
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-8"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M4.98 3.5c0 1.38-1.12 2.5-2.5 2.5s-2.5-1.12-2.5-2.5 1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5zm.02 5.5h-5v16h5v-16zm7.02 0h-4.98v16h5v-9.7c0-5.44 6.58-5.89 6.58 0v9.7h5v-10.3c0-9.26-10.58-8.96-11.58-4.38v-1.92h-4.02v16z" />
            </svg>
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
            Learn More
          </Link>
          <Link
            href="/Signin"
            className="hover:text-white transition duration-300 ease-in-out"
          >
            User Portal
          </Link>
          <Link
            href="/Customer/login"
            className="hover:text-white transition duration-300 ease-in-out"
          >
            Customer Portal
          </Link>
          <Link
            href="/Contact"
            className="hover:text-white transition duration-300 ease-in-out"
          >
            Contact
          </Link>
        </nav>

        {/* Footer Text */}
        <p className="mt-8 text-center">
          © {new Date().getFullYear()} {siteMetadata.title}. All rights
          reserved. Momentum is a subsidary of{" "}
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
