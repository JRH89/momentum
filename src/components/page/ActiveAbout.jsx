"use client";

import Image from "next/image";
import { useParams } from "next/navigation";

const sections = {
  welcomeToMomentum: {
    title: "Welcome to Momentum",
    content:
      "Momentum is your go-to project management and invoicing platform. Designed with freelancers, small businesses, and independent contractors in mind, it streamlines your workflow for increased productivity.",
    content2:
      "Our user-friendly interface makes it effortless to manage projects and invoices. Whether you're tracking deliverables, creating invoices, or monitoring progress, Momentum provides all the tools you need in one place.",
    content3:
      "With clear, upfront pricing and no hidden fees, you can confidently stay on budget. Momentum offers flexible monthly or yearly membership plans, while Stripe processes payments securely with a 0.4% fee on each paid invoice.",
    image: ["/cover.png", "/dashboard.png", "/account-3.png"],
  },
  accountCreation: {
    title: "Creating an Account",
    content:
      "Easily sign up using Google or GitHub. Get started in minutes and take control of your project and invoice management.",
    content2:
      "Select a plan that fits your needs—monthly or yearly—with the flexibility to upgrade or downgrade anytime. Stripe ensures all transactions are secure and reliable.",
    content3:
      "Link your Stripe account to enable seamless payment processing and invoicing within Momentum. Don’t have a Stripe account? You can create one quickly during the sign-up process.",
    image: ["/account-1.png", "/account-3.png", "/account-2.png"],
  },
  connectingStripe: {
    title: "Connecting to Stripe",
    content:
      "Start by clicking the 'Connect to Stripe' button. You will be redirected to Stripe’s secure website to log in and authorize the connection between your account and Momentum.",
    content2:
      "Once connected, you'll unlock the full potential of Momentum’s dashboard, making payment and invoice management straightforward and efficient.",
    image: ["/account-2.png", "/dashboard.png"], // Single image in array
  },
  userDashboard: {
    title: "User Dashboard",
    content:
      "The user dashboard serves as a central hub for managing all aspects of your business. From tracking project milestones and progress to creating customer profiles and generating invoices, it provides an all-in-one solution to keep you organized.",
    image: ["/dashboard.png"],
  },
  customerDashboard: {
    title: "Customer Dashboard",
    content:
      "The customer dashboard empowers your clients to stay informed. They can view project progress, track milestones, and conveniently pay invoices—all from one streamlined interface.",
    image: ["/customer-dashboard.png"],
  },
  invoicing: {
    title: "Invoicing",
    content:
      "Easily create invoices directly from the customer list. Click 'Create Invoice' in the dropdown menu located in the 'Actions' column on the far right.",
    content2:
      "Complete the invoice form with the necessary details and click 'Create Invoice' to finalize.",
    content3:
      "Your invoice will be sent directly to the customer’s email. Customers can pay securely via the provided email link or through their customer dashboard.",
    image: ["/invoice-2.png", "/invoice.png"],
  },
  projectPages: {
    title: "Project Pages",
    content:
      "Organize and manage projects with ease using Momentum’s project pages. Create milestones, set deadlines, and upload essential files. Both you and your clients can access project pages to monitor progress and stay on the same page.",
    image: ["/project.png"],
  },
};

export default function ActiveAbout() {
  const { activeSection } = useParams("accountCreation");

  return (
    <div className="min-h-screen flex flex-col sm:flex-row">
      {/* Main Content */}
      <main className="w-full mt-20 sm:mt-12 lg:mt-0 flex flex-col px-4 sm:p-8 pb-12 max-w-4xl mx-auto">
        <h1 className="text-3xl lg:text-4xl text-center font-bold mb-4">
          {sections[activeSection].title}
        </h1>
        <div className="p-2 sm:p-4 sm:pt-0 pt-0 ">
          <p className="text-lg text-justify sm:text-left leading-7 mb-4">
            {sections[activeSection].content}
          </p>

          {/* Insert images where you want */}
          <div className="mb-4">
            {sections[activeSection].image.length > 0 && (
              <Image
                className="border-2 mx-auto shadow-md shadow-black border-black rounded-lg"
                src={sections[activeSection].image[0]} // Example for first image
                alt={`${sections[activeSection].title} Image 1`}
                width={1920}
                height={1080}
              />
            )}
          </div>

          <p className="text-lg text-justify sm:text-left leading-7 mb-4">
            {sections[activeSection].content2}
          </p>

          <div className="mt-4">
            {sections[activeSection].image.length > 1 && (
              <Image
                className="border-2 shadow-md shadow-black w-full mx-auto border-black rounded-lg"
                src={sections[activeSection].image[1]} // Example for second image
                alt={`${sections[activeSection].title} Image 2`}
                width={1920}
                height={1080}
              />
            )}

            <p className="text-lg text-justify sm:text-left leading-7 my-4">
              {sections[activeSection].content3}
            </p>

            <div className="my-4">
              {sections[activeSection].image.length > 2 && (
                <Image
                  className="border-2 shadow-md shadow-black  w-full mx-auto border-black rounded-lg"
                  src={sections[activeSection].image[2]} // Example for third image
                  alt={`${sections[activeSection].title} Image 3`}
                  width={1920}
                  height={1080}
                />
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
