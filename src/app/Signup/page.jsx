import { Footer } from "../../components/landing-page/Footer";
import siteMetadata from "../../../siteMetadata";
import SignIn from "../../components/SignIn";
import { Header } from "../../components/landing-page/Header";
import Link from "next/link";

export const metadata = {
  title: `Sign Up | ${siteMetadata.title}`,
  description: `Sign up to get started with ${siteMetadata.title}.`,
  url: `${siteMetadata.siteUrl}/Signup`,
};

export default function Page() {
  return (
    <>
      <Header />
      <div className="absolute h-full min-h-screen inset-0 bg-white/75"></div>
      <div
        style={{ backgroundImage: `url("/lightspeed2.jpg")` }}
        className="flex bg-white justify-center items-center bg-cover bg-center min-h-screen h-full  flex-col text-center gap-5 w-full mx-auto"
      >
        <div className="relative z-10 h-full mx-auto justify-center items-center flex flex-col gap-4">
          <h1 className="text-4xl px-2 md:px-0 max-w-xl mx-auto sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-black mb-2">
            Ready to gain {siteMetadata.title}?
          </h1>
          <SignIn />
          <div>
            <p className="text-base font-semibold mt-4">
              Already have an account?{" "}
              <Link className="hover:underline text-gray-600" href="/Signin">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
