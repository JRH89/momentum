import Link from 'next/link';

const pageData = {
    title: "The Ultimate Tool for Growth",
    intro: "Sign up today and start leveraging our powerful tools. Begin for free, then choose a plan to unlock advanced features and take your application live.",
    buyNowLink: {
        text: "Start Your Journey",
        href: "/Signup",
    },
    whatIs: {
        title: "What is GrowthMaster?",
        content: "GrowthMaster is a dynamic toolkit designed to supercharge your business growth. It integrates effortlessly with payment systems, data storage solutions, and real-time notifications. With GrowthMaster, you get pre-built dashboards, customizable email campaigns, user management, support systems, announcement tools, and more—all optimized for peak performance and SEO."
    },
    keyFeatures: {
        title: "Key Features",
        features: [
            "ZebraPay Integration: Effortlessly handle transactions and manage subscriptions with ZebraPay.",
            "Nimbus Data: Manage user authentication and data storage seamlessly with Nimbus.",
            "Echo Notifications: Enhance user experience with real-time Echo Alerts.",
            "User-Friendly Dashboard: Monitor user activities and manage subscriptions easily with a pre-built dashboard.",
            "SEO Enhancement: Boost your application's visibility with built-in SEO optimization.",
            "Real-Time Syncing: Keep your data accurate with automatic synchronization between payment and data storage services.",
            "Update Broadcasts: Keep your users informed with a built-in announcement system.",
            "Support Suite: Manage user queries and issues with an integrated support ticket system.",
            "Custom Authentication: Streamline user onboarding with pre-built authentication components.",
            "Subscription Tools: Manage user subscriptions efficiently with built-in tools.",
            "Webhook Automation: Integrate external services seamlessly with automated webhook management.",
            "Role Management: Customize user roles and permissions to suit your application.",
            "Insightful Analytics: Track user behavior and system performance with a built-in analytics dashboard.",
            "Performance Tweaks: Ensure your application runs smoothly with built-in performance optimizations."
        ]
    },
    technology: {
        title: "Technology Behind GrowthMaster",
        content: "GrowthMaster is built on modern, scalable technologies that ensure your application is reliable, secure, and ready for growth.",
        technologies: [
            "JavaScript, TypeScript, and React: A responsive and dynamic front-end built with JavaScript, TypeScript, and React.",
            "Next.js: Leverage server-side rendering and static site generation with Next.js for the backend.",
            "Nimbus: Real-time data storage and authentication powered by Nimbus.",
            "ZebraPay: Secure payment processing and subscription management with ZebraPay.",
            "SendGrid: Seamless email and marketing automation with SendGrid.",
            "Echo Alerts: Real-time notifications to enhance user engagement.",
            "Vercel Analytics: Optimize performance with integrated analytics tools.",
            "Vercel Speed Insights: Ensure fast load times and smooth performance.",
            "tailwindcss: Rapidly build custom UIs with TailwindCSS.",
            "Framer Motion: Create interactive and responsive UIs with Framer Motion."
        ]
    },
    howToUse: {
        title: "How to Use GrowthMaster",
        steps: [
            "Step 1: Environment Setup - Install dependencies and configure your environment using the provided setup guide.",
            "Step 2: Customize Interface - Tailor the pre-built components and dashboard to match your application’s requirements.",
            "Step 3: Develop Your App - Add the necessary features and build your application.",
            "Step 4: Deploy & Test - Deploy your app and test the payment and authentication features to ensure everything works correctly.",
            "Step 5: Grow Your Business!"
        ]
    },
    benefits: {
        title: "Why GrowthMaster Stands Out",
        points: [
            "Accelerated Development: Kickstart your project with a ready-made toolkit, allowing you to focus on unique features.",
            "Seamless Integrations: Built-in integrations with key services streamline your development process.",
            "Enhanced UX: Use real-time notifications to keep users informed and engaged.",
            "SEO-Friendly: Ensure your application reaches its audience with SEO optimizations.",
            "Reliable Data Management: Keep user data synchronized across all systems with real-time syncing."
        ]
    },
    faq: {
        title: "Frequently Asked Questions (FAQ)",
        questions: [
            {
                question: "How do I integrate GrowthMaster into my app?",
                answer: "Integration is simple—just follow the setup guide to configure payment, data storage, email services, and more ",
                linkText: "here",
                linkHref: "https://growthmaster-docs.com"
            },
            {
                question: "Is my data secure with GrowthMaster?",
                answer: "Absolutely. GrowthMaster uses industry-standard practices for secure data storage and user authentication."
            },
            {
                question: "Can I customize the dashboards?",
                answer: "Yes! The dashboards are fully customizable to meet the specific needs of your application."
            },
            {
                question: "How does GrowthMaster benefit my project?",
                answer: "GrowthMaster provides essential features out-of-the-box, allowing you to focus on your application’s unique value proposition."
            },
            {
                question: "Where can I get help?",
                answer: "Support is available through our documentation and customer service team. Reach out to us ",
                linkText: "here",
                linkHref: "mailto:support@growthmaster.com"
            }
        ]
    }
};


export default function About() {
    return (
        <>
            <div className="min-h-screen h-full flex flex-col items-center justify-center py-8 sm:pb-24 px-4 sm:px-6 lg:px-8 text-black max-w-6xl mx-auto w-full">
                <div className="w-full space-y-8">
                    <div className="text-left">
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
                            {pageData.title}
                        </h1>
                        <p className="mt-4 text-lg leading-6 text-justify">
                            {pageData.intro}
                        </p>
                        <Link className="py-2 text-black font-semibold cursor-pointer hover:shadow-lg hover:shadow-black shadow-md shadow-black duration-300 mt-8 bg-confirm px-4 rounded inline-block" href={pageData.buyNowLink.href}>
                            {pageData.buyNowLink.text}
                        </Link>
                    </div>
                    <div className="rounded-lg">
                        <h2 className="text-2xl font-semibold mb-4">{pageData.whatIs.title}</h2>
                        <p className="text-lg leading-6 mb-6">{pageData.whatIs.content}</p>
                        <h2 className="text-2xl font-semibold mb-4">{pageData.keyFeatures.title}</h2>
                        <ul className="list-disc ml-6 text-lg leading-6 mb-6">
                            {pageData.keyFeatures.features.map((feature, index) => (
                                <li key={index}>{feature}</li>
                            ))}
                        </ul>
                        <h2 className="text-2xl font-semibold mb-4">{pageData.technology.title}</h2>
                        <p className="text-lg leading-6 mb-4">{pageData.technology.content}</p>
                        <ul className="list-disc ml-6 text-lg leading-6 mb-6">
                            {pageData.technology.technologies.map((tech, index) => (
                                <li key={index}>{tech}</li>
                            ))}
                        </ul>
                        <Link className="py-2 text-black font-semibold cursor-pointer hover:shadow-lg hover:shadow-black shadow-md shadow-black duration-300 mb-8 bg-confirm px-4 rounded inline-block" href={pageData.buyNowLink.href}>
                            {pageData.buyNowLink.text}
                        </Link>
                        <h2 className="text-2xl font-semibold mb-4">{pageData.howToUse.title}</h2>
                        {pageData.howToUse.steps.map((step, index) => (
                            <p key={index} className="text-lg leading-6 mb-6">{step}</p>
                        ))}
                        <h2 className="text-2xl font-semibold mb-4">{pageData.benefits.title}</h2>
                        <ul className="list-disc ml-6 text-lg leading-6 mb-6">
                            {pageData.benefits.points.map((point, index) => (
                                <li key={index}>{point}</li>
                            ))}
                        </ul>
                        <h2 className="text-2xl font-semibold mb-4">{pageData.faq.title}</h2>
                        {pageData.faq.questions.map((q, index) => (
                            <div key={index} className="mb-6">
                                <h3 className="text-xl font-semibold mb-2">{q.question}</h3>
                                <p className="text-lg leading-6 mb-6">
                                    {q.answer}
                                    {q.linkText && (
                                        <Link className="text-destructive font-bold cursor-pointer hover:opacity-80 duration-300" href={q.linkHref}>
                                            {q.linkText}
                                        </Link>
                                    )}
                                </p>
                            </div>
                        ))}
                    </div>
                    <Link className="py-2 text-black font-semibold cursor-pointer hover:shadow-lg hover:shadow-black shadow-md shadow-black duration-300 mt-8 bg-confirm px-4 rounded inline-block" href={pageData.buyNowLink.href}>
                        {pageData.buyNowLink.text}
                    </Link>
                </div>
            </div>
        </>
    );
}
