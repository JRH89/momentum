import { ExternalLink } from "lucide-react";
import React, { useState } from "react";
import ReactPaginate from "react-paginate";

const InvoicesTable = ({ invoices, itemsPerPage = 5 }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  // Handle sorting logic
  const sortedInvoices = [...invoices].sort((a, b) => {
    if (!sortConfig.key) return 0;

    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (typeof aValue === "string") {
      return sortConfig.direction === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    return sortConfig.direction === "asc" ? aValue - bValue : bValue - aValue;
  });

  // Get the invoices for the current page
  const displayedInvoices = sortedInvoices.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  // Handle page change
  const handlePageChange = (selectedItem) => {
    setCurrentPage(selectedItem.selected);
  };

  // Handle sorting toggle
  const handleSort = (key) => {
    setSortConfig((prevConfig) => ({
      key,
      direction:
        prevConfig.key === key && prevConfig.direction === "asc"
          ? "desc"
          : "asc",
    }));
  };

  return (
    <div className="mt-1">
      {invoices.length > 0 ? (
        <div className="overflow-x-auto  shadow-md shadow-black rounded-lg border-2 border-black">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-backgroundPrimary border-b-2 border-black">
                <th
                  className="px-2 md:px-4 py-3 text-left cursor-pointer"
                  onClick={() => handleSort("number")}
                >
                  Invoice ID
                </th>
                <th
                  className="px-2 md:px-4 py-3 text-left cursor-pointer"
                  onClick={() => handleSort("amount_due")}
                >
                  Amount
                </th>
                <th
                  className="px-2 md:px-4 py-3 text-left cursor-pointer"
                  onClick={() => handleSort("status")}
                >
                  Status
                </th>
                <th
                  className="px-2 md:px-4 py-3 text-left cursor-pointer"
                  onClick={() => handleSort("due_date")}
                >
                  Due Date
                </th>
                <th className="px-2 md:px-4 py-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {displayedInvoices.map((invoice) => (
                <tr
                  key={invoice.id}
                  className="border-b-2 hover:bg-yellow-50 border-black"
                >
                  <td className="px-2 md:px-4 py-2.5 font-medium">
                    {invoice.number}
                  </td>
                  <td className="px-2 md:px-4 py-2.5 flex flex-row max-w-xs mx-auto w-full">
                    ${invoice.amount_due}
                  </td>
                  <td
                    className={`px-2 md:px-4 py-2.5 font-medium capitalize ${
                      invoice.status === "paid"
                        ? "text-confirm"
                        : invoice.status === "uncollectible"
                        ? "text-destructive"
                        : "text-green-500"
                    }`}
                  >
                    {invoice.status}
                  </td>
                  <td className="px-2 md:px-4 py-2.5">{invoice.due_date}</td>
                  <td className="px-2 md:px-4 py-2.5">
                    <a
                      className="text-destructive hover:text-confirm duration-300 font-semibold rounded-lg flex flex-row items-center"
                      href={invoice.hosted_invoice_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View <ExternalLink className="w-5 h-5 pb-2" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-600 px-2">No invoices found.</p>
      )}

      {/* Pagination Controls */}
      {invoices.length > itemsPerPage && (
        <div className="mt-2 font-medium flex justify-center">
          <ReactPaginate
            previousLabel={"Previous"}
            nextLabel={"Next"}
            pageCount={Math.ceil(invoices.length / itemsPerPage)}
            onPageChange={handlePageChange}
            containerClassName={
              "pagination flex flex-row w-full justify-between px-2 md:px-4"
            }
            activeClassName={"active text-confirm font-extrabold"}
            pageClassName={"page hover:underline"}
            breakClassName={"break"}
            previousClassName={
              "previous text-xl text-green-500 hover:underline"
            }
            nextClassName={"next text-xl text-green-500 hover:underline"}
          />
        </div>
      )}
    </div>
  );
};

export default InvoicesTable;
