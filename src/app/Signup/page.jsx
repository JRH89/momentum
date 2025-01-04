import NavBar from "../../components/navbar";
import { Footer } from "../../components/landing-page/Footer";
import siteMetadata from "../../../siteMetadata";
import SignIn from "../../components/SignIn";

export const metadata = {
  title: `Sign Up | ${siteMetadata.title}`,
  description: `Sign up to ${siteMetadata.title} .`,
  url: `${siteMetadata.siteUrl}/Signup`,
};

export default function Page() {
  return (
    <>
      <NavBar />
      <div className="flex bg-white justify-center items-center min-h-screen h-full -mt-24 flex-col text-center gap-5 w-full mx-auto">
        <h1 className="text-3xl max-w-xl mx-auto sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-black">
          Ready to gain {siteMetadata.title}?
        </h1>

        <SignIn />
        <div>
          <p className="text-sm">
            Already have an account?{" "}
            <a className="hover:underline text-confirm" href="/Signin">
              Sign in
            </a>
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}
