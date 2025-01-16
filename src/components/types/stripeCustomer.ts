export interface StripeCustomer {
  email: string;
  name: string;
  description: string;
  stripeCustomerId: string;
  createdAt: Date;
  uid?: string;
}
