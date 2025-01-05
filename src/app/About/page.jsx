import { Header } from "../../components/landing-page/Header";
import About from "../../components/page/About";
import { Footer } from "../../components/landing-page/Footer";
import siteMetadata from "../../../siteMetadata";

export function generateMetadata() {
  return {
    title: `About | ${siteMetadata.title}`,
    description: `Learn more about ${siteMetadata.title}`,
    url: `${siteMetadata.siteUrl}/About`,
  };
}

export default function AboutPage() {
  return (
    <div className="bg-gradient-to-t from-white to-[#D2DCFF]">
      <Header />
      <About />
      <Footer />
    </div>
  );
}
