"use client";

import { ArrowBigLeftIcon, ArrowBigRightIcon, XIcon } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";

// Define the type for images
type ImageType = {
  src: string;
  alt: string;
  desc: string;
  bgImage?: string;
};

const ImageGallery = () => {
  const images: ImageType[] = [
    {
      src: "/dashboard.png",
      alt: "User Dashboard",
      desc: "The user dashboard serves as a comprehensive control center, allowing you to create customers, send invoices, and start projects.",
      bgImage: "/image-3.png",
    },
    {
      src: "/customer-dashboard.png",
      alt: "Customer Dashboard",
      desc: "The customer dashboard provides an intuitive interface for your customers to acess projects and view or pay invoices. Delivering transparency and convenience, it enhances collaboration and customer satisfaction.",
      bgImage: "/image-2.png",
    },
    {
      src: "/project.png",
      alt: "Project Dashboard",
      desc: "The project dashboard centralizes milestones, project level invoices, project files, and a live chat portal, ensuring every aspect of project management is organized. Both you and customers can access these pages to monitor progress and ensure you stay in sync.",
      bgImage: "/image-5.png",
    },
    {
      src: "/features.png",
      alt: "Project Features",
      desc: "In addition to milestones and project level invoices, each project dashboard has optional features, such as live chat, file uploads, and a color palette. These features are free to enable and can be activated only when needed, ensuring your workspace stays clean and uncluttered.",
      bgImage: "/image-4.png",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState<ImageType | null>(null);

  const itemsPerPage = 4;

  const openModal = (image: ImageType) => {
    setSelectedImage(image);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  const currentImages = images.slice(
    currentIndex * itemsPerPage,
    currentIndex * itemsPerPage + itemsPerPage
  );

  return (
    <section
      id="details"
      className="border-t-2 border-black bg-white flex flex-col py-24 px-5 lg:px-0"
    >
      <div className="section-heading w-full mx-auto flex flex-col text-center">
        <div className="tag mx-auto justify-center w-auto text-destructive text-sm sm:text-md md:text-lg lg:text-xl">
          In-App Previews
        </div>
        <h2 className="section-title mt-5">See the App in Action</h2>
        <p className="section-description mt-5">
          Get a closer look at the app&apos;s interface and tools. Click on any
          preview to learn more about its features.
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 gap-5 lg:gap-10 mt-6 max-w-4xl mx-auto">
        {currentImages.map((image, index) => (
          <div
            key={index}
            className="relative flex flex-col rounded-lg shadow-md shadow-black cursor-pointer"
            onClick={() => openModal(image)}
          >
            <Image
              aria-label={image.alt}
              src={image.src}
              alt={image.alt}
              width={600}
              height={400}
              className="w-full shadow-lg h-auto rounded-t-lg border-t-2 border-l-2 border-r-2 border-black object-cover"
            />
            <p className="text-black bg-backgroundPrimary h-full flex p-2 text-center border-r-2 border-l-2 border-b-2 border-black rounded-b-lg text-xs sm:text-base mx-auto w-full justify-center font-medium">
              {image.alt}
            </p>
          </div>
        ))}
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 w-full h-full min-h-screen bg-black bg-opacity-50 flex justify-center items-center z-50"
          style={{
            backgroundImage: `url(${selectedImage.bgImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="bg-white/95 h-full flex flex-col py-12 shadow-lg w-full p-4 mx-auto items-center relative">
            <button
              aria-label="close modal"
              type="button"
              onClick={closeModal}
              className="absolute top-0 right-0 text-destructive border-l-2 border-b-2 border-black text-2xl p-1 bg-black rounded-bl-lg shadow-md shadow-black"
            >
              <XIcon className="w-6 h-6 hover:rotate-90 duration-300" />
            </button>
            <div className="flex flex-col items-center sm:px-5  h-full justify-center gap-5 lg:gap-10">
              <p className="text-black text-left text-2xl lg:text-3xl px-2 font-bold ">
                {selectedImage.alt}
              </p>
              <div className="flex flex-col lg:flex-row gap-5 items-center">
                <Image
                  aria-label={selectedImage.alt}
                  src={selectedImage.src}
                  alt={selectedImage.alt}
                  width={1920}
                  height={1080}
                  className="w-full max-w-xl shadow-md shadow-black border-2 border-black h-auto rounded-lg"
                />
                <div className="flex flex-col justify-between">
                  <p className="text-justify mt-4 px-2 max-w-xl text-black font-medium sm:text-md text-sm lg:text-xl">
                    {selectedImage.desc}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-center gap-5 lg:gap-10 mt-2 max-w-xl lg:max-w-6xl mx-auto w-full ">
                <button
                  aria-label="previous page"
                  type="button"
                  onClick={() => {
                    const currentIndex = images.findIndex(
                      (image) => image.src === selectedImage.src
                    );
                    const prevIndex =
                      (currentIndex - 1 + images.length) % images.length;
                    setSelectedImage(images[prevIndex]);
                  }}
                  className="px-4 py-2 flex w-full text-center justify-center border-2 border-black duration-300 bg-confirm text-black rounded-lg hover:bg-opacity-60"
                >
                  <ArrowBigLeftIcon className="w-6 h-6" />
                </button>
                <button
                  aria-label="next page"
                  type="button"
                  onClick={() => {
                    const currentIndex = images.findIndex(
                      (image) => image.src === selectedImage.src
                    );
                    const nextIndex = (currentIndex + 1) % images.length;
                    setSelectedImage(images[nextIndex]);
                  }}
                  className="px-4 border-2 border-black py-2 flex w-full text-center justify-center duration-300 bg-confirm text-black rounded-lg hover:bg-opacity-60"
                >
                  <ArrowBigRightIcon className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ImageGallery;
