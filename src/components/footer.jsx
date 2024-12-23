'use client'

import { Bug, Cookie, HelpCircle, Info } from "lucide-react";
import Link from "next/link";
import siteMetadata from "../../siteMetadata";
import { useAuth } from "../context/AuthProvider";
import { useState } from "react";
import SupportForm from "./user/SupportTicketForm";

export default function Footer() {
    const { user } = useAuth();
    const [showSupportForm, setShowSupportForm] = useState(false);

    return (
        <footer data-testid="footer" className="bg-primary min-h-screen text-black w-full flex flex-col items-center justify-between">
            <div className="flex flex-col mx-auto text-center content-center justify-center items-center text-lg sm:text-2xl gap-5 py-4 w-auto text-gray-800 md:text-3xl my-auto self-center">
                <Link href="/About" className="py-2 shadow-md shadow-black bg-confirm text-black rounded w-full max-w-xs px-5 text-center hover:bg-confirm/60 transition duration-300 flex items-center gap-2 hover:shadow-black hover:shadow-lg">
                    <Info className="w-7 h-7" />
                    <span className="mx-auto text-center">About</span>
                </Link>
                <Link href="/FAQ" className="py-2 shadow-md hover:shadow-black hover:shadow-lg shadow-black bg-confirm text-black rounded w-full max-w-xs px-5 text-center hover:bg-confirm/60 transition duration-300 flex items-center gap-2">
                    <HelpCircle className="w-7 h-7" />
                    <span className="mx-auto text-center">FAQ</span>
                </Link>
                <Link href="/Policies" className="py-2 shadow-md hover:shadow-black hover:shadow-lg shadow-black bg-confirm text-black rounded w-full max-w-xs px-5 text-center hover:bg-confirm/60 transition duration-300 flex items-center gap-2">
                    <Cookie className="w-7 h-7" />
                    <span className="mx-auto text-center">Policies</span>
                </Link>
                <button onClick={() => setShowSupportForm(!showSupportForm)} className="py-2 shadow-md hover:shadow-black hover:shadow-lg shadow-black bg-confirm text-black rounded w-full max-w-xs px-5 text-center hover:bg-confirm/60 transition duration-300 flex items-center gap-2">
                    <Bug className="w-7 h-7" />
                    <span className="mx-auto text-center">Support</span>
                </button>
            </div>
            <div className="font-bold text-center w-full flex flex-col justify-end text-lg sm:text-2xl">
                <p className="">&copy; {new Date().getFullYear()} <a className="hover:opacity-60 transition duration-300" href={`${siteMetadata.siteUrl}`}>{siteMetadata.title}</a></p>
            </div>
            {showSupportForm && (
                <SupportForm onClose={() => setShowSupportForm(false)} />
            )}
        </footer>
    );
}
