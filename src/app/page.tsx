import Image from "next/image";
import SignIn from "../components/SignIn";
import { CalendarCheck, CreditCard, FolderPlus, LayoutDashboard, Smile, TrendingUp } from "lucide-react";
import NavBar from "../components/navbar";
import Footer from "../components/footer";

export default function Home() {
  return (
    <>
    <NavBar />
    
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
  <div className="relative z-10 text-center max-w-7xl p-8 pt-32">
    <h1 className="text-6xl leading-relaxed sm:leading-relaxed text-black sm:text-7xl font-bold mb-6">
      Project Management for{" "}
      <span className="bg-green-500 px-2  inline-block rotate-1">Freelancers</span>{" "}
      &{" "}
      <span className="bg-green-500 px-2  inline-block -rotate-1">
        Small Businesses
      </span>
    </h1>
    <p className="text-3xl text-justify lg:px-10 mb-8 text-black">
      Organize your projects, collaborate with teams, and manage deadlines with ease. Take your business to the next level with our intuitive project management platform built for freelancers and small businesses.
    </p>
    <SignIn />
  </div>
</section>

 {/* Features Section */}
{/* Features Section */}
<section className="min-h-screen h-full my-auto flex items-center justify-center bg-white py-16">
  <div className="max-w-7xl mx-auto px-6">
    <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">
      Key Features
    </h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
      {/* Create Projects */}
      <div className="relative bg-gray-700 p-8 rounded-lg shadow-lg text-center flex flex-col items-center">
        <div className="absolute -top-6 flex items-center justify-center">
          <div className="bg-white rounded-full w-16 h-16 border-4 border-gray-700 flex items-center justify-center">
            <FolderPlus className="text-gray-700 w-8 h-8" />
          </div>
        </div>
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-white">
          Create Projects
        </h3>
        <p className="text-lg text-gray-300 mb-4">
          Set up new projects and manage everything in one place.
        </p>
        <ul className="text-gray-400 text-sm space-y-2">
          <li>- Add project details and goals</li>
          <li>- Manage associated files</li>
          <li>- Organize resources effectively</li>
        </ul>
      </div>

      {/* Milestone Tracking */}
      <div className="relative bg-gray-700 p-8 rounded-lg shadow-lg text-center flex flex-col items-center">
        <div className="absolute -top-6 flex items-center justify-center">
          <div className="bg-white rounded-full w-16 h-16 border-4 border-gray-700 flex items-center justify-center">
            <TrendingUp className="text-gray-700 w-8 h-8" />
          </div>
        </div>
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-white">
          Milestone Tracking
        </h3>
        <p className="text-lg text-gray-300 mb-4">
          Stay on top of key milestones and budgets.
        </p>
        <ul className="text-gray-400 text-sm space-y-2">
          <li>- Monitor milestone progress</li>
          <li>- Log and manage expenses</li>
          <li>- Track budgets and costs</li>
        </ul>
      </div>

      {/* Project Dashboard */}
      <div className="relative bg-gray-700 p-8 rounded-lg shadow-lg text-center flex flex-col items-center">
        <div className="absolute -top-6 flex items-center justify-center">
          <div className="bg-white rounded-full w-16 h-16 border-4 border-gray-700 flex items-center justify-center">
            <LayoutDashboard className="text-gray-700 w-8 h-8" />
          </div>
        </div>
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-white">
          Project Dashboard
        </h3>
        <p className="text-lg text-gray-300 mb-4">
          Get insights into your projects and progress.
        </p>
        <ul className="text-gray-400 text-sm space-y-2">
          <li>- View project status at a glance</li>
          <li>- Track deadlines and deliverables</li>
          <li>- Access customer and project data</li>
        </ul>
      </div>
    </div>
  </div>
</section>
      {/* About Section */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-6 text-center pb-6">
          <h2 className="text-4xl font-bold text-white mb-6">
            Why Choose Us?
          </h2>
          <p className="text-lg text-gray-200 max-w-3xl mx-auto mb-12 bg-gray-800 bg-opacity-75 p-6 rounded-lg shadow-lg border border-gray-600 pt-6">
            We understand the unique needs of freelancers and small businesses. Our platform is designed to streamline your project management, making it easier to stay organized and meet deadlines, so you can focus on what matters most — growing your business.
          </p>
          <div className="flex justify-center">
            <Image
              src="/image.png"
              alt="Project Management"
              width={600}
              height={400}
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center bg-center bg-fixed bg-cover bg-no-repeat"
  style={{
    backgroundImage: 'url("/image-2.png")',
        }}>
        <div className="absolute inset-0 bg-white bg-opacity-90"></div>
       <div className="relative z-10 text-left max-w-7xl p-8 pt-32">
        <h2 className="text-7xl font-bold mb-6 text-black">
          Ready to Get Started?
        </h2>
        <p className="text-3xl max-w-3xl mb-8 text-black">
          Sign up today to start managing your projects effortlessly and take your business to new heights.
        </p>
        <SignIn />
      </div></section>
      </main>
    <Footer />
    </>
  );
}
