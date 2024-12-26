import React from 'react'
import Dashboard from '../../../components/user/Dashboard'
import Navbar from '../../../components/navbar'
import Footer from '../../../components/footer'
import siteMetadata from '../../../../siteMetadata'

export const metadata = {
    title: `Dashboard | ${siteMetadata.title}`,
    description: `Manage your ${siteMetadata.title} dashboard.`,
    url: `${siteMetadata.siteUrl}/Dashboard`,
}

const page = () => {
  return (
    <div>
      <Navbar />
      <Dashboard />
      <Footer />
    </div>
  )
}

export default page
