'use client'

import React, { useState } from 'react';
import ArrowRight from '../../assets/arrow-right.svg';
import Logo from '../../../public/logo.png';
import Image from 'next/image';
import MenuIcon from '../../assets/menu.svg';
import Link from 'next/link';
import { motion } from 'framer-motion';

// Page Data
const pageData = {
  bannerText: 'Streamline your workflow and boost productivity effortlessly.',
  bannerLinkText: 'Get started today',
  bannerLinkHref: '/Signup',
  logoHref: '/',
  menuItems: [
    { text: 'Price', href: '/#price' },
    { text: 'FAQ', href: '/FAQ' },
    { text: 'Learn More', href: '/About' },
    { text: 'Start Now', href: '/Signup', isPrimary: true }
  ],
};

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className='sticky top-0 backdrop-blur-sm z-20'>
      <div className="flex justify-center items-center py-3 bg-black text-white text-sm gap-3">
        <p className='text-white/60 hidden md:block'>
          {pageData.bannerText}
        </p>
        <Link href={pageData.bannerLinkHref} className='inline-flex gap-1 items-center'>
          <p>
            {pageData.bannerLinkText}
          </p>
          <ArrowRight className="h-4 w-4 inline-flex justify-center items-center" />
        </Link>
      </div>
      <div className='py-5'>
        <div className='px-5 md:px-10'>
          <div className='flex items-center justify-between'>
            <Link className='shimmer-container' href={pageData.logoHref}>
              <Image
                className='border-2 border-black rounded-lg'
                height={40}
                width={40}
                src={Logo}
                alt="shimmer-image"
              />
            </Link>
            <div className="md:hidden hover:text-confirm duration-300" onClick={toggleMenu}>
              <MenuIcon className="h-10 w-10 " />
            </div>
            {/* Desktop Menu */}
            <nav className='hidden font-bold md:flex gap-6 text-black/60 items-center'>
              {pageData.menuItems.map((item, index) => (
                <Link key={index} href={item.href} className={item.isPrimary ? 'bg-confirm shadow-md font-bold shadow-black hover:shadow-lg hover:shadow-black duration-300 text-black px-4 py-2 rounded-lg inline-flex tracking-tight' : 'hover:pb-2 duration-300'}>
                  {item.text}
                </Link>
              ))}
            </nav>
          </div>
          {/* Mobile Menu */}
          <motion.nav
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: isMenuOpen ? 1 : 0, y: isMenuOpen ? 0 : -100 }}
            transition={{
              opacity: { duration: 0.7 },
              y: { duration: 1, ease: [0.42, 0, 0.58, 1], type: 'easeInOut' }, // Smooth easing for both up and down
            }}
            className={`md:hidden sticky w-full h-full text-black flex flex-col items-center justify-center font-bold space-y-4 ${isMenuOpen ? 'sticky' : 'hidden'}`}
            style={{ zIndex: 10 }}
          >
            {pageData.menuItems.map((item, index) => (
              <Link key={index} href={item.href} className={item.isPrimary ? 'bg-confirm text-black px-4 py-2 rounded-lg font-bold inline-flex tracking-tight shadow-md shadow-black hover:shadow-lg hover:shadow-black duration-300' : 'hover:pr-2 duration-300'} onClick={toggleMenu}>
                {item.text}
              </Link>
            ))}
          </motion.nav>
        </div>
      </div>
    </header>
  );
};
