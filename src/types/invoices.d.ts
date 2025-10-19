declare module '@/lib/invoices' {
  export function createInvoice(invoice: { projectId: string; amount: number; dueDate: Date }): Promise<any>;
  export function sendInvoice(id: string): Promise<any>;
  export function getInvoice(id: string): Promise<any>;
}
