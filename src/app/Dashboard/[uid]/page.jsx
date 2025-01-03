import React from "react";
import Dashboard from "../../../components/user/Dashboard";
import siteMetadata from "../../../../siteMetadata";

export const metadata = {
  title: `Dashboard | ${siteMetadata.title}`,
  description: `Manage your ${siteMetadata.title} dashboard.`,
  url: `${siteMetadata.siteUrl}/Dashboard`,
};

const page = () => {
  return <Dashboard />;
};

export default page;
