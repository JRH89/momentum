"use client"

import ArrowRight from '../../assets/arrow-right.svg'
import Link from "next/link"

export const CallToAction = () => {

  const pageData = {
    tag: "What are you waiting for?",
    title: "Get started today",
    description: "Start building for free, then add a site plan to go live. Account plans unlock additional features.",
  }

  return (
    <section
      className="bg-white py-24 pb-48 overflow-x-clip w-full flex flex-col  mx-auto"
    >
      <div className="flex flex-col w-full">
        <div className="section-heading flex flex-col w-full">
          <div className="flex justify-center">
            <div className="tag text-destructive text-sm sm:text-md md:text-lg lg:text-xl">
              {pageData.tag}
            </div>
          </div>
          <h2 className="section-title mt-5">
            {pageData.title}
          </h2>
          <p className="section-description mt-5">
            {pageData.description}
          </p>
        </div>
        <div className="flex gap-2 mt-10 justify-center">
          <Link
            href="/Signup"
            className="btn btn-primary text-black bg-confirm shadow-md shadow-black hover:shadow-lg hover:shadow-black text-sm sm:text-lg md:text-xl lg:text-2xl duration-300">
            Get Started Now
          </Link>
          <Link
            href="/About"
            className="btn btn-text gap-1 hover:scale-95 duration-300">
            <span className="text-sm sm:text-lg md:text-xl lg:text-2xl">
              Discover more
            </span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};
