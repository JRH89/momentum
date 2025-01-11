'use client'

import Link from 'next/link'
import { StripeCustomer as Customer } from './types/stripeCustomer'
import ReactPaginate from 'react-paginate'
import { useState } from 'react'
import { ArrowBigRight } from 'lucide-react'

interface CustomerTableProps {
  customers: Customer[]
  userId: string
  itemsPerPage?: number // Optional prop for items per page
}

interface StripeCustomer {
  email: string
  name: string
  description: string
  stripeCustomerId: string
}

export function CustomerTable({ customers, userId, itemsPerPage = 8 }: CustomerTableProps) {
  const [currentPage, setCurrentPage] = useState(0)

  // Add a key of type keyof StripeCustomer to fix the type error
  const [sortConfig, setSortConfig] = useState<{ key: keyof StripeCustomer; direction: 'asc' | 'desc' }>({
    key: 'email', // Default to 'email' for sorting
    direction: 'asc',
  })

  const handleSort = (key: keyof StripeCustomer) => {
    let direction: 'asc' | 'desc' = 'asc'
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
  }

  const handlePageChange = (selectedPage: { selected: number }) => {
    setCurrentPage(selectedPage.selected)
  }

  const offset = currentPage * itemsPerPage
  const currentCustomers = customers.slice(offset, offset + itemsPerPage)

  const sortedCustomers = [...currentCustomers].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1
    if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1
    return 0
  })

  if (!customers.length) {
    return <p className="text-black">No customers found</p>
  }

  return (
    <>
      <div className="overflow-x-auto py-2 pt-4 md:pt-0 h-full flex flex-col">
        <table className="min-w-full h-full bg-white border-2 border-black rounded-md">
          <thead>
            <tr className="bg-[#EAEEFE] font-semibold border-b-2 border-black">
              <th className="py-4 px-6 cursor-pointer hover:underline text-left text-md text-black" onClick={() => handleSort('email')}>
                Email
              </th>
              <th className="py-4 px-6 cursor-pointer hover:underline text-left text-md text-black" onClick={() => handleSort('name')}>
                Name
              </th>
              <th className="py-4 px-6 cursor-pointer hover:underline text-left text-md text-black" onClick={() => handleSort('description')}>
                Description
              </th>
              <th className="py-4 px-6 text-left text-md text-black">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-black space-y-2">
            {sortedCustomers.map((customer, index) => (
              <tr key={index} className="py-4 hover:bg-yellow-50">
                <td className="py-4 font-bold px-6 text-sm text-black">
                  <Link href={`mailto:${customer.email}`}>
                    {customer.email}
                  </Link>
                </td>
                <td className="py-4 px-6 text-sm font-medium text-black">{customer.name}</td>
                <td className="py-4 px-6 text-sm font-medium text-black">{customer.description || 'N/A'}</td>
                <td className="py-4 px-6 text-sm">
                  <Link
                    className="text-destructive flex font-semibold hover:underline"
                    href={`/Dashboard/${userId}/${customer?.stripeCustomerId}`}
                  >
                    View <ArrowBigRight className="w-5 h-5" />
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
        pageCount={Math.ceil(customers.length / itemsPerPage)}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={handlePageChange}
        containerClassName={'flex px-4 justify-between items-center space-x-2'}
        pageClassName={'page-item'}
        pageLinkClassName={'px-4 py-2 text-sm rounded-md text-gray-700 bg-white  hover:bg-gray-200 transition-colors duration-300'}
        previousClassName={'previous-item text-xl text-green-500'}
        nextClassName={'next-item text-green-500 text-xl'}
        disabledClassName={'disabled'}
        activeClassName={'text-confirm text-white border-blue-500'}
      />
    </>
  )
}