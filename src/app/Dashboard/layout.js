'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '../../../firebase';
import Sidebar from '../../components/SideBar';
import Breadcrumb from '../../components/BreadcrumbMenu';

const ProtectedRoute = ({ children }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true); // Track the loading state

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.push('/'); // Redirect if user is not authenticated
      } else {
        // Check if user is authenticated via Google or GitHub
        const isAuthorizedUser = user.providerData.some((provider) =>
          ['google.com', 'github.com'].includes(provider.providerId)
        );

        if (!isAuthorizedUser) {
          router.push('/'); // Redirect if user is not authenticated via Google or GitHub
        } else {
          setLoading(false); // Auth check complete and user is authenticated
        }
      }
    });
    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return <div>Loading...</div>; // Show a loading indicator while checking auth
  }

  return (
    <div className="flex min-h-screen bg-white w-full">
      {/* Sidebar */}
      <Sidebar uid={auth.currentUser.uid} />

      {/* Main Content */}
      <main className="relative flex flex-col w-full bg-white pt-16 ">
        <div className='absolute hidden sm:flex top-3 justify-center w-full '>
          <Breadcrumb
            homeElement={"Home"}
            separator={<span> / </span>}
            activeClasses="bg-gradient-to-r from-confirm to-destructive text-transparent bg-clip-text"
            containerClasses="flex w-full flex-wrap justify-center items-center shadow-md shadow-black text-black mx-auto rounded-lg border-2 p-1 border-black"
            listClasses="hover:underline items-center mx-2 font-bold flex flex-row text-xs sm:text-sm"
            capitalizeLinks
          />
        </div>

        {children}
      </main>
    </div>
  )
};

export default ProtectedRoute;
