import { Handler } from '@netlify/functions';
import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  console.error('❌ [CHECKOUT SESSION] STRIPE_SECRET_KEY is not configured');
  throw new Error('STRIPE_SECRET_KEY is not configured');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
};

export const handler: Handler = async (event) => {
  // Log the function invocation
  console.log('🚀 [CHECKOUT SESSION] Function invoked with method:', event.httpMethod);
  
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers,
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    console.log('⚠️ [CHECKOUT SESSION] Method not allowed:', event.httpMethod);
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed', success: false }),
    };
  }

  try {
    console.log('🔄 [CHECKOUT SESSION] Received request:', event.body);

    // Validate request body
    if (!event.body) {
      throw new Error('Request body is empty');
    }

    const { email, name, priceId, quizData, successUrl, cancelUrl } = JSON.parse(event.body);

    console.log('📋 [CHECKOUT SESSION] Parsed data:', {
      email,
      name,
      priceId,
      quizData: quizData ? 'Present' : 'Not provided',
      successUrl,
      cancelUrl
    });

    // Use the price ID from the request or fallback to default
    const finalPriceId = priceId || 'price_1RUs9qRuGbBleiQfhYV8HsAo';
    console.log('💰 [CHECKOUT SESSION] Using price ID:', finalPriceId);

    // Get the base URL for redirects
    const baseUrl = process.env.URL || process.env.DEPLOY_PRIME_URL || 'https://affinityai.me';
    console.log('🔗 [CHECKOUT SESSION] Base URL:', baseUrl);

    // Use provided URLs or fallback to defaults
    const finalSuccessUrl = successUrl || `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`;
    const finalCancelUrl = cancelUrl || `${baseUrl}/premium`;
    
    console.log('🔗 [CHECKOUT SESSION] Success URL:', finalSuccessUrl);
    console.log('🔗 [CHECKOUT SESSION] Cancel URL:', finalCancelUrl);

    // Create the checkout session with enhanced metadata
    console.log('🔄 [CHECKOUT SESSION] Creating session with Stripe...');
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price: finalPriceId,
        quantity: 1
      }],
      mode: 'payment',
      success_url: finalSuccessUrl,
      cancel_url: finalCancelUrl,
      payment_method_options: {
        card: {
          setup_future_usage: 'off_session'
        }
      },
      locale: 'auto',
      metadata: {
        customer_name: name || '',
        customer_email: email || '',
        archetype_id: quizData?.archetype_id || '',
        archetype_name: quizData?.archetype_name || '',
        data_processing_consent: 'true',
        temp_purchase_id: quizData?.temp_purchase_id || ''
      },
      payment_intent_data: {
        description: 'Affinity AI Premium Love Blueprint'
      }
    });

    console.log('✅ [CHECKOUT SESSION] Created successfully:', {
      sessionId: session.id,
      url: session.url,
      successUrl: finalSuccessUrl,
      cancelUrl: finalCancelUrl,
      customerEmail: email || 'not provided',
      customerName: name || 'not provided'
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        sessionId: session.id,
        url: session.url,
        success: true
      }),
    };
  } catch (error: any) {
    console.error('💥 [CHECKOUT SESSION] Error:', error.message);
    console.error('💥 [CHECKOUT SESSION] Stack trace:', error.stack);
    
    // Check for specific Stripe errors
    if (error.type && error.type.startsWith('Stripe')) {
      console.error('💥 [CHECKOUT SESSION] Stripe error type:', error.type);
      console.error('💥 [CHECKOUT SESSION] Stripe error code:', error.code);
      console.error('💥 [CHECKOUT SESSION] Stripe error param:', error.param);
    }
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: error.message || 'Failed to create checkout session',
        errorType: error.type || 'Unknown',
        errorCode: error.code || 'Unknown',
        success: false
      }),
    };
  }
};
