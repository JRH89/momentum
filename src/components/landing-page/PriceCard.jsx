"use client";

import CheckIcon from "../../assets/check.svg";
import { twMerge } from "tailwind-merge";
import { motion } from "framer-motion";
import Link from "next/link";

// Page Data
const pageData = {
  tag: "A plan for every budget",
  title: "Pricing",
  description:
    "We offer generous pricing plans to fit any budget. Choose the one that works best for you.",
};

// Pricing Data
const pricingTiers = [
  {
    title: "Pro",
    monthlyPrice: 8.99,
    buttonText: "Sign up now",
    popular: false,
    inverse: true,
    features: [
      "Unlimited Projects",
      "Stripe Integration",
      "Customer Management",
      "Project Creation",
      "Progress Tracking",
      "Task Management",
    ],
    url: "/Signup",
    cycle: "/ month",
  },
  {
    title: "Business",
    monthlyPrice: 75.0,
    buttonText: "Sign up now",
    popular: true,
    inverse: true,
    features: [
      "Unlimited Projects",
      "Stripe Integration",
      "Customer Management",
      "Project Creation",
      "Progress Tracking",
      "Task Management",
    ],
    url: "/Signup",
    cycle: "/ year",
  },
];

export const PriceCard = () => {
  return (
    <section
      id="price"
      className="relative min-h-screen flex flex-col items-center justify-center bg-center bg-fixed bg-cover bg-no-repeat"
      style={{
        backgroundImage: 'url("/image-5.png")',
      }}
    >
      <div className="absolute inset-0 bg-white bg-opacity-90"></div>
      <div className="relative z-10 text-left max-w-7xl p-8 ">
        <div className="section-heading">
          <h2 className="section-title">{pageData.title}</h2>
          <p className="section-description mt-5">{pageData.description}</p>
        </div>
        <div className="flex flex-col gap-6 items-center mt-5 lg:flex-row lg:items-end lg:justify-center px-5">
          {pricingTiers.map((tier, index) => (
            <div
              key={index}
              className={twMerge(
                tier.inverse &&
                  "p-6 pb-8 rounded-xl border-black bg-black text-white shadow-md shadow-black"
              )}
            >
              <div className="flex justify-between">
                <h3
                  className={twMerge(
                    "text-lg font-bold text-black/50",
                    tier.inverse && "text-white/60"
                  )}
                >
                  {tier.title}
                </h3>
                {tier.popular && (
                  <div className="inline-flex text-sm px-4 py-1.5 rounded-xl border border-white/20">
                    <motion.span
                      animate={{ backgroundPositionX: "100%" }}
                      transition={{
                        repeat: Infinity,
                        ease: "linear",
                        repeatType: "loop",
                        duration: 1,
                      }}
                      className="bg-[linear-gradient(to_right,#DD7DDF,#E1CD86,#BBCB92,#71C2EF,#3BFFFF,#DD7DDF,#E1CD86,#BBCB92,#71C2EF,#3BFFFF)] [background-size:200%] text-transparent bg-clip-text font-semibold"
                    >
                      Popular
                    </motion.span>
                  </div>
                )}
              </div>
              <div className="flex  justify-center items-baseline gap-1 mt-[30px]">
                <span className="text-5xl font-bold tracking-tighter leading-none">
                  ${tier.monthlyPrice}
                </span>
                <span
                  className={twMerge(
                    "tracking-tight font-bold text-black/50",
                    tier.inverse && "text-white/60"
                  )}
                >
                  {tier.cycle}
                </span>
              </div>
              <Link
                href={tier.url}
                className={twMerge(
                  "btn btn-primary w-full mt-[30px] justify-center hover:opacity-60 duration-300 font-semibold",
                  tier.inverse && "bg-white text-black"
                )}
              >
                {tier.buttonText}
              </Link>
              <ul className="flex flex-col w-full gap-2 mt-8 sm:grid sm:grid-cols-2">
                {tier.features.map((feature, featureIndex) => (
                  <li
                    key={featureIndex}
                    className="capitalize text-sm flex items-center gap-1"
                  >
                    <CheckIcon className="w-6 h-6 text-destructive" />
                    <span className="text-confirm font-medium flex-1">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
