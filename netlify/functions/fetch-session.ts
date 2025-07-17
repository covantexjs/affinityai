import { Handler } from '@netlify/functions';
import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not configured');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Content-Type': 'application/json',
};

export const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers,
      body: '',
    };
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const sessionId = event.queryStringParameters?.session_id;

    if (!sessionId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing session_id parameter' }),
      };
    }

    console.log('🔍 [FETCH SESSION] Retrieving session:', sessionId);

    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['customer', 'line_items', 'payment_intent']
    });

    console.log('✅ [FETCH SESSION] Session retrieved:', {
      id: session.id,
      payment_status: session.payment_status,
      customer_email: session.customer_email || session.customer_details?.email,
      amount_total: session.amount_total
    });

    // Check if payment was successful
    if (session.payment_status !== 'paid') {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: 'Payment not completed',
          payment_status: session.payment_status,
          message: `Payment status is "${session.payment_status}". Please complete your payment first.`
        }),
      };
    }

    // Extract customer information
    const customerEmail = session.customer_email || session.customer_details?.email;
    const customerName = session.customer_details?.name || session.metadata?.customer_name;

    if (!customerEmail) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: 'No customer email found',
          message: 'Unable to retrieve customer information from this session.'
        }),
      };
    }

    // Get line items for product details
    const lineItems = session.line_items?.data || [];
    const productInfo = lineItems.map(item => ({
      description: item.description,
      amount: item.amount_total,
      quantity: item.quantity
    }));

    // Return comprehensive session data
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        session_id: session.id,
        customer_email: customerEmail,
        customer_name: customerName,
        payment_status: session.payment_status,
        amount_total: session.amount_total,
        amount_subtotal: session.amount_subtotal,
        currency: session.currency,
        payment_intent_id: typeof session.payment_intent === 'string' 
          ? session.payment_intent 
          : session.payment_intent?.id,
        metadata: session.metadata,
        created: session.created,
        product_info: productInfo,
        success: true
      }),
    };

  } catch (error: any) {
    console.error('💥 [FETCH SESSION] Error:', error);
    
    // Handle specific Stripe errors
    if (error.type === 'StripeInvalidRequestError') {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ 
          error: 'Session not found',
          message: 'The provided session ID is invalid or expired. Please try making a new purchase.',
          session_id: event.queryStringParameters?.session_id
        }),
      };
    }

    if (error.code === 'resource_missing') {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ 
          error: 'Session expired',
          message: 'This checkout session has expired. Please start a new purchase.',
          session_id: event.queryStringParameters?.session_id
        }),
      };
    }
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: 'Failed to fetch session data. Please contact support if this persists.',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      }),
    };
  }
};