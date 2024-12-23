'use client';

import { useAuth } from "../../context/AuthProvider";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getPremiumStatus } from "../payments/account/GetPremiumStatus";
import { getAuth, sendPasswordResetEmail, deleteUser, signInWithEmailAndPassword } from "@firebase/auth";
import { initFirebase } from "../../../firebase";
import { getFirestore } from "firebase/firestore";
import { getDoc, doc, collection } from "firebase/firestore";
import Link from "next/link";
import LoginForm from "./SignIn";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";

const Account = () => {

    const { user } = useAuth();
    const router = useRouter();
    const app = initFirebase()
    const auth = getAuth(app)
    const firestore = getFirestore(app)
    const [isPremium, setIsPremium] = useState(false);
    const [userIsPremium, setUserIsPremium] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loadingPortal, setLoading] = useState(false);
    const [alert, setAlert] = useState(null);

    // Fetch premium status
    useEffect(() => {
        const fetchPremiumStatus = async () => {
            try {
                const newPremiumStatus = user ? await getPremiumStatus(app) : false;
                setIsPremium(newPremiumStatus);
                setUserIsPremium(newPremiumStatus);
                setIsAdmin(newPremiumStatus);
            } catch (error) {
                console.error("Error fetching premium status:", error.message);
            }
        };

        fetchPremiumStatus();
    });

    const sendResetEmail = async (email) => {
        try {
            await sendPasswordResetEmail(auth, email);
            toast.success("Password reset email sent");
            setTimeout(() => {
                setAlert(null);
            }, 4000);

        } catch (error) {
            console.error('Error sending password reset email:', error);
        }
    };

    const loadPortal = async () => {

        setLoading(true); // Optional: Handle loading state

        try {
            const db = getFirestore(); // Initialize Firestore
            const userId = auth.currentUser?.uid; // Ensure current user is authenticated

            if (!userId) {
                throw new Error('User is not authenticated');
            }

            // Fetch the Stripe Customer ID from Firestore
            const customerRef = doc(collection(db, 'customers'), userId);
            const customerDoc = await getDoc(customerRef);

            if (!customerDoc.exists()) {
                throw new Error('User document not found');
            }

            const customerData = customerDoc.data();
            const stripeCustomerId = customerData?.stripeId;

            console.log("Stripe Customer ID:", stripeCustomerId);

            if (!stripeCustomerId) {
                throw new Error('Stripe customer ID not found');
            }

            // Call the API to create the Stripe portal session
            const { url } = await fetch("/api/stripe/createPortal", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userId: stripeCustomerId }), // Send the Stripe Customer ID to your API
            }).then((res) => {
                if (!res.ok) {
                    throw new Error(`Error: ${res.statusText}`);
                }
                console.log("Response:", res);
                return res.json();
            });

            router.push(url); // Redirect the user to the Stripe billing portal

        } catch (error) {
            console.error("Error loading portal:", error);
            // Handle error (e.g., set an error state)
        } finally {
            setLoading(false); // Optional: Reset loading state
        }
    };

    const deleteAccount = async () => {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
            console.log("No user is currently signed in.");
            return;
        }

        const confirmDelete = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");

        if (confirmDelete) {
            try {
                await deleteUser(user);
                console.log("User account deleted successfully.");
            } catch (error) {
                console.error("Error deleting user account:", error);
            }
        } else {
            console.log("Account deletion canceled.");
        }
    };

    return (
        <div className="flex flex-col min-h-screen h-full my-auto w-full max-w-6xl mx-auto text-black items-center justify-center">
            {user ? (
                <div className="mx-auto w-full flex flex-col justify-center item-center">
                    <div className="flex flex-col gap-1 w-auto justify-center mx-auto max-w-xs text-xl sm:text-2xl">
                        <p className="flex flex-row gap-1">
                            <span className="font-bold">
                                {user.email}
                            </span>
                        </p>
                        <p className="capitalize flex flex-row gap-1 w-full justify-between">
                            Subscribed:
                            <span className="font-bold">{userIsPremium.toString()}
                            </span></p>
                        {alert && <p className="text-red-600 font-semibold text-center my-2 p-2 rounded-lg bg-white">{alert}</p>}
                        <div className="flex flex-col gap-1 w-full justify-center mx-auto ">
                            <button
                                className="bg-confirm duration-300 shadow-black shadow-md hover:shadow-black hover:shadow-lg hover:bg-confirm/80  font-bold py-2 px-4 rounded mt-4 text-slate-900 mx-auto flex w-full justify-center"
                                onClick={() => sendResetEmail(user.email)}>
                                Reset Password
                            </button>
                            {isPremium &&
                                <button
                                    className="bg-confirm duration-300 shadow-black shadow-md hover:shadow-black hover:shadow-lg hover:bg-confirm/80  font-bold py-2 px-4 rounded mt-4 text-slate-900 mx-auto flex w-full justify-center"
                                    onClick={() => {
                                        loadPortal()
                                    }}>{loadingPortal ? <Loader2 className="w-6 h-6 animate-spin duration-300" /> : "Manage Subscription"}</button>
                            }
                            {!isPremium &&
                                <Link
                                    href="/Dashboard/subscribe"
                                    className="bg-confirm duration-300 shadow-black shadow-md hover:shadow-black hover:shadow-lg hover:bg-confirm/80  font-bold py-2 px-4 rounded mt-4 text-slate-900 mx-auto flex w-full justify-center"
                                >
                                    Upgrade to Premium
                                </Link>
                            }
                            <button
                                className="bg-destructive duration-300 shadow-black shadow-md hover:shadow-black hover:shadow-lg hover:bg-destructive/80  font-bold py-2 px-4 rounded mt-4 text-slate-900 mx-auto flex w-full justify-center"
                                onClick={() => {
                                    deleteAccount()
                                }}>
                                Delete Account
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <LoginForm route="/Dashboard/account" />
            )}
        </div >
    )

}

export default Account