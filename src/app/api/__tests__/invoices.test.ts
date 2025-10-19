import { NextRequest } from 'next/server';
import { GET, POST } from '../invoices/route';
import * as invoices from '@/lib/invoices';

// Mock the invoices module
jest.mock('@/lib/invoices');

const mockInvoice = {
  id: 'inv_test123',
  projectId: 'proj_test123',
  amount: 1000,
  status: 'draft',
  dueDate: new Date().toISOString(),
};

describe('Invoices API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/invoices', () => {
    it('should return a list of invoices', async () => {
      // Mock the request with query parameters
      const url = new URL('http://localhost/api/invoices?projectId=proj_test123');
      const request = new NextRequest(url);

      // Mock the implementation
      (invoices as any).getInvoicesByProject = jest.fn()
        .mockResolvedValueOnce([mockInvoice]);

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual([mockInvoice]);
      expect(invoices.getInvoicesByProject).toHaveBeenCalledWith('proj_test123');
    });

    it('should return 400 if projectId is missing', async () => {
      const url = new URL('http://localhost/api/invoices');
      const request = new NextRequest(url);

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toEqual({ error: 'Project ID is required' });
    });
  });

  describe('POST /api/invoices', () => {
    it('should create a new invoice', async () => {
      const requestBody = {
        projectId: mockInvoice.projectId,
        amount: mockInvoice.amount,
        dueDate: mockInvoice.dueDate,
      };

      // Create a mock request with JSON body
      const request = new NextRequest('http://localhost/api/invoices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      // Mock the implementation
      (invoices as any).createInvoice = jest.fn()
        .mockResolvedValueOnce(mockInvoice);

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data).toEqual(mockInvoice);
      expect(invoices.createInvoice).toHaveBeenCalledWith({
        projectId: mockInvoice.projectId,
        amount: mockInvoice.amount,
        dueDate: mockInvoice.dueDate,
      });
    });
  });
});
