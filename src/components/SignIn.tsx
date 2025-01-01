'use client';

import { signInWithPopup } from 'firebase/auth';
import { auth, provider, db } from '../../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ArrowRight, File, Goal, Projector, User } from 'lucide-react';

const SignIn = () => {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  // Monitor auth state
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);

        // Check if user exists in Firestore
        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnapshot = await getDoc(userDocRef);

        if (!userDocSnapshot.exists()) {
          // Create the document if it doesn't exist
          const userData = {
            uid: user.uid,
            userId: user.uid,
            name: user.displayName || 'Anonymous',
            email: user.email,
            photoURL: user.photoURL,
            isPremium: false,
            isSubscribed: true,
            isAdmin: false,
            customers: [],
            stripeAccountId: '',
            stripeConnected: false,
            createdAt: new Date().toISOString(),
          };
          await setDoc(userDocRef, userData);
        }

        // Redirect to the user's dashboard
        router.push(`/Dashboard/${user.uid}`);
      }
    });

    return () => unsubscribe();
  }, [router]);

  // Handle Google Sign-In
  const handleSignIn = async () => {
    try {
      await signInWithPopup(auth, provider);
      router.push('/Dashboard');
    } catch (error: any) {
      console.error('Error signing in:', error.message);
    }
  };

  return (
   <div>
  <button
    type="button"
    className="flex items-center justify-center w-full max-w-sm px-4 py-2 text-sm sm:text-lg font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-100 focus:outline-none duration-300 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
    onClick={handleSignIn}
  >
    <img
    src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
      alt="Google Logo"
      className="w-5 h-5 mr-2"
    />
    Sign up with Google
  </button>
</div>

  );
};

export default SignIn;
