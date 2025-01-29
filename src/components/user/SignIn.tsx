"use client";

import {
  signInWithPopup,
  signInWithEmailAndPassword,
  GithubAuthProvider,
} from "firebase/auth";
import { auth, provider as googleProvider, db } from "../../../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";

const SignIn = () => {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);

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
            name: user.displayName || user.email,
            email: user.email,
            photoURL: user.photoURL,
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

          // send email
          try {
            const user = auth.currentUser;
            const response = await fetch("/api/sendWelcomeEmail", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email: user?.email, userID: user?.uid }),
            });

            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.error || "Something went wrong.");
            }
          } catch (error: any) {
            setError(error.message);
          }
          await setDoc(userDocRef, userData);
        }

        // Redirect to the user's dashboard
        router.push(`/Dashboard/${user.uid}`);
      }
    });

    return () => unsubscribe();
  }, [router]);

  // Handle sign-in or registration
  const handleSignIn = async (provider: any) => {
    try {
      await signInWithPopup(auth, provider);
      router.push("/Dashboard");
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleEmailSignIn = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Firestore user setup
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnapshot = await getDoc(userDocRef);

      if (!userDocSnapshot.exists()) {
        // Create the document if it doesn't exist
        const userData = {
          uid: user.uid,
          userId: user.uid,
          name: user.displayName || user.email,
          email: user.email,
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

      router.push(`/Dashboard/${user.uid}`);
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full mx-auto max-w-xs">
      {error && (
        <p className="text-red-500 max-w-sm text-center p-4 bg-white rounded-lg border-2 border-black">
          {error}
        </p>
      )}
      <div className="flex flex-row gap-4">
        {/* Google Sign-In Button */}
        <button
          type="button"
          className="flex items-center justify-center w-full max-w-sm px-4 py-2 text-lg md:text-xl font-medium text-gray-700 bg-white border-2 border-black rounded-lg shadow-md shadow-black hover:shadow-lg hover:shadow-black focus:outline-none duration-300 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          onClick={() => handleSignIn(googleProvider)}
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google Logo"
            className="w-5 h-5 sm:w-6 sm:h-6 mr-2"
          />
        </button>

        {/* GitHub Sign-In Button */}
        <button
          id="github-button"
          aria-label="Sign in with GitHub"
          type="button"
          className="flex items-center justify-center w-full max-w-sm px-4 py-2 text-lg md:text-xl font-medium text-gray-700 bg-white border-2 border-black rounded-lg shadow-md shadow-black hover:shadow-lg hover:shadow-black focus:outline-none duration-300 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          onClick={() => handleSignIn(new GithubAuthProvider())}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 24 24"
            className="w-5 h-5 sm:w-6 sm:h-6 mr-2"
          >
            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.302 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.757-1.333-1.757-1.089-.744.083-.729.083-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.807 1.305 3.492.998.108-.775.419-1.305.762-1.605-2.665-.305-5.467-1.332-5.467-5.93 0-1.31.467-2.38 1.235-3.22-.123-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.3 1.23a11.49 11.49 0 013.003-.404c1.02.005 2.045.138 3.003.404 2.29-1.553 3.297-1.23 3.297-1.23.653 1.653.241 2.873.118 3.176.77.84 1.233 1.91 1.233 3.22 0 4.61-2.807 5.625-5.478 5.92.43.372.823 1.102.823 2.222v3.293c0 .322.216.694.824.576C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
          </svg>
        </button>
      </div>

      {/* Email/Password Sign-In */}
      <input
        type="email"
        placeholder="Enter email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full max-w-sm px-4 py-2 border-2 border-black shadow-md shadow-black rounded-lg"
      />
      <div className="relative w-full">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full max-w-sm px-4 py-2 border-2 border-black shadow-md shadow-black rounded-lg"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800"
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>

      <button
        type="button"
        className="w-full max-w-sm px-4 py-2 text-lg md:text-xl font-semibold text-black bg-confirm border-2 border-black rounded-lg shadow-md shadow-black hover:shadow-lg hover:shadow-black duration-300"
        onClick={handleEmailSignIn}
      >
        Sign In
      </button>
    </div>
  );
};

export default SignIn;
