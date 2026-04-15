import { createCustomer, createSubscription, getSubscriptionStatus, cancelSubscription } from '@/lib/stripe';

// Mock the Stripe module
jest.mock('stripe', () => {
  return jest.fn().mockImplementation(() => ({
    customers: {
      create: jest.fn(),
    },
    subscriptions: {
      create: jest.fn(),
      retrieve: jest.fn(),
      cancel: jest.fn(),
    },
    paymentMethods: {
      list: jest.fn(),
    },
  }));
});

// Import the mocked Stripe module
import Stripe from 'stripe';

// Get the mock instances
const mockStripe = new (Stripe as unknown as jest.Mock)();
const mockCreateCustomer = mockStripe.customers.create as jest.Mock;
const mockCreateSubscription = mockStripe.subscriptions.create as jest.Mock;
const mockRetrieveSubscription = mockStripe.subscriptions.retrieve as jest.Mock;
const mockCancelSubscription = mockStripe.subscriptions.cancel as jest.Mock;
const mockListPaymentMethods = mockStripe.paymentMethods.list as jest.Mock;

describe('Subscription Management', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Customer Management', () => {
    it('should create a new customer in Stripe', async () => {
      const testCustomer = {
        email: 'test@example.com',
        name: 'Test User',
        paymentMethodId: 'pm_test123',
      };
      
      mockCreateCustomer.mockResolvedValueOnce({
        id: 'cus_test123',
        email: testCustomer.email,
        name: testCustomer.name,
      });

      const result = await createCustomer(testCustomer);

      expect(mockCreateCustomer).toHaveBeenCalledWith({
        email: testCustomer.email,
        name: testCustomer.name,
        payment_method: testCustomer.paymentMethodId,
        invoice_settings: {
          default_payment_method: testCustomer.paymentMethodId,
        },
      });
      
      expect(result).toMatchObject({
        id: 'cus_test123',
        email: testCustomer.email,
        name: testCustomer.name,
      });
    });
  });

  describe('Subscription Management', () => {
    it('should create a new subscription', async () => {
      const customerId = 'cus_test123';
      const priceId = 'price_test123';
      
      const mockSubscription = {
        id: 'sub_test123',
        status: 'active',
        current_period_end: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60, // 30 days from now
      };
      
      mockCreateSubscription.mockResolvedValueOnce(mockSubscription);

      const result = await createSubscription(customerId, priceId);

      expect(mockCreateSubscription).toHaveBeenCalledWith({
        customer: customerId,
        items: [{ price: priceId }],
        expand: ['latest_invoice.payment_intent'],
      });
      
      expect(result).toEqual(mockSubscription);
    });

    it('should get subscription status', async () => {
      const subscriptionId = 'sub_test123';
      const currentPeriodEnd = Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60;
      
      mockRetrieveSubscription.mockResolvedValueOnce({
        id: subscriptionId,
        status: 'active',
        current_period_end: currentPeriodEnd,
        cancel_at_period_end: false,
      });

      const status = await getSubscriptionStatus(subscriptionId);

      expect(mockRetrieveSubscription).toHaveBeenCalledWith(subscriptionId);
      expect(status).toEqual({
        status: 'active',
        currentPeriodEnd: currentPeriodEnd,
        cancelAtPeriodEnd: false,
      });
    });

    it('should cancel a subscription', async () => {
      const subscriptionId = 'sub_test123';
      const canceledSubscription = {
        id: subscriptionId,
        status: 'canceled',
      };
      
      mockCancelSubscription.mockResolvedValueOnce(canceledSubscription);

      const result = await cancelSubscription(subscriptionId);

      expect(mockCancelSubscription).toHaveBeenCalledWith(subscriptionId);
      expect(result).toEqual(canceledSubscription);
    });
  });
});
