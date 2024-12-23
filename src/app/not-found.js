
import Image from "next/image";

export default function NotFound() {
  return (
    <>

      <main className="flex text-xl md:text-2xl flex-col items-center justify-center min-h-screen h-full my-auto mx-auto w-full gap-5 px-10 sm:px-5 text-center bg-gray-800">
        <div className=" ">
          <Image className="w-full max-w-2xl" src="/404.png" alt="404" width={500} height={500} />
        </div>

        <div className="flex  flex-col items-center justify-center ">
          <h1>404 - Page Not Found</h1>
          <p>The page you are looking for does not exist.</p>
          <p>If you feel this is an error, please <a className="hover:underline text-cyan-500" href="/Contact">contact us</a>.</p>
          <div className="flex max-w-lg mx-auto flex-row justify-around   text-green-500 w-full px-5 text-lg md:text-xl mt-5">
            <a className="hover:underline text-3xl" href="/">Go back to Home</a>


          </div>
        </div>

      </main>

    </>
  );
}