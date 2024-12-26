"use client";

import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import { twMerge } from "tailwind-merge";

const pageData = {
  faqItems: [
    {
      question: "What is Momentum?",
      answer:
        "Momentum is a streamlined project management platform designed to empower freelancers and small businesses. It centralizes project tracking, milestone management, and resource organization while offering tools to enhance team collaboration and efficiency.",
    },
    {
      question: "What are the main features of Momentum?",
      answer:
        "Momentum provides powerful tools, including project creation and tracking, milestone management, real-time progress monitoring, a customizable project dashboard, integrated budget tracking, and intuitive task assignment features to keep your projects on track.",
    },
    {
      question: "How do I get started with Momentum?",
      answer:
        "Getting started with Momentum is simple. Sign up on our website, explore the setup guide in the documentation, and start creating your first project. With an intuitive interface, you'll be up and running in no time.",
    },
    {
      question: "Can I customize the dashboards in Momentum?",
      answer:
        "Yes! Momentum’s dashboards are fully customizable, allowing you to adjust layouts and widgets to match your workflow. Tailor the platform to track the metrics and tasks that matter most to you.",
    },
    {
      question: "How does Momentum help with team collaboration?",
      answer:
        "Momentum enhances collaboration by providing a centralized platform for task assignments, real-time progress updates, and resource sharing. Keep everyone on the same page with clear communication and milestone tracking.",
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
      <h2 className="section-title mb-5">Frequently Asked Questions</h2>
      {faqItems.map((item, index) => (
        <FAQItem key={index} question={item.question} answer={item.answer} />
      ))}
    </div>
  );
}
