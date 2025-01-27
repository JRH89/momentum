import { act } from "react";
import siteMetadata from "../../../../siteMetadata";
import ActiveAbout from "../../../components/page/ActiveAbout";

export async function generateMetadata({ params }) {
  // Ensure params is resolved before accessing `activeSection`
  const { activeSection } = params || {}; // Use optional chaining if `params` is undefined

  const formattedTitle = activeSection
    ? activeSection.replace(/([a-z])([A-Z])/g, "$1 $2")
    : "About";

  return {
    title: formattedTitle
      ? `${formattedTitle
          .replace(/-/g, " ")
          .replace(/\b\w/g, (char) => char.toUpperCase())} | ${
          siteMetadata.title
        }`
      : `About | ${siteMetadata.title}`,
    description: formattedTitle
      ? `Learn more about ${formattedTitle
          .replace(/-/g, " ")
          .toLowerCase()} in ${siteMetadata.title}.`
      : `Learn more about ${siteMetadata.title}.`,
    url: activeSection
      ? `${siteMetadata.siteUrl}/About/${activeSection}`
      : `${siteMetadata.siteUrl}/About`,
    alternates: {
      canonical: activeSection
        ? `${siteMetadata.siteUrl}/About/${activeSection}`
        : `${siteMetadata.siteUrl}/About`,
    },
  };
}

export default function Page() {
  return (
    <div className="bg-white">
      <ActiveAbout />
    </div>
  );
}
