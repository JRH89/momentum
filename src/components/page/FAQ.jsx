'use client'

import { Minus, Plus } from 'lucide-react'
import { useState } from 'react'
import { twMerge } from 'tailwind-merge'

const pageData = {
    faqItems: [
        {
            question: "What is GrowthMaster?",
            answer: "GrowthMaster is a versatile toolkit designed to enhance your business operations. It integrates with various services for payments, data management, and real-time notifications. GrowthMaster includes pre-built dashboards, customizable email templates, user management features, and is optimized for performance and SEO."
        },
        {
            question: "What are the main features of GrowthMaster?",
            answer: "GrowthMaster offers a comprehensive set of features, including seamless payment integration with ZebraPay, real-time data management with Nimbus, customizable email campaigns with SendGrid, a robust support ticket system, a built-in announcement tool, a pre-designed user and admin dashboard, SEO optimization, and webhook automation for data synchronization."
        },
        {
            question: "How do I get started with GrowthMaster?",
            answer: "To get started, sign up and download GrowthMaster from our website. Follow the setup guide included in the documentation to install dependencies, configure settings, and start building your application."
        },
        {
            question: "Can I customize the dashboards?",
            answer: "Absolutely! The dashboards in GrowthMaster are fully customizable. You can adjust the layout and functionality to meet your specific needs, whether you need to track user activity or manage subscriptions."
        },
        {
            question: "How does GrowthMaster handle SEO?",
            answer: "GrowthMaster includes built-in SEO optimization features, such as meta tags and content structuring, to improve your application's visibility in search engine results. It also supports automatic sitemap generation to aid in search engine indexing."
        },
    ]
}

const FAQItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-gray-300 bg-opacity-0 p-5 sm:px-10 max-w-6xl w-full mx-auto">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full text-left flex justify-between items-center focus:outline-none">
                <span className="font-semibold text-lg sm:text-xl">{question}</span>
                <span className={twMerge("ml-2 text-confirm", isOpen && "text-destructive")}>
                    {isOpen ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                </span>
            </button>
            {isOpen && <p className="mt-2 text-black text-base sm:text-lg">{answer}</p>}
        </div>
    )
}

export default function FAQ() {
    const { faqItems } = pageData;

    return (
        <div id="faq" className="mx-auto pt-5 min-h-screen h-full w-full flex flex-col text-black ">
            <h2 className="section-title mb-5">
                Frequently Asked Questions
            </h2>
            {faqItems.map((item, index) => (
                <FAQItem key={index} question={item.question} answer={item.answer} />
            ))}
        </div>
    )
}
