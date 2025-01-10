'use client';

import Image from 'next/image';
import React, { useState } from 'react';

const ImageGallery = () => {
  const images = [
    {
      src: '/cover.png',
      alt: 'Image 1',
      description: 'This is the first image, showcasing our cover design.',
    },
    {
      src: '/image-2.png',
      alt: 'Image 2',
      description: 'Image 2 demonstrates a key feature of our platform.',
    },
    {
      src: '/image-3.png',
      alt: 'Image 3',
      description: 'This is the third image, highlighting project management.',
    },
    {
      src: '/preview.png',
      alt: 'Image 4',
      description: 'Our preview image gives a sneak peek of the interface.',
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const handleImageClick = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const currentImage = images[currentIndex];

  return (
    <section id='gallery' className="border-t-2 border-black bg-white min-h-screen h-full flex flex-col py-24">
      <div className="section-heading w-full mx-auto flex flex-col text-center">
        <div className="tag mx-auto justify-center w-auto text-destructive text-sm sm:text-md md:text-lg lg:text-xl">
          Images
        </div>
        <h2 className="section-title mt-5">Image Gallery</h2>
        <p className="section-description mt-5">
          Check out our image gallery to see how Momentum can help you manage your projects and stay on schedule.
        </p>
      </div>
      <div className="flex flex-col items-center justify-center mt-10">
        <div className="flex flex-row items-center space-x-10">
          <div className="relative rounded-lg cursor-pointer flex-1" onClick={handleImageClick}>
            <Image
              src={currentImage.src}
              alt={currentImage.alt}
              width={600}
              height={400}
              className="w-full h-auto rounded-lg object-cover"
            />
          </div>
          <div className="flex-1">
            <p className="text-gray-700">{currentImage.description}</p>
            <div className="mt-5 flex space-x-4">
              <button
                onClick={handlePrevious}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              >
                Previous
              </button>
              <button
                onClick={handleNext}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for fullscreen image */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
          <button
            onClick={closeModal}
            className="absolute top-5 right-5 text-white text-2xl bg-gray-800 rounded-full px-3 py-1 hover:bg-gray-600"
          >
            ✕
          </button>
          <Image
            src={currentImage.src}
            alt={currentImage.alt}
            width={1200}
            height={800}
            className="w-auto h-auto rounded-lg object-cover"
          />
        </div>
      )}
    </section>
  );
};

export default ImageGallery;
