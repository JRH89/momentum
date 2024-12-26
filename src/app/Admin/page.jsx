import React from "react";
import AdminDashboard from "../../components/admin/AdminDashboard";
import siteMetadata from "../../../siteMetadata";

export const metadata = {
  title: `Admin | ${siteMetadata.title}`,
  description: `${siteMetadata.description} Admin Page`,
  url: `${siteMetadata.siteUrl}/Admin`,
};

const page = () => {
  return (
    <>
      <AdminDashboard />
    </>
  );
};

export default page;
