'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { initFirebase } from '../../../firebase';
import Sidebar from '../../components/SideBar';
import { getPremiumStatus } from '../../components/payments/account/GetPremiumStatus';
import { getAuth } from '@firebase/auth';
import { useAuth } from '../../context/AuthProvider';
import PricingSection from "../../components/user/SubscriptionSection";

const Layout = ({ children }) => {
  const { user, loading: authLoading } = useAuth(); // Ensure `useAuth` provides these values
  const app = initFirebase();
  const auth = getAuth(app);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false);

  // Fetch premium status
  useEffect(() => {
    const fetchPremiumStatus = async () => {
      try {
        if (user) {
          const newPremiumStatus = await getPremiumStatus(app);
          setIsPremium(newPremiumStatus);
        }
      } catch (error) {
        console.error("Error fetching premium status:", error.message);
      }
    };

    fetchPremiumStatus();
  }, [user, app]);

  useEffect(() => {
    if (authLoading) {
      return; // Wait until the auth state is done loading
    }

    if (!user) {
      setLoading(false); // Ensure loading ends
      if (router.pathname !== '/Dashboard/login') {
        router.push('/Dashboard/login'); // Redirect to login if not logged in
      }
    } else {
      setLoading(false); // Ensure loading ends once the user is logged in
    }
  }, [user, authLoading, router]);

  return (
    <div className="flex min-h-screen bg-white w-full">
      <Sidebar uid={auth.currentUser?.uid} />
      <main className="relative flex flex-col w-full bg-white pt-14 sm:pt-16 lg:pt-1.5">
        {!isPremium && user ? (
          <div className="min-h-screen max-w-6xl mx-auto h-full w-full p-4 pt-0 text-black flex flex-col -mt-8">
            <div className="flex flex-col justify-center items-center max-w-4xl mx-auto h-full w-full p-6 pt-0">
              <PricingSection />
            </div>
          </div>
        ) : (
          <div className='mt-4 sm:mt-0'>
            {children}
          </div>
        )}
      </main>
    </div>
  );
};

export default Layout;
