import NavBar from "../../components/navbar";
import SignUpForm from "../../components/user/SignUp";
import Footer from "../../components/footer";
import siteMetadata from "../../../siteMetadata";

export const metadata = {
    title: `Sign Up | ${siteMetadata.title}`,
    description: `Sign up to ${siteMetadata.title} .`,
    url: `${siteMetadata.siteUrl}/Signup`,
}

export default function Page() {
    return (
        <>
            <NavBar />
            <SignUpForm />
            <Footer />
        </>
    )
}