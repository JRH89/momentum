'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '../../../../firebase';

const StripeCallback = () => {
  const router = useRouter();
  
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      setUser(authUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleCallback = async () => {
      if (loading) return;

      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');

      if (!user || !code) {
        console.error('Missing user or authorization code');
        setErrorMessage('Missing user or authorization code');
        return;
      }

      try {
        const response = await fetch('/api/stripe/callback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code, user: { uid: user.uid } }),
        });

        if (response.ok) {
          router.push(`/dashboard/${user.uid}`);
        } else {
          const errorData = await response.json();
          console.error('Failed to process Stripe OAuth:', errorData.error);
          setErrorMessage(errorData.error || 'Failed to process Stripe OAuth');
        }
      } catch (err) {
        console.error('Error:', err);
        setErrorMessage('An error occurred while processing Stripe OAuth');
      }
    };

    handleCallback();
  }, [user, router, loading]);

  return (
    <div>
      {loading ? (
        <p>Loading your user information...</p>
      ) : errorMessage ? (
        <p>Error: {errorMessage}</p>
      ) : (
        <p>Processing your Stripe account setup...</p>
      )}
    </div>
  );
};

export default StripeCallback;
