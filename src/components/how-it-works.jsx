import Image from "next/image";

export default function HowItWorks() {
  const steps = [
    {
      step: 1,
      title: "Create Your Account",
      description:
        "Quick and secure sign-up with Google, GitHub, or Email authentication.",
      benefits: [
        "One-click login with your preferred platform",
        "Secure authentication",
        "Personalized dashboard ready in seconds",
      ],
      image: "/account-1.png",
    },
    {
      step: 2,
      title: "Choose Your Plan",
      description:
        "Select between monthly or annual billing options. Annual plans come with preferred pricing.",
      benefits: [
        "Save 20% with annual billing",
        "Upgrade or downgrade anytime",
        "No hidden fees or long-term contracts",
      ],
      image: "/account-3.png",
    },
    {
      step: 3,
      title: "Connect Stripe",
      description:
        "Securely link your Stripe account for invoicing, adding customers, and payments. Don't have Stripe? We'll help you set it up.",
      benefits: [
        "Automatically sync customers & invoices",
        "Create and send invoices",
        "Industry-standard security protocols",
      ],
      image: "/stripe.png",
    },
    {
      step: 4,
      title: "Manage Projects & Invoices",
      description:
        "Create and organize projects, generate professional invoices, and track payments all in one place.",
      benefits: [
        "Professional invoice templates ready to use",
        "Automated payment reminders & tracking",
        "Detailed financial reporting & insights",
      ],
      image: "/project.png",
    },
  ];

  return (
    <section
      id="howitworks"
      className="relative py-24 lg:py-32 bg-center bg-fixed bg-cover bg-no-repeat border-t-2 border-black"
      style={{
        backgroundImage: 'url("/image-2.png")',
        backgroundPosition: "center 25%",
      }}
    >
      <div className="absolute inset-0 bg-white bg-opacity-95"></div>
      <div className="relative container mx-auto px-4 sm:px-6 z-40">
        {/* Header */}
        <div className="section-heading w-full mx-auto flex flex-col mb-12 sm:mb-16 text-center">
          <div className="tag mx-auto text-destructive text-sm sm:text-md md:text-lg lg:text-xl">
            Getting Started
          </div>
          <h2 className="section-title mt-5">How It Works</h2>
          <p className="section-description mt-5">
            Connect your Stripe account with Momentum. No Stripe account? No
            worries—setting one up is quick and easy during the sign-up process.
          </p>
        </div>
        <div className="max-w-6xl mx-auto">
          {steps.map(({ step, title, description, benefits, image }, index) => (
            <div
              key={step}
              className={`relative flex flex-col lg:flex-row items-center gap-6 sm:gap-8 lg:gap-16 mb-8 sm:mb-20 lg:mb-32 pt-8 sm:pt-12 ${
                index % 2 === 1 ? "lg:flex-row-reverse" : ""
              }`}
            >
              <div className="flex-1 lg:max-w-xl text-center lg:text-left">
                <div className="flex flex-row items-center my-auto mb-3 sm:mb-4 gap-2 ">
                  <div className="rounded-full border-2 border-black bg-confirm text-black w-auto p-2 px-4 font-extrabold flex shadow-md shadow-black">
                    {step}
                  </div>
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-black">
                    {title}
                  </h3>
                </div>
                <p className="feature-description mb-2 font-semibold py-2 sm:py-0 text-left text-sm sm:text-base">
                  {description}
                </p>
                <div className="flex flex-col gap-2 text-black justify-center lg:justify-start">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <svg
                        className="size-4 sm:size-5 flex-shrink-0 shadow-md shadow-black rounded-full bg-black text-white"
                        viewBox="0 0 20 20"
                        fill="#ec4899"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="font-medium text-sm sm:text-base">
                        {benefit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Image */}
              <div className="flex-1 w-full lg:max-w-xl">
                <div className="relative aspect-video rounded-2xl overflow-hidden border-2 border-black shadow-md shadow-black">
                  <Image
                    src={image}
                    alt={`Step ${step}: ${title}`}
                    width={1920}
                    height={1080}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
