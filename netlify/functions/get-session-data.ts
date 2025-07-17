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
    const { session_id } = event.queryStringParameters || {};

    if (!session_id) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          success: false, 
          message: 'Missing session_id parameter' 
        }),
      };
    }

    console.log('🔍 [GET SESSION DATA] Retrieving session:', session_id);

    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ['customer', 'customer_details']
    });

    console.info(`✅ [GET SESSION DATA] Session retrieved:`, {
      id: session.id,
      payment_status: session.payment_status,
      customer_email: session.customer_email || session.customer_details?.email,
      amount_total: session.amount_total,
      currency: session.currency
    });

    if (session.payment_status === 'paid') {
      // Extract customer information
      const customerEmail = session.customer_email || session.customer_details?.email;
      const customerName = session.customer_details?.name || session.metadata?.customer_name || 'Valued Customer';

      if (!customerEmail) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ 
            success: false, 
            message: 'No customer email found in session' 
          }),
        };
      }

      console.info(`💳 [GET SESSION DATA] Payment successful for ${customerEmail}`);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          success: true, 
          email: customerEmail, 
          name: customerName,
          session_id: session.id,
          amount_total: session.amount_total,
          currency: session.currency,
          payment_status: session.payment_status,
          created: session.created,
          customer_email: customerEmail,
          customer_name: customerName
        })
      };
    } else {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          success: false, 
          message: 'Payment not completed',
          payment_status: session.payment_status
        })
      };
    }
  } catch (error: any) {
    console.error('💥 [GET SESSION DATA] Error:', error);
    
    // Handle specific Stripe errors
    if (error.type === 'StripeInvalidRequestError') {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ 
          success: false, 
          message: 'Session not found or invalid'
        }),
      };
    }

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        success: false, 
        message: error.message || 'Internal server error'
      })
    };
  }
};