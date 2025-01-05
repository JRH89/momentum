"use client";

import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import { twMerge } from "tailwind-merge";

const pageData = {
  faqItems: [
    {
      question: "Is Stripe required to use Momentum?",
      answer:
        "Yes, Stripe is required for payment processing. However, if you don't have a Stripe account, don't worry! You can still connect your account to Stripe and create a new one directly within the platform during the sign-up process. Stripe accounts are free to create and you only pay for the services you use (i.e. processing paid invoices @ 0.4%).",
    },
    {
      question: "What is the pricing for Momentum?",
      answer:
        "Momentum is priced at $8.99 per month or $75 per year. This includes unlimited projects, invoices, and more. You can send invoices, track payments, and create as many projects as needed, all while keeping everything organized in one place.",
    },
    {
      question: "What features are included with my Momentum subscription?",
      answer:
        "With your Momentum subscription, you'll have access to unlimited project creation, customizable project dashboards, invoice management, and real-time progress tracking. You can also send invoices, track payments, and easily collaborate with clients by sharing project details and updates.",
    },
    {
      question: "Can I manage client projects and invoices?",
      answer:
        "Absolutely! Momentum allows you to manage all your client projects in one place, including creating, tracking, and organizing milestones. You can send invoices directly to your clients, track payments, and ensure that everything stays up to date.",
    },
    {
      question: "How can my clients interact with the project?",
      answer:
        "Your clients can view a personalized dashboard where they can track project progress, see completed milestones, and stay up to date on what's next. They can also upload files related to the project, making collaboration simple and efficient.",
    },
  ],
};

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-300 bg-opacity-0 p-5 sm:px-10 max-w-6xl w-full mx-auto">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left flex justify-between items-center focus:outline-none"
      >
        <span className="font-semibold text-lg sm:text-xl">{question}</span>
        <span
          className={twMerge("ml-2 text-confirm", isOpen && "text-destructive")}
        >
          {isOpen ? (
            <Minus className="w-5 h-5" />
          ) : (
            <Plus className="w-5 h-5" />
          )}
        </span>
      </button>
      {isOpen && (
        <p className="mt-2 text-black text-base sm:text-lg">{answer}</p>
      )}
    </div>
  );
};

export default function FAQ() {
  const { faqItems } = pageData;

  return (
    <div
      id="faq"
      className="mx-auto min-h-screen h-full w-full flex flex-col text-black pt-32"
    >
      <h2 className="text-2xl text-center sm:text-3xl md:text-4xl font-bold">
        Frequently Asked Questions
      </h2>
      <div className="mt-10">
        {faqItems.map((item, index) => (
          <FAQItem key={index} question={item.question} answer={item.answer} />
        ))}
      </div>
    </div>
  );
}
