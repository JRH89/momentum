declare module '@/lib/invoices' {
  import { Invoice } from './invoices';
  
  export const getInvoices: (projectId: string) => Promise<Invoice[]>;
  export const getInvoicesByProject: (projectId: string) => Promise<Invoice[]>;
  export const getInvoiceById: (id: string) => Promise<Invoice | undefined>;
  export const createInvoice: (data: Omit<Invoice, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => Promise<Invoice>;
  export const updateInvoice: (id: string, data: Partial<Omit<Invoice, 'id' | 'createdAt'>>) => Promise<Invoice | undefined>;
  export const deleteInvoice: (id: string) => Promise<boolean>;
  export const _clearInvoices: () => void;
}
