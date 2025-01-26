import PricingSection from "../../../components/user/SubscriptionSection";
import siteMetadata from "../../../../siteMetadata";
import NavBar from "../../../components/navbar";
import Footer from "../../../components/footer";

export function generateMetadata() {
  return {
    title: `Subscribe | ${siteMetadata.title}`,
    description: `Subscribe to ${siteMetadata.title} .`,
    url: `${siteMetadata.siteUrl}/Dashboard/subscribe`,
  };
}

export default function Page() {
  return (
    <>
      <PricingSection />
    </>
  );
}
