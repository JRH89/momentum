'use client';

import React, { useState, useEffect } from 'react';
import { db } from '../../../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';

const LeadCapture = () => {
    const [email, setEmail] = useState('');
    const [isSubscribed, setIsSubscribed] = useState(true);
    const [show, setShow] = useState(false);
    const [dontShowAgain, setDontShowAgain] = useState(false);

    useEffect(() => {
        // Check localStorage to see if popup should be shown
        if (!localStorage.getItem('dontShowAgain')) {
            const timer = setTimeout(() => {
                setShow(true);
            }, 10000); // Show after 10 seconds

            return () => clearTimeout(timer); // Clean up the timer on unmount
        }
    }, []);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (email) {
            try {
                // Add the email to the waitingList collection
                await addDoc(collection(db, 'waitingList'), {
                    email,
                    isSubscribed,
                });
                // Reset the form
                setEmail('');
                setIsSubscribed(true);
                setShow(false);
                // Show success toast
                toast.success('Thank you for subscribing!');

                // Set localStorage flag if the user subscribed
                if (dontShowAgain) {
                    localStorage.setItem('dontShowAgain', 'true');
                }
            } catch (error) {
                console.error('Error adding document: ', error);
            }
        }
    };

    // Handle close button click
    const handleClose = () => {
        setShow(false);
        if (dontShowAgain) {
            localStorage.setItem('dontShowAgain', 'true');
        }
    };

    return (
        show && (
            <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50">
                <div className="bg-white p-6 pb-2 rounded-lg shadow-lg w-80">
                    <h2 className="text-xl mb-4 font-semibold text-center">
                        Join our waiting list to receive updates and exclusive offers!
                    </h2>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            className="w-full p-2 mb-4 border border-gray-300 rounded"
                            required
                        />
                        <div className="flex flex-col justify-center">
                            <button
                                type="submit"
                                className="w-full p-2 bg-confirm rounded btn btn-primary text-center mx-auto justify-center text-black shadow-black shadow-md hover:shadow-lg hover:shadow-black duration-300"
                            >
                                Subscribe
                            </button>
                            <div className="flex flex-row justify-between w-full items-center  align-middle mt-6 px-5">
                                <input
                                    type="checkbox"
                                    checked={dontShowAgain}
                                    onChange={() => setDontShowAgain(!dontShowAgain)}
                                    className="mr-2"
                                />
                                <label className='text-sm w-full'>Don&apos;t show again</label>
                                <button
                                    type="button"
                                    className="btn btn-text text-destructive mx-auto text-center justify-end p-0 hover:opacity-60 duration-300"
                                    onClick={handleClose}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        )
    );
};

export default LeadCapture;
