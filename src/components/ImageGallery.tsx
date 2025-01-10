'use client';

import { XIcon } from 'lucide-react';
import Image from 'next/image';
import React, { useState } from 'react';

// Define the type for images
type ImageType = {
  src: string;
  alt: string;
  desc: string;
};

const ImageGallery = () => {
  const images: ImageType[] = [
    {
      src: '/cover.png',
      alt: 'User Dashboard',
      desc: 'The user dashboard provides quick access to customers, invoices, reports, and more for streamlined management.',
    },
    {
      src: '/image-2.png',
      alt: 'Client Dashboard',
      desc: 'The client dashboard lets you track projects, milestones, and key deliverables with ease.',
    },
    {
      src: '/image-3.png',
      alt: 'Project Dashboard',
      desc: 'The project dashboard centralizes milestones, files, and timelines to keep your team aligned.',
    },
    {
      src: '/preview.png',
      alt: 'Invoicing Form',
      desc: 'Create and send invoices to your clients effortlessly with our user-friendly invoicing form.',
    },
    {
      src: '/support-tickets.png',
      alt: 'Support Tickets',
      desc: 'Manage customer inquiries and support tickets efficiently to ensure satisfaction and quick resolution.',
    },
    {
      src: '/project-settings.png',
      alt: 'Project Settings',
      desc: 'Customize project details, permissions, and configurations using the project settings interface.',
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState<ImageType | null>(null);

  const itemsPerPage = 3;
  const maxIndex = Math.ceil(images.length / itemsPerPage) - 1;

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex < maxIndex ? prevIndex + 1 : 0));
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : maxIndex));
  };

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
      id="gallery"
      className="border-t-2 border-black bg-white min-h-screen h-full flex flex-col py-24 px-5 lg:px-0"
    >
      <div className="section-heading w-full mx-auto flex flex-col text-center">
        <div className="tag mx-auto justify-center w-auto text-destructive text-sm sm:text-md md:text-lg lg:text-xl">
          Images
        </div>
        <h2 className="section-title mt-5">Image Gallery</h2>
        <p className="section-description mt-5">
          Browse through our gallery to explore various features and tools. Click an image for a detailed view.
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-5 mt-6 max-w-6xl mx-auto">
        {currentImages.map((image, index) => (
          <div
            key={index}
            className="relative flex flex-col rounded-lg shadow-md shadow-black cursor-pointer"
            onClick={() => openModal(image)}
          >
            <Image
              src={image.src}
              alt={image.alt}
              width={600}
              height={400}
              className="w-full shadow-lg h-auto rounded-t-lg border-t border-l border-r border-black object-cover"
            />
            <p className="text-black h-full flex p-2 text-center border-r border-l border-b border-black rounded-b-lg text-xs sm:text-base mx-auto w-full justify-center font-medium">
              {image.alt}
            </p>
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-6 space-x-4  max-w-xl mx-auto w-full">
        <button
          onClick={handlePrevious}
          className="px-4 py-2 flex w-full text-center justify-center bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          className="px-4 py-2 flex w-full text-center justify-center bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
        >
          Next
        </button>
        </div>
        {selectedImage && (
        <>
        <div className="fixed inset-0 h-full min-h-screen bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white h-full py-12 shadow-lg max-w-xl w-full p-4 relative">
            <button
            aria-label="close modal"
            type="button"
            onClick={closeModal}
            className="absolute top-0 right-0 text-destructive hover:rotate-90 duration-300 border-l-2 border-b-2 border-black text-2xl p-1 bg-black rounded-bl-lg"
            >
            <XIcon className="w-6 h-6" />
            </button>
            <Image
                src={selectedImage.src}
                alt={selectedImage.alt}
                width={600}
                height={400}
                className="w-full shadow-md mt-4 shadow-black border-2 border-black h-auto rounded-lg"
            />
                <p className="text-black px-2 font-medium mt-4 mb-2">{selectedImage.alt}</p>
                <p className="text-justify px-2 text-black font-medium">{selectedImage.desc}</p>
                <div className="flex absolute bottom-2 justify-center space-x-4 max-w-xl mx-auto w-full">
                <button
                    onClick={() => {
                    const currentIndex = images.findIndex((image) => image.src === selectedImage.src);
                    const prevIndex = (currentIndex - 1 + images.length) % images.length;
                    setSelectedImage(images[prevIndex]);
                    }}
                    className="px-4 py-2 flex w-full text-center justify-center bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                >
                    Previous
                </button>
                <button
                    onClick={() => {
                    const currentIndex = images.findIndex((image) => image.src === selectedImage.src);
                    const nextIndex = (currentIndex + 1) % images.length;
                    setSelectedImage(images[nextIndex]);
                    }}
                    className="px-4 py-2 flex w-full text-center justify-center bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                >
                    Next
                </button>
            </div>
        </div>
    </div>
  </>
)}
    </section>
  );
};

export default ImageGallery;
