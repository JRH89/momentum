'use client'

import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthProvider";
import { initFirebase } from "../../../firebase";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { Lock, Unlock } from 'lucide-react';
import { getPremiumStatus } from '../payments/account/GetPremiumStatus'
import { getAuth } from '@firebase/auth';
import Link from 'next/link';
import LoginForm from './SignIn';
import Announcements from './Announcements';
import UserTickets from './UserTickets';

const Dashboard = () => {
    const { user, loading: userLoading } = useAuth();
    const [loading, setLoading] = useState(false);

    // User info
    const [email, setEmail] = useState("");
    const [userId, setUserId] = useState(null);

    // Subscription stuff
    const app = initFirebase()
    const auth = getAuth(app)
    const firestore = getFirestore(app)
    const [isPremium, setIsPremium] = useState(false);

    // Fetch premium status
    useEffect(() => {
        const fetchPremiumStatus = async () => {
            try {
                const newPremiumStatus = user ? await getPremiumStatus(app) : false;
                setIsPremium(newPremiumStatus);

            } catch (error) {
                console.error("Error fetching premium status:", error.message);
            }
        };

        fetchPremiumStatus();
    });

    useEffect(() => {
        if (user) {
            const docRef = doc(firestore, "users", auth.currentUser.uid);
            getDoc(docRef).then((doc) => {
                if (doc.exists()) {
                    const data = doc.data();
                    setEmail(data.email);
                    setUserId(auth.currentUser.uid);
                } else {
                    console.log("No such document!");
                }
            }).catch((error) => {
                console.log("Error getting document:", error);
            });
        }
    }, [user]);

    return (
        <div className="min-h-screen max-w-6xl mx-auto h-full w-full px-3 sm:px-5 text-black flex flex-col ">
            {loading ? (
                <div>Loading...</div>
            ) : user ? (
                <div>
                    <Announcements />
                    <div className="px-5 pt-6">
                        <h2 className="text-3xl font-bold text-center">
                            Welcome back, <span className="text-destructive">{email}</span>
                        </h2>
                        <div className="p-5 pb-0">
                            <div className="flex flex-col gap-5">
                                {!isPremium && (
                                    <div className="bg-white p-4 rounded-lg shadow-md h-full flex flex-col shadow-black mx-auto w-full">
                                        <div className='flex flex-row w-full'>
                                            <h3 className="text-2xl font-bold mb-4 text-black flex flex-row gap-1 items-center">
                                                <Lock size={20} className='text-destructive' />
                                                Upgrade to Premium
                                            </h3>
                                        </div>
                                        <p className="text-gray-700 my-auto h-auto text-xs sm:text-base font-semibold">
                                            Unlock all features!!!
                                        </p>
                                        <div className="mt-2 flex mx-auto w-full justify-start">
                                            <Link
                                                href="/Dashboard/subscribe"
                                                className="bg-confirm font-semibold duration-300 text-black py-2 px-4  shadow-md hover:shadow-lg hover:shadow-black shadow-black text-xs sm:text-lg rounded"
                                            >
                                                Upgrade
                                            </Link>
                                        </div>
                                    </div>
                                )}
                                {isPremium && (
                                    <div className="bg-white p-4 rounded-lg shadow-md h-full flex flex-col shadow-black mx-auto w-full">
                                        <div className='flex flex-row w-full'>
                                            <h3 className="text-2xl font-bold mb-4 text-black flex flex-row gap-1 items-center">
                                                <Unlock size={20} className='text-destructive' />
                                                Thank you for choosing to be a premium subscriber.
                                            </h3>
                                        </div>
                                        <p className="text-gray-700 my-auto h-auto text-xs sm:text-base font-semibold">
                                            All features unlocked!!!
                                        </p>
                                        <div className="mt-2 flex mx-auto w-full justify-start">
                                            <Link
                                                href="/Dashboard/account"
                                                className="bg-confirm font-semibold duration-300 text-black py-2 px-4  shadow-md hover:shadow-lg hover:shadow-black shadow-black text-xs sm:text-lg rounded"
                                            >
                                                Manage Account
                                            </Link>
                                        </div>
                                    </div>
                                )}
                                <div className="flex flex-row gap-5 w-full ">
                                    <div className='border border-gray-300 shadow-md shadow-black p-4 rounded-lg bg-white w-full'>
                                        <h2 className="text-2xl font-bold mb-4">User Info</h2>
                                        <div className="p-5 bg-[#EAEEFE] flex flex-col rounded-lg border w-full border-gray-300">
                                            <p className='text-lg font-semibold'>User Email: <span className='font-normal'>{email}</span></p>
                                            <p className='text-lg break-words font-semibold'>User Id: <span className='font-normal'>{userId}</span></p>
                                            <p className='text-lg font-semibold'>
                                                Is Premium:{' '}
                                                <span className='capitalize font-normal'>
                                                    {isPremium ? 'Yes' : 'No'}
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                    <UserTickets />
                                </div>

                            </div>

                        </div>
                    </div>
                </div>
            ) : (
                <LoginForm route="/Dashboard" />
            )}
        </div>
    );
};

export default Dashboard;
