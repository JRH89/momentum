'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ReactPaginate from 'react-paginate';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { toast } from 'react-toastify';

interface StripeCustomer {
  email: string;
  name: string;
  description: string;
  stripeCustomerId: string;
}

interface CustomerTableProps {
  customers: StripeCustomer[];
  userId: string;
  itemsPerPage?: number;
}

export function CustomerTable({ customers, userId, itemsPerPage = 7 }: CustomerTableProps) {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(0);
  const [stripeAccountId, setStripeAccountId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);
  const [invoiceData, setInvoiceData] = useState({
    amount: '',
    currency: 'usd',
    description: '',
    dueDate: ''
  });
  const [selectedCustomer, setSelectedCustomer] = useState<StripeCustomer | null>(null);

  const [sortConfig, setSortConfig] = useState<{
    key: keyof StripeCustomer;
    direction: 'asc' | 'desc';
  }>({
    key: 'email',
    direction: 'asc',
  });

  useEffect(() => {
    const fetchUserStripeAccountId = async () => {
      try {
        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setStripeAccountId(userSnap.data().stripeAccountId || null);
        } else {
          setError("User document not found");
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to fetch user data.");
      }
    };

    fetchUserStripeAccountId();
  }, [userId]);

  const handleSort = (key: keyof StripeCustomer) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handlePageChange = (selectedPage: { selected: number }) => {
    setCurrentPage(selectedPage.selected);
  };

  const handleCreateInvoice = async (customerId: string) => {
    if (!stripeAccountId) {
      setError("Stripe account not found");
      return;
    }

    try {
      const response = await fetch('/api/stripe/invoices/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          stripeAccountId,
          stripeCustomerId: customerId,
          items: [{
            amount: Math.round(parseFloat(invoiceData.amount) * 100),
            currency: invoiceData.currency.toLowerCase(),
            description: invoiceData.description,
            quantity: 1,
          }],
          dueDate: Math.floor(new Date(invoiceData.dueDate).getTime() / 1000),
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to create invoice');

      setShowInvoiceForm(false);
      setInvoiceData({
        amount: '',
        currency: 'usd',
        description: '',
        dueDate: ''
      });
      toast.success("Invoice created successfully!");
    } catch (err) {
      console.error("Error creating invoice:", err);
      setError(err instanceof Error ? err.message : "Failed to create invoice");
      toast.error("Failed to create invoice");
    }
  };

  const offset = currentPage * itemsPerPage;
  const currentCustomers = customers.slice(offset, offset + itemsPerPage);

  const sortedCustomers = [...currentCustomers].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
    if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  if (!customers.length) {
    return <p className="text-black">No customers found</p>;
  }

  return (
    <>
      <div className="overflow-x-auto py-2 pb-4 px-4 h-full flex flex-col">
        <div className="border-2 border-black rounded-lg overflow-x-auto shadow-md shadow-black">
          <table className="min-w-full h-full">
            <thead>
              <tr className="bg-backgroundPrimary font-semibold border-b-2 border-black">
                <th
                  className="py-4 px-6 cursor-pointer hover:underline text-left text-md text-black"
                  onClick={() => handleSort('email')}
                >
                  Email
                </th>
                <th
                  className="py-4 px-6 cursor-pointer hover:underline text-left text-md text-black"
                  onClick={() => handleSort('name')}
                >
                  Name
                </th>
                <th
                  className="py-4 px-6 cursor-pointer hover:underline text-left text-md text-black"
                  onClick={() => handleSort('description')}
                >
                  Description
                </th>
                <th className="py-4 px-6 text-left text-md text-black">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-black space-y-2">
              {sortedCustomers.map((customer) => (
                <tr key={customer.stripeCustomerId} className="py-4 hover:bg-yellow-50">
                  <td className="py-4 font-bold px-6 text-sm text-black">
                    <Link href={`mailto:${customer.email}`}>{customer.email}</Link>
                  </td>
                  <td className="py-4 px-6 text-sm font-medium text-black">{customer.name}</td>
                  <td className="py-4 px-6 text-sm font-medium text-black">
                    {customer.description || 'N/A'}
                  </td>
                  <td className="py-2 px-6 text-sm">
                    <div className="flex items-center space-x-4">
                      <select
                        className="border border-black rounded-md px-2 py-1 text-sm text-black"
                        onChange={(e) => {
                          const action = e.target.value;
                          if (action === 'createInvoice') {
                            setSelectedCustomer(customer);
                            setShowInvoiceForm(true);
                          } else if (action === 'view') {
                            router.push(`/Dashboard/${userId}/${customer.stripeCustomerId}`);
                          }
                          e.target.value = ''; // Reset select after action
                        }}
                      >
                        <option value="Actions">Actions</option>
                        <option value="createInvoice">Create Invoice</option>
                        <option value="view">View Details</option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      {customers.length > itemsPerPage && (
        <ReactPaginate
          previousLabel={'Previous'}
          nextLabel={'Next'}
          breakLabel={'...'}
          pageCount={Math.ceil(customers.length / itemsPerPage)}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handlePageChange}
          containerClassName={
              "pagination flex mt-2 flex-row w-full justify-between px-4"
            }
            activeClassName={"active text-confirm font-extrabold"}
            pageClassName={"page hover:underline"}
            breakClassName={"break"}
            previousClassName={
              "previous text-xl text-green-500 hover:underline"
            }
            nextClassName={"next text-xl text-green-500 hover:underline"}
        />
      )}
      
      </div>

      

      {showInvoiceForm && (
        <div className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center">
          <div className="p-6 max-w-md w-full">
            <h2 className="text-xl text-white lg:text-2xl text-center font-bold mb-4">Create Invoice</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              if (selectedCustomer) {
                handleCreateInvoice(selectedCustomer.stripeCustomerId);
              }
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white">Amount</label>
                  <input
                    type="number"
                    value={invoiceData.amount}
                    onChange={(e) => setInvoiceData(prev => ({ ...prev, amount: e.target.value }))}
                    className="mt-1 p-1 block w-full rounded-md border-gray-300 shadow-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white">Description</label>
                  <input
                    type="text"
                    value={invoiceData.description}
                    onChange={(e) => setInvoiceData(prev => ({ ...prev, description: e.target.value }))}
                    className="mt-1 p-1 block w-full rounded-md border-gray-300 shadow-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white">Due Date</label>
                  <input
                    type="date"
                    value={invoiceData.dueDate}
                    onChange={(e) => setInvoiceData(prev => ({ ...prev, dueDate: e.target.value }))}
                    className="mt-1 p-1 block w-full rounded-md border-gray-300 shadow-sm"
                    required
                  />
                </div>
              </div>
              <div className="mt-4 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowInvoiceForm(false);
                    setSelectedCustomer(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-destructive hover:opacity-60 transition duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-black bg-confirm border border-transparent rounded-md hover:bg-opacity-60 transition duration-300"
                >
                  Create Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

