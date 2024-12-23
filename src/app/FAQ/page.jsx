import FAQ from "../../components/page/FAQ";
import { Footer } from "../../components/landing-page/Footer";
import siteMetadata from "../../../siteMetadata";
import { Header } from "../../components/landing-page/Header";

export const metadata = {
    title: `FAQ | ${siteMetadata.title}`,
    description: `Get answers to common questions about ${siteMetadata.title}`,
    url: `${siteMetadata.siteUrl}/FAQ`,
}

export default function Page() {

    return (
        <div className="bg-gradient-to-t from-white to-[#D2DCFF]">
            <Header />
            <FAQ />
            <Footer />
        </div>
    )
}