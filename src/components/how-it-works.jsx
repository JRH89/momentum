import Image from "next/image";

export default function MomentumInfographic() {
  return (
    <div
      id="howitworks"
      className="relative pb-6 min-h-screen flex flex-col items-center justify-center bg-center bg-fixed bg-cover bg-no-repeat border-t-2 border-black px-5"
      style={{
        backgroundImage: 'url("/image-2.png")',
        backgroundPosition: "center 25%",
      }}
    >
      <div className="absolute inset-0 bg-white bg-opacity-95"></div>
      <div className="relative flex flex-col py-24 z-40 text-left max-w-6xl p-8 px-0">
        <div className="section-heading w-full mx-auto flex flex-col">
          <div className="tag mx-auto justify-center w-auto text-destructive text-sm sm:text-md md:text-lg lg:text-xl">
            Getting Started
          </div>
          <h2 className="section-title mt-5">How It Works</h2>
          <p className="section-description mt-5">
            Momentum uses Stripe Connect to securely link your Stripe account.
            We sync your customers and invoices automatically, so you can manage
            everything in one place. Don&apos;t have a Stripe account? No
            problem, you can easily create one during our sign-up process.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mt-8">
          {[
            {
              step: 1,
              title: "Sign Up",
              description:
                "Register with Google, GitHub, or Email to get started.",
              image: "/account-1.png",
              alt: "Sign Up",
            },
            {
              step: 2,
              title: "Choose Subscription",
              description:
                "Choose to pay monthly or yearly, depending on your needs.",
              image: "/account-3.png",
              alt: "Choose Subscription",
            },
            {
              step: 3,
              title: "Connect Stripe",
              description:
                "Link your Stripe account to sync customers and invoices.",
              image: "/stripe.png",
              alt: "Connect Stripe",
            },
            {
              step: 4,
              title: "Projects & Invoices",
              description:
                "Create projects, send invoices, and collaborate with clients.",
              image: "/project.png",
              alt: "Send Invoices",
            },
          ].map(({ step, title, description, image, alt }) => (
            <div
              key={step}
              className="flex flex-col items-center text-center p-6 pt-0 px-0 bg-gray-50 rounded-2xl shadow-lg border-2 border-black"
            >
              <div className="flex items-end justify-center ">
                <Image
                  width={1920}
                  height={1080}
                  src={image}
                  alt={alt}
                  className="w-auto h-full rounded-t-xl border-b-2 border-black shadow-sm"
                />
              </div>
              <h3 className="text-xl mt-6 font-semibold text-gray-800 my-2">
                {title}
              </h3>
              <p className="text-gray-600 flex-1 px-5">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
