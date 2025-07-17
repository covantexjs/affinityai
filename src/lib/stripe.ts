import { loadStripe } from '@stripe/stripe-js';
import { products } from '../stripe-config';

const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

// Create a more robust Stripe initialization
let stripePromise: Promise<any> | null = null;

const initializeStripe = () => {
  if (!STRIPE_PUBLISHABLE_KEY) {
    console.warn('⚠️ [STRIPE] VITE_STRIPE_PUBLISHABLE_KEY is not defined. Running in preview mode.');
    return null;
  }

  if (!stripePromise) {
    console.log('🔄 [STRIPE] Initializing Stripe with key:', STRIPE_PUBLISHABLE_KEY.substring(0, 12) + '...');
    stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);
  }

  return stripePromise;
};

// Initialize Stripe
const stripe = initializeStripe();

interface CheckoutOptions {
  customerEmail?: string;
  customerName?: string;
  testMode?: boolean;
}

export const initiateCheckout = async (options: CheckoutOptions = {}) => {
  console.log('🚀 [STRIPE] Initiating checkout with session creation');
  
  try {
    // Check if Stripe is available
    if (!stripe) {
      throw new Error('Stripe is not configured. Please check your VITE_STRIPE_PUBLISHABLE_KEY environment variable.');
    }

    const product = products[0]; // We only have one product
    console.log('📦 [STRIPE] Using product:', product);

    // Create checkout session via our Netlify function
    console.log('🔄 [STRIPE] Creating checkout session...');
    
    const requestBody = {
      email: options.customerEmail,
      name: options.customerName,
      priceId: product.priceId
    };
    
    console.log('📤 [STRIPE] Request body:', requestBody);

    const response = await fetch('/.netlify/functions/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    console.log('📥 [STRIPE] Response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        error: `HTTP error! status: ${response.status}`
      }));
      console.error('❌ [STRIPE] Checkout session creation failed:', errorData);
      throw new Error(errorData.error || 'Failed to create checkout session');
    }

    const data = await response.json();
    console.log('✅ [STRIPE] Checkout session created:', data);

    if (!data.url) {
      throw new Error('No checkout URL received');
    }

    console.log('🎯 [STRIPE] Redirecting to Stripe Checkout:', data.url);
    console.log('💳 [STRIPE] Test card numbers you can use:');
    console.log('  - 4242424242424242 (Visa - Success)');
    console.log('  - 4000000000000002 (Card declined)');
    console.log('  - 4000000000009995 (Insufficient funds)');
    console.log('  - Use any future expiry date (e.g., 12/34)');
    console.log('  - Use any 3-digit CVC (e.g., 123)');
    console.log('  - Use any ZIP code (e.g., 12345)');

    // Redirect to Stripe Checkout
    window.location.href = data.url;
  } catch (error: any) {
    console.error('💥 [STRIPE] Checkout error:', error);
    throw error;
  }
};

// Test mode helper function
export const testStripeFlow = async () => {
  console.log('🧪 [TEST MODE] Starting Stripe test flow...');
  
  try {
    await initiateCheckout({
      customerEmail: 'test@example.com',
      customerName: 'Test User',
      testMode: true
    });
  } catch (error) {
    console.error('🧪 [TEST MODE] Test flow failed:', error);
    throw error;
  }
};

// Check if Stripe is properly configured
export const isStripeConfigured = () => {
  return !!STRIPE_PUBLISHABLE_KEY;
};

// Get Stripe configuration status
export const getStripeConfig = () => {
  return {
    hasPublishableKey: !!STRIPE_PUBLISHABLE_KEY,
    keyPreview: STRIPE_PUBLISHABLE_KEY ? STRIPE_PUBLISHABLE_KEY.substring(0, 12) + '...' : 'Not configured',
    isTestMode: STRIPE_PUBLISHABLE_KEY?.includes('pk_test_') || false
  };
};