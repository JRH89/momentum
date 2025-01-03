'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '../../../firebase';

const ProtectedRoute = ({ children }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true); // Track the loading state

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.push('/'); // Redirect if user is not authenticated
      } else {
        // Check if user is authenticated via Google
        const isGoogleUser = user.providerData.some(
          (provider) => provider.providerId === 'google.com'
        );

        if (!isGoogleUser) {
          router.push('/'); // Redirect if user is not authenticated via Google
        } else {
          setLoading(false); // Auth check complete and user is authenticated via Google
        }
      }
    });
    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return <div>Loading...</div>; // Show a loading indicator while checking auth
  }

  return <>{children}</>;
};

export default ProtectedRoute;
