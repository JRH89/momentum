import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-06-20',
});

export interface CustomerData {
  email: string;
  name: string;
  paymentMethodId?: string;
}

export const createCustomer = async (data: CustomerData) => {
  return stripe.customers.create({
    email: data.email,
    name: data.name,
    payment_method: data.paymentMethodId,
    invoice_settings: {
      default_payment_method: data.paymentMethodId,
    },
  });
};

export const createSubscription = async (customerId: string, priceId: string) => {
  return stripe.subscriptions.create({
    customer: customerId,
    items: [{ price: priceId }],
    expand: ['latest_invoice.payment_intent'],
  });
};

export const getSubscriptionStatus = async (subscriptionId: string) => {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  return {
    status: subscription.status,
    currentPeriodEnd: subscription.current_period_end,
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
  };
};

export const cancelSubscription = async (subscriptionId: string) => {
  return stripe.subscriptions.cancel(subscriptionId);
};

export const updateSubscription = async (subscriptionId: string, updates: any) => {
  return stripe.subscriptions.update(subscriptionId, updates);
};

export const listPaymentMethods = async (customerId: string) => {
  return stripe.paymentMethods.list({
    customer: customerId,
    type: 'card',
  });
};
