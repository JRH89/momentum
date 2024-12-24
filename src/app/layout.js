import { DM_Sans } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../context/AuthProvider";
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from '@vercel/speed-insights/next';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import siteMetadata from "../../siteMetadata";
import { twMerge } from "tailwind-merge";

const dmSans = DM_Sans({ subsets: ["latin"] });

export const metadata = {
  title: `${siteMetadata.title} | ${siteMetadata.headerTitle}`,
  description: `${siteMetadata.description}`,
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: `${siteMetadata.title}`,
    description: `${siteMetadata.description}`,
    url: `${siteMetadata.siteUrl}`,
    site_name: `${siteMetadata.title}`,
    images: [
      {
        url: `${siteMetadata.siteUrl}${siteMetadata.socialBanner}`,
        width: 1920,
        height: 1080,
        alt: `${siteMetadata.title}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: `${siteMetadata.twitter}`,
    title: `${siteMetadata.title}`,
    description: `${siteMetadata.description}`,
    image: `${siteMetadata.siteUrl}${siteMetadata.socialBanner}`,
  },
  additionalMetaTags: [
    {
      name: "robots",
      content: "index, follow",
    },
    {
      name: "author",
      content: `${siteMetadata.author}`,
    },
    {
      name: "keywords",
      content: `${siteMetadata.keywords}`,
    },
    {
      name: "theme-color",
      content: "#1a202c",
    },
    {
      name: "viewport",
      content: "width=device-width, initial-scale=1.0",
    },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="description" content={metadata.description} />
        <meta name="robots" content="index, follow" />
        <meta name="author" content={metadata.additionalMetaTags[1].content} />
        <meta name="keywords" content={metadata.additionalMetaTags[2].content} />
        <meta name="theme-color" content={metadata.additionalMetaTags[3].content} />
        <meta name="viewport" content="width=device-width, initial-scale=1"></meta>
        <meta property="og:title" content={metadata.openGraph.title} />
        <meta property="og:description" content={metadata.openGraph.description} />
        <meta property="og:url" content={metadata.openGraph.url} />
        <meta property="og:site_name" content={metadata.openGraph.site_name} />
        <meta property="og:image" content={metadata.openGraph.images[0].url} />
        <meta property="og:image:width" content={metadata.openGraph.images[0].width} />
        <meta property="og:image:height" content={metadata.openGraph.images[0].height} />
        <meta property="og:image:alt" content={metadata.openGraph.images[0].alt} />
        <meta name="twitter:card" content={metadata.twitter.card} />
        <meta name="twitter:site" content={metadata.twitter.site} />
        <meta name="twitter:title" content={metadata.twitter.title} />
        <meta name="twitter:description" content={metadata.twitter.description} />
        <meta name="twitter:image" content={metadata.twitter.image} />
        <title>{metadata.title}</title>
      </head>
      <body className={twMerge(dmSans.className, "antialiased bg-[#EAEEFE]")}>
        <AuthProvider>
          {children}
          <ToastContainer
            position="bottom-center"
            autoClose={3000}
            hideProgressBar
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </AuthProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
