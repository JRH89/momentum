'use client'

import Image from "next/image";

// Product Images
import productImage from "../../../public/admin-dash.png";
import productImage2 from "../../../public/about-1.png";
import productImage3 from "../../../public/account.png";
import productImage4 from "../../../public/cover.png";
import productImage5 from "../../../public/dashboard.png";
import productImage6 from "../../../public/ticekts.png";


// Product Data
const pageData = {
  tag: "We offer the best product",
  title: "This is a product showcase",
  description: "Start building for free, then add a site plan to go live. Account plans unlock additional features.",
}

// Array of Product Images
const productImages = [
  { src: productImage4, alt: "Product image 4" },
  { src: productImage2, alt: "Product image 2" },
  { src: productImage, alt: "Product image 1" },
  { src: productImage5, alt: "Product image 5" },
  { src: productImage3, alt: "Product image 3" },
  { src: productImage6, alt: "Product image 6" },
]

export const ProductShowcase = () => {
  return (
    <section className="pt-12 w-full min-h-screen h-full mx-auto max-w-7xl sm:py-24 sm:pt-36 flex flex-col items-center sm:p-10   p-8 px-2">
      <div className="flex flex-col items-center text-center">
        <div className="section-heading">
          <div className="flex justify-center">
            <div className="tag text-destructive text-sm sm:text-md md:text-lg lg:text-xl">
              {pageData.tag}
            </div>
          </div>
          <h2 className="section-title mt-5">
            {pageData.title}
          </h2>
          <p className="section-description mt-5 ">
            {pageData.description}
          </p>
        </div>
        <div className="mx-auto justify-center flex mt-10">
          <div className="grid grid-cols-1 gap-6 items-center w-full mx-auto sm:grid-cols-2 lg:grid-cols-3">
            {productImages.map((image, index) => (
              <div key={index} className="flex justify-center items-center ">
                <Image
                  className="rounded-lg border-2 border-black w-full h-auto shadow-md shadow-black "
                  src={image.src}
                  alt={image.alt}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
