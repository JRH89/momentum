'use client'

import React, { useState, useEffect } from 'react';
import { addDoc, collection, getDocs, deleteDoc, doc, query, where } from 'firebase/firestore';
import { db } from '../../../firebase';
import dynamic from 'next/dynamic';
import { Minus, Plus } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';
import ReactPaginate from 'react-paginate';

const RichTextEditor = dynamic(() => import('@mantine/rte'), { ssr: false });

const CreateNewsletter = () => {
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [body, setBody] = useState('');
    const [loading, setLoading] = useState(false);
    const [showNewsletterForm, setShowNewsletterForm] = useState(false);
    const [newsletters, setNewsletters] = useState([]);

    const [currentPage, setCurrentPage] = useState(0); // For tracking the current page
    const newslettersPerPage = 1; // Display one newsletter per page

    // Fetch newsletters from Firestore
    useEffect(() => {
        const fetchNewsletters = async () => {
            try {
                const newslettersCollection = collection(db, 'newsletters');
                const newsletterSnapshot = await getDocs(newslettersCollection);
                const newslettersList = newsletterSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setNewsletters(newslettersList);
            } catch (error) {
                console.error('Error fetching newsletters:', error);
            }
        };

        fetchNewsletters();
    }, []);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const docRef = await addDoc(collection(db, 'newsletters'), {
                title,
                author,
                body,
                date: new Date().getTime(),
            });

            // Set success toast
            toast.success('Newsletter created successfully!');
            setTitle('');
            setAuthor('');
            setBody('');
            setShowNewsletterForm(false);

            const newslettersCollection = collection(db, 'newsletters');
            const newsletterSnapshot = await getDocs(newslettersCollection);
            const newslettersList = newsletterSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setNewsletters(newslettersList);

            const usersCollection = collection(db, 'users');
            const q = query(usersCollection, where('isSubscribed', '==', true));
            const usersSnapshot = await getDocs(q);
            const emails = usersSnapshot.docs.map(userDoc => userDoc.data().email);

            // Send newsletter to subscribed users
            await axios.post('/api/sendNewsletter', {
                emails,
                subject: title,
                html: body,
            });

            // Set success toast
            toast.success('Newsletter sent to subscribed users!');
        } catch (error) {
            console.error('Error creating newsletter:', error);
            toast.error('Failed to create newsletter');
        } finally {
            setLoading(false);
        }
    };

    // Delete newsletter
    const handleDelete = async (id) => {
        const confirmDelete = confirm('Are you sure you want to delete this newsletter?');
        if (confirmDelete) {
            try {
                const docRef = doc(db, 'newsletters', id);
                await deleteDoc(docRef);
                toast.success('Newsletter deleted successfully!');
                setNewsletters(newsletters.filter(newsletter => newsletter.id !== id));
            } catch (error) {
                console.error('Error deleting newsletter:', error);
                toast.error('Error deleting newsletter:', error);
            }
        }
    };

    const handlePageClick = (data) => {
        setCurrentPage(data.selected);
    };

    const displayNewsletters = newsletters.slice(currentPage * newslettersPerPage, (currentPage + 1) * newslettersPerPage);

    return (
        <div className='p-5 border h-full shadow-md shadow-black bg-white border-gray-300 rounded-xl flex flex-col w-full'>
            <div className='flex gap-2 items-center mb-2'>
                <h2 className="text-2xl font-bold">
                    Newsletter
                </h2>
                {showNewsletterForm ?
                    <Minus className="w-6 h-6 cursor-pointer text-destructive" onClick={() => setShowNewsletterForm(!showNewsletterForm)} />
                    :
                    <Plus className="w-6 h-6 text-confirm cursor-pointer" onClick={() => setShowNewsletterForm(!showNewsletterForm)} />
                }
            </div>
            {showNewsletterForm &&
                <div className='inset-0 top-20 fixed w-full h-full my-auto bg-black/95 flex flex-col px-5'>
                    <form onSubmit={handleSubmit} className="space-y-4 max-w-md w-full flex flex-col mx-auto justify-center h-full my-auto">
                        <h2 className="text-2xl text-center font-bold text-white">Create Newsletter</h2>
                        <div>
                            <input
                                placeholder="Title"
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>
                        <div>
                            <input
                                placeholder="Author"
                                type="text"
                                value={author}
                                onChange={(e) => setAuthor(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>
                        <div>
                            <RichTextEditor
                                value={body}
                                onChange={setBody}
                                controls={[
                                    ['bold', 'italic', 'underline', 'link'],
                                    ['blockquote', 'code'],
                                    ['unorderedList', 'orderedList'],
                                ]}
                                styles={{
                                    root: {
                                        minHeight: 300,
                                        maxHeight: 500,
                                        overflowY: 'auto',
                                    },
                                }}
                            />
                        </div>
                        <button
                            type="submit"
                            className={`bg-confirm text-black py-2 px-4 rounded-md hover:bg-opacity-60 duration-300 shadow-md font-semibold shadow-black hover:shadow-lg hover:shadow-black ${loading ? 'bg-gray-500' : 'bg-blue-500'}`}
                            disabled={loading}
                        >
                            {loading ? 'Creating...' : 'Create Newsletter'}
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowNewsletterForm(false)}
                            className="text-destructive py-2 px-4 rounded-md hover:bg-opacity-60 duration-300 shadow-md font-semibold shadow-black hover:shadow-lg hover:shadow-black"
                        >
                            Cancel
                        </button>
                    </form>
                </div>
            }
            <div className="mt-5">
                {displayNewsletters.length > 0 ? (
                    <ul className="space-y-4">
                        {displayNewsletters
                            .sort((a, b) => b.date - a.date) // Sort from newest to oldest
                            .map((newsletter) => (
                                <li key={newsletter.id} className="flex flex-row p-4 border border-gray-300 rounded-lg bg-[#EAEEFE] justify-between align-middle items-center">
                                    <div>
                                        <h3 className="text-xl font-bold">{newsletter.title}</h3>
                                        <p className="text-gray-600">By: {newsletter.author}</p>
                                        <p className="mt-2" dangerouslySetInnerHTML={{ __html: newsletter.body }}></p>
                                        <p className="text-gray-500 text-sm mt-2">
                                            {new Date(newsletter.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                                        </p>
                                    </div>
                                    <div>
                                        <button
                                            onClick={() => handleDelete(newsletter.id)}
                                            className="mt-2 mx-auto bg-destructive text-black font-semibold py-2 px-4 rounded-md hover:shadow-lg hover:shadow-black shadow-md shadow-black duration-300"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </li>
                            ))}

                    </ul>
                ) : (
                    <p>No newsletters found.</p>
                )}
            </div>
            <ReactPaginate
                previousLabel={'Previous'}
                nextLabel={'Next'}
                breakLabel={'...'}
                breakClassName={'break-me'}
                pageCount={Math.ceil(newsletters.length / newslettersPerPage)}
                marginPagesDisplayed={2}
                pageRangeDisplayed={3}
                onPageChange={handlePageClick}
                containerClassName={"pagination flex justify-between mt-4 items-center"}
                activeClassName={"px-2 py-1 text-destructive"}
                pageClassName={'inline-block p-2 mx-1 rounded-md cursor-pointer'}
                previousClassName={"px-3 py-1 text-confirm hover:opacity-60 duration-300 rounded-md cursor-pointer"}
                nextClassName={"px-3 py-1 text-confirm hover:opacity-60 duration-300 rounded-md cursor-pointer"}
                disabledClassName={"text-gray-400 cursor-not-allowed"}
            />
        </div>
    );
};

export default CreateNewsletter;
