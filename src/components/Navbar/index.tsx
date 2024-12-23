'use client'

import React from 'react'
import { auth } from '../../../firebase'
import Link from 'next/link'
import Image from 'next/image'

const Navbar = () => {
  return (
      <nav className="bg-gray-800 text-white p-4 py-2 flex fixed top-0 left-0 right-0 z-50">
          <div className="container mx-auto flex justify-between items-center max-w-6xl">
              <h1><Link href="/"><Image src="/logo.png" alt="Logo" width={50} height={50} /></Link></h1>
              <div className="flex gap-4">
                <button type="button" onClick={() => auth.signOut()} className="text-white hover:text-gray-400">Sign In</button>
              <button type="button" onClick={() => auth.signOut()} className="text-white hover:text-gray-400">Sign Out</button>  
              </div>
              
          </div>
      
    </nav>
  )
}

export default Navbar
