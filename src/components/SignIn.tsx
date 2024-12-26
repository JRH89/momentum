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
        className="shadow-md shadow-black hover:shadow-lg hover:shadow-black duration-300 bg-destructive text-black py-2 px-4 lg:py-4 lg:px-6 rounded-lg text-xl font-semibold items-center flex flex-row "
        onClick={handleSignIn}
      >
        Get Started Now
        <ArrowRight className="w-6 h-6 ml-2" />
      </button>
    </div>
  );
};

export default SignIn;
