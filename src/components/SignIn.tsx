'use client';

import { signInWithPopup, GithubAuthProvider } from 'firebase/auth';
import { auth, provider as googleProvider, db } from '../../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { error } from 'console';

const SignIn = () => {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

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
            invoicesPerPage: 8,
            projectsPerPage: 8,
            customersPerPage: 10,
            milestonesPerPage: 5,
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

  // Handle sign-in with a specific provider
  const handleSignIn = async (provider: any) => {
    try {
      await signInWithPopup(auth, provider);
      router.push('/Dashboard');
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Google Sign-In Button */}
      {error && <p className="text-red-500 max-w-sm text-center p-4 bg-white rounded-lg border-2 border-black">{error}</p>}
      <button
        type="button"
        className="flex items-center justify-center w-full max-w-sm px-4 py-2 text-sm sm:text-lg font-medium text-gray-700 bg-white border-2 border-black rounded-lg shadow-md shadow-black hover:shadow-lg hover:shadow-black focus:outline-none duration-300 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        onClick={() => handleSignIn(googleProvider)}
      >
        <img
          src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
          alt="Google Logo"
          className="w-5 h-5 mr-2"
        />
        Sign up with Google
      </button>

      {/* GitHub Sign-In Button */}
      <button
        type="button"
        className="flex items-center justify-center w-full max-w-sm px-4 py-2 text-sm sm:text-lg font-medium text-gray-700 bg-white border-2 border-black rounded-lg shadow-md shadow-black hover:shadow-lg hover:shadow-black focus:outline-none duration-300 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        onClick={() => handleSignIn(new GithubAuthProvider())}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 24 24"
          className="w-5 h-5 mr-2"
        >
          <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.302 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.757-1.333-1.757-1.089-.744.083-.729.083-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.807 1.305 3.492.998.108-.775.419-1.305.762-1.605-2.665-.305-5.467-1.332-5.467-5.93 0-1.31.467-2.38 1.235-3.22-.123-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.3 1.23a11.49 11.49 0 013.003-.404c1.02.005 2.045.138 3.003.404 2.29-1.553 3.297-1.23 3.297-1.23.653 1.653.241 2.873.118 3.176.77.84 1.233 1.91 1.233 3.22 0 4.61-2.807 5.625-5.478 5.92.43.372.823 1.102.823 2.222v3.293c0 .322.216.694.824.576C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
        </svg>
        Sign up with GitHub
      </button>
    </div>
  );
};

export default SignIn;
