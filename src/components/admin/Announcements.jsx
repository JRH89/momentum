import { useAuth } from '../../context/AuthProvider';
import React, { useState, useEffect } from 'react';
import { db } from '../../../firebase';
import { doc, getDoc, onSnapshot, collection, addDoc, deleteDoc } from 'firebase/firestore';
import { Minus, Plus } from 'lucide-react';
import { toast } from 'react-toastify';
import ReactPaginate from 'react-paginate';

const Announcements = () => {
    const { user, loading } = useAuth();
    const [announcements, setAnnouncements] = useState([]);
    const [announcementType, setAnnouncementType] = useState('');
    const [announcementMessage, setAnnouncementMessage] = useState('');
    const [showAnnouncementForm, setShowAnnouncementForm] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [loadingAnnouncements, setLoadingAnnouncements] = useState(true);

    const announcementsPerPage = 5;

    useEffect(() => {
        const fetchData = async () => {
            if (!loading) {
                if (user) {
                    try {
                        const userDocRef = doc(db, "users", user.uid);
                        const userDoc = await getDoc(userDocRef);

                        if (userDoc.exists()) {
                            fetchAnnouncements();
                        } else {
                            console.log('No such document, redirecting!');
                        }
                    } catch (error) {
                        console.error('Error fetching admin status:', error);
                    }
                } else {
                    console.log('No user found, redirecting!');
                }
            }
        };

        // Fetch announcements from Firestore
        const fetchAnnouncements = () => {
            try {
                const announcementsCollection = collection(db, "announcements");

                // Set up a real-time listener
                const unsubscribe = onSnapshot(announcementsCollection, (snapshot) => {
                    const announcementsList = snapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }));
                    setAnnouncements(announcementsList);
                    setLoadingAnnouncements(false);
                });

                // Clean up the listener when the component unmounts
                return () => unsubscribe();

            } catch (error) {
                console.error('Error fetching announcements:', error);
                setLoadingAnnouncements(false);
            }
        };

        fetchAnnouncements();

        fetchData();
    }, [user, loading]);


    // Handle delete announcement
    const handleDeleteAnnouncement = async (id) => {
        const confirmDelete = confirm('Are you sure you want to delete this announcement?');
        if (confirmDelete) {
            try {
                const docRef = doc(db, "announcements", id);
                await deleteDoc(docRef);
                toast.success('Announcement deleted successfully!');
                // No need to manually update the announcements state, as onSnapshot will automatically reflect the deletion.
            } catch (error) {
                console.error('Error deleting announcement:', error);
                toast.error('Error deleting announcement:', error);
            }
        }
    };

    // Form logic
    const handleCreateAnnouncement = async (e) => {
        e.preventDefault();
        if (announcementType && announcementMessage) {
            try {
                await addDoc(collection(db, "announcements"), {
                    type: announcementType,
                    message: announcementMessage,
                    timestamp: new Date().getTime(),
                });
                setAnnouncementType('');
                setAnnouncementMessage('');
                toast.success('Announcement created successfully!');
                setShowAnnouncementForm(false);
            } catch (error) {
                console.error('Error creating announcement:', error);
                toast.error('Error creating announcement:', error);
            }
        } else {
            toast.error('Please fill out all fields.');
        }
    };

    // Pagination logic
    const handlePageChange = (selectedPage) => {
        setCurrentPage(selectedPage.selected);
    };

    const indexOfLastAnnouncement = (currentPage + 1) * announcementsPerPage;
    const indexOfFirstAnnouncement = indexOfLastAnnouncement - announcementsPerPage;
    const currentAnnouncements = announcements.slice(indexOfFirstAnnouncement, indexOfLastAnnouncement);

    return (
        <div className='p-5 border h-full shadow-md shadow-black bg-white border-gray-300 rounded-xl flex flex-col w-full'>
            <div className='flex gap-2 items-center mb-2'>
                <h2 className="text-2xl font-bold">
                    Announcements
                </h2>
                {showAnnouncementForm ?
                    <Minus className="w-6 h-6 cursor-pointer text-destructive" onClick={() => setShowAnnouncementForm(!showAnnouncementForm)} />
                    :
                    <Plus className="w-6 h-6 text-confirm cursor-pointer" onClick={() => setShowAnnouncementForm(!showAnnouncementForm)} />
                }
            </div>
            <div>
                {showAnnouncementForm &&
                    <div className='inset-0 fixed w-full h-full my-auto bg-black/95 flex flex-col px-5'>
                        <form onSubmit={handleCreateAnnouncement} className="space-y-4 max-w-md w-full flex flex-col mx-auto justify-center h-full my-auto">
                            <h2 className="text-2xl text-center font-bold text-white">Create Announcement</h2>
                            <select
                                id="type"
                                value={announcementType}
                                onChange={(e) => setAnnouncementType(e.target.value)}
                                className="mt-1 block w-full border border-gray-300 bg-white rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            >
                                <option value="">
                                    Select Type
                                </option>
                                <option value="Bug">
                                    Bug
                                </option>
                                <option value="Feature">
                                    Feature
                                </option>
                                <option value="Update">
                                    Update
                                </option>
                            </select>
                            <textarea
                                placeholder='Enter announcement message...'
                                id="message"
                                value={announcementMessage}
                                onChange={(e) => setAnnouncementMessage(e.target.value)}
                                rows="4"
                                className="mt-1 bg-white p-2 px-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                            <button
                                type="submit"
                                className="bg-confirm text-black py-2 px-4 rounded-md hover:bg-opacity-60 duration-300 shadow-md font-semibold shadow-black hover:shadow-lg hover:shadow-black"
                            >
                                Create
                            </button>
                            <button className='text-destructive' onClick={() => setShowAnnouncementForm(!showAnnouncementForm)}>Cancel</button>
                        </form>
                    </div>
                }
            </div>
            <div className="flex w-full flex-col h-full">
                {currentAnnouncements.length > 0 ? (
                    <ul className="space-y-4 flex flex-col h-full">
                        {currentAnnouncements.map((announcement) => (
                            <li key={announcement.id} className="flex h-full justify-between items-center bg-[#EAEEFE] p-4 border border-gray-300 rounded-lg">
                                <div className='flex flex-col h-full'>
                                    <p className="font-bold text-lg">
                                        {announcement.type}
                                    </p>
                                    <p className='text-gray-500'>
                                        {new Date(announcement.timestamp).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                                    </p>
                                    <p className='flex w-auto my-auto max-w-xs'>
                                        {announcement.message}
                                    </p>
                                </div>
                                <button
                                    onClick={() => handleDeleteAnnouncement(announcement.id)}
                                    className="bg-destructive text-white py-2 px-4 rounded-md hover:shadow-lg hover:shadow-black shadow-md shadow-black hover:bg-opacity-60 duration-300"
                                >
                                    Delete
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No announcements found.</p>
                )}
                <div className="mt-4">
                    <ReactPaginate
                        pageCount={Math.ceil(announcements.length / announcementsPerPage)}
                        previousLabel={'Previous'}
                        nextLabel={'Next'}
                        breakLabel={'...'}
                        breakClassName={'break-me'}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={3}
                        onPageChange={handlePageChange}
                        containerClassName={"pagination flex justify-between mt-4 items-center"}
                        activeClassName={"px-2 py-1 text-destructive"}
                        pageClassName={'inline-block p-2 mx-1 rounded-md cursor-pointer'}
                        previousClassName={"px-3 py-1 text-confirm hover:opacity-60 duration-300 rounded-md cursor-pointer"}
                        nextClassName={"px-3 py-1 text-confirm hover:opacity-60 duration-300 rounded-md cursor-pointer"}
                        disabledClassName={"text-gray-400 cursor-not-allowed"}
                    />
                </div>
            </div>
        </div>
    )
}

export default Announcements;
