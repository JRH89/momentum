
import Image from "next/image";
import NavBar from "../components/navbar";
import { Header } from "../components/landing-page/Header";
import { Footer } from "../components/landing-page/Footer";
import Link from "next/link";

export default function NotFound() {
  return (
    <>
      <Header />

      <main className="relative min-h-screen flex flex-col items-center justify-center bg-center bg-fixed aspect-auto bg-cover bg-no-repeat"
        style={{
          backgroundImage: 'url("/lightspeed.png")',
          backgroundPosition: 'center 25%', // Adjust the vertical position of the background image
        }}>
        <div className="absolute inset-0 bg-white bg-opacity-40"></div>
        <div className="relative z-30 ">
          <div className="flex text-lg md:text-xl flex-col items-center font-medium justify-center ">
            <h1 className="text-xl md:text-2xl font-bold mb-4">
              404 - Page Not Found
            </h1>
            <p>
              The page you are looking for does not exist.
            </p>
            <p>
              If you feel this is an error, please{" "}
              <a className="hover:underline text-destructive" href="mailto:hookerhillstudios@gmail.com">
                contact us
              </a>.
            </p>
            <div className="flex max-w-lg mx-auto flex-row justify-around  font-semibold text-destructive w-full px-5 text-lg md:text-xl mt-5">
              <Link className="hover:underline text-3xl" href="/">
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}