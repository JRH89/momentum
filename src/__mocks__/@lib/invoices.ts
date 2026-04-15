// Mock implementation of the invoices module
export const getInvoices = jest.fn().mockResolvedValue([]);
export const getInvoiceById = jest.fn().mockResolvedValue(null);
export const createInvoice = jest.fn().mockResolvedValue({ id: 'mock-invoice-id' });
export const updateInvoice = jest.fn().mockResolvedValue({});
export const deleteInvoice = jest.fn().mockResolvedValue(true);
export const _clearInvoices = jest.fn();

// Alias for backward compatibility
export const getInvoicesByProject = getInvoices;
