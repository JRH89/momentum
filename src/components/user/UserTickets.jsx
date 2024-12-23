import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthProvider";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../../../firebase"; // Make sure this path is correct
import { format } from 'date-fns';

export default function UserTickets() {
    const { user, loading } = useAuth();
    const [tickets, setTickets] = useState([]);
    const [loadingTickets, setLoadingTickets] = useState(true);

    useEffect(() => {
        let unsubscribe;

        if (user) {
            const fetchTickets = () => {
                setLoadingTickets(true);
                try {
                    const ticketsQuery = query(
                        collection(db, "supportTickets"),
                        where("userId", "==", user.uid)
                    );

                    // Set up a real-time listener
                    unsubscribe = onSnapshot(ticketsQuery, (snapshot) => {
                        const userTickets = snapshot.docs.map(doc => ({
                            id: doc.id,
                            ...doc.data()
                        }));
                        setTickets(userTickets);
                        setLoadingTickets(false);
                    });
                } catch (error) {
                    console.error("Error fetching tickets:", error);
                    setLoadingTickets(false);
                }
            };

            fetchTickets();
        }

        // Cleanup the listener when the component unmounts
        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, [user]);

    if (loading || loadingTickets) {
        return <p>Loading tickets...</p>;
    }

    return (
        <div className='border w-full bg-white border-gray-300 shadow-md shadow-black p-4 rounded-lg'>
            <h2 className="text-2xl font-bold mb-4">Support Tickets</h2>
            <div>
                <ul className="space-y-4">
                    {tickets.length === 0 && <p className="p-4 border border-gray-300 bg-[#EAEEFE] rounded-lg shadow-sm">No tickets found.</p>}
                    {tickets.map(ticket => (
                        <li key={ticket.id} className="p-4 border border-gray-300 bg-[#EAEEFE] rounded-lg shadow-sm">
                            <p className="font-bold text-lg">{ticket.type}</p>
                            <p className="text-gray-500">
                                {format(new Date(ticket.timestamp), 'MMMM dd, yyyy')}
                            </p>
                            <p>{ticket.message}</p>
                            <p>Status: <span className="font-bold capitalize">{ticket.ticketStatus}</span></p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
