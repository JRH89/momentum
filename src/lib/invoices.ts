export interface Invoice {
  id: string;
  projectId: string;
  amount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  dueDate: string;
  sentAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Mock database
let invoices: Invoice[] = [];

// Get all invoices for a project
export const getInvoicesByProject = async (projectId: string): Promise<Invoice[]> => {
  return invoices.filter(invoice => invoice.projectId === projectId);
};

// Alias for backward compatibility
export const getInvoices = getInvoicesByProject;

export const getInvoiceById = async (id: string): Promise<Invoice | undefined> => {
  return invoices.find(invoice => invoice.id === id);
};

export const createInvoice = async (data: Omit<Invoice, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Promise<Invoice> => {
  const now = new Date().toISOString();
  const newInvoice: Invoice = {
    ...data,
    id: `inv_${Math.random().toString(36).substr(2, 9)}`,
    status: 'draft',
    createdAt: now,
    updatedAt: now,
  };
  
  invoices.push(newInvoice);
  return newInvoice;
};

export const updateInvoice = async (id: string, data: Partial<Omit<Invoice, 'id' | 'createdAt'>>): Promise<Invoice | undefined> => {
  const index = invoices.findIndex(invoice => invoice.id === id);
  if (index === -1) return undefined;
  
  const now = new Date().toISOString();
  const updatedInvoice = {
    ...invoices[index],
    ...data,
    updatedAt: now,
  };
  
  invoices[index] = updatedInvoice;
  return updatedInvoice;
};

export const deleteInvoice = async (id: string): Promise<boolean> => {
  const initialLength = invoices.length;
  invoices = invoices.filter(invoice => invoice.id !== id);
  return invoices.length < initialLength;
};

// For testing purposes
export const sendInvoice = async (id: string): Promise<Invoice | undefined> => {
  const invoice = await getInvoiceById(id);
  if (!invoice) return undefined;
  
  return updateInvoice(id, {
    status: 'sent',
    sentAt: new Date().toISOString()
  });
};

// For testing purposes
export const _clearInvoices = (): void => {
  invoices = [];
};
