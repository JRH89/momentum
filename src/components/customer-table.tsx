'use client'

import Link from 'next/link'
import { StripeCustomer as Customer } from './types/stripeCustomer'
import ReactPaginate from 'react-paginate'
import { useState } from 'react'

interface CustomerTableProps {
  customers: Customer[]
  userId: string
}

export function CustomerTable({ customers, userId }: CustomerTableProps) {
  const [currentPage, setCurrentPage] = useState(0)
  const customersPerPage = 5

  // Paginate the customers
  const handlePageChange = (selectedPage: { selected: number }) => {
    setCurrentPage(selectedPage.selected)
  }

  const offset = currentPage * customersPerPage
  const currentCustomers = customers.slice(offset, offset + customersPerPage)

  if (!customers.length) {
    return <p className="text-black">No customers found</p>
  }

    return (
      <>
    <div className="overflow-x-auto py-5 pt-0 h-full flex flex-col">
      <table className="min-w-full h-full bg-white border border-black rounded-md">
        <thead>
          <tr className="bg-gray-100 font-semibold border-b border-black">
            <th className="py-3 px-6 text-left text-sm text-black">Email</th>
            <th className="py-3 px-6 text-left text-sm text-black">Name</th>
            <th className="py-3 px-6 text-left text-sm text-black">Description</th>
            <th className="py-3 px-6 flex justify-end text-left text-sm text-black">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-black space-y-2">
          {currentCustomers.map((customer, index) => (
            <tr key={index} className="py-2">
              <td className="py-3 font-medium px-6 text-sm text-black">{customer.email}</td>
              <td className="py-3 px-6 text-sm text-black">{customer.name}</td>
              <td className="py-3 px-6 text-sm text-black">{customer.description}</td>
              <td className="py-3 px-6 text-sm justify-end flex">
                <Link
                  className="px-4 py-2 text-white text-center rounded items-center bg-confirm hover:bg-destructive duration-300"
                  href={`/Dashboard/${userId}/${customer?.stripeCustomerId}`}
                >
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
        </div>

      <ReactPaginate
        previousLabel={'Previous'}
        nextLabel={'Next'}
        breakLabel={'...'}
        pageCount={Math.ceil(customers.length / customersPerPage)}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={handlePageChange}
        containerClassName={'flex px-4 justify-between items-center space-x-2'}
        pageClassName={'page-item'}
        pageLinkClassName={'px-4 py-2 text-sm rounded-md text-gray-700 bg-white border border-gray-300 hover:bg-gray-200 transition-colors duration-300'}
        previousClassName={'previous-item'}
        nextClassName={'next-item'}
        disabledClassName={'disabled'}
        activeClassName={'bg-blue-500 text-white border-blue-500'}
      />
      </>
  )
}
