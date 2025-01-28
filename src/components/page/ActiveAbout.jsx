"use client";

import Image from "next/image";
import { useParams } from "next/navigation";

const sections = {
  welcomeToMomentum: {
    title: "Welcome to Momentum",
    content:
      "Momentum is your go-to platform for project management and invoicing. Designed with freelancers, small businesses, and independent contractors in mind, it keeps everything you need in one place—project management, invoicing, and customer collaboration.",
    content2:
      " Our user-friendly interface streamlines your workflow by simplifying how you track deliverables, manage clients, and monitor progress. No plugins or add-ons are required—all features are included in your subscription price.",
    content3:
      "Enjoy unlimited customers, unlimited invoices, and complete peace of mind with Stripe’s secure payment processing. The only additional cost you’ll incur is Stripe’s standard invoicing fees. Momentum is built to empower your business with clear, upfront pricing—no hidden fees, no surprises.",
    image: ["/cover.png", "/dashboard.png", "/account-3.png"],
  },
  accountCreation: {
    title: "Creating an Account",
    content:
      "Getting started with Momentum is simple and fast. Sign up in seconds using Google, GitHub, or Email then choose a subscription plan that fits your business needs—monthly or yearly.",
    content2:
      "Cancel at any time for any reason, no questions asked. Momentum charges a flat monthly or yearly membership fee, and Stripe charges 2.9% + 30¢ per successful charge for domestic cards. All payments are processed through Stripe, ensuring secure and reliable transactions.",
    content3:
      "Momentum allows you to link your Stripe account during sign-up to enable seamless payment processing and invoicing. If you don’t have a Stripe account, no problem—you can create one directly from the onboarding flow.",
    image: ["/account-1.png", "/account-3.png", "/account-2.png"],
  },
  connectingStripe: {
    title: "Connecting to Stripe",
    content:
      "With Momentum, linking to Stripe unlocks powerful payment processing features that allow you to create and send invoices quickly and efficiently.",
    content2:
      "Start by clicking the 'Connect to Stripe' button from the dashboard. This redirects you to Stripe’s secure platform, where you can log in and authorize Momentum to integrate with your Stripe account.",
    content3:
      "Once connected, you’ll have full access to Momentum’s dashboard, enabling smooth payment and invoice management for all your projects. Existing customers and invoices will automatically be synced to your Momentum account, ensuring a seamless experience for both you and your clients.",
    image: ["/account-2.png", "/stripe.png", "/dashboard.png"], // Single image in array
  },
  userDashboard: {
    title: "User Dashboard",
    content:
      "The Momentum user dashboard is your all-in-one hub for managing every aspect of your business. Track project milestones, monitor progress, generate invoices, and maintain customer profiles in one intuitive interface.",
    image: ["/dashboard.png"],
  },
  clientDashboard: {
    title: "Client Dashboard",
    content:
      "Empower your clients with Momentum’s client dashboard. Clients can track project progress, view milestones, upload files, and pay invoices securely—all from one streamlined portal.",
    image: ["/customer-dashboard.png"],
  },
  invoicing: {
    title: "Invoicing",
    content:
      "Create and send invoices directly from the customer list in Momentum. Simply click “Create Invoice” in the dropdown menu under the “Actions” column.",
    content2:
      "Fill in the required details, such as amount due, description, and due date, and click 'Create Invoice' to finalize.",
    content3:
      "Invoices are sent directly to your client’s email, with a secure payment link included. Clients can pay instantly through the email link.",
    image: ["/invoice-2.png", "/invoice.png"],
  },
  projectPages: {
    title: "Project Pages",
    content:
      "Keep your projects organized and running smoothly with Momentum’s project pages. Create milestones, set deadlines, and upload essential files. Both you and your clients can access these pages to monitor progress and ensure alignment.",
    content2:
      "Optional features—such as live chat for real-time collaboration, file uploads for resource sharing, and a color palette for project theming (ideal for visual work like posters or websites)—can be activated at no additional cost on a per-project basis to avoid unnecessary dashboard clutter.",
    image: ["/project.png", "/features.png"],
  },
  projectFeatures: {
    title: "Project Dashboard Features",
    content:
      "Live chat: Enable real-time communication with your clients directly within each project. This optional feature keeps collaboration seamless and focused while eliminating the need for external messaging tools.",
    content2:
      "File uploads: Share important resources effortlessly by uploading up to 10 files per project, with a maximum file size of 5MB each. This feature ensures all relevant documents and materials are accessible in one place, making project management more efficient.",
    content3:
      "Color theme picker: Clients can customize the color scheme of their projects to match their branding or personal preferences.",
    content4:
      "All optional features are free to enable and can be activated only when needed, ensuring your workspace stays clean and uncluttered. Momentum gives you complete flexibility to tailor projects to your workflow without additional charges.",
    image: ["/chat.png", "/uploads.png", "/palette.png"],
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
            {sections[activeSection].content4 && (
              <p className="text-lg text-justify sm:text-left leading-7 my-4">
                {sections[activeSection].content4}
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
