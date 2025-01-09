import Image from "next/image";
import { ArrowRight, CircleCheckIcon, FolderPlus, Info, LayoutDashboard, LayoutTemplate, Receipt } from "lucide-react";
import { PriceCard } from "../components/landing-page/PriceCard";
import { Header } from "../components/landing-page/Header";
import { Footer } from "../components/landing-page/Footer";
import Link from "next/link";
import Script from "next/script";
import FAQ from "../components/page/FAQ";

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
          {/* Hero Section */}
          <section
          className="relative min-h-screen flex flex-col items-center justify-center bg-center bg-fixed aspect-auto bg-cover bg-no-repeat"
          style={{
            backgroundImage: 'url("/lightspeed.png")',
            backgroundPosition: 'center 25%', // Adjust the vertical position of the background image
          }}>
          {/* Overlay */}
          <div className="absolute inset-0 bg-white bg-opacity-60"></div>
            {/* Content */}
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
                <Link href={"/Signup"} className="bg-confirm hover:shadow-lg border-2 border-black hover:shadow-black transition duration-300 ease-in-out text-black text-xs sm:text-xl font-extrabold flex flex-row gap-2 px-4 sm:px-6 py-3 rounded-lg shadow-md shadow-black items-center">Get Started <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" /></Link>
                <Link href="/About" className="hover:opacity-60 transition duration-300 ease-in-out items-center font-bold flex flex-row gap-2 text-md sm:text-xl text-black">Learn more <Info className="w-5 h-5" /></Link>
              </div>
            </div>
            </section>
            {/* Features Section */}
            <section id="features" className="min-h-screen border-t-2 border-black h-full my-auto flex items-center justify-center bg-white py-16 pb-24">
              <div className="max-w-7xl mx-auto px-6">
            <div className="section-heading w-full mx-auto flex flex-col">
                <div className="tag mx-auto justify-center w-auto text-destructive text-sm sm:text-md md:text-lg lg:text-xl">Features</div>
                  <h2 className="section-title mt-5">
                    Project Management Suite
              </h2>
              
                  <p className="section-description mt-5">
                    We provide a comprehensive suite of features to help you keep organized, stay on schedule, and get paid.
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-10 mt-12">
                  {/* Create Projects */}
                  <div className="relative border-2 border-black bg-confirm p-8 rounded-lg shadow-lg text-center flex flex-col items-center shadow-black">
                    <div className="absolute -top-6 flex items-center justify-center">
                      <div className="bg-white border-2 border-black shadow-md shadow-black rounded-full w-16 h-16  flex items-center justify-center">
                        <FolderPlus className="text-destructive w-8 h-8" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-semibold mb-4 mt-8 text-black">
                      Create Projects
                    </h3>
                    <p className="text-lg w-full font-medium text-black mb-4 text-left">
                      Create projects and manage everything in one place.
                    </p>
                    <ul className="text-black items-start w-full text-left text-md font-medium space-y-2">
                      <li className="flex gap-2"><CircleCheckIcon className="text-destructive w-5 h-5 bg-white rounded-full shadow-md shadow-black" /> Add project details and goals</li>
                      <li className="flex gap-2"><CircleCheckIcon className="text-destructive w-5 h-5 bg-white rounded-full shadow-md shadow-black" /> Manage associated files</li>
                      <li className="flex gap-2"><CircleCheckIcon className="text-destructive w-5 h-5 bg-white rounded-full shadow-md shadow-black" /> Share progress with clients</li>
                    </ul>
                  </div>
                {/* Milestone Tracking */}
                <div className="relative border-2 border-black bg-confirm p-8 rounded-lg shadow-lg shadow-black text-center flex flex-col items-center">
                  <div className="absolute -top-6 flex items-center justify-center">
                  <div className="bg-white border-2 border-black shadow-md shadow-black rounded-full w-16 h-16  flex items-center justify-center">
                      <Receipt className="text-destructive w-8 h-8" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-semibold mb-4 mt-8 text-black">
                    Send Invoices
                  </h3>
                  <p className="text-lg w-full font-medium text-left text-black mb-4">
                    Create and send invoices to clients with Stripe.
                  </p>
                  <ul className="text-black items-start w-full  text-left text-md font-medium space-y-2">
                    <li className="flex gap-2"><CircleCheckIcon className="text-destructive w-5 h-5 bg-white rounded-full shadow-md shadow-black" /> Create and send invoices</li>
                    <li className="flex gap-2"><CircleCheckIcon className="text-destructive w-5 h-5 bg-white rounded-full shadow-md shadow-black" /> Manage and track payments</li>
                    <li className="flex gap-2"><CircleCheckIcon className="text-destructive w-5 h-5 bg-white rounded-full shadow-md shadow-black" /> Track budgets and costs</li>
                  </ul>
                </div>
                {/* Project Dashboard */}
                <div className="relative border-2 border-black bg-confirm p-8 rounded-lg shadow-lg shadow-black text-center w-full flex flex-col items-center">
                  <div className="absolute -top-6 flex items-center justify-center">
                    <div className="bg-white shadow-md shadow-black rounded-full w-16 h-16 border-2 border-black flex items-center justify-center">
                      <LayoutDashboard className="text-destructive w-8 h-8" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-semibold mb-4 mt-8 text-black">
                    User Dashboard
                  </h3>
                  <p className="text-lg h-full font-medium text-left text-black mb-4">
                    Manage all your customers and projects in one place.
                  </p>
                  <ul className="text-black items-start w-full flex flex-col h-full text-left text-md font-medium space-y-2">
                    <li className="flex gap-2"><CircleCheckIcon className="text-destructive w-5 h-5 bg-white rounded-full shadow-md shadow-black" /> Create projects</li>
                    <li className="flex gap-2"><CircleCheckIcon className="text-destructive w-5 h-5 bg-white rounded-full shadow-md shadow-black" /> Send invoices</li>
                    <li className="flex gap-2"><CircleCheckIcon className="text-destructive w-5 h-5 bg-white rounded-full shadow-md shadow-black" /> Manage customers</li>
                  </ul>
                </div>
                  {/* Project Dashboard */}
                  <div className="relative lg:flex border-2 border-black bg-confirm p-8 rounded-lg shadow-lg shadow-black text-center w-full flex flex-col items-center">
                    <div className="absolute -top-6 flex items-center justify-center">
                    <div className="bg-white shadow-md shadow-black rounded-full w-16 h-16 border-2 border-black flex items-center justify-center">
                      <LayoutTemplate className="text-destructive w-8 h-8" />
                    </div>
                    </div>
                    <h3 className="text-2xl font-semibold mb-4 mt-8 text-black">
                      Client Dashboard
                    </h3>
                    <p className="text-lg font-medium text-left text-black mb-4">
                      Your clients can view projects, pay invoices, and more.
                    </p>
                    <ul className="text-black items-start w-full  text-left text-md font-medium space-y-2">
                      <li className="flex gap-2"><CircleCheckIcon className="text-destructive w-5 h-5 bg-white rounded-full shadow-md shadow-black" /> View project status</li>
                      <li className="flex gap-2"><CircleCheckIcon className="text-destructive w-5 h-5 bg-white rounded-full shadow-md shadow-black" /> Upload files and track progress</li>
                      <li className="flex gap-2"><CircleCheckIcon className="text-destructive w-5 h-5 bg-white rounded-full shadow-md shadow-black" /> Pay invoices</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>
            <section className="border-t-2 border-black bg-[#EAEEFE]">
            <PriceCard />
            </section>
            {/* About Section */}
            <section id="about" className="min-h-screen h-full my-auto flex flex-col items-center border-t-2 border-black bg-white lg:py-24 py-24 ">
              <div className="max-w-7xl mx-auto px-6 text-center pb-6">
            <div className="section-heading w-full mx-auto flex flex-col">
                <div className="tag mx-auto justify-center w-auto text-destructive text-sm sm:text-md md:text-lg lg:text-xl">About</div>
                  <h2 className="section-title mt-5">
                    Why Choose Us?
                  </h2>
                  <p className="section-description mt-5">We provide the tools you need to succeed. Want to know more about Momentum? <Link className="text-medoum text-green-500 hover:underline" href="/About">Visit the About page</Link>.</p>
                </div>
                <div className="flex flex-col md:flex-row justify-center mt-6 items-stretch gap-5 sm:gap-10 shadow-black shadow-md bg-black py-6 rounded-xl p-6">
                <p className="section-description font-medium h-full text-black text-justify my-auto text-lg w-full  sm:max-w-xl bg-destructive p-8 py-10 sm:py-20 lg:py-24 flex md:ml-10 rounded-lg">
                  We understand the unique needs of freelancers and small businesses. Our platform is designed to streamline your project management, making it easier to stay organized and meet deadlines, so you can focus on what matters most — growing your business.
                </p>
                <div className="md:mr-10 bg-confirm rounded-lg flex">
                  <Image
                    src="/image-4.png"
                    alt="Project Management"
                    width={600}
                    height={400}
                    className="rounded-lg mx-auto w-full max-w-xs sm:max-w-xl lg:max-w-xs h-auto object-center flex object-contain"
                  />
                </div>
              </div>
            </div>
        </section>
        <section id="faq" className="border-t-2 border-black bg-white">
          
          <FAQ />
        </section>
          {/* Call to Action Section */}
          <section className="border-t-2 border-black relative min-h-screen flex flex-col items-center justify-center bg-center bg-fixed bg-cover bg-no-repeat"
            style={{
              backgroundImage: 'url("/image-3.png")',
              backgroundPosition: 'center 25%',
            }}>
            <div className="absolute inset-0 bg-white bg-opacity-95"></div>
            <div className="relative z-10 text-left max-w-7xl p-8 ">
              <h2 className="text-4xl lg:text-7xl font-bold mb-6 text-black">
                Ready to Build Momentum?
              </h2>
              <p className="text-2xl lg:text-3xl max-w-3xl mb-8 text-gray-800 font-medium">
                Sign up now to organize your projects, stay on schedule, and keep your business moving forward.
              </p>
              <div className="flex flex-row gap-5 items-center">
                <Link href={"/Signup"} className="bg-destructive hover:shadow-lg hover:shadow-black transition duration-300 ease-in-out text-black font-bold flex flex-row gap-2 text-xs sm:text-xl px-4 sm:px-6 py-3 rounded-lg shadow-md border-2 border-black shadow-black items-center">Get Started <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" /></Link>
                <Link href="/About" className="hover:opacity-60 transition duration-300 ease-in-out items-center font-semibold flex flex-row gap-2 text-md sm:text-xl text-black">Learn more <Info className="w-5 h-5" /></Link>
              </div>
            </div>
          </section>
        </main>
      <Footer />
    </>
  );
}
