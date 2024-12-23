// components/SupportForm.js

import React, { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../../../firebase';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthProvider';

export default function SupportForm({ onClose }) {
    const { user } = useAuth();
    const [ticketType, setTicketType] = useState('Bug');
    const [isSubmitted, setIsSubmitted] = useState(false);

    // Handle form submission
    const submitSupportForm = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);

        if (user) {
            try {
                // Add the support ticket to the supportTickets collection
                await addDoc(collection(db, 'supportTickets'), {
                    userId: user.uid,
                    type: ticketType,
                    message: data.message,
                    timestamp: new Date().getTime(),
                    ticketStatus: 'submitted', // Default ticket status is open,
                });

                // Clear the form and show a success message
                toast.success('Support ticket submitted successfully!');
                setIsSubmitted(true);
                setTimeout(() => {
                    setIsSubmitted(false);
                    onClose();
                }, 3000);
            } catch (error) {
                console.error('Error submitting support ticket:', error);
                alert('Failed to submit the support ticket. Please try again.');
            }
        } else {
            alert('You must be logged in to submit a support ticket.');
        }
    };

    return (
        <div className="inset-0 flex fixed w-full h-full bg-black/95 justify-center">
            <form onSubmit={submitSupportForm} className="w-full h-full flex flex-col absolute items-center justify-center max-w-xl mx-auto px-10">
                <h2 className="text-2xl text-center font-bold text-white mb-4">Submit Support Ticket</h2>
                <select
                    name="type"
                    value={ticketType}
                    onChange={(e) => setTicketType(e.target.value)}
                    className="w-full p-2 rounded-md mb-4"
                >
                    <option value="">Select Type</option>
                    <option value="Bug">Bug</option>
                    <option value="Feature Request">Feature Request</option>
                    <option value="Help">Help</option>
                </select>
                <textarea rows={4} name="message" placeholder="Your Message" className="w-full p-2 rounded-md mb-4" />
                <button type="submit" className="bg-confirm text-black w-full p-2 rounded-md hover:bg-confirm/60 transition duration-300 font-semibold">
                    Submit
                </button>
                <button className="btn btn-text text-destructive hover:opacity-60 duration-300" onClick={onClose}>
                    Cancel
                </button>
            </form>
        </div>
    );
}
