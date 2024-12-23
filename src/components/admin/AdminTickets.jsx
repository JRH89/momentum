'use client'

import React, { useState, useEffect, useRef } from "react";
import ReactPaginate from "react-paginate";
import { collection, getDocs, updateDoc, doc, query, deleteDoc, orderBy } from "firebase/firestore";
import { db } from "../../../firebase";
import { format } from 'date-fns';
import { toast } from "react-toastify";

export default function AdminTickets() {
    const [tickets, setTickets] = useState([]);
    const [loadingTickets, setLoadingTickets] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const ticketsPerPage = 5; // Adjust as needed
    const ticketsRef = useRef(tickets);

    // Update ref when tickets change
    useEffect(() => {
        ticketsRef.current = tickets;
    }, [tickets]);

    // Fetch tickets on component mount
    useEffect(() => {
        const fetchTickets = async () => {
            setLoadingTickets(true);
            try {
                const ticketsQuery = query(
                    collection(db, "supportTickets"),
                    // Order by timestamp in descending order
                    orderBy("timestamp", "desc")
                );
                const querySnapshot = await getDocs(ticketsQuery);
                const allTickets = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setTickets(allTickets);
            } catch (error) {
                console.error("Error fetching tickets:", error);
            } finally {
                setLoadingTickets(false);
            }
        };

        fetchTickets();
    }, []);


    // Handle status change locally
    const handleStatusChange = (ticketId, newStatus) => {
        setTickets(prevTickets =>
            prevTickets.map(ticket =>
                ticket.id === ticketId ? { ...ticket, ticketStatus: newStatus } : ticket
            )
        );
    };

    // Save status change to Firestore
    const saveStatusChange = async (ticketId, newStatus) => {
        try {
            const ticketRef = doc(db, "supportTickets", ticketId);

            const updateData = {
                ticketStatus: newStatus,
            };

            // Add resolved timestamp if resolved
            if (newStatus === "resolved") {
                updateData.resolvedTimestamp = Date.now();
            }

            await updateDoc(ticketRef, updateData);

            toast.success("Ticket status updated successfully!");
        } catch (error) {
            console.error("Error updating ticket status:", error);
        }
    };

    // Cleanup old resolved tickets periodically
    useEffect(() => {
        const deleteOldResolvedTickets = async () => {
            try {
                const resolvedTickets = ticketsRef.current.filter(
                    ticket =>
                        ticket.ticketStatus === "resolved" &&
                        Date.now() - ticket.resolvedTimestamp > 48 * 60 * 60 * 1000
                );

                for (let ticket of resolvedTickets) {
                    await deleteDoc(doc(db, "supportTickets", ticket.id));
                }

                // Update tickets state without causing re-render loop
                setTickets(prevTickets =>
                    prevTickets.filter(ticket => !resolvedTickets.includes(ticket))
                );
            } catch (error) {
                console.error("Error deleting old resolved tickets:", error);
            }
        };

        deleteOldResolvedTickets();
    }, []); // Empty dependency array to run only once on mount

    // Pagination logic
    const offset = currentPage * ticketsPerPage;
    const currentTickets = tickets.slice(offset, offset + ticketsPerPage);
    const pageCount = Math.ceil(tickets.length / ticketsPerPage);

    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected);
    };

    if (loadingTickets) {
        return <p>Loading tickets...</p>;
    }

    return (
        <div className="p-5 border bg-white shadow-md shadow-black border-gray-300 rounded-xl h-full flex flex-col w-full">
            <h2 className="text-2xl font-bold mb-2">
                Support Tickets
            </h2>
            <div className="overflow-y-auto flex-grow">
                <ul className="space-y-4">
                    {currentTickets.length === 0 ? (
                        <div className="flex items-center  w-full h-full">
                            <div className="p-4 border bg-[#EAEEFE] shadow-md border-gray-300 rounded-lg">
                                <p>No support tickets found.</p>
                            </div>
                        </div>
                    ) : (
                        currentTickets.map(ticket => (
                            <li key={ticket.id} className="p-4 bg-[#EAEEFE] border border-gray-300 rounded-md shadow-sm flex flex-row w-full justify-between items-center">
                                <div className="flex h-full flex-col">
                                    <p className="font-bold text-lg">
                                        {ticket.type}
                                    </p>
                                    <p className="text-gray-500">
                                        {format(new Date(ticket.timestamp), 'MMMM dd, yyyy')}
                                    </p>
                                    <p>
                                        {ticket.message}
                                    </p>
                                    <p className="capitalize">
                                        Status: {ticket.ticketStatus}
                                    </p>
                                </div>
                                <div>
                                    <select
                                        value={ticket.ticketStatus}
                                        onChange={(e) => handleStatusChange(ticket.id, e.target.value)}
                                        className="mt-2 p-2 border rounded-md"
                                    >
                                        <option value="submitted">
                                            Submitted
                                        </option>
                                        <option value="open">
                                            Open
                                        </option>
                                        <option value="resolved">
                                            Resolved
                                        </option>
                                    </select>
                                    <button
                                        onClick={() => saveStatusChange(ticket.id, ticket.ticketStatus)}
                                        className="ml-2 p-2 px-4 bg-confirm hover:bg-opacity-60 duration-300 shadow-md shadow-black hover:shadow-lg hover:shadow-black text-white rounded-md"
                                    >
                                        Save
                                    </button>

                                </div>
                            </li>
                        ))
                    )}
                </ul>
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
}
