import { loadStripe } from '@stripe/stripe-js';
import { storeQuizPurchase, testSupabaseConnection } from './supabase';
import { QuizResult } from '../types/quiz';

const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

if (!STRIPE_PUBLISHABLE_KEY) {
  console.warn('VITE_STRIPE_PUBLISHABLE_KEY is not defined. Running in preview mode.');
}

const stripePromise = STRIPE_PUBLISHABLE_KEY ? loadStripe(STRIPE_PUBLISHABLE_KEY) : null;

interface CheckoutData {
  customerEmail: string;
  customerName: string;
  quizResult: QuizResult;
  startGenerating?: boolean;
  dimensionScores?: {
    emotional_depth: number;
    relational_style: number;
    values_alignment: number;
    communication_style: number;
  };
}

export const initiateStripeCheckout = async (data: CheckoutData) => {
  console.log('🚀 [STRIPE CHECKOUT] Initiating checkout with data:', {
    email: data.customerEmail,
    name: data.customerName,
    archetype: data.quizResult.archetype.name,
    startGenerating: data.startGenerating
  });
  
  try {
    // Test Supabase connection first
    const supabaseConnected = await testSupabaseConnection();
    console.log('🔗 [STRIPE CHECKOUT] Supabase connection status:', supabaseConnected);
    
    // Pre-store the quiz data in Supabase with pending status (if connected)
    let tempPurchaseId = null;
    if (supabaseConnected) {
      try {
        console.log('💾 [STRIPE CHECKOUT] Pre-storing purchase data...');
        tempPurchaseId = await storeQuizPurchase({
          email: data.customerEmail,
          name: data.customerName,
          archetype_id: data.quizResult.archetype.id,
          archetype_name: data.quizResult.archetype.name,
          dimension_scores: data.dimensionScores || {
            emotional_depth: 0,
            relational_style: 0,
            values_alignment: 0,
            communication_style: 0
          },
          payment_status: 'pending'
        });
        console.log('✅ [STRIPE CHECKOUT] Pre-stored purchase with ID:', tempPurchaseId);
      } catch (storeError) {
        console.warn('⚠️ [STRIPE CHECKOUT] Failed to pre-store purchase:', storeError);
        // Continue with checkout even if pre-storage fails
      }
    }

    // Create checkout session via Netlify function
    const requestBody = {
      email: data.customerEmail,
      name: data.customerName,
      priceId: 'price_1RUs9qRuGbBleiQfhYV8HsAo', // Your price ID
      quizData: {
        archetype_id: data.quizResult.archetype.id,
        archetype_name: data.quizResult.archetype.name,
        start_generating: data.startGenerating,
        dimension_scores: data.dimensionScores,
        temp_purchase_id: tempPurchaseId
      },
      successUrl: `${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}&paid=true`,
      cancelUrl: `${window.location.origin}/premium?canceled=true`
    };
    
    console.log('📤 [STRIPE CHECKOUT] Creating checkout session...');

    const functionUrl = '/.netlify/functions/create-checkout-session';
    
    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      console.log('📥 [STRIPE CHECKOUT] Response status:', response.status);
      let errorData;
      try {
        errorData = await response.json();
      } catch (parseError) {
        // If we can't parse JSON, get the text response
        const errorText = await response.text().catch(() => 'Unknown error');
        errorData = {
          error: `HTTP ${response.status}: ${response.statusText}`,
          details: errorText,
          url: functionUrl
        };
      }
      
      console.error('❌ [STRIPE CHECKOUT] Session creation failed:', errorData);
      
      // Provide more helpful error messages
      if (response.status === 404) {
        throw new Error('Netlify function not found. Please ensure the development server is running with Netlify functions enabled.');
      } else if (response.status === 500) {
        throw new Error(errorData.error || 'Server error occurred. Please try again.');
      } else {
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }
    }

    const { sessionId, url } = await response.json();
    console.log('✅ [STRIPE CHECKOUT] Session created:', { sessionId, url });

    if (!url) {
      throw new Error('No checkout URL received');
    }

    // Update the stored data with the real session ID (if Supabase is connected)
    if (supabaseConnected && tempPurchaseId) {
      try {
        await storeQuizPurchase({
          email: data.customerEmail,
          name: data.customerName,
          archetype_id: data.quizResult.archetype.id,
          archetype_name: data.quizResult.archetype.name,
          dimension_scores: data.dimensionScores || {
            emotional_depth: 0,
            relational_style: 0,
            values_alignment: 0,
            communication_style: 0
          },
          stripe_session_id: sessionId,
          payment_status: 'pending'
        });
        console.log('✅ [STRIPE CHECKOUT] Updated purchase with session ID');
      } catch (updateError) {
        console.warn('⚠️ [STRIPE CHECKOUT] Failed to update with session ID:', updateError);
        // Continue with checkout even if update fails
      }
    }

    console.log('🎯 [STRIPE CHECKOUT] Redirecting to:', url);
    
    // Redirect to Stripe Checkout
    window.location.href = url;
  } catch (error: any) {
    console.error('💥 [STRIPE CHECKOUT] Error:', error);
    throw error;
  }
};

// Enhanced function to check if user already has premium access
export const checkExistingPremiumAccess = async (email: string): Promise<boolean> => {
  if (!email) return false;
  
  try {
    const supabaseConnected = await testSupabaseConnection();
    if (!supabaseConnected) return false;
    
    // Import here to avoid circular dependencies
    const { getQuizPurchaseByEmail } = await import('./supabase');
    const purchase = await getQuizPurchaseByEmail(email);
    
    return purchase && purchase.payment_status === 'paid';
  } catch (error) {
    console.warn('⚠️ [PREMIUM ACCESS] Failed to check existing access:', error);
    return false;
  }
};

// Test mode helper
export const testCheckoutFlow = async (quizResult: QuizResult) => {
  console.log('🧪 [TEST MODE] Starting checkout test flow...');
  
  try {
    await initiateStripeCheckout({
      customerEmail: 'test@example.com',
      customerName: 'Test User',
      quizResult,
      dimensionScores: {
        emotional_depth: 1.5,
        relational_style: 0.8,
        values_alignment: 2.0,
        communication_style: 1.2
      }
    });
  } catch (error) {
    console.error('🧪 [TEST MODE] Test flow failed:', error);
    throw error;
  }
};