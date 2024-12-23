'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../context/AuthProvider'
import { doc, getDoc, getDocs, collection } from 'firebase/firestore'
import { db, initFirebase } from '../../../firebase'
import NavBar from '../navbar'
import Announcements from './Announcements'
import AdminTickets from './AdminTickets'
import UserList from './UserList'
import Footer from '../footer'
import LoginForm from '../user/SignIn'
import { getAuth } from '@firebase/auth'
import CreateNewsletter from './Newsletter'

const AdminDashboard = () => {
    const { user, loading, signOut } = useAuth();
    const [isAdmin, setIsAdmin] = useState(false);
    const [users, setUsers] = useState([]);
    const [showUserList, setShowUserList] = useState(true);
    const [showAnnouncements, setShowAnnouncements] = useState(false);
    const [showAdminTickets, setShowAdminTickets] = useState(false);
    const [showCreateNewsletter, setShowCreateNewsletter] = useState(false);

    const router = useRouter();

    const app = initFirebase()
    const auth = getAuth(app)

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (authUser) => {
            if (authUser) {
                const userDocRef = doc(db, "users", authUser.uid);
                const userDoc = await getDoc(userDocRef);

                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    if (userData.isAdmin) {
                        setIsAdmin(true);
                        fetchUsers();
                    } else {
                        setIsAdmin(false);
                        console.log('User is not admin, redirecting...');
                    }
                } else {
                    setIsAdmin(false);
                    console.log('No such document, redirecting!');
                }
            } else {
                setIsAdmin(false);
                console.log('No user found, redirecting!');
            }
        });

        // Cleanup listener on unmount
        return () => unsubscribe();
    }, [router]);

    const fetchUsers = async () => {
        try {
            const usersCollection = collection(db, "users");
            const userSnapshot = await getDocs(usersCollection);
            const usersList = userSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setUsers(usersList);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <NavBar />
            {isAdmin ? (
                <div className='px-5 max-w-6xl min-h-screen h-full justify-start mx-auto pt-6 flex flex-col w-full'>
                    <h1 className='section-title'>
                        Admin Dashboard
                    </h1>
                    <div className='flex gap-4 my-4 mx-auto w-full justify-center'>
                        <button
                            onClick={() => {
                                setShowUserList(true);
                                setShowAnnouncements(false);
                                setShowAdminTickets(false);
                                setShowCreateNewsletter(false);
                            }}
                            className={`btn text-black font-semibold shadow-md shadow-black hover:shadow-black hover:shadow-lg duration-300 ${showUserList ? 'bg-destructive' : 'bg-confirm'}`}
                        >
                            User List
                        </button>
                        <button
                            onClick={() => {
                                setShowUserList(false);
                                setShowAnnouncements(true);
                                setShowAdminTickets(false);
                                setShowCreateNewsletter(false);
                            }}
                            className={`btn text-black font-semibold shadow-md shadow-black hover:shadow-black hover:shadow-lg duration-300 ${showAnnouncements ? 'bg-destructive' : 'bg-confirm'}`}
                        >
                            Announcements
                        </button>
                        <button
                            onClick={() => {
                                setShowUserList(false);
                                setShowAnnouncements(false);
                                setShowAdminTickets(true);
                                setShowCreateNewsletter(false);
                            }}
                            className={`btn text-black font-semibold shadow-md shadow-black hover:shadow-black hover:shadow-lg duration-300 ${showAdminTickets ? 'bg-destructive' : 'bg-confirm'}`}
                        >
                            Admin Tickets
                        </button>
                        <button
                            onClick={() => {
                                setShowUserList(false);
                                setShowAnnouncements(false);
                                setShowAdminTickets(false);
                                setShowCreateNewsletter(true);
                            }}
                            className={`btn text-black font-semibold shadow-md shadow-black hover:shadow-black hover:shadow-lg duration-300 ${showCreateNewsletter ? 'bg-destructive' : 'bg-confirm'}`}
                        >
                            Create Newsletter
                        </button>
                    </div>
                    <div>
                        {showUserList && <UserList users={users} />}
                        {showAnnouncements && <Announcements />}
                        {showAdminTickets && <AdminTickets />}
                        {showCreateNewsletter && <CreateNewsletter />}
                    </div>
                </div>
            ) : (
                <LoginForm route={'/Admin'} />
            )}
            <Footer />
        </div>
    );
};

export default AdminDashboard;
