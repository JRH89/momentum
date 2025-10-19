import { createCustomer, createSubscription, getSubscriptionStatus, cancelSubscription } from '@/lib/stripe';

describe('Subscription Management', () => {
  // Mock Stripe functions
  const mockCreateCustomer = jest.fn();
  const mockCreateSubscription = jest.fn();
  const mockRetrieveSubscription = jest.fn();
  const mockCancelSubscription = jest.fn();

  beforeAll(() => {
    // Mock the Stripe client
    jest.mock('stripe', () => {
      return jest.fn().mockImplementation(() => ({
        customers: {
          create: mockCreateCustomer,
        },
        subscriptions: {
          create: mockCreateSubscription,
          retrieve: mockRetrieveSubscription,
          cancel: mockCancelSubscription,
        },
      }));
    });
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Customer Management', () => {
    it('should create a new customer in Stripe', async () => {
      const testCustomer = {
        email: 'test@example.com',
        name: 'Test User',
      };
      
      mockCreateCustomer.mockResolvedValueOnce({
        id: 'cus_test123',
        ...testCustomer,
      });

      const result = await createCustomer(testCustomer);

      expect(mockCreateCustomer).toHaveBeenCalledWith({
        email: testCustomer.email,
        name: testCustomer.name,
      });
      
      expect(result).toEqual({
        id: 'cus_test123',
        ...testCustomer,
      });
    });
  });

  describe('Subscription Management', () => {
    it('should create a new subscription', async () => {
      const testSubscription = {
        customerId: 'cus_test123',
        priceId: 'price_test123',
      };
      
      mockCreateSubscription.mockResolvedValueOnce({
        id: 'sub_test123',
        status: 'active',
        current_period_end: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60, // 30 days from now
      });

      const result = await createSubscription(testSubscription);

      expect(mockCreateSubscription).toHaveBeenCalledWith({
        customer: testSubscription.customerId,
        items: [
          { price: testSubscription.priceId },
        ],
        payment_behavior: 'default_incomplete',
        expand: ['latest_invoice.payment_intent'],
      });
      
      expect(result).toHaveProperty('id', 'sub_test123');
      expect(result).toHaveProperty('status', 'active');
    });

    it('should get subscription status', async () => {
      const subscriptionId = 'sub_test123';
      
      mockRetrieveSubscription.mockResolvedValueOnce({
        id: subscriptionId,
        status: 'active',
        current_period_end: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60,
      });

      const status = await getSubscriptionStatus(subscriptionId);

      expect(mockRetrieveSubscription).toHaveBeenCalledWith(subscriptionId);
      expect(status).toEqual({
        id: subscriptionId,
        status: 'active',
        current_period_end: expect.any(Number),
      });
    });

    it('should cancel a subscription', async () => {
      const subscriptionId = 'sub_test123';
      
      mockCancelSubscription.mockResolvedValueOnce({
        id: subscriptionId,
        status: 'canceled',
      });

      const result = await cancelSubscription(subscriptionId);

      expect(mockCancelSubscription).toHaveBeenCalledWith(subscriptionId);
      expect(result).toEqual({
        id: subscriptionId,
        status: 'canceled',
      });
    });
  });
});
