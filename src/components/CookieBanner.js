'use client'

import { useState, useEffect } from "react";

const CookieBanner = () => {
    const [isVisible, setIsVisible] = useState(true);

    // Ensure this effect runs only on the client side
    useEffect(() => {
        // Check if the cookie is already set
        if (document.cookie.includes("cookies_accepted=true")) {
            setIsVisible(false); // Hide banner if cookie exists
        }
    }, []);

    const handleAccept = () => {
        // Set a cookie to remember the user's choice
        document.cookie = "cookies_accepted=true; max-age=31536000; path=/"; // 1 year expiration
        setIsVisible(false);
    };

    if (!isVisible) return null; // Return null if the banner is not visible

    return (
        <div className="sticky flex flex-col sm:flex-row justify-center items-center bottom-0 left-0 w-full bg-black text-white p-4 shadow-lg z-50">
            <div className="flex flex-col sm:flex-row justify-between items-center w-full mx-auto space-y-3 sm:space-y-0 sm:space-x-4">
                <p className="text-xs sm:text-sm text-center sm:text-left w-full sm:w-auto">
                    We use cookies to improve your experience on our site. By continuing to browse, you agree to our use of cookies.
                </p>
                <button
                    onClick={handleAccept}
                    className="bg-confirm hover:bg-opacity-60 duration-300 text-white px-4 py-2 rounded-lg text-sm w-full sm:w-auto"
                >
                    Accept
                </button>
            </div>
        </div>
    );
};

export default CookieBanner;
