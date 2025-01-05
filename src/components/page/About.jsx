import Link from "next/link";

const pageData = {
  title: "Simplify Project Management with Momentum",
  intro:
    "Streamline your workflow with Momentum. Sign up today to unlock powerful tools that help you manage projects, track progress, and handle invoicing with ease—all in one place.",
  buyNowLink: {
    text: "Get Started Now",
    href: "/Signup",
  },
  whatIs: {
    title: "What is Momentum?",
    content:
      "Momentum is a comprehensive project management platform designed to help businesses and teams stay organized and productive. With integrated tools for creating and tracking projects, setting milestones, managing customers, and sending invoices through Stripe, Momentum ensures everything you need is in one place.",
  },
  keyFeatures: {
    title: "Key Features",
    features: [
      "Stripe Integration: Effortlessly manage customer subscriptions, send invoices, and track payments.",
      "Customer Management: Sync customers in real-time and create new ones directly in the platform.",
      "Project Creation: Build and manage projects with custom milestones and deadlines.",
      "Progress Tracking: Visualize project progress with detailed dashboards and reports.",
      "Document Sharing: Upload and share files directly within projects.",
      "Cloud Sync: Ensure your data is secure and accessible from anywhere.",
    ],
  },
  technology: {
    title: "Technology Behind Momentum",
    content:
      "Momentum is built using secure and modern technologies to deliver a reliable, secure, and scalable solution for project management.",
    technologies: [
      "JavaScript, TypeScript, and React: Responsive and dynamic user interfaces.",
      "Next.js: Server-side rendering and static site generation for optimized performance.",
      "Stripe API: Seamless payment processing and invoicing integration.",
      "Firebase: Real-time database and authentication for secure user management.",
      "TailwindCSS: Rapid and efficient custom UI development.",
      "Vercel Hosting: Reliable and scalable cloud hosting for fast deployment.",
      "Framer Motion: Intuitive animations for a modern and engaging experience.",
    ],
  },
  howToUse: {
    title: "How to Use Momentum",
    steps: [
      "Step 1: Sign Up - Create an account and log in to your personalized dashboard.",
      "Step 2: Connect your Stripe Account - Connect your Stripe account to start managing customers and sending invoices.",
      "Step 3: Create a Project - Define project details, set milestones, and more.",
      "Step 4: Track Progress - Monitor milestones and tasks with real-time updates.",
    ],
  },
  benefits: {
    title: "Why Choose Momentum?",
    points: [
      "Streamlined Workflow: Manage projects, customers, and invoices in one place.",
      "Integrated Payments: Save time with integrated Stripe invoicing and payment tracking.",
      "Customer Dashboard: Let your customers to stay updated on projects and pay invoices directly from your platform.",
    ],
  },
  faq: {
    title: "Frequently Asked Questions (FAQ)",
    questions: [
      {
        question: "How do I integrate Stripe with Momentum?",
        answer:
          "Simply connect your Stripe account through the settings panel to start managing customers and sending invoices.",
      },
      {
        question: "Can I assign tasks to team members?",
        answer:
          "Yes, you can assign specific tasks to team members and track their progress directly within the platform.",
      },
      {
        question: "Is my data secure?",
        answer:
          "Absolutely. Momentum uses industry-standard security measures to protect your data.",
      },
      {
        question: "Can I customize project workflows?",
        answer:
          "Yes! You can define custom workflows to match your team’s unique processes.",
      },
      {
        question: "Where can I get support?",
        answer:
          "Support is available through our documentation and customer service team. Reach out to us ",
        linkText: "here",
        linkHref: "mailto:hookerhillstudios@gmail.com",
      },
    ],
  },
};

export default function About() {
  return (
    <>
      <div className="min-h-screen h-full flex flex-col items-center justify-start py-8 pt-36 sm:pb-24 px-4 sm:px-6 lg:px-8 text-black max-w-6xl mx-auto w-full">
        <div className="w-full space-y-8">
          {/* Header Section */}
          <div className="w-full text-left">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
              {pageData.title}
            </h1>
            <p className="mt-4 text-lg leading-6 text-justify">
              {pageData.intro}
            </p>
            <Link
              className="py-2 text-black font-semibold cursor-pointer hover:shadow-lg hover:shadow-black shadow-md shadow-black duration-300 mt-8 bg-confirm px-4 rounded inline-block"
              href={pageData.buyNowLink.href}
            >
              {pageData.buyNowLink.text}
            </Link>
          </div>

          {/* What is Momentum Section */}
          <section className="rounded-lg space-y-6">
            <h2 className="text-2xl font-semibold mb-4">
              {pageData.whatIs.title}
            </h2>
            <p className="text-lg leading-6">{pageData.whatIs.content}</p>
          </section>

          {/* Key Features Section */}
          <section className="rounded-lg space-y-6">
            <h2 className="text-2xl font-semibold mb-4">
              {pageData.keyFeatures.title}
            </h2>
            <ul className="list-disc ml-6 text-lg leading-6">
              {pageData.keyFeatures.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </section>

          {/* Technology Section */}
          {/* <section className="rounded-lg space-y-6">
            <h2 className="text-2xl font-semibold mb-4">
              {pageData.technology.title}
            </h2>
            <p className="text-lg leading-6">{pageData.technology.content}</p>
            <ul className="list-disc ml-6 text-lg leading-6">
              {pageData.technology.technologies.map((tech, index) => (
                <li key={index}>{tech}</li>
              ))}
            </ul>
          </section> */}

          {/* Call-to-Action Section */}
          <Link
            className="py-2 text-black font-semibold cursor-pointer hover:shadow-lg hover:shadow-black shadow-md shadow-black duration-300 mb-8 bg-confirm px-4 rounded inline-block"
            href={pageData.buyNowLink.href}
          >
            {pageData.buyNowLink.text}
          </Link>

          {/* How to Use Section */}
          <section className="rounded-lg space-y-6">
            <h2 className="text-2xl font-semibold mb-4">
              {pageData.howToUse.title}
            </h2>
            {pageData.howToUse.steps.map((step, index) => (
              <p key={index} className="text-lg leading-6 mb-6">
                {step}
              </p>
            ))}
          </section>

          {/* Benefits Section */}
          <section className="rounded-lg space-y-6">
            <h2 className="text-2xl font-semibold mb-4">
              {pageData.benefits.title}
            </h2>
            <ul className="list-disc ml-6 text-lg leading-6">
              {pageData.benefits.points.map((point, index) => (
                <li key={index}>{point}</li>
              ))}
            </ul>
          </section>

          <section className="rounded-lg space-y-6">
            <h2 className="text-2xl font-semibold mb-4">
              {pageData.faq.title}
            </h2>
            {pageData.faq.questions.map((q, index) => (
              <div key={index} className="mb-6">
                {/* Native HTML <details> and <summary> for dropdown functionality */}
                <details className="group">
                  <summary className="cursor-pointer text-xl font-semibold mb-2 flex justify-between items-center">
                    {q.question}
                    <span className="text-xl group-open:hidden">+</span>
                    <span className="text-xl group-open:block hidden">
                      -
                    </span>{" "}
                    {/* Show "-" when open */}
                  </summary>
                  <div className="text-lg leading-6 mb-6">
                    {q.answer}
                    {q.linkText && (
                      <Link
                        className="text-destructive font-bold cursor-pointer hover:opacity-80 duration-300"
                        href={q.linkHref}
                      >
                        {q.linkText}
                      </Link>
                    )}
                  </div>
                </details>
              </div>
            ))}
          </section>

          {/* Final Call-to-Action */}
          <Link
            className="py-2 text-black font-semibold cursor-pointer hover:shadow-lg hover:shadow-black shadow-md shadow-black duration-300 mt-8 bg-confirm px-4 rounded inline-block"
            href={pageData.buyNowLink.href}
          >
            {pageData.buyNowLink.text}
          </Link>
        </div>
      </div>
    </>
  );
}
