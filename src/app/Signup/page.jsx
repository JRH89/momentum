import NavBar from "../../components/navbar";
import { Footer } from "../../components/landing-page/Footer";
import siteMetadata from "../../../siteMetadata";
import SignIn from "../../components/SignIn";
import NewNavBar from "../../components/SignUpNavbar";
import { Header } from "../../components/landing-page/Header";

export const metadata = {
  title: `Sign Up | ${siteMetadata.title}`,
  description: `Sign up to ${siteMetadata.title} .`,
  url: `${siteMetadata.siteUrl}/Signup`,
};

export default function Page() {
  return (
    <>
      <Header />
      <div className="absolute h-full min-h-screen inset-0  bg-white/60"></div>
      <div
        style={{ backgroundImage: `url("/lightspeed.png")` }}
        className="flex bg-white justify-center items-center bg-cover bg-center min-h-screen h-full  flex-col text-center gap-5 w-full mx-auto"
      >
        <div className="relative z-10 h-full mx-auto justify-center items-center flex flex-col gap-4">
          <h1 className="text-3xl max-w-xl mx-auto sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-black">
            Ready to gain {siteMetadata.title}?
          </h1>

          <SignIn />
          <div>
            <p className="text-base font-semibold">
              Already have an account?{" "}
              <a className="hover:underline text-destructive" href="/Signin">
                Sign in
              </a>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
