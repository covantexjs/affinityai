import { Handler } from '@netlify/functions';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { recordPurchase } from '../../src/lib/supabase';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

// Initialize Supabase client with service role key for webhook operations
const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  const sig = event.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    console.error('❌ [WEBHOOK] Missing signature or webhook secret');
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing signature or webhook secret' }),
    };
  }

  let stripeEvent: Stripe.Event;

  try {
    stripeEvent = stripe.webhooks.constructEvent(event.body!, sig, webhookSecret);
  } catch (err: any) {
    console.error('❌ [WEBHOOK] Signature verification failed:', err.message);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid signature' }),
    };
  }

  console.log('🎣 [WEBHOOK] Received event:', stripeEvent.type);

  try {
    if (stripeEvent.type === 'checkout.session.completed') {
      const session = stripeEvent.data.object as Stripe.Checkout.Session;
      
      console.log('💳 [WEBHOOK] Processing completed checkout:', session.id);
      
      // Extract customer information
      const customerEmail = session.customer_email || session.customer_details?.email;
      const customerName = session.customer_details?.name || session.metadata?.customer_name || 'Premium Customer';

      if (!customerEmail) {
        console.error('❌ [WEBHOOK] No customer email found in session');
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'No customer email found' }),
        };
      }

      // Test Supabase connection
      try {
        const { error: testError } = await supabase
          .from('quiz_purchases')
          .select('count(*)')
          .limit(1);

        if (testError) {
          console.error('❌ [WEBHOOK] Supabase connection failed:', testError);
          // Log the payment but continue without database operations
          console.log('💳 [WEBHOOK] Payment processed successfully (DB unavailable):', {
            sessionId: session.id,
            customerEmail,
            amount: session.amount_total,
            supabaseUrl: process.env.VITE_SUPABASE_URL
          });
          
          return {
            statusCode: 200,
            body: JSON.stringify({ 
              received: true, 
              warning: 'Database unavailable, payment processed successfully' 
            }),
          };
        }

        console.log('✅ [WEBHOOK] Supabase connection verified');
      } catch (connectionError) {
        console.error('💥 [WEBHOOK] Supabase connection error:', connectionError);
        // Log the payment but continue without database operations
        console.log('💳 [WEBHOOK] Payment processed successfully (DB unavailable):', {
          sessionId: session.id,
          customerEmail,
          amount: session.amount_total
        });
        
        return {
          statusCode: 200,
          body: JSON.stringify({ 
            received: true, 
            warning: 'Database connection failed, payment processed successfully' 
          }),
        };
      }

      // Parse dimension scores from metadata
      let dimensionScores = {};
      try {
        if (session.metadata?.dimension_scores) {
          dimensionScores = JSON.parse(session.metadata.dimension_scores);
        }
      } catch (parseError) {
        console.warn('⚠️ [WEBHOOK] Failed to parse dimension scores:', parseError);
      }

      // Store or update the purchase record using the upsert function
      try {
        // Use the enhanced recordPurchase function
        const purchase = await recordPurchase({
          email: customerEmail,
          name: customerName,
          archetype_id: session.metadata?.archetype_id || 'unknown',
          archetype_name: session.metadata?.archetype_name || 'Unknown Archetype',
          dimension_scores: dimensionScores,
          stripe_session_id: session.id,
          stripe_payment_intent_id: session.payment_intent as string,
          payment_status: 'paid',
          amount_paid: session.amount_total,
          currency: session.currency || 'usd',
          purchase_type: 'premium_report',
          metadata: {
            webhook_processed: true,
            stripe_event_id: stripeEvent.id,
            processed_at: new Date().toISOString()
          }
        });


        console.log('✅ [WEBHOOK] Successfully recorded purchase:', {
          purchaseId: purchase.id,
          customerEmail,
          sessionId: session.id,
          archetype: session.metadata?.archetype_name,
          amount: session.amount_total
        });

        // GDPR Compliance: Log data processing
        console.log('📋 [GDPR] Data processed for customer:', {
          email: customerEmail,
          purpose: 'Premium report delivery',
          consent: session.metadata?.data_processing_consent === 'true',
          timestamp: new Date().toISOString()
        });

      } catch (dbError) {
        console.error('💥 [WEBHOOK] Database operation failed:', dbError);
        return {
          statusCode: 500,
          body: JSON.stringify({ error: 'Database operation failed' }),
        };
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ received: true }),
    };
  } catch (error: any) {
    console.error('💥 [WEBHOOK] Error processing webhook:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Webhook processing failed' }),
    };
  }
};

export default handler;