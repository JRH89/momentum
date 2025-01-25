import Policies from "../../components/page/PoliciesPage";
import siteMetadata from "../../../siteMetadata";
import { Header } from "../../components/landing-page/Header";
import { Footer } from "../../components/landing-page/Footer";

export const metadata = {
  title: `Policies | ${siteMetadata.title}`,
  description: `Read the policies of ${siteMetadata.title}`,
  url: `${siteMetadata.siteUrl}/Policies`,
  alternates: {
    canonical: `${siteMetadata.siteUrl}/Policies`,
  },
};

export default function PoliciesPage() {
  return (
    <>
      <Header />
      <Policies />
      <Footer />
    </>
  );
}
