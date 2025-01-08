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

  return <>{children}</>;
};

export default ProtectedRoute;
