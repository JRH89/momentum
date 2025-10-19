import { createMocks } from 'node-mocks-http';
import handler from '../invoices/route';
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
      const { req, res } = createMocks({
        method: 'GET',
      });

      // Mock the implementation
      (invoices as any).getInvoicesByProject = jest.fn()
        .mockResolvedValueOnce([mockInvoice]);

      await handler(req, res);

      expect(res._getStatusCode()).toBe(200);
      expect(JSON.parse(res._getData())).toEqual([mockInvoice]);
    });
  });

  describe('POST /api/invoices', () => {
    it('should create a new invoice', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        body: {
          projectId: mockInvoice.projectId,
          amount: mockInvoice.amount,
          dueDate: mockInvoice.dueDate,
        },
      });

      // Mock the implementation
      (invoices as any).createInvoice = jest.fn()
        .mockResolvedValueOnce(mockInvoice);

      await handler(req, res);

      expect(res._getStatusCode()).toBe(201);
      expect(JSON.parse(res._getData())).toEqual(mockInvoice);
    });
  });

  // Add more test cases for other HTTP methods (PUT, DELETE, etc.)
});
