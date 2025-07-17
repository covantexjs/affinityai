export type Product = {
  id: string;
  priceId: string;
  name: string;
  description: string;
  price: number;
  mode: 'payment' | 'subscription';
};

export interface StripeSessionData {
  session_id: string;
  customer_email: string;
  customer_name?: string;
  payment_status: string;
  amount_total: number;
  amount_subtotal?: number;
  currency: string;
  payment_intent_id?: string;
  metadata?: Record<string, any>;
  created: number;
  product_info?: Array<{
    description: string;
    amount: number;
    quantity: number;
  }>;
  success: boolean;
}

export interface PaymentVerificationResult {
  verified: boolean;
  sessionData?: StripeSessionData;
  purchaseData?: any;
  error?: string;
  supabaseConnected: boolean;
}