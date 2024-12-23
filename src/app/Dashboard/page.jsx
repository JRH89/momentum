import siteMetadata from "../../../siteMetadata";
import NavBar from "../../components/navbar";
import Dashboard from "../../components/user/Dashboard";
import Footer from "../../components/footer";

export function generateMetadata() {
    return {
        title: `Dashboard | ${siteMetadata.title}`,
        description: `Dashboard for ${siteMetadata.title} .`,
        url: `${siteMetadata.siteUrl}/Dashboard`,
    };
}

export default function Page() {
    return (
        <>
            <NavBar />
            <Dashboard />
            <Footer />
        </>
    )
}