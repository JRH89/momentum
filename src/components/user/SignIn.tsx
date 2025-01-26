"use client";

import { signInWithPopup, GithubAuthProvider } from "firebase/auth";
import { auth, provider as googleProvider, db } from "../../../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const githubProvider = new GithubAuthProvider(); // Reuse the provider instance

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
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnapshot = await getDoc(userDocRef);

        if (!userDocSnapshot.exists()) {
          // Create the document if it doesn't exist
          const userData = {
            uid: user.uid,
            userId: user.uid,
            name: user.displayName || "Anonymous",
            email: user.email || null,
            photoURL: user.photoURL || null,
            isPremium: false,
            isSubscribed: true,
            isAdmin: false,
            customers: [],
            stripeAccountId: "",
            stripeConnected: false,
            invoicesPerPage: 8,
            projectsPerPage: 10,
            customersPerPage: 7,
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

  // Handle sign-in for different providers
  const handleSignIn = async (provider: any) => {
    try {
      await signInWithPopup(auth, provider);
      router.push("/Dashboard");
    } catch (error: any) {
      toast.error(error.message);
      setError(error.message);
    }
  };

  return (
    <div className="space-y-4">
      <button
        type="button"
        className="flex border-2 border-black items-center justify-center w-full max-w-sm px-4 py-2 text-lg md:text-xl font-medium text-gray-700 shadow-md shadow-black bg-white rounded-lg hover:shadow-lg hover:shadow-black focus:outline-none duration-300 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        onClick={() => handleSignIn(googleProvider)}
      >
        <img
          src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
          alt="Google Logo"
          className="w-5 h-5 sm:w-6 sm:h-6 mr-2"
        />
        Sign in with Google
      </button>

      <button
        type="button"
        className="flex items-center justify-center w-full max-w-sm px-4 py-2 text-lg md:text-xl shadow-md shadow-black font-medium text-gray-700 bg-white   border-2 border-black rounded-lg hover:shadow-lg hover:shadow-black focus:outline-none duration-300 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        onClick={() => handleSignIn(githubProvider)}
      >
        <img
          src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
          alt="GitHub Logo"
          className="w-5 h-5 sm:w-6 sm:h-6 mr-2"
        />
        Sign in with GitHub
      </button>
    </div>
  );
};

export default SignIn;
