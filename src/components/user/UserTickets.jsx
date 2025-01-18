import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthProvider";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../../../firebase"; // Make sure this path is correct
import { format } from "date-fns";
import SupportForm from "./SupportTicketForm";
import { Plus } from "lucide-react";
import { Bug } from "lucide-react";

export default function UserTickets() {
  const { user, loading } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loadingTickets, setLoadingTickets] = useState(true);

  const [showForm, setShowForm] = useState(false);

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
            const userTickets = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
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
    <div className="px-4">
      <div className="flex flex-row items-center justify-start gap-4 mb-2">
        <h2 className="text-3xl font-bold flex flex-row gap-2 items-center">
          <Bug className="w-8 h-8" /> Support Tickets
        </h2>
        <button
          onClick={() => setShowForm(true)}
          className=" text-black flex items-center flex-row font-bold text-xl rounded"
        >
          [
          <Plus className="w-6 h-6 text-green-500 hover:rotate-90 duration-300" />
          ]
        </button>
      </div>
      <div>
        <ul className=" grid grid-cols-1 sm:grid-cols-2 gap-4">
          {tickets.length === 0 && (
            <p className="px-4 text-gray-600">No tickets found.</p>
          )}
          {tickets.map((ticket) => (
            <li
              key={ticket.id}
              className="p-4 shadow-md shadow-black border-2 border-black bg-[#EAEEFE] rounded-lg"
            >
              <p className="font-bold text-lg">{ticket.type}</p>
              <p className="text-gray-500">
                {format(new Date(ticket.timestamp), "MMMM dd, yyyy")}
              </p>
              <p>{ticket.message}</p>
              <p>
                Status:{" "}
                <span className="font-bold capitalize">
                  {ticket.ticketStatus}
                </span>
              </p>
            </li>
          ))}
        </ul>
      </div>
      {showForm && <SupportForm onClose={() => setShowForm(false)} />}
    </div>
  );
}
