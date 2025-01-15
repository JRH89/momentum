"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import { useState } from "react";

const sections = {
  welcomeToMomentum: {
    title: "Welcome to Momentum",
    content:
      "Momentum is a project management and invoicing platform. It's perfect for freelancers, small businesses, and independent contractors.",
    content2:
      "Our simple and intuitive interface makes it easy to manage your projects and invoices. Whether you're a freelancer, small business, or independent contractor, Momentum has everything you need to get started.",
    content3:
      "With transparent pricing and no hidden fees, you can stay on top of budgets. We charge a flat Monthly or Yearly membership fee, and Stripe charges 0.4% of each paid invoice. All payments are processed through Stripe, ensuring secure and reliable transactions.",
    image: ["/cover.png", "/dashboard.png", "/account-3.png"],
  },
  accountCreation: {
    title: "Creating an Account",
    content:
      "Sign up with Google or GitHub (more providers coming soon) to create an account and start managing your projects and invoices.",
    content2:
      "Choose between monthly or yearly plans. You can upgrade or downgrade at any time. All payments are processed through Stripe, ensuring secure and reliable transactions.",
    content3:
      "Connect your Stripe account to enable seamless payment management and invoicing within Momentum. Don't have a Stripe account? No problem! You can easily create a new account during the sign-up process.",
    image: ["/account-1.png", "/account-3.png", "/account-2.png"],
  },
  connectingStripe: {
    title: "Connecting to Stripe",
    content:
      "Click the 'Connect to Stripe' button to begin the process. You will be redirected to Stripe's website, where you will be prompted to login with your Stripe account credentials and authorize the connection to Momentum.",
    content2:
      "After you have successfully connected, you will be able to access all of the Dashboard's features.",
    image: ["/account-2.png", "/dashboard.png"], // Single image in array
  },
  userDashboard: {
    title: "User Dashboard",
    content:
      "The user dashboard provides a centralized view for managing your projects, tracking progress, creating customers and projects, and accessing essential tools.",
    image: ["/dashboard.png"],
  },
  customerDashboard: {
    title: "Customer Dashboard",
    content:
      "The customer dashboard allows your clients to view their project progress, pay invoices, and stay updated on milestones.",
    image: ["/customer-dashboard.png"],
  },
  invoicing: {
    title: "Invoicing",
    content:
      "From the customer list, select 'Create Invoice' from the dropdown menu at the far right side of the table, in the 'Actions' column.",
    content2:
      "The invoice form will open. Fill it out with the required information and click 'Create Invoice'.",
    content3:
      "Once you hit the 'Create Invoice' button, your invoice will be sent to the customer's email address. Customers can pay by visiting the link in the email or using their customer dashboard.",
    image: ["/invoice-2.png", "/invoice.png"],
  },
  projectPages: {
    title: "Project Pages",
    content:
      "Create and manage projects with milestones, deadlines, and tasks.",
    image: ["/project-page-1.png", "/project-page-2.png"],
  },
};

export default function ActiveAbout() {
  const { activeSection } = useParams("accountCreation");

  return (
    <div className="min-h-screen flex flex-col sm:flex-row">
      {/* Main Content */}
      <main className="w-full mt-20 sm:mt-12 flex flex-col px-4 sm:p-8 pb-12 max-w-4xl mx-auto">
        <h1 className="text-3xl lg:text-4xl text-center font-bold mb-4">
          {sections[activeSection].title}
        </h1>
        <div className="p-2 sm:p-4 sm:pt-0 pt-0 ">
          <p className="text-lg leading-7 mb-4">
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

          <p className="text-lg leading-7 mb-4">
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

            <p className="text-lg leading-7 my-4">
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
