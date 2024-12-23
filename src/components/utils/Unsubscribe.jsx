'use client'

import { useEffect } from 'react'
import { db } from '../../../firebase'
import { collection, query, where, getDocs, updateDoc } from 'firebase/firestore'
import siteMetadata from '../../../siteMetadata'
import { toast } from 'react-toastify'
import NavBar from '../../components/navbar'
import Footer from '../../components/footer'

// Function to unsubscribe user from the database
const unsubscribeUser = async () => {
    try {
        // Check if window object exists (client-side)
        if (typeof window !== 'undefined') {
            // Extract email from the URL query parameters using URLSearchParams
            const url = new URL(window.location.href);
            const email = url.searchParams.get('email'); // Extract the email query parameter

            if (email) {
                // Query the Firestore collection to find the document with the matching email
                const q = query(collection(db, 'users'), where('email', '==', email));
                const querySnapshot = await getDocs(q);

                // Loop through the matching documents (should be just one)
                querySnapshot.forEach(async (doc) => {
                    // Update the document to mark the email as unsubscribed
                    await updateDoc(doc.ref, {
                        isSubscribed: false
                    });
                });

                // Inform the user that they have been unsubscribed
                toast.success('You have been unsubscribed. You will no longer receive emails.');
            } else {
                // Handle case where email is not present in query parameters
                toast.error('Invalid unsubscribe request. Email parameter is missing.');
            }
        }
    } catch (error) {
        console.error('Error unsubscribing:', error);
        toast.error('An error occurred while unsubscribing. Please try again later.');
    }
}

// Page component
const UnsubscribePage = () => {
    useEffect(() => {
        // Execute the unsubscribeUser function when the component mounts
        unsubscribeUser();
    }, []); // Empty dependency array ensures the effect runs only once on mount

    return (
        <>
            <NavBar />
            <div className='text-black text-xl text-center mx-auto my-auto min-h-screen flex flex-col justify-center'>
                You have been unsubscribed. <br />
                You will no longer receive emails from <br />
                <a className='cursor-pointer hover:scale-95 duration-200 text-blue-400' href={siteMetadata.siteUrl}>
                    {siteMetadata.title}
                </a>
            </div>
            <Footer />
        </>
    );
}

export default UnsubscribePage;
