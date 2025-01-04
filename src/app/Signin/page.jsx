import NavBar from "../../components/navbar";
import { Footer } from "../../components/landing-page/Footer";
import siteMetadata from "../../../siteMetadata";
import SignIn from "../../components/user/SignIn";

export const metadata = {
  title: `Sign In | ${siteMetadata.title}`,
  description: `Sign in to your ${siteMetadata.title} account.`,
  url: `${siteMetadata.siteUrl}/Signin`,
};

export default function Page() {
  return (
    <>
      <NavBar />
      <div className="flex bg-white justify-center items-center min-h-screen h-full -mt-24 flex-col text-center gap-5 w-full mx-auto">
        <h1 className="text-3xl max-w-xl mx-auto sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-black">
          Keep that {siteMetadata.title} going!
        </h1>
        <SignIn />
        <div>
          <p className="text-sm">
            Don't have an account?{" "}
            <a className="hover:underline text-confirm" href="/Signup">
              Sign up
            </a>
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}
