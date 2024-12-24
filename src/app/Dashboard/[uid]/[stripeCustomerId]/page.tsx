'use client';

import React, { use, useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { db } from '../../../../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { StripeCustomer } from '../../../../components/types/stripeCustomer';
import Link from 'next/link';
import { getAuth } from 'firebase/auth';
import NavBar from '../../../../components/navbar';
import Footer from '../../../../components/footer';

const CustomerDetailsPage = () => {
  const router = useRouter();

  // Get userId and stripeCustomerId from params
  const { uid, stripeCustomerId } = useParams();
  
  // Get the logged-in user's id from Firebase Auth
  const auth = getAuth();
  const user = auth.currentUser;

  const [customerData, setCustomerData] = useState<StripeCustomer | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCustomerData = async () => {
      if (!user || !stripeCustomerId) {
        setError('User not logged in or no customer ID provided');
        setLoading(false);
        return;
      }

      try {
        // Query the user's document using the logged-in user's ID
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          setError('User not found');
          setLoading(false);
          return;
        }

        const userData = userSnap.data();
        // Find the customer by stripeCustomerId
        const customer = userData?.customers?.find(
          (cust: any) => cust.stripeCustomerId === stripeCustomerId
        );

        if (customer) {
          setCustomerData(customer);
        } else {
          setError('Customer not found');
        }
      } catch (err) {
        console.error('Error fetching customer data:', err);
        setError('Failed to load customer data.');
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerData();
  }, [stripeCustomerId, user]); // Re-run when either stripeCustomerId or user changes

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <>
    <NavBar />
    
    <div className="p-6 bg-primary min-h-screen h-full pt-12 w-full mx-auto justify-center">
      <div className="max-w-6xl bg-white p-6 rounded-2xl shadow w-full mx-auto justify-center">
        {customerData && !loading && !error && (
            <div className="w-full flex flex-col mx-auto">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 border-b">Customer Details</h2>
                <button type="button" className="text-gray-800 hover:text-gray-400">Create Invoice</button>
                </div>
            <div className="w-full mx-auto">
              <div className="mt-4 w-full flex ml-4">
                <div className="grid grid-cols-2 gap-4 justify-between w-full">
                  <div className=''>
                    <strong className="text-gray-600">Name:</strong>
                    <p className="text-gray-800">{customerData?.name}</p>
                  </div>
                  <div>
                    <strong className="text-gray-600">Email:</strong>
                    <p className="text-gray-800">{customerData?.email}</p>
                  </div>
                  <div>
                    <strong className="text-gray-600">Description:</strong>
                    <p className="text-gray-800">{customerData?.description}</p>
                  </div>
                  <div>
                    <strong className="text-gray-600">Stripe Customer ID:</strong>
                    <p className="text-gray-800">{customerData?.stripeCustomerId}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      </div>
    <Footer />
    </>
  );
};

export default CustomerDetailsPage;
