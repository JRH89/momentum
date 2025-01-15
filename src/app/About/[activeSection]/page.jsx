import About from "../../components/page/About";
import siteMetadata from "../../../siteMetadata";

export function generateMetadata() {
  return {
    title: `Documentation | ${siteMetadata.title}`,
    description: `Learn more about ${siteMetadata.title}`,
    url: `${siteMetadata.siteUrl}/About/${activeSection}`,
  };
}

export default function AboutPage() {
  return (
    <div className="bg-white">
      <About />
    </div>
  );
}
