import Image from "next/image";
import logo from "../../assets/logosaas.png"
import siteMetadata from "../../../siteMetadata";
import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="bg-black text-[#bcbcbc] text-sm sm:text-lg md:text-xl lg:text-2xl py-10 text-center ">
      <div className="container">
        <div className="inline-flex relative before:content-[''] before:w-full before:top-0 before:bottom-0 before:blur before:h-full before:bg-[linear-gradient(to_right,#f87bff,#fb92cf,#ffdd9b,#c2f0b1,#2fd8fe)] before:absolute ">
          <Image
            src={logo}
            alt="logo"
            height={40}
            className="relative rounded-lg border-2 border-black"
          />
        </div>
        <nav className="flex flex-col md:flex-row md:justify-center gap-6 mt-6">
          <Link href="/#price">
            Price
          </Link>
          <Link href="/FAQ">
            FAQ
          </Link>
          <Link href="/About">
            Learn More
          </Link>
        </nav>
        <p className="mt-6">
          © {new Date().getFullYear()} {siteMetadata.title}
        </p>
      </div>
    </footer>
  )
}
