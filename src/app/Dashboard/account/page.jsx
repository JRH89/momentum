import Account from "../../../components/user/AccountPage";
import Footer from "../../../components/footer";
import siteMetadata from "../../../../siteMetadata";
import NavBar from "../../../components/navbar";

export const metadata = {
    title: `Account | ${siteMetadata.title}`,
    description: `Manage your ${siteMetadata.title} account.`,
    url: `${siteMetadata.siteUrl}/Dashboard/account`,
}

export default function Page() {
    return (
        <>
            <NavBar />
            <Account />
            <Footer />
        </>
    )
}