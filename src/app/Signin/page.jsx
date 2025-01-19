import { Footer } from "../../components/landing-page/Footer";
import siteMetadata from "../../../siteMetadata";
import SignIn from "../../components/user/SignIn";
import { Header } from "../../components/landing-page/Header";
import Link from "next/link";

export const metadata = {
  title: `Sign In | ${siteMetadata.title}`,
  description: `Sign in to your ${siteMetadata.title} account.`,
  url: `${siteMetadata.siteUrl}/Signin`,
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
          <h1 className="text-3xl max-w-lg mx-auto sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-black">
            Keep up that {siteMetadata.title}!
          </h1>
          <SignIn />
          <div>
            <p className="text-base font-semibold">
              Don&apos;t have an account?{" "}
              <Link className="hover:underline text-gray-600" href="/Signup">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
