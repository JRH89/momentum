import { createCustomer } from '@/lib/stripe';

// Mock the Stripe module
jest.mock('stripe');

// Import the mocked Stripe module
import Stripe from 'stripe';

// Mock the environment variable
process.env.STRIPE_SECRET_KEY = 'test_key';

describe('Subscriptions Simple Test', () => {
  let stripeInstance: any;
  
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Create a new instance of the mocked Stripe
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
      apiVersion: '2024-06-20',
    });
  });

  it('should create a customer', async () => {
    // Mock the customers.create method
    (stripeInstance.customers.create as jest.Mock).mockResolvedValueOnce({
      id: 'cus_test123',
      email: 'test@example.com',
      name: 'Test User',
      payment_method: 'pm_test123',
      invoice_settings: {
        default_payment_method: 'pm_test123'
      }
    });

    const customerData = {
      email: 'test@example.com',
      name: 'Test User',
      paymentMethodId: 'pm_test123'
    };

    const result = await createCustomer(customerData);

    // Verify that the Stripe customers.create method was called with the correct arguments
    expect(stripeInstance.customers.create).toHaveBeenCalledWith({
      email: customerData.email,
      name: customerData.name,
      payment_method: customerData.paymentMethodId,
      invoice_settings: {
        default_payment_method: customerData.paymentMethodId
      }
    });

    // Verify that the function returns the expected result
    expect(result).toEqual({
      id: 'cus_test123',
      email: customerData.email,
      name: customerData.name,
      payment_method: customerData.paymentMethodId,
      invoice_settings: {
        default_payment_method: customerData.paymentMethodId
      }
    });
  });
});
