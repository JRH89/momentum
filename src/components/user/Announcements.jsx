'use client';

import React, { useEffect, useState } from "react";
import { getDoc, getFirestore, collection, getDocs, doc, updateDoc, arrayUnion } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const Announcements = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showOverlay, setShowOverlay] = useState(true); // State to control the visibility of the overlay
    const auth = getAuth();
    const user = auth.currentUser;
    const db = getFirestore();

    useEffect(() => {
        if (user) {
            loadAnnouncements();
        }
    }, [user]);

    const loadAnnouncements = async () => {
        try {
            // Fetch all announcements
            const announcementsRef = collection(db, "announcements");
            const announcementsSnapshot = await getDocs(announcementsRef);
            const allAnnouncements = announcementsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            // Fetch user's dismissed announcements
            const userDocRef = doc(db, "users", user.uid);
            const userDocSnapshot = await getDoc(userDocRef);
            const userData = userDocSnapshot.data();
            const userDismissed = userData?.dismissedAnnouncements || []; // Default to empty array if not found

            // Filter out dismissed announcements
            const filteredAnnouncements = allAnnouncements.filter(announcement => !userDismissed.includes(announcement.id));

            setAnnouncements(filteredAnnouncements);
            if (filteredAnnouncements.length > 0) {
                setCurrentIndex(0); // Set to first announcement if available
            } else {
                setShowOverlay(false); // Hide overlay if no announcements
            }
        } catch (error) {
            console.error("Error loading announcements:", error);
        }
    };

    const dismissAnnouncement = async (announcementId) => {
        try {
            const userDocRef = doc(db, "users", user.uid);

            // Add the dismissed announcement ID to the user's array
            await updateDoc(userDocRef, {
                dismissedAnnouncements: arrayUnion(announcementId)
            });

            // Move to the next announcement
            const nextIndex = currentIndex + 1;
            if (nextIndex < announcements.length) {
                setCurrentIndex(nextIndex);
            } else {
                // Hide overlay if there are no more announcements
                setShowOverlay(false);
            }
        } catch (error) {
            console.error("Error dismissing announcement:", error);
        }
    };

    if (!showOverlay || announcements.length === 0) {
        return null; // Don't render anything if there are no announcements or overlay should be hidden
    }

    const currentAnnouncement = announcements[currentIndex];

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 z-50 px-5 sm:px-0 text-slate-900">
            {currentAnnouncement && (
                <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
                    <div className="flex flex-row justify-between w-full items-center border-b pb-1 mb-1">
                        <p className="text-lg font-bold">{currentAnnouncement.type}</p>
                        <p className="text-sm font-bold">
                            {new Date(currentAnnouncement.timestamp).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'numeric',
                                day: 'numeric'
                            })}
                        </p>
                    </div>
                    <p className="my-4">{currentAnnouncement.message}</p>
                    <button onClick={() => dismissAnnouncement(currentAnnouncement.id)} className="text-white bg-red-500 px-4 py-2 rounded">
                        Dismiss
                    </button>
                </div>
            )}
        </div>
    );
};

export default Announcements;
