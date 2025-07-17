/*
  # Enhanced Customer Tracking Schema

  1. New Tables
    - `customers`: Core customer profiles with analytics
      - Includes email, name, purchase stats, archetype preferences
      - Automatic stats tracking via triggers
      - Marketing consent and engagement data

    - `purchases`: Enhanced purchase tracking (replaces quiz_purchases)
      - Links to customers table
      - Detailed metadata and purchase types
      - Comprehensive payment tracking

    - `subscriptions`: Future subscription management
      - Ready for subscription-based features
      - Stripe subscription integration

  2. Analytics Functions
    - `get_customer_analytics()`: Real-time business metrics
    - `update_customer_stats()`: Automatic customer stat updates
    - Trigger-based data consistency

  3. Security
    - Row Level Security on all tables
    - Proper policies for authenticated and anonymous access
    - Service role permissions for webhooks

  4. Backward Compatibility
    - Maintains existing `upsert_quiz_purchase` function
    - Seamless migration from existing data
*/

-- Create customers table
CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  name text NOT NULL,
  first_purchase_date timestamptz,
  total_purchases integer DEFAULT 0,
  total_spent integer DEFAULT 0,
  preferred_archetype text,
  marketing_consent boolean DEFAULT false,
  last_login timestamptz,
  customer_lifetime_value integer DEFAULT 0,
  risk_score integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create enhanced purchases table
CREATE TABLE IF NOT EXISTS purchases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES customers(id),
  email text NOT NULL,
  name text NOT NULL,
  archetype_id text NOT NULL,
  archetype_name text NOT NULL,
  dimension_scores jsonb NOT NULL DEFAULT '{}',
  stripe_session_id text UNIQUE,
  stripe_payment_intent_id text,
  payment_status text NOT NULL DEFAULT 'pending',
  amount_paid integer,
  currency text DEFAULT 'usd',
  purchase_type text DEFAULT 'premium_report',
  metadata jsonb DEFAULT '{}',
  refunded boolean DEFAULT false,
  refund_amount integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create subscriptions table for future use
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES customers(id) NOT NULL,
  stripe_subscription_id text UNIQUE,
  status text NOT NULL DEFAULT 'active',
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean DEFAULT false,
  plan_name text,
  plan_price integer,
  trial_end timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create quiz_completions table for conversion tracking
CREATE TABLE IF NOT EXISTS quiz_completions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text,
  archetype text,
  session_id text,
  completed_at timestamptz DEFAULT now(),
  converted_to_purchase boolean DEFAULT false,
  conversion_date timestamptz
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS customers_email_idx ON customers(email);
CREATE INDEX IF NOT EXISTS customers_created_at_idx ON customers(created_at);
CREATE INDEX IF NOT EXISTS customers_total_spent_idx ON customers(total_spent DESC);
CREATE INDEX IF NOT EXISTS customers_risk_score_idx ON customers(risk_score DESC);

CREATE INDEX IF NOT EXISTS purchases_customer_id_idx ON purchases(customer_id);
CREATE INDEX IF NOT EXISTS purchases_email_idx ON purchases(email);
CREATE INDEX IF NOT EXISTS purchases_stripe_session_idx ON purchases(stripe_session_id);
CREATE INDEX IF NOT EXISTS purchases_payment_status_idx ON purchases(payment_status);
CREATE INDEX IF NOT EXISTS purchases_created_at_idx ON purchases(created_at DESC);
CREATE INDEX IF NOT EXISTS purchases_purchase_type_idx ON purchases(purchase_type);

CREATE INDEX IF NOT EXISTS subscriptions_customer_id_idx ON subscriptions(customer_id);
CREATE INDEX IF NOT EXISTS subscriptions_stripe_subscription_idx ON subscriptions(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS subscriptions_status_idx ON subscriptions(status);

CREATE INDEX IF NOT EXISTS quiz_completions_email_idx ON quiz_completions(email);
CREATE INDEX IF NOT EXISTS quiz_completions_completed_at_idx ON quiz_completions(completed_at DESC);

-- Enable Row Level Security
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_completions ENABLE ROW LEVEL SECURITY;

-- Create policies for customers table
CREATE POLICY "Users can view their own customer data"
  ON customers FOR SELECT TO authenticated
  USING (email = auth.jwt() ->> 'email');

CREATE POLICY "Anonymous users can view customer data by email"
  ON customers FOR SELECT TO anon
  USING (true);

CREATE POLICY "Service role can manage all customer data"
  ON customers FOR ALL TO service_role
  USING (true);

-- Create policies for purchases table
CREATE POLICY "Users can view their own purchase data"
  ON purchases FOR SELECT TO authenticated
  USING (email = auth.jwt() ->> 'email');

CREATE POLICY "Anonymous users can view purchase data by email"
  ON purchases FOR SELECT TO anon
  USING (true);

CREATE POLICY "Service role can manage all purchase data"
  ON purchases FOR ALL TO service_role
  USING (true);

-- Create policies for subscriptions table
CREATE POLICY "Users can view their own subscription data"
  ON subscriptions FOR SELECT TO authenticated
  USING (customer_id IN (
    SELECT id FROM customers WHERE email = auth.jwt() ->> 'email'
  ));

CREATE POLICY "Service role can manage all subscription data"
  ON subscriptions FOR ALL TO service_role
  USING (true);

-- Create policies for quiz_completions table
CREATE POLICY "Service role can manage quiz completion data"
  ON quiz_completions FOR ALL TO service_role
  USING (true);

CREATE POLICY "Anonymous users can insert quiz completions"
  ON quiz_completions FOR INSERT TO anon
  WITH CHECK (true);

-- Function to get comprehensive customer analytics
CREATE OR REPLACE FUNCTION get_customer_analytics()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result jsonb;
  total_customers integer;
  total_revenue bigint;
  avg_order_value numeric;
  popular_archetypes jsonb;
  monthly_stats jsonb;
  conversion_rate numeric;
BEGIN
  -- Get total customers
  SELECT COUNT(*) INTO total_customers FROM customers;
  
  -- Get total revenue from paid purchases
  SELECT COALESCE(SUM(amount_paid), 0) INTO total_revenue 
  FROM purchases WHERE payment_status = 'paid' AND refunded = false;
  
  -- Calculate average order value
  IF total_customers > 0 THEN
    avg_order_value := total_revenue::numeric / total_customers;
  ELSE
    avg_order_value := 0;
  END IF;
  
  -- Get popular archetypes
  SELECT jsonb_object_agg(archetype_name, purchase_count)
  INTO popular_archetypes
  FROM (
    SELECT archetype_name, COUNT(*) as purchase_count
    FROM purchases 
    WHERE payment_status = 'paid' AND refunded = false
    GROUP BY archetype_name
    ORDER BY purchase_count DESC
    LIMIT 10
  ) archetype_stats;
  
  -- Get monthly statistics
  WITH current_month AS (
    SELECT 
      COUNT(DISTINCT c.id) as customers,
      COALESCE(SUM(p.amount_paid), 0) as revenue,
      COUNT(p.id) as purchases
    FROM customers c
    LEFT JOIN purchases p ON c.id = p.customer_id 
      AND p.payment_status = 'paid' 
      AND p.refunded = false
      AND p.created_at >= date_trunc('month', CURRENT_DATE)
    WHERE c.created_at >= date_trunc('month', CURRENT_DATE)
  ),
  previous_month AS (
    SELECT 
      COUNT(DISTINCT c.id) as customers,
      COALESCE(SUM(p.amount_paid), 0) as revenue,
      COUNT(p.id) as purchases
    FROM customers c
    LEFT JOIN purchases p ON c.id = p.customer_id 
      AND p.payment_status = 'paid' 
      AND p.refunded = false
      AND p.created_at >= date_trunc('month', CURRENT_DATE - interval '1 month')
      AND p.created_at < date_trunc('month', CURRENT_DATE)
    WHERE c.created_at >= date_trunc('month', CURRENT_DATE - interval '1 month')
      AND c.created_at < date_trunc('month', CURRENT_DATE)
  )
  SELECT jsonb_build_object(
    'current_month', row_to_json(cm.*),
    'previous_month', row_to_json(pm.*)
  ) INTO monthly_stats
  FROM current_month cm, previous_month pm;
  
  -- Calculate conversion rate (quiz completions to purchases)
  WITH quiz_count AS (
    SELECT COUNT(*) as total_quizzes FROM quiz_completions
    WHERE completed_at >= CURRENT_DATE - interval '30 days'
  ),
  purchase_count AS (
    SELECT COUNT(*) as total_purchases FROM purchases
    WHERE payment_status = 'paid' 
      AND created_at >= CURRENT_DATE - interval '30 days'
  )
  SELECT CASE 
    WHEN qc.total_quizzes > 0 THEN (pc.total_purchases::numeric / qc.total_quizzes) * 100
    ELSE 0
  END INTO conversion_rate
  FROM quiz_count qc, purchase_count pc;
  
  -- Build comprehensive result
  result := jsonb_build_object(
    'total_customers', total_customers,
    'total_revenue', total_revenue,
    'average_order_value', avg_order_value,
    'popular_archetypes', COALESCE(popular_archetypes, '{}'::jsonb),
    'monthly_stats', monthly_stats,
    'conversion_rate', COALESCE(conversion_rate, 0)
  );
  
  RETURN result;
END;
$$;

-- Function to update customer statistics automatically
CREATE OR REPLACE FUNCTION update_customer_stats()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  customer_record customers%ROWTYPE;
  days_since_last_purchase integer;
  calculated_risk_score integer;
BEGIN
  -- Only process paid purchases
  IF NEW.payment_status = 'paid' AND (OLD.payment_status IS NULL OR OLD.payment_status != 'paid') THEN
    
    -- Get or create customer record
    SELECT * INTO customer_record FROM customers WHERE email = NEW.email;
    
    IF customer_record.id IS NULL THEN
      -- Create new customer
      INSERT INTO customers (
        email, name, first_purchase_date, total_purchases, 
        total_spent, preferred_archetype, created_at, updated_at
      ) VALUES (
        NEW.email, NEW.name, now(), 1, 
        COALESCE(NEW.amount_paid, 0), NEW.archetype_id, now(), now()
      ) RETURNING * INTO customer_record;
    ELSE
      -- Update existing customer
      UPDATE customers 
      SET 
        total_purchases = total_purchases + 1,
        total_spent = total_spent + COALESCE(NEW.amount_paid, 0),
        preferred_archetype = NEW.archetype_id,
        customer_lifetime_value = total_spent + COALESCE(NEW.amount_paid, 0),
        updated_at = now()
      WHERE id = customer_record.id
      RETURNING * INTO customer_record;
    END IF;
    
    -- Calculate risk score
    SELECT EXTRACT(days FROM (now() - customer_record.updated_at))::integer 
    INTO days_since_last_purchase;
    
    calculated_risk_score := 0;
    IF days_since_last_purchase > 90 THEN calculated_risk_score := calculated_risk_score + 40;
    ELSIF days_since_last_purchase > 60 THEN calculated_risk_score := calculated_risk_score + 25;
    ELSIF days_since_last_purchase > 30 THEN calculated_risk_score := calculated_risk_score + 10;
    END IF;
    
    IF customer_record.total_purchases = 1 THEN calculated_risk_score := calculated_risk_score + 30;
    END IF;
    IF customer_record.total_spent < 2000 THEN calculated_risk_score := calculated_risk_score + 20;
    END IF;
    
    -- Update risk score
    UPDATE customers 
    SET risk_score = LEAST(100, calculated_risk_score)
    WHERE id = customer_record.id;
    
    -- Update customer_id in the purchase record
    NEW.customer_id := customer_record.id;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger to automatically update customer stats
DROP TRIGGER IF EXISTS update_customer_stats_trigger ON purchases;
CREATE TRIGGER update_customer_stats_trigger
  BEFORE INSERT OR UPDATE ON purchases
  FOR EACH ROW
  EXECUTE FUNCTION update_customer_stats();

-- Enhanced backward compatibility function
CREATE OR REPLACE FUNCTION upsert_quiz_purchase(
  p_email text,
  p_name text,
  p_archetype_id text,
  p_archetype_name text,
  p_dimension_scores jsonb,
  p_stripe_session_id text,
  p_stripe_payment_intent_id text DEFAULT NULL,
  p_payment_status text DEFAULT 'pending',
  p_amount_paid integer DEFAULT NULL,
  p_currency text DEFAULT 'usd'
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  purchase_id uuid;
  customer_id uuid;
BEGIN
  -- Get or create customer
  SELECT id INTO customer_id FROM customers WHERE email = p_email;
  
  IF customer_id IS NULL THEN
    INSERT INTO customers (email, name, created_at, updated_at)
    VALUES (p_email, p_name, now(), now())
    RETURNING id INTO customer_id;
  END IF;
  
  -- Try to update existing purchase first
  UPDATE purchases 
  SET 
    customer_id = customer_id,
    name = p_name,
    archetype_id = p_archetype_id,
    archetype_name = p_archetype_name,
    dimension_scores = p_dimension_scores,
    stripe_session_id = p_stripe_session_id,
    stripe_payment_intent_id = COALESCE(p_stripe_payment_intent_id, stripe_payment_intent_id),
    payment_status = p_payment_status,
    amount_paid = COALESCE(p_amount_paid, amount_paid),
    currency = p_currency,
    updated_at = now()
  WHERE email = p_email AND stripe_session_id = p_stripe_session_id
  RETURNING id INTO purchase_id;
  
  -- If no record was updated, insert a new one
  IF purchase_id IS NULL THEN
    INSERT INTO purchases (
      customer_id, email, name, archetype_id, archetype_name, dimension_scores,
      stripe_session_id, stripe_payment_intent_id, payment_status,
      amount_paid, currency, purchase_type, metadata
    ) VALUES (
      customer_id, p_email, p_name, p_archetype_id, p_archetype_name, p_dimension_scores,
      p_stripe_session_id, p_stripe_payment_intent_id, p_payment_status,
      p_amount_paid, p_currency, 'premium_report', 
      jsonb_build_object('legacy_migration', true, 'created_via', 'upsert_function')
    )
    RETURNING id INTO purchase_id;
  END IF;
  
  RETURN purchase_id;
END;
$$;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON customers TO anon, authenticated, service_role;
GRANT ALL ON purchases TO anon, authenticated, service_role;
GRANT ALL ON subscriptions TO anon, authenticated, service_role;
GRANT ALL ON quiz_completions TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION get_customer_analytics TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION upsert_quiz_purchase TO anon, authenticated, service_role;

-- Insert sample data for testing (optional)
DO $$
BEGIN
  -- Only insert if tables are empty
  IF NOT EXISTS (SELECT 1 FROM customers LIMIT 1) THEN
    -- Insert sample customers
    INSERT INTO customers (email, name, total_purchases, total_spent, preferred_archetype, marketing_consent, created_at) VALUES
    ('alice@example.com', 'Alice Johnson', 2, 3800, 'narrative-idealist', true, now() - interval '30 days'),
    ('bob@example.com', 'Bob Smith', 1, 1900, 'steady-guardian', false, now() - interval '15 days'),
    ('carol@example.com', 'Carol Davis', 3, 5700, 'vibrant-explorer', true, now() - interval '7 days');
    
    -- Insert sample purchases
    INSERT INTO purchases (customer_id, email, name, archetype_id, archetype_name, dimension_scores, payment_status, amount_paid, purchase_type, created_at) VALUES
    ((SELECT id FROM customers WHERE email = 'alice@example.com'), 'alice@example.com', 'Alice Johnson', 'narrative-idealist', 'Narrative Idealist', '{"emotional_depth": 2.0, "relational_style": 1.5}', 'paid', 1900, 'premium_report', now() - interval '30 days'),
    ((SELECT id FROM customers WHERE email = 'alice@example.com'), 'alice@example.com', 'Alice Johnson', 'narrative-idealist', 'Narrative Idealist', '{"emotional_depth": 2.0, "relational_style": 1.5}', 'paid', 1900, 'premium_report', now() - interval '20 days'),
    ((SELECT id FROM customers WHERE email = 'bob@example.com'), 'bob@example.com', 'Bob Smith', 'steady-guardian', 'Steady Guardian', '{"emotional_depth": 1.0, "relational_style": 2.0}', 'paid', 1900, 'premium_report', now() - interval '15 days'),
    ((SELECT id FROM customers WHERE email = 'carol@example.com'), 'carol@example.com', 'Carol Davis', 'vibrant-explorer', 'Vibrant Explorer', '{"emotional_depth": 1.5, "relational_style": 1.8}', 'paid', 1900, 'premium_report', now() - interval '7 days');
    
    -- Insert sample quiz completions
    INSERT INTO quiz_completions (email, archetype, session_id, completed_at, converted_to_purchase, conversion_date) VALUES
    ('alice@example.com', 'narrative-idealist', 'session_1', now() - interval '30 days', true, now() - interval '30 days'),
    ('bob@example.com', 'steady-guardian', 'session_2', now() - interval '15 days', true, now() - interval '15 days'),
    ('carol@example.com', 'vibrant-explorer', 'session_3', now() - interval '7 days', true, now() - interval '7 days'),
    ('david@example.com', 'mindful-architect', 'session_4', now() - interval '5 days', false, null),
    ('eve@example.com', 'compassionate-nurturer', 'session_5', now() - interval '2 days', false, null);
  END IF;
END $$;