'use client'

import React, { useState, useEffect } from "react"
import ReactPaginate from "react-paginate"
import { doc, updateDoc, deleteDoc, collection, onSnapshot } from 'firebase/firestore'
import { db } from '../../../firebase'
import { toast } from "react-toastify"

const UserList = () => {
    const [currentPage, setCurrentPage] = useState(0)
    const [users, setUsers] = useState([])
    const [premiumStatuses, setPremiumStatuses] = useState({})
    const usersPerPage = 50
    const offset = currentPage * usersPerPage
    const currentUsers = users.slice(offset, offset + usersPerPage)
    const pageCount = Math.ceil(users.length / usersPerPage)

    useEffect(() => {
        // Listen to changes in the users collection
        const unsubscribeUsers = onSnapshot(collection(db, "users"), (snapshot) => {
            const usersList = snapshot.docs.map(doc => ({
                userId: doc.id,
                ...doc.data()
            }))
            setUsers(usersList)
        }, (error) => {
            console.error("Error fetching users:", error)
        })

        // Listen to changes in the premiumStatuses collection
        const unsubscribePremiumStatuses = onSnapshot(collection(db, "premiumStatuses"), (snapshot) => {
            const statuses = {}
            snapshot.forEach((doc) => {
                statuses[doc.id] = doc.data().isPremium
            })
            setPremiumStatuses(statuses)
        }, (error) => {
            console.error("Error fetching premium statuses:", error)
        })

        // Clean up listeners on component unmount
        return () => {
            unsubscribeUsers()
            unsubscribePremiumStatuses()
        }
    }, [])

    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected);
    }

    // Delete user
    const onDelete = async (userId) => {
        if (confirm("Are you sure you want to delete this user?")) {
            try {
                // Delete user from Firestore
                await deleteDoc(doc(db, "users", userId));
                toast.success("User deleted successfully!");
            } catch (error) {
                console.error("Error deleting user:", error);
                toast.error("Error deleting user:", error);
            }
        }
    };

    // Promote user
    const onPromote = async (userId) => {
        if (confirm("Are you sure you want to promote this user?")) {
            try {
                const userDocRef = doc(db, "users", userId);
                await updateDoc(userDocRef, { isAdmin: true });
                toast.success("User promoted successfully!");
            } catch (error) {
                console.error("Error promoting user:", error);
                toast.error("Error promoting user:", error);
            }
        }
    };

    // Demote user
    const onDemote = async (userId) => {
        if (confirm("Are you sure you want to demote this user?")) {
            try {
                const userDocRef = doc(db, "users", userId);
                await updateDoc(userDocRef, { isAdmin: false });
                toast.success("User demoted successfully!");
            } catch (error) {
                console.error("Error demoting user:", error);
                toast.error("Error demoting user:", error);
            }
        }
    };

    return (
        <div className="p-5 bg-white border shadow-md shadow-black border-gray-300 rounded-lg">
            <h2 className="text-2xl font-bold mb-2">
                User List
            </h2>
            <div className="overflow-y-auto max-h-96">
                <table className="min-w-full divide-y divide-gray-200 rounded-lg bg-[#EAEEFE]">
                    <thead>
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Email
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Subscription Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-[#EAEEFE] divide-y divide-gray-200 rounded-b-lg">
                        {currentUsers.map((user) => (
                            <tr key={user.userId}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {user.email}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {premiumStatuses[user.userId] ? "Premium" : "Basic"}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 space-x-2 w-full flex justify-between">
                                    {user.isAdmin ? (
                                        <button
                                            onClick={() => onDemote(user.userId)}
                                            className="text-confirm font-semibold hover:opacity-60 duration-300"
                                        >
                                            Demote
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => onPromote(user.userId)}
                                            className="text-confirm font-semibold hover:opacity-60 duration-300"
                                        >
                                            Promote
                                        </button>
                                    )}
                                    <button
                                        onClick={() => onDelete(user.userId)}
                                        className="text-destructive font-semibold hover:opacity-60 duration-300"
                                    >
                                        Delete Data
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <ReactPaginate
                previousLabel={"Previous"}
                nextLabel={"Next"}
                pageCount={pageCount}
                onPageChange={handlePageClick}
                containerClassName={"pagination flex justify-between mt-4 items-center"}
                pageClassName={"cursor-pointer hover:opacity-60 duration-300"}
                activeClassName={"px-2 py-1 text-destructive"}
                previousClassName={"px-3 py-1 text-confirm hover:opacity-60 duration-300 rounded-md cursor-pointer"}
                nextClassName={"px-3 py-1 text-confirm hover:opacity-60 duration-300 rounded-md cursor-pointer"}
                disabledClassName={"text-gray-400 cursor-not-allowed"}
            />
        </div>
    );
};

export default UserList;
