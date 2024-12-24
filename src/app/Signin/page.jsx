import NavBar from "../../components/navbar";
import Footer from "../../components/footer";
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
        <h1 className="text-3xl max-w-4xl mx-auto sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-gray-800">
          Already Have an Account with {siteMetadata.title}?
        </h1>
        <SignIn />
      </div>
      <Footer />
    </>
  );
}
