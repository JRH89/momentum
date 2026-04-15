import { Noto_Sans } from 'next/font/google';
import "./globals.css";
import { AuthProvider } from "../context/AuthProvider";
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from '@vercel/speed-insights/next';
import { ToastContainer, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import siteMetadata from "../../siteMetadata";
import { twMerge } from "tailwind-merge";
import CookieBanner from "../components/CookieBanner";

// Configure the font with required subsets and weights
const notoSans = Noto_Sans({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  variable: '--font-noto-sans',
});

export const metadata = {
  title: `${siteMetadata.title} | ${siteMetadata.headerTitle}`,
  description: `${siteMetadata.description}`,
  image: `${siteMetadata.siteUrl}${siteMetadata.socialBanner}`,
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
  alternates: {
    canonical: `${siteMetadata.siteUrl}`,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="google-site-verification" content="94IN99LAWmrXJfd0QuFFwdRCGEGyEep99Cx0-GGRiPQ" />
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-7PMY0MNS8K"
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-7PMY0MNS8K');
              `,
          }}
        ></script>
      </head>
      <body className={twMerge(notoSans.className, "antialiased flex flex-col bg-[#EAEEFE]")}>
        <AuthProvider>
          {children}
          <CookieBanner />
          <ToastContainer
            position="bottom-center"
            autoClose={5000}
            newestOnTop
            transition={Zoom}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
        </AuthProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
