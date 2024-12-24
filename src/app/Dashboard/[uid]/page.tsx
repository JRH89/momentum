// 'use client';

// import React, { useState, useEffect, FormEvent, useRef } from 'react';
// import { auth } from '../../../../firebase';
// import { db } from '../../../../firebase';
// import { addDoc, arrayUnion, collection, doc, getDoc, updateDoc } from 'firebase/firestore';
// import { useRouter } from 'next/navigation';
// import Link from 'next/link';
// import { Plus, PlusIcon } from 'lucide-react';

// const Dashboard = () => {
//   const [user, setUser] = useState<any>(null);
//   const [isDisconnecting, setIsDisconnecting] = useState(false);
//   const [customers, setCustomers] = useState<any[]>([]);
//   const [loadingCustomers, setLoadingCustomers] = useState(false);
//   const [isAddingCustomer, setIsAddingCustomer] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);

//   const router = useRouter();
//   const stripeClientId = process.env.NEXT_PUBLIC_STRIPE_CLIENT_ID!;
  
//   const nameRef = useRef<HTMLInputElement | null>(null);
//   const emailRef = useRef<HTMLInputElement | null>(null);
//   const descriptionRef = useRef<HTMLTextAreaElement | null>(null);

//   // Get the current user state from Firebase
//   useEffect(() => {
//     const unsubscribe = auth.onAuthStateChanged(async (authUser) => {
//       if (authUser) {
//         const userRef = doc(db, 'users', authUser.uid);
//         const userSnap = await getDoc(userRef);
//         if (userSnap.exists()) {
//           const userData = userSnap.data();
//           setUser({ ...authUser, ...userData });
//         } else {
//           console.log('No such document!');
//         }
//       } else {
//         setUser(null);
//       }
//     });
//     return () => unsubscribe();
//   }, []);

//   // Fetch Stripe customers once the user is logged in and has a connected Stripe account
//   useEffect(() => {
//     const fetchStripeCustomers = async () => {
//       if (user && user.stripeAccountId) {
//         setLoadingCustomers(true);
//         try {
//           const response = await fetch(`/api/stripe/customers?stripeAccountId=${user.stripeAccountId}`);
//           const data = await response.json();
//           if (response.ok) {
//             setCustomers(data);
//           } else {
//             console.error('Error fetching customers:', data);
//           }
//         } catch (error) {
//           console.error('Error fetching customers:', error);
//         } finally {
//           setLoadingCustomers(false);
//         }
//       }
//     };

//     fetchStripeCustomers();
//   }, [user]);

//   const handleDisconnectStripe = async () => {
//     if (!user) {
//       alert('No user found');
//       return;
//     }
//     setIsDisconnecting(true);
//     try {
//       await revokeStripeConnection(user.stripeAccountId);
//       const userRef = doc(db, 'users', user.uid);
//       await updateDoc(userRef, { stripeAccountId: null, stripeConnected: false });
//       setIsDisconnecting(false);
//       alert('Stripe account successfully unlinked');
//     } catch (error) {
//       setIsDisconnecting(false);
//       console.error('Error disconnecting Stripe account:', error);
//       alert('There was an error disconnecting your Stripe account.');
//     }
//   };

//   const revokeStripeConnection = async (stripeUserId: string) => {
//     try {
//       const response = await fetch('https://connect.stripe.com/oauth/deauthorize', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/x-www-form-urlencoded',
//         },
//         body: new URLSearchParams({
//           client_id: process.env.NEXT_PUBLIC_STRIPE_CLIENT_ID!,
//           stripe_user_id: stripeUserId,
//         }),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         console.log('Successfully deauthorized the Stripe account');
//       } else {
//         console.error('Failed to deauthorize the Stripe account:', data);
//       }
//     } catch (error) {
//       console.error('Error revoking Stripe OAuth token:', error);
//     }
//   };

//   const handleLogout = async () => {
//     try {
//       await auth.signOut();
//       router.push('/');
//     } catch (error) {
//       console.error('Error signing out:', error);
//     }
//   };

//   const handleAddCustomerClick = () => {
//     setIsAddingCustomer(true);
//   };

//   const handleAddCustomer = async (event: FormEvent<HTMLFormElement>) => {
//     event.preventDefault();

//     // Access form values directly using refs
//     const name = nameRef.current?.value;
//     const email = emailRef.current?.value;
//     const description = descriptionRef.current?.value;

//     if (!name || !email || !description) {
//       alert('All fields (name, email, description) are required.');
//       return;
//     }

//     setIsLoading(true);
//     try {
//       const response = await fetch('/api/stripe/add-customer', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           email,
//           name,
//           description,
//           connectId: user.stripeAccountId,
//         }),
//       });

//       if (!response.ok) {
//         throw new Error('Failed to add customer to Stripe');
//       }

//       const stripeCustomer = await response.json();
//       if (!stripeCustomer?.id) {
//         throw new Error('Failed to retrieve Stripe customer ID');
//       }

//       const userRef = doc(db, 'users', user.uid);
//       const userDoc = await getDoc(userRef);
//       if (!userDoc.exists()) {
//         throw new Error('User does not exist.');
//       }

//       const userData = userDoc.data();
//       if (!userData?.customers || userData.customers.length === 0) {
//         await updateDoc(userRef, {
//           customers: [
//             {
//               email,
//               name,
//               description,
//               stripeCustomerId: stripeCustomer.id,
//               createdAt: new Date(),
//             },
//           ],
//         });
//       } else {
//         await updateDoc(userRef, {
//           customers: arrayUnion({
//             email,
//             name,
//             description,
//             stripeCustomerId: stripeCustomer.id,
//             createdAt: new Date(),
//           }),
//         });
//       }

//       alert('Customer added successfully!');
//       setIsAddingCustomer(false);
//     } catch (error) {
//       console.error('Error:', error);
//       alert('Failed to add customer. Please try again.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className='p-6 bg-gray-50 min-h-screen pt-24'>
//       <div className='max-w-6xl mx-auto'>
        // <div className='flex flex-row items-center border-b justify-between'>
        //   <h1 className='text-3xl font-semibold text-gray-800'>Dashboard</h1>
        //   <h2 className='flex items-baseline gap-1 text-xl text-gray-800'>
        //     Welcome back, {user?.name || 'User'} {" "}
        //     [<button onClick={handleLogout} className="text-xs text-red-500 hover:underline rounded">
        //       Sign Out
        //     </button>]
        //   </h2>
        // </div>

//         <div className='mt-8'>
//           {user && user.stripeConnected && (
//             <div className='bg-white shadow-md rounded-lg p-6'>
//               <div className='flex flex-col gap-4'>
//                 <div className="flex justify-between items-center">
//                   <h3 className="text-2xl font-semibold text-gray-800 flex flex-row gap-2">Customers <button
//                       onClick={handleAddCustomerClick}
//                       className="text-gray-800 text-lg flex flex-row items-baseline gap-1 hover:underline"
//                     >
//                       [<PlusIcon className="w-5 h-5 text-green-500 hover:rotate-90 duration-300 my-auto items-center " />]
//                     </button></h3>

//                   <div className="flex items-center space-x-4">
                   
//                     {user.stripeConnected ? (
//                       <button
//                         onClick={handleDisconnectStripe}
//                         disabled={isDisconnecting}
//                         className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
//                       >
//                         {isDisconnecting ? "Disconnecting..." : "Disconnect Stripe Account"}
//                       </button>
//                     ) : (
//                       <p className="text-sm text-gray-500">No Stripe account connected</p>
//                     )}
//                   </div>
//                 </div>

//                 {loadingCustomers ? (
//                   <p className="text-gray-600">Loading customers...</p>
//                 ) : customers.length > 0 ? (
//                   <div className="overflow-x-auto">
//                     <table className="min-w-full bg-white border border-gray-300 rounded-md">
//                       <thead>
//                         <tr className="bg-gray-100">
//                           <th className="py-3 px-6 text-left text-sm font-medium text-gray-600 border-b">Email</th>
//                           <th className="py-3 px-6 text-left text-sm font-medium text-gray-600 border-b">Name</th>
//                             <th className="py-3 px-6 text-left text-sm font-medium text-gray-600 border-b">Description</th>
//                             <th className="py-3 px-6 text-left text-sm font-medium text-gray-600 border-b">Actions</th>
//                         </tr>
//                       </thead>
//                       <tbody className="divide-y divide-gray-200 space-y-2">
//                         {customers.map((customer) => (
//                           <tr key={customer.id} className="py-2">
//                             <td className="py-3 px-6 text-sm text-gray-600">{customer.email}</td>
//                             <td className="py-3 px-6 text-sm text-gray-600">{customer.name}</td>
//                             <td className="py-3 px-6 text-sm text-gray-600">{customer.description}</td>
//                             <td className="py-3 px-6 text-sm  "><Link className=' px-4 py-2 text-white text-center rounded items-center bg-blue-500' href={`/Dashboard/${user.uid}/${customer.id}`}>View</Link>
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>
//                 ) : (
//                   <p>No customers found</p>
//                 )}
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Add Customer Form */}
//         {isAddingCustomer && (
//           <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-500 bg-opacity-50">
//           <div className="bg-white p-6 mt-8 shadow-md rounded-lg w-full max-w-xl">
//             <h3 className="text-2xl font-semibold text-gray-800 mb-4">Add Customer</h3>
//             <form onSubmit={handleAddCustomer}>
//               <div className="space-y-4">
//                 <div>
//                   <label htmlFor="name" className="block text-sm font-medium text-gray-600">Name</label>
//                     <input
//                     id="name"
//                     ref={nameRef}
//                     type="text"
//                     className="mt-2 p-2 border border-gray-300 rounded-md w-full"
//                     required
//                   />
//                 </div>
//                 <div>
//                   <label htmlFor="email" className="block text-sm font-medium text-gray-600">Email</label>
//                     <input
//                     id="email"
//                     ref={emailRef}
//                     type="email"
//                     className="mt-2 p-2 border border-gray-300 rounded-md w-full"
//                     required
//                   />
//                 </div>
//                 <div>
//                   <label htmlFor="description" className="block text-sm font-medium text-gray-600">Description</label>
//                     <textarea
//                     id="description"
//                     ref={descriptionRef}
//                     className="mt-2 p-2 border border-gray-300 rounded-md w-full"
//                     required
//                   ></textarea>
//                   </div>
//                   <div className='flex justify-start gap-6'>
//                 <button
//                   type="submit"
//                   disabled={isLoading}
//                   className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
//                 >
//                   {isLoading ? 'Adding...' : 'Add Customer'}
//                     </button>
//                     <button type="button" onClick={() => setIsAddingCustomer(false)} className="mt-4 text-red-500 hover:underline rounded-md ">Cancel</button>
//                     </div>
//               </div>
//             </form>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Dashboard;


import React from 'react'
import Dashboard from '../../../components/user/Dashboard'
import Navbar from '../../../components/navbar'
import Footer from '../../../components/footer'
import siteMetadata from '../../../../siteMetadata'

export const metadata = {
    title: `Dashboard | ${siteMetadata.title}`,
    description: `Manage your ${siteMetadata.title} dashboard.`,
    url: `${siteMetadata.siteUrl}/Dashboard`,
}

const page = () => {
  return (
    <div>
      <Navbar />
      <Dashboard />
      <Footer />
    </div>
  )
}

export default page
