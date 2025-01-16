import {  Info, ArrowBigRightIcon, } from "lucide-react";
import { PriceCard } from "../components/landing-page/PriceCard";
import { Header } from "../components/landing-page/Header";
import { Footer } from "../components/landing-page/Footer";
import Link from "next/link";
import Script from "next/script";
import FAQ from "../components/page/FAQ";
import FeaturesSection from "../components/FeaturesSection";
import ImageGallery from "../components/ImageGallery";


export default function Home() {
  return (
    <>
      <div
        dangerouslySetInnerHTML={{
          __html: `<review-vault-widget 
          projectid="Momentum" 
          userid="Hj3U9zIg3pQd2DGsA4Uvs95uUje2" 
          position="bottom-right">
          </review-vault-widget>`,
          }}>
        </div>
        <Script src="https://review-vault-widget.vercel.app/widget.umd.js"></Script>
        <Header />
        <main className="bg-gray-900 text-white">
          <section
          className="relative min-h-screen flex flex-col items-center justify-center bg-center bg-fixed aspect-auto bg-cover bg-no-repeat"
          style={{
            backgroundImage: 'url("/lightspeed.png")',
            backgroundPosition: 'center 25%', // Adjust the vertical position of the background image
          }}>
          <div className="absolute inset-0 bg-white bg-opacity-60"></div>
            <div className="relative lg:ml-14 z-10 text-left max-w-5xl p-8 pt-28 sm:pt-32">
              <h1
              className="text-4xl sm:text-5xl text-black md:text-6xl font-extrabold mb-6"
              >
                Project Management for Freelancers & Small Businesses
              </h1>
              <p className="text-2xl max-w-3xl lg:text-3xl mb-8 text-gray-800 font-medium">
                Manage projects, organize customers, and send invoices.
              </p>
              <div className="flex flex-row gap-5 items-center">
                <Link href={"/Signup"} className="bg-confirm hover:shadow-lg border-2 border-black hover:shadow-black transition duration-300 ease-in-out text-black text-xs sm:text-xl font-extrabold flex flex-row gap-2 px-4 sm:px-6 py-3 rounded-lg shadow-md shadow-black items-center">Get Started <ArrowBigRightIcon className="w-4 h-4 sm:w-6 sm:h-6" /></Link>
                <Link href="/About" className="hover:opacity-60 transition duration-300 ease-in-out items-center font-bold flex flex-row gap-2 text-md sm:text-xl text-black">Learn more <Info className="w-5 h-5" /></Link>
              </div>
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
              backgroundPosition: 'center 25%',
              }}
              id="faq" className="border-t-2 border-black relative min-h-screen flex flex-col items-center justify-center bg-center bg-fixed bg-cover bg-no-repeat">
              <div className="absolute inset-0 bg-white bg-opacity-95"></div>
              <FAQ />
            </section>
                <section className="relative min-h-screen flex flex-col items-center justify-center border-t-2 border-black bg-center bg-fixed aspect-auto bg-cover bg-no-repeat"
                style={{
                  backgroundImage: 'url("/lightspeed.png")',
                  backgroundPosition: 'center 25%', // Adjust the vertical position of the background image
                }}>
                <div className="absolute inset-0 bg-white bg-opacity-60"></div>
                  <div className="relative z-10 text-left max-w-7xl p-8 ">
                    <h2 className="text-4xl lg:text-7xl font-bold mb-6 text-black">
                      Ready to Build Momentum?
                    </h2>
                    <p className="text-2xl lg:text-3xl max-w-3xl mb-8 text-gray-800 font-medium">
                      Sign up now to organize your projects, stay on schedule, and keep your business moving forward.
                    </p>
                    <div className="flex flex-row gap-5 items-center">
                    <Link href={"/Signup"} className="bg-confirm hover:shadow-lg hover:shadow-black transition duration-300 ease-in-out text-black font-bold flex flex-row gap-2 text-xs sm:text-xl px-4 sm:px-6 py-3 rounded-lg shadow-md border-2 border-black shadow-black items-center">
                      Get Started <ArrowBigRightIcon className="w-4 h-4 sm:w-6 sm:h-6" />
                    </Link>
                    <Link href="/About" className="hover:opacity-60 transition duration-300 ease-in-out items-center font-semibold flex flex-row gap-2 text-md sm:text-xl text-black">
                      Learn more <Info className="w-5 h-5" />
                    </Link>
              </div>
            </div>
          </section>
        </main>
      <Footer />
    </>
  );
}
