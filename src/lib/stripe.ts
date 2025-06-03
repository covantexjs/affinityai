import { loadStripe } from '@stripe/stripe-js';
import { products } from '../stripe-config';

const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

// Instead of throwing an error, just log a warning
if (!STRIPE_PUBLISHABLE_KEY) {
  console.warn('VITE_STRIPE_PUBLISHABLE_KEY is not defined. Running in preview mode.');
}

// Only attempt to load Stripe if we have a key
const stripePromise = STRIPE_PUBLISHABLE_KEY ? loadStripe(STRIPE_PUBLISHABLE_KEY) : null;

export const initiateCheckout = async () => {
  try {
    // If Stripe isn't initialized, throw an error that will be caught
    if (!stripePromise) {
      throw new Error('Stripe is not initialized. Running in preview mode.');
    }

    const stripe = await stripePromise;
    
    if (!stripe) {
      throw new Error('Failed to initialize Stripe');
    }

    const product = products[0]; // We only have one product

    // Create checkout session
    const response = await fetch('/.netlify/functions/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId: product.priceId,
        successUrl: `${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${window.location.origin}/premium`,
        mode: product.mode
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        error: `HTTP error! status: ${response.status}`
      }));
      throw new Error(errorData.error || 'Failed to create checkout session');
    }

    const data = await response.json();

    if (!data.url) {
      throw new Error('No checkout URL received');
    }

    // Log success for testing
    console.log('Checkout session created successfully:', data);

    // Redirect to Stripe Checkout
    window.location.href = data.url;
  } catch (error: any) {
    console.error('Checkout error:', error);
    throw error;
  }
};