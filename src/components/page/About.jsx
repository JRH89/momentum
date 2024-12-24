import Link from "next/link";

const pageData = {
  title: "Simplify Project Management with Momentum HQ",
  intro:
    "Streamline your workflow with Momentum HQ. Sign up today to unlock powerful tools that help you manage projects, track progress, and handle invoicing with ease—all in one place.",
  buyNowLink: {
    text: "Get Started Now",
    href: "/Signup",
  },
  whatIs: {
    title: "What is Momentum HQ?",
    content:
      "Momentum HQ is a comprehensive project management platform designed to help businesses and teams stay organized and productive. With integrated tools for creating and tracking projects, setting milestones, managing customers, and sending invoices through Stripe, Momentum HQ ensures everything you need is in one place.",
  },
  keyFeatures: {
    title: "Key Features",
    features: [
      "Stripe Integration: Effortlessly manage customer subscriptions, send invoices, and track payments.",
      "Customer Management: Sync customers in real-time and create new ones directly in the platform.",
      "Project Creation: Build and manage projects with custom milestones and deadlines.",
      "Progress Tracking: Visualize project progress with detailed dashboards and reports.",
      "Task Management: Break down milestones into tasks and assign them to team members.",
      "Team Collaboration: Share updates, assign roles, and work together seamlessly.",
      "Real-Time Notifications: Stay informed with updates on tasks, milestones, and payments.",
      "Performance Analytics: Get insights into project timelines, budgets, and team efficiency.",
      "Custom Workflows: Tailor project stages and workflows to suit your team’s needs.",
      "Document Sharing: Upload and share files directly within projects.",
      "Invoice Automation: Generate and send invoices automatically based on project milestones.",
      "Role-Based Permissions: Control access to projects and tasks with customizable user roles.",
      "Cloud Sync: Ensure your data is secure and accessible from anywhere.",
    ],
  },
  technology: {
    title: "Technology Behind Momentum HQ",
    content:
      "Momentum HQ is built using cutting-edge technologies to deliver a reliable, secure, and scalable solution for project management.",
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
    title: "How to Use Momentum HQ",
    steps: [
      "Step 1: Sign Up - Create an account and log in to your personalized dashboard.",
      "Step 2: Connect your Stripe Account - Connect your Stripe account to start managing customers and sending invoices.",
      "Step 3: Create a Project - Define project details, set milestones, and assign team members.",
      "Step 4: Track Progress - Monitor milestones and tasks with real-time updates.",
      "Step 5: Send Invoices - Automatically generate and send invoices via Stripe as milestones are completed.",
    ],
  },
  benefits: {
    title: "Why Choose Momentum HQ?",
    points: [
      "Streamlined Workflow: Manage projects, customers, and invoices in one place.",
      "Real-Time Insights: Keep track of progress and budgets with detailed analytics.",
      "Integrated Payments: Save time with automated Stripe invoicing and payment tracking.",
      "Team Collaboration: Enhance productivity with tools for assigning tasks and sharing updates.",
      "Customizable Workflows: Adapt the platform to match your team’s unique processes.",
    ],
  },
  faq: {
    title: "Frequently Asked Questions (FAQ)",
    questions: [
      {
        question: "How do I integrate Stripe with Momentum HQ?",
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
          "Absolutely. Momentum HQ uses industry-standard security measures to protect your data.",
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
      <div className="min-h-screen h-full flex flex-col items-center justify-center py-8 pt-36 sm:pb-24 px-4 sm:px-6 lg:px-8 text-black max-w-6xl mx-auto w-full">
        <div className="w-full space-y-8">
          <div className="text-left">
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
          <div className="rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">
              {pageData.whatIs.title}
            </h2>
            <p className="text-lg leading-6 mb-6">{pageData.whatIs.content}</p>
            <h2 className="text-2xl font-semibold mb-4">
              {pageData.keyFeatures.title}
            </h2>
            <ul className="list-disc ml-6 text-lg leading-6 mb-6">
              {pageData.keyFeatures.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
            <h2 className="text-2xl font-semibold mb-4">
              {pageData.technology.title}
            </h2>
            <p className="text-lg leading-6 mb-4">
              {pageData.technology.content}
            </p>
            <ul className="list-disc ml-6 text-lg leading-6 mb-6">
              {pageData.technology.technologies.map((tech, index) => (
                <li key={index}>{tech}</li>
              ))}
            </ul>
            <Link
              className="py-2 text-black font-semibold cursor-pointer hover:shadow-lg hover:shadow-black shadow-md shadow-black duration-300 mb-8 bg-confirm px-4 rounded inline-block"
              href={pageData.buyNowLink.href}
            >
              {pageData.buyNowLink.text}
            </Link>
            <h2 className="text-2xl font-semibold mb-4">
              {pageData.howToUse.title}
            </h2>
            {pageData.howToUse.steps.map((step, index) => (
              <p key={index} className="text-lg leading-6 mb-6">
                {step}
              </p>
            ))}
            <h2 className="text-2xl font-semibold mb-4">
              {pageData.benefits.title}
            </h2>
            <ul className="list-disc ml-6 text-lg leading-6 mb-6">
              {pageData.benefits.points.map((point, index) => (
                <li key={index}>{point}</li>
              ))}
            </ul>
            <h2 className="text-2xl font-semibold mb-4">
              {pageData.faq.title}
            </h2>
            {pageData.faq.questions.map((q, index) => (
              <div key={index} className="mb-6">
                <h3 className="text-xl font-semibold mb-2">{q.question}</h3>
                <p className="text-lg leading-6 mb-6">
                  {q.answer}
                  {q.linkText && (
                    <Link
                      className="text-destructive font-bold cursor-pointer hover:opacity-80 duration-300"
                      href={q.linkHref}
                    >
                      {q.linkText}
                    </Link>
                  )}
                </p>
              </div>
            ))}
          </div>
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
