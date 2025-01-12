"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { getCheckoutUrl } from "../payments/account/StripePayments";
import { initFirebase } from "../../../firebase";
import { useAuth } from "../../context/AuthProvider";
import { useEffect } from "react";

// Pricing Plan Data
const pricingPlans = [
  {
    title: "Monthly",
    price: process.env.NEXT_PUBLIC_MONTHLY_PRICE,
    description: "Unlimited projects. Analytics.",
    isPopular: false,
    url: null, // Will be generated dynamically
    features: ["Unlimited projects", "Full analytics", "24/7 support"],
    priceId: process.env.NEXT_PUBLIC_MONTHLY_PRICE_ID,
  },
  {
    title: "Yearly",
    price: process.env.NEXT_PUBLIC_YEARLY_PRICE,
    description: "Save 15%!",
    isPopular: true,
    url: null, // Will be generated dynamically
    features: ["Unlimited projects", "Full analytics", "24/7 support"],
    priceId: process.env.NEXT_PUBLIC_YEARLY_PRICE_ID,
  },
];

const SubscriptionSection = () => {
  const { user } = useAuth();

  const router = useRouter();
  const app = initFirebase();

  const [loadingPlanIndex, setLoadingPlanIndex] = useState(null); // Track the index of the loading plan

  const handleCheckout = async (priceId, index) => {
    if (priceId) {
      setLoadingPlanIndex(index); // Set the loading plan index when the button is clicked
      try {
        const checkoutUrl = await getCheckoutUrl(app, priceId);
        router.push(checkoutUrl);
      } catch (error) {
        console.error("Error creating checkout session:", error);
      } finally {
        setLoadingPlanIndex(null); // Reset loading state after process finishes
      }
    }
  };

  const handleClick = (url, priceId, index) => {
    if (url === null && priceId !== null) {
      handleCheckout(priceId, index); // Trigger Stripe checkout session for paid plans
    } else {
      window.location.href = url; // Redirect to the signup page for the free plan
    }
  };

  useEffect(() => {
    if (!user) {
      router.push("/Dashboard/login"); // Redirect to home if user is not logged in
    }
  }, [user, router]);

  return (
    <>
      <div
        id="pricing"
        name="pricing"
        className="min-h-screen h-full text-center text-black flex flex-col w-full mx-auto justify-center items-center my-auto align-middle py-8 sm:py-0 px-5 max-w-6xl"
      >
        {user && (
          <>
            <h2 className="text-2xl font-bold mb-4">Step 1: Choose a Plan</h2>
            <div className="grid grid-cols-1 items-center w-full mx-auto sm:grid-cols-2 lg:grid-cols-2 justify-center gap-5">
              {pricingPlans.map((plan, index) => (
                <div
                  key={index}
                  className="border-2 border-black max-w-xs flex flex-col h-full rounded-lg p-6 px-4 md:px-6  text-left relative bg-white text-slate-900 mx-auto w-full  justify-center shadow-md shadow-black"
                >
                  {plan.isPopular && (
                    <p className="text-sm mb-8 border-l-2 border-b-2 border-black text-black font-bold absolute top-0 right-0 px-2 md:px-4 py-1 rounded-bl-lg rounded-tr-md bg-destructive  shadow-md shadow-black">
                      Popular
                    </p>
                  )}
                  <div className="flex flex-col text-black justify-center items-center h-full">
                    <div className="inline-flex mt-4 items-end">
                      <h1 className="font-extrabold text-2xl md:text-4xl">
                        ${plan.price}
                      </h1>
                    </div>
                    <h2 className="font-extrabold text-xl md:text-3xl">
                      {plan.title}
                    </h2>
                    <div className="flex-grow h-full border-t border-black opacity-25 my-3"></div>
                    <ul className="h-full font-semibold flex flex-col my-auto">
                      {plan.features.map((feature, featureIndex) => (
                        <li
                          key={featureIndex}
                          className="flex flex-row items-center text-gray-900 gap-2 my-2 text-sm sm:text-lg"
                        >
                          <div className="rounded-full border-2 border-black flex items-center justify-center bg-destructive shadow-md shadow-black w-6 h-6 mr-2">
                            <span className="text-black">✓</span>
                          </div>
                          <p>{feature}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <button
                      onClick={() => handleClick(plan.url, plan.priceId, index)}
                      className="bg-confirm py-2 mt-4 rounded-lg text-black w-full font-semibold  duration-300 shadow-md shadow-black border-2 border-black hover:shadow-black hover:shadow-lg"
                      disabled={loadingPlanIndex === index} // Disable only the clicked button
                    >
                      {loadingPlanIndex === index
                        ? "Processing..."
                        : "Select Plan"}{" "}
                      {/* Show loading only for the clicked button */}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default SubscriptionSection;
