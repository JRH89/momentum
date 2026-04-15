declare module '@/lib/stripe' {
  export function createCustomer(customer: { email: string; name: string }): Promise<any>;
  export function createSubscription(subscription: { customerId: string; priceId: string }): Promise<any>;
  export function getSubscriptionStatus(subscriptionId: string): Promise<any>;
  export function cancelSubscription(subscriptionId: string): Promise<any>;
}
