import React, { useState } from "react";
import ReactPaginate from "react-paginate";

const InvoicesTable = ({ invoices }) => {
  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(0);

  // Get the invoices for the current page
  const displayedInvoices = invoices.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  // Handle page change
  const handlePageChange = (selectedItem) => {
    setCurrentPage(selectedItem.selected);
  };

  return (
    <div>
      {invoices.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border border-black">
            <thead>
              <tr className="bg-gray-100 border-b border-black">
                <th className="px-4 py-2 text-left">Invoice ID</th>
                <th className="px-4 py-2 text-left">Amount</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Due Date</th>
                <th className="px-4 py-2 text-left flex justify-end">Action</th>
              </tr>
            </thead>
            <tbody>
              {displayedInvoices.map((invoice) => (
                <tr
                  key={invoice.id}
                  className="border-b border-black rounded-lg"
                >
                  <td className="px-4 py-2 font-medium">{invoice.number}</td>
                  <td className="px-4 py-2 flex flex-row  max-w-xs mx-auto w-full">
                    ${invoice.amount_due}
                  </td>
                  <td
                    className={`px-4 py-2 capitalize ${
                      invoice.status === "paid"
                        ? "text-confirm"
                        : "text-destructive"
                    }`}
                  >
                    {invoice.status}
                  </td>
                  <td className="px-4 py-2">{invoice.due_date}</td>
                  <td className="px-4 py-2 flex justify-end">
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

      {/* Pagination Controls */}
      {invoices.length > 5 && (
        <div className="mt-2 font-medium flex justify-center">
          <ReactPaginate
            previousLabel={"Previous"}
            nextLabel={"Next"}
            pageCount={Math.ceil(invoices.length / itemsPerPage)}
            onPageChange={handlePageChange}
            containerClassName={
              "pagination flex flex-row w-full justify-between px-4"
            }
            activeClassName={"active text-confirm font-extrabold"}
            pageClassName={"page hover:underline"}
            breakClassName={"break"}
            previousClassName={"previous text-green-500 hover:underline"}
            nextClassName={"next text-green-500 hover:underline"}
          />
        </div>
      )}
    </div>
  );
};

export default InvoicesTable;
