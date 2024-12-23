'use client';

import { signInWithPopup } from 'firebase/auth';
import { auth, provider, db } from '../../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

const SignIn = () => {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  // Monitor auth state
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);

        // Check if user exists in Firestore, if not, create a document
        const userDocRef = doc(db, 'users', user.uid);
        const userData = {
          uid: user.uid,
          name: user.displayName || 'Anonymous',
          email: user.email,
          photoURL: user.photoURL,
          createdAt: new Date().toISOString(),
        };
        await setDoc(userDocRef, userData, { merge: true }); // merge to avoid overwriting
        
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
        
        router.push('/Dashboard/[uid]');
    } catch (error: any) {
      console.error('Error signing in:', error.message);
    }
  };

  return (
    <div className="">
      <button
          type='button'
          className="shadow-md shadow-black hover:shadow-lg hover:shadow-black duration-300 bg-orange-500 text-white px-6 py-4 rounded text-4xl lg:text-5xl sm:text-3xl"
          onClick={handleSignIn}
      >
          Get Started Now
        </button>
    </div>
  );
};

export default SignIn;
