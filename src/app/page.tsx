import {
  Info,
  ArrowBigRightIcon,
  Text,
  Book,
  GraduationCap,
} from "lucide-react";
import { PriceCard } from "../components/landing-page/PriceCard";
import { Header } from "../components/landing-page/Header";
import { Footer } from "../components/landing-page/Footer";
import Link from "next/link";
import FAQ from "../components/page/FAQ";
import FeaturesSection from "../components/FeaturesSection";
import ImageGallery from "../components/ImageGallery";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <Header />
      <main className="bg-gray-900 text-white">
        <section
          className="relative min-h-screen flex flex-col lg:flex-row items-center justify-center bg-center bg-fixed aspect-auto bg-cover bg-no-repeat"
          style={{
            backgroundImage: 'url("/lightspeed2.jpg")',
            backgroundPosition: "center 25%",
          }}
        >
          <div className="absolute inset-0 bg-white bg-opacity-75"></div>
          <div className="relative xl:ml-14 z-10 text-left sm:max-w-xl lg:max-w-5xl p-8 pt-28 sm:pt-32 lg:pt-32 lg:w-1/2">
            <div className="flex lg:hidden mb-8">
              <Image
                width={1920}
                height={1080}
                src="/project.png"
                alt="Project Dashboard"
                className="w-auto border-2 border-black shadow-md shadow-black h-auto rounded-lg my-auto justify-center items-center z-40"
              />
            </div>
            <h1 className="text-3xl text-black sm:text-3xl lg:text-5xl font-extrabold xl:text-6xl mb-2 xl:mb-4">
              Project Management for Freelancers & Small Businesses
            </h1>
            <p className="text-xl md:text-xl max-w-3xl xl:text-3xl lg:text-2xl mb-4 xl:mb-6 text-black font-medium">
              Manage projects, organize customers, and send invoices.
            </p>
            <div className="flex flex-row gap-5 items-center">
              <Link
                href={"/Signup"}
                className="bg-confirm hover:shadow-lg border-2 border-black hover:shadow-black transition duration-300 ease-in-out text-black text-md sm:text-base md:text-xl font-extrabold flex flex-row gap-2 px-4 sm:px-6 py-3 rounded-lg shadow-md shadow-black items-center"
              >
                Get Started{" "}
                <ArrowBigRightIcon className="w-4 h-4 sm:w-6 sm:h-6" />
              </Link>
              <Link
                href="/#features"
                className="hover:opacity-60 transition duration-300 ease-in-out items-center font-bold flex flex-row gap-2 text-md sm:text-base md:text-xl text-black"
              >
                Learn more <GraduationCap className="w-4 h-4 sm:w-6 sm:h-6" />
              </Link>
            </div>
          </div>
          <div className="relative lg:w-1/2 hidden lg:flex items-center justify-center p-8 pt-28 sm:pt-32 lg:pt-32">
            <Image
              width={1920}
              height={1080}
              src="/project.png"
              alt="Project Dashboard"
              className="max-w-lg border-2 border-black shadow-md shadow-black h-auto rounded-lg my-auto justify-center items-center"
            />
          </div>
        </section>
        <FeaturesSection />
        <section className="border-t-2 border-black bg-[#EAEEFE]">
          <PriceCard />
        </section>
        <ImageGallery />
        <section
          style={{
            backgroundImage: 'url("/image-3.png")',
            backgroundPosition: "center 25%",
          }}
          id="faq"
          className="border-t-2 border-black relative min-h-screen flex flex-col items-center justify-center bg-center bg-fixed bg-cover bg-no-repeat"
        >
          <div className="absolute inset-0 bg-white bg-opacity-95"></div>
          <FAQ />
        </section>
        <section
          className="relative min-h-screen flex flex-col items-center justify-center border-t-2 border-black bg-center bg-fixed aspect-auto bg-cover bg-no-repeat"
          style={{
            backgroundImage: 'url("/lightspeed2.jpg")',
            backgroundPosition: "center 25%", // Adjust the vertical position of the background image
          }}
        >
          <div className="absolute inset-0 bg-white bg-opacity-75"></div>
          <div className="relative z-10 text-left max-w-7xl p-8 ">
            <h2 className="text-4xl lg:text-7xl font-bold mb-6 text-black">
              Ready to Build Momentum?
            </h2>
            <p className="text-2xl lg:text-3xl max-w-3xl mb-8 text-gray-800 font-medium">
              Sign up now to keep your business moving forward.
            </p>
            <div className="flex flex-row gap-5 items-center">
              <Link
                href={"/Signup"}
                className="bg-confirm hover:shadow-lg hover:shadow-black transition duration-300 ease-in-out text-black font-bold flex flex-row gap-2 text-xs sm:text-xl px-4 sm:px-6 py-3 rounded-lg shadow-md border-2 border-black shadow-black items-center"
              >
                Get Started{" "}
                <ArrowBigRightIcon className="w-4 h-4 sm:w-6 sm:h-6" />
              </Link>
              <Link
                href="/About"
                className="hover:opacity-60 transition duration-300 ease-in-out items-center font-semibold flex flex-row gap-2 text-md sm:text-xl text-black"
              >
                Read the docs <Book className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
