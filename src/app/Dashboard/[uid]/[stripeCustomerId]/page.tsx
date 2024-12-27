'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { db } from '../../../../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { StripeCustomer } from '../../../../components/types/stripeCustomer';
import NavBar from '../../../../components/navbar';
import Footer from '../../../../components/footer';

const CustomerDetailsPage: React.FC = () => {
  const { uid, stripeCustomerId } = useParams() as { uid: string; stripeCustomerId: string };
  const [stripeAccountId, setStripeAccountId] = useState<string | null>(null);
  const [customerData, setCustomerData] = useState<StripeCustomer | null>(null);
  const [invoices, setInvoices] = useState<any[]>([]); 
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  
  // State for creating invoices
  const [invoiceAmount, setInvoiceAmount] = useState<string>('');
  const [invoiceCurrency, setInvoiceCurrency] = useState<string>('usd');
  const [invoiceDescription, setInvoiceDescription] = useState<string>('');

  useEffect(() => {
    const fetchUserStripeAccountId = async (userId: string) => {
      try {
        const userRef = doc(db, 'users', userId);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          setStripeAccountId(userData.stripeAccountId || null);
        } else {
          setError('User document not found');
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to fetch user data.');
      }
    };

    if (uid) fetchUserStripeAccountId(uid);
  }, [uid]);

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        const userRef = doc(db, 'users', uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          const customer = userData.customers?.find(
            (cust: StripeCustomer) => cust.stripeCustomerId === stripeCustomerId
          );
          if (customer) setCustomerData(customer);
          else setError('Customer not found in user document.');
        } else {
          setError('User document not found.');
        }
      } catch (err) {
        console.error('Error fetching customer data:', err);
        setError('Failed to load customer data.');
      }
    };

    if (stripeAccountId) fetchCustomerData();
  }, [stripeAccountId, stripeCustomerId, uid]);

  useEffect(() => {
    const fetchInvoices = async () => {
      if (!stripeAccountId || !stripeCustomerId) return;

      try {
        const response = await fetch(`/api/stripe/invoices?stripeAccountId=${stripeAccountId}&stripeCustomerId=${stripeCustomerId}`);
        const data = await response.json();

        if (response.ok && data.invoices) {
          setInvoices(data.invoices || []);
        } else {
          setError(data.error || 'Failed to fetch invoices');
        }
      } catch (err) {
        console.error('Error fetching invoices:', err);
        setError('Failed to fetch invoices.');
      }
    };

    if (stripeAccountId && stripeCustomerId) fetchInvoices();
  }, [stripeAccountId, stripeCustomerId]);

  useEffect(() => {
    if (stripeAccountId || error || invoices.length > 0) {
      setLoading(false);
    }
  }, [stripeAccountId, error, invoices]);

  // Handle creating a new invoice
  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!invoiceAmount || !invoiceCurrency || !invoiceDescription) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const response = await fetch('/api/stripe/invoices/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          stripeCustomerId,
          items: [
            {
              amount: parseInt(invoiceAmount, 10) * 100, // Convert to cents
              currency: invoiceCurrency,
              description: invoiceDescription,
            },
          ],
        }),
      });
      const data = await response.json();

      if (response.ok) {
        setInvoices((prevInvoices) => [...prevInvoices, data.invoice]);
        setInvoiceAmount('');
        setInvoiceCurrency('usd');
        setInvoiceDescription('');
      } else {
        setError(data.error || 'Failed to create invoice');
      }
    } catch (err) {
      console.error('Error creating invoice:', err);
      setError('Failed to create invoice');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <>
      <NavBar />
      <div className="p-6 bg-primary min-h-screen">
        <div className="max-w-6xl bg-white p-6 rounded-2xl shadow mx-auto">
          {customerData && (
            <>
              <h2 className="text-2xl font-semibold text-gray-900">Customer Details</h2>
              <p>Name: {customerData.name}</p>
              <p>Email: {customerData.email}</p>
            </>
          )}

          {/* Invoice Creation Form */}
          <div className="mt-6">
            <h3 className="text-xl font-semibold">Create Invoice</h3>
            <form onSubmit={handleCreateInvoice}>
              <div className="mt-2">
                <label htmlFor="amount" className="block text-gray-700">Amount</label>
                <input
                  id="amount"
                  type="number"
                  value={invoiceAmount}
                  onChange={(e) => setInvoiceAmount(e.target.value)}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mt-2">
                <label htmlFor="currency" className="block text-gray-700">Currency</label>
                <input
                  id="currency"
                  type="text"
                  value={invoiceCurrency}
                  onChange={(e) => setInvoiceCurrency(e.target.value)}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mt-2">
                <label htmlFor='description' className="block text-gray-700">Description</label>
                <input
                  id='description'
                  type="text"
                  value={invoiceDescription}
                  onChange={(e) => setInvoiceDescription(e.target.value)}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <button
                type="submit"
                className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md"
              >
                Create Invoice
              </button>
            </form>
          </div>

          <div className='mt-6'>
            {invoices.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-4 py-2 text-left">Invoice ID</th>
                    <th className="px-4 py-2 text-left">Amount</th>
                    <th className="px-4 py-2 text-left">Status</th>
                    <th className="px-4 py-2 text-left">Due Date</th>
                    <th className="px-4 py-2 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((invoice) => (
                    <tr key={invoice.id} className="border-b">
                      <td className="px-4 py-2">{invoice.number}</td>
                      <td className="px-4 py-2">${invoice.amount_due} {invoice.currency.toUpperCase()}</td>
                      <td className={`px-4 py-2 capitalize ${invoice.status === 'paid' ? 'text-green-600' : 'text-red-600'}`}>{invoice.status}</td>
                      <td className="px-4 py-2">{invoice.due_date}</td>
                      <td className="px-4 py-2">
                        <a 
                          className="text-destructive hover:underline font-semibold rounded-lg"
                          href={invoice.hosted_invoice_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          View Invoice
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No invoices found.</p>
          )}
        </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CustomerDetailsPage;
