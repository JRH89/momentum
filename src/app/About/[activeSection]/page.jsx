import siteMetadata from "../../../../siteMetadata";
import ActiveAbout from "../../../components/page/ActiveAbout";

export const metadata = {
  title: `About | ${siteMetadata.title}`,
  description: `Learn more about ${siteMetadata.title}`,
};

export default function AboutPage({ activeSection }) {
  return (
    <div className="bg-white">
      <ActiveAbout activeSection={activeSection} />
    </div>
  );
}
