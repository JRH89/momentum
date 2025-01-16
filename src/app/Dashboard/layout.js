'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { initFirebase } from '../../../firebase';
import Sidebar from '../../components/SideBar';
import Breadcrumb from '../../components/BreadcrumbMenu';
import { usePremiumStatus } from '../hooks/use-premium-status';
import { getAuth } from '@firebase/auth';
import { useAuth } from '../../context/AuthProvider';
import PricingSection from "../../components/user/SubscriptionSection";

const Layout = ({ children }) => {
  const { user, loading: authLoading } = useAuth(); // Ensure `useAuth` provides these values
  const app = initFirebase();
  const auth = getAuth(app);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const isPremium = usePremiumStatus(app, user);

  useEffect(() => {
    if (authLoading) {
      return; // Wait until the auth state is done loading
    }

    if (!user) {
      setLoading(false); // Ensure loading ends
      if (router.pathname !== '/Dashboard/login') {
        router.push('/Dashboard/login'); // Redirect only if not already on the login page
      }
    } else {
      const isAuthorizedUser = user.providerData.some((provider) =>
        ['google.com', 'github.com'].includes(provider.providerId)
      );

      if (!isAuthorizedUser) {
        router.push('/Dashboard/login');
      } else {
        setLoading(false);
      }
    }
  }, [user, authLoading, router]);

  return (
    <div className="flex min-h-screen bg-white w-full">
      {/* Sidebar */}
      <Sidebar uid={auth.currentUser?.uid} />
      {/* Main Content */}
      <main className="relative flex flex-col w-full bg-white pt-16">
        <div className="absolute hidden sm:flex top-2 md:top-3 justify-center w-full px-24 md:px-0">
          <Breadcrumb
            homeElement={"Home"}
            separator={<span> / </span>}
            activeClasses="bg-gradient-to-r from-confirm to-destructive text-transparent bg-clip-text"
            containerClasses="flex w-full flex-wrap justify-center items-center shadow-md shadow-black text-black mx-auto rounded-lg border-2 p-1 border-black"
            listClasses="hover:underline items-center mx-2 font-bold flex flex-row text-xs sm:text-sm"
            capitalizeLinks
          />
        </div>
        {!isPremium && user ? (
          <div className="min-h-screen max-w-6xl mx-auto h-full w-full p-4 pt-0 text-black flex flex-col -mt-8">
            <div className="flex flex-col justify-center items-center max-w-4xl mx-auto h-full w-full p-6 pt-0">
              <PricingSection />
            </div>
          </div>
        ) : (
          <>
            {children}
          </>
        )}
      </main>
    </div>
  );
};

export default Layout;
