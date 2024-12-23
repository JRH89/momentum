import NavBar from "../../components/navbar"
import LoginForm from "../../components/user/SignIn"
import Footer from "../../components/footer"
import siteMetadata from "../../../siteMetadata"

export const metadata = {
    title: `Sign In | ${siteMetadata.title}`,
    description: `Sign in to your ${siteMetadata.title} account.`,
    url: `${siteMetadata.siteUrl}/Signin`,
}

export default function Page() {
    return (
        <>
            <NavBar />
            <LoginForm route="/Dashboard" />
            <Footer />
        </>
    )
}