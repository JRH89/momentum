'use client';

import { useAuth } from "../context/AuthProvider";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Loader2, Menu } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getPremiumStatus } from "./payments/account/GetPremiumStatus";
import { getAuth } from "@firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import Breadcrumb from "./BreadcrumbMenu";
import siteMetadata from "../../siteMetadata";
import { initFirebase } from "../../firebase";

const NavBar = () => {
    const { user, loading, logout } = useAuth();
    const [showMenu, setShowMenu] = useState(false);
    const router = useRouter();
    const app = initFirebase()
    const auth = getAuth(app)
    const firestore = getFirestore(app)
    const [isPremium, setIsPremium] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loadingPortal, setLoading] = useState(false);

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

    // Fetch admin status
    useEffect(() => {
        if (user) {
            const docRef = doc(firestore, "users", auth.currentUser.uid);
            getDoc(docRef).then((doc) => {
                if (doc.exists()) {
                    const data = doc.data();
                    setIsAdmin(data.isAdmin);
                } else {
                    console.log("No such document!");
                }
            }).catch((error) => {
                console.log("Error getting document:", error);
            });
        }
    }, [user]);

    // Handle user login
    const handleLogin = async () => {
        setShowMenu(false);
        router.push('/Signin')
    };

    // Handle user signup
    const handleSignup = async () => {
        setShowMenu(false);
        router.push('/Signup')
    };

    // Handle user logout
    const handleLogout = async () => {
        try {
            await logout()
            setShowMenu(false);
        } catch (error) {
            console.error('Logout error:', error.message);
        }
    };

    return (
        <>
            <div className="bg-white py-2 sticky font-semibold top-0 w-full flex flex-row justify-between px-2 sm:px-5 my-auto items-center z-50 h-full align-middle">
                <div className="flex shimmer-container flex-row align-middle items-center gap-1 my-auto h-full">
                    <Link className="my-auto cursor-pointer flex items-center gap-2" href="/">
                        <Image alt="shimmer-image" className="border-2 rounded-md cursor-pointer border-black" src="/logo.png" width={50} height={50} />
                        <h2 alt="shimmer-image" className="text-2xl sm:text-3xl md:text-4xl cursor-pointer font-bold text-black  items-center align-middle h-full">
                            {siteMetadata.title} </h2>
                    </Link>
                </div>
                <div className="align-middle justify-end text-xl md:text-2xl hidden md:flex sm:flex-row">
                    {user ? (
                        <div className="flex flex-row justify-between gap-5 md:gap-10 align-midle items-center">
                            {isAdmin &&
                                <Link onClick={() => setShowMenu(false)} className="hover:text-confirm duration-300 justify-start rounded cursor-pointer text-black flex w-auto" href="/Admin">
                                    <span>Admin</span>
                                </Link>
                            }
                            <Link onClick={() => setShowMenu(false)} className="hover:text-confirm duration-300 justify-start rounded cursor-pointer text-black flex w-auto" href="/Dashboard">
                                <span>Dashboard</span>
                            </Link>
                            <Link
                                onClick={() => setShowMenu(false)}
                                className="hover:text-confirm duration-300 cursor-pointer justify-start rounded  text-black flex w-auto" href="/Dashboard/account">
                                {loadingPortal ? <Loader2 className="w-6 h-6 ml-3 animate-spin duration-300" /> : <span>Account</span>
                                }
                            </Link>
                            <button className="hover:text-confirm duration-300 justify-start rounded  text-black flex w-auto cursor-pointer" onClick={() => {
                                setShowMenu(false);
                                handleLogout()
                            }}>
                                Sign Out
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-row justify-between gap-5 md:gap-10 align-midle items-center">
                            <button className="hover:text-confirm duration-300 justify-start rounded  text-black flex cursor-pointer w-auto" onClick={() => {
                                setShowMenu(false)
                                handleSignup()
                            }}>
                                Sign Up
                            </button>
                            <button className="hover:text-confirm duration-300 justify-start cursor-pointer rounded  text-black flex w-auto" onClick={() => {
                                setShowMenu(false)
                                handleLogin()
                            }}>
                                Sign In
                            </button>
                        </div>
                    )}
                </div>
                <Menu className="cursor-pointer hover:scale-95 duration-300 h-10 w-10 md:hidden hover:text-confirm" onClick={() => setShowMenu(!showMenu)} />
            </div>
            {/* Mobile menu */}
            {showMenu && (
                <div className="w-full fixed h-auto flex justify-center items-center mx-auto bg-white z-50 flex-row gap-5 mt-0 pt-0 p-2 pb-3 text-lg sm:text-2xl">
                    <ul className="text-center items-center text-lg sm:text-2xl flex flex-row mx-auto justify-center gap-1 w-full">
                        {user ? (
                            <div className="text-center mx-auto text-lg sm:text-2xl flex flex-col justify-center items-center font-semibold gap-2">
                                {isAdmin &&
                                    <Link onClick={() => setShowMenu(false)} className="hover:text-confirm duration-300 justify-start rounded cursor-pointer text-black flex w-auto" href="/Admin">
                                        <span>Admin</span>
                                    </Link>
                                }
                                <Link className="hover:text-confirm duration-300 justify-start rounded  text-black flex w-full" href={`/Dashboard`}>
                                    Dashboard
                                </Link>
                                <Link
                                    onClick={() => setShowMenu(false)}
                                    className="hover:text-confirm duration-300 justify-start rounded  text-black flex w-auto" href="/Dashboard/account">
                                    Account
                                </Link>
                                <div className="hover:text-confirm duration-300 justify-center rounded  text-black flex text-center mx-auto w-full cursor-pointer" onClick={() => {
                                    setShowMenu(false);
                                    handleLogout();
                                }}>
                                    Sign Out
                                </div>
                            </div>
                        ) : (
                            <div className="text-center mx-auto text-lg sm:text-2xl flex flex-col justify-center items-center font-semibold gap-2">
                                <li className="hover:text-confirm duration-300 justify-center rounded  text-black cursor-pointer flex w-full text-center" onClick={() => {
                                    setShowMenu(false);
                                    handleSignup();
                                }}>
                                    Sign Up
                                </li>
                                <li className="hover:text-confirm  duration-300 justify-center rounded  text-black flex w-full text-center mx-auto cursor-pointer" onClick={() => {
                                    setShowMenu(false);
                                    handleLogin();
                                }}>
                                    <Link href={'/Signin'}>Sign In</Link>

                                </li>
                            </div>
                        )}
                    </ul>
                </div>
            )}
            <div className="">
                <Breadcrumb
                    homeElement={'Home'}
                    separator={<span> / </span>}
                    activeClasses='bg-gradient-to-r from-confirm to-destructive text-transparent bg-clip-text'
                    containerClasses='flex flex-row text-black px-1 sm:px-4 pt-1'
                    listClasses='hover:underline items-center mx-2 font-bold flex flex-row text-xs sm:text-sm'
                    capitalizeLinks
                />
            </div>
        </>
    );
}

export default NavBar;
