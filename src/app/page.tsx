import Image from "next/image";
import SignIn from "../components/SignIn";
import { FolderPlus, LayoutDashboard, Smile, TrendingUp } from "lucide-react";
import { PriceCard } from "../components/landing-page/PriceCard";
import { Header } from "../components/landing-page/Header";
import { Footer } from "../components/landing-page/Footer";

export default function Home() {
  return (
    <>
    <Header />
    
    <main className="bg-gray-900 text-white">
  {/* Hero Section */}
  <section
  className="relative min-h-screen flex flex-col items-center justify-center bg-center bg-fixed aspect-auto bg-cover bg-no-repeat"
  style={{
    backgroundImage: 'url("/image-2.png")',
  }}
>
  {/* Overlay */}
  <div className="absolute inset-0 bg-white bg-opacity-90"></div>

  {/* Content */}
  <div className="relative lg:ml-14 z-10 text-left max-w-7xl p-8 pt-32">
    <h1 className="text-5xl leading-relaxed sm:leading-relaxed text-black lg:leading-tight md:text-7xl font-bold mb-6">
      Project Management for Freelancers & Small Businesses
    </h1>
    <p className="text-xl md:text-3xl lg:text-4xl text-left py-4 mb-8 text-black">
      Organize your projects, manage customers, send invoices, and track payments all in one place. Managing projects has never been easier!
    </p>
    <SignIn />
  </div>
</section>

 {/* Features Section */}
        <section className="min-h-screen h-full my-auto flex items-center justify-center bg-white py-16">
          
          <div className="max-w-7xl mx-auto px-6">
              <div className="section-heading">
    <h2 className="section-title">
      Key Features
            </h2>
            <p className="section-description mt-5">Momentum HQ provides a comprehensive suite of features to help you streamline your project management workflow.</p></div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 mt-12">
      {/* Create Projects */}
      <div className="relative bg-confirm p-8 rounded-lg shadow-lg text-center flex flex-col items-center">
        <div className="absolute -top-6 flex items-center justify-center">
          <div className="bg-white rounded-full w-16 h-16 border-4 border-confirm flex items-center justify-center">
            <FolderPlus className="text-destructive w-8 h-8" />
          </div>
        </div>
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-black">
          Create Projects
        </h3>
        <p className="text-lg text-black mb-4">
          Set up new projects and manage everything in one place.
        </p>
        <ul className="text-black text-md font-medium space-y-2">
          <li>- Add project details and goals</li>
          <li>- Manage associated files</li>
          <li>- Organize resources effectively</li>
        </ul>
      </div>

      {/* Milestone Tracking */}
      <div className="relative bg-confirm p-8 rounded-lg shadow-lg text-center flex flex-col items-center">
        <div className="absolute -top-6 flex items-center justify-center">
          <div className="bg-white rounded-full w-16 h-16 border-4 border-confirm flex items-center justify-center">
            <TrendingUp className="text-destructive w-8 h-8" />
          </div>
        </div>
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-black">
          Milestone Tracking
        </h3>
        <p className="text-lg text-black mb-4">
          Stay on top of key milestones and budgets.
        </p>
        <ul className="text-black text-md font-medium space-y-2">
          <li>- Monitor milestone progress</li>
          <li>- Log and manage expenses</li>
          <li>- Track budgets and costs</li>
        </ul>
      </div>

      {/* Project Dashboard */}
      <div className="relative bg-confirm p-8 rounded-lg shadow-lg text-center flex flex-col items-center">
        <div className="absolute -top-6 flex items-center justify-center">
          <div className="bg-white rounded-full w-16 h-16 border-4 border-confirm flex items-center justify-center">
            <LayoutDashboard className="text-destructive w-8 h-8" />
          </div>
        </div>
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-black">
          Project Dashboard
        </h3>
        <p className="text-lg text-black mb-4">
          Get insights into your projects and progress.
        </p>
        <ul className="text-black text-md font-medium space-y-2">
          <li>- View project status at a glance</li>
          <li>- Track deadlines and deliverables</li>
          <li>- Access customer and project data</li>
        </ul>
      </div>
    </div>
  </div>
        </section>
        <section className=" bg-[#EAEEFE]">
      <PriceCard />
        </section>
      {/* About Section */}
      <section className="min-h-screen h-full my-auto flex flex-col items-center bg-white lg:py-24 py-24 md:py-0">
        <div className="max-w-7xl mx-auto px-6 text-center pb-6">
          <div className="section-heading">
            <h2 className="section-title">
            Why Choose Us?
              </h2>
              <p className="section-description mt-5">We provide the tools you need to succeed.</p>
            </div>
         
           <div className="flex flex-col md:flex-row justify-center mt-6 items-stretch gap-10 bg-black py-6 rounded-xl p-6">
  <p className="section-description h-full text-white text-justify my-auto max-w-xl bg-destructive p-8 py-20 flex md:ml-10 rounded-lg">
    We understand the unique needs of freelancers and small businesses. Our platform is designed to streamline your project management, making it easier to stay organized and meet deadlines, so you can focus on what matters most — growing your business.
  </p>
  <div className="md:mr-10 flex">
    <Image
      src="/image-4.png"
      alt="Project Management"
      width={600}
      height={400}
      className="rounded-lg shadow-lg max-w-xs sm:max-w-xl lg:max-w-xs h-auto flex object-cover"
    />
  </div>
</div>

        </div>
      </section>

      {/* Call to Action Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center bg-center bg-fixed bg-cover bg-no-repeat"
  style={{
    backgroundImage: 'url("/image-3.png")',
        }}>
        <div className="absolute inset-0 bg-white bg-opacity-90"></div>
       <div className="relative z-10 text-left max-w-7xl p-8 ">
        <h2 className="text-4xl lg:text-7xl font-bold mb-6 text-black">
          Ready to Get Started?
        </h2>
        <p className="text-2xl lg:text-3xl max-w-3xl mb-8 text-black font-medium">
          Sign up today to start managing your projects effortlessly and take your business to new heights.
        </p>
        <SignIn />
      </div></section>
      </main>
    <Footer />
    </>
  );
}
