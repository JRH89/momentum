"use client";

import CheckIcon from "../../assets/check.svg";
import { twMerge } from "tailwind-merge";
import { motion } from "framer-motion";
import Link from "next/link";
import { CircleCheckIcon, ExternalLink } from "lucide-react";

// Page Data
const pageData = {
  tag: "Pricing",
  title: "Affordable Plans",
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
      "Unlimited Invoices",
      "Unlimited Customers",
      "Project Creation",
      "Milestone Tracking",
      "Stripe Integration",
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
      "Unlimited Invoices",
      "Unlimited Customers",
      "Project Creation",
      "Milestone Tracking",
      "Stripe Integration",
    ],
    url: "/Signup",
    cycle: "/ year",
  },
];

export const PriceCard = () => {
  return (
    <section
      id="price"
      className="relative pb-6 min-h-screen flex flex-col items-center justify-center bg-center bg-fixed bg-cover bg-no-repeat"
      style={{
        backgroundImage: 'url("/image-2.png")',
        backgroundPosition: "center 25%",
      }}
    >
      <div className="absolute inset-0 bg-white bg-opacity-95"></div>
      <div className="relative flex flex-col py-24 z-10 text-left max-w-7xl p-8">
        <div className="section-heading w-full mx-auto flex flex-col">
          <div className="tag mx-auto justify-center w-auto text-destructive text-sm sm:text-md md:text-lg lg:text-xl">
            {pageData.tag}
          </div>
          <h2 className="section-title mt-5">{pageData.title}</h2>
          <p className="section-description mt-5">{pageData.description}</p>
        </div>
        <div className="flex flex-col gap-6 items-center mt-5 sm:flex-row sm:items-end sm:justify-center ">
          {pricingTiers.map((tier, index) => (
            <div
              key={index}
              className={twMerge(
                tier.inverse &&
                  "p-6 pb-8 rounded-xl bg-white text-black border-2 border-black shadow-md w-full shadow-black"
              )}
            >
              <div className="flex justify-between">
                <h3
                  className={twMerge(
                    "text-lg font-bold text-black/50 pt-2",
                    tier.inverse && "text-black/60"
                  )}
                >
                  {tier.title}
                </h3>
                {tier.popular && (
                  <div className="inline-flex bg-black text-sm px-4 py-1.5 rounded-xl border border-black/20">
                    <motion.span
                      animate={{ backgroundPositionX: "100%" }}
                      transition={{
                        repeat: Infinity,
                        ease: "linear",
                        repeatType: "loop",
                        duration: 3,
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
                    tier.inverse && "text-black/80"
                  )}
                >
                  {tier.cycle}
                </span>
              </div>
              <span className="text-center mx-auto justify-center items-center flex flex-row text-gray-600 text-xs mt-1">
                ( + {"  "}
                <span className="flex ml-1 flex-row items-center">
                  {" "}
                  Stripe fees
                  <a
                    className="text-green-500 cursor-pointer underline flex items-center gap-1"
                    href="https://stripe.com/pricing?utm_campaign=AMER_US_en_Google_Search_Brand_Pricing_EXA_PHR-21345170790&utm_medium=cpc&utm_source=google&ad_content=701359366946&utm_term=stripe%20fees&utm_matchtype=e&utm_adposition=&utm_device=c&gad_source=1&gclid=CjwKCAiAtNK8BhBBEiwA8wVt98_7_ktBp9hQGlAiZbnMUuMr82O2-7aWjfXFV5dH_j-_O3ihj8VKhRoC1MEQAvD_BwE"
                    target="_blank"
                  >
                    <ExternalLink className="inline w-3 h-3 ml-1" />
                  </a>
                </span>
                )
              </span>
              <Link
                href={tier.url}
                className={twMerge(
                  "btn btn-primary w-full mt-[30px] justify-center hover:shadow-lg hover:shadow-black duration-300 font-semibold",
                  tier.inverse &&
                    "bg-confirm shadow-md shadow-black border-2 border-black text-black"
                )}
              >
                {tier.buttonText}
              </Link>
              <ul className="flex flex-col w-full gap-2 mt-8 lg:grid lg:grid-cols-2">
                {tier.features.map((feature, featureIndex) => (
                  <li
                    key={featureIndex}
                    className="capitalize text-lg flex items-center gap-1 py-1"
                  >
                    <CircleCheckIcon className="text-white w-5 h-5 bg-destructive rounded-full shadow-md shadow-black" />
                    <span className="text-black font-medium flex-1">
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
