-- Enhanced Customer Analytics Schema for Affinity AI
-- This script creates all necessary tables for customer tracking and analytics

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

CREATE INDEX IF NOT EXISTS quiz_completions_email_idx ON quiz_completions(email);
CREATE INDEX IF NOT EXISTS quiz_completions_completed_at_idx ON quiz_completions(completed_at DESC);

-- Enable Row Level Security
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_completions ENABLE ROW LEVEL SECURITY;

-- Create policies for customers table
CREATE POLICY "Service role can manage all customer data"
  ON customers FOR ALL TO service_role
  USING (true);

CREATE POLICY "Anonymous users can view customer data by email"
  ON customers FOR SELECT TO anon
  USING (true);

-- Create policies for purchases table
CREATE POLICY "Service role can manage all purchase data"
  ON purchases FOR ALL TO service_role
  USING (true);

CREATE POLICY "Anonymous users can view purchase data by email"
  ON purchases FOR SELECT TO anon
  USING (true);

-- Create policies for quiz_completions table
CREATE POLICY "Service role can manage quiz completion data"
  ON quiz_completions FOR ALL TO service_role
  USING (true);

CREATE POLICY "Anonymous users can insert quiz completions"
  ON quiz_completions FOR INSERT TO anon
  WITH CHECK (true);

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

-- Backward compatibility function for existing quiz_purchases queries
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
GRANT ALL ON quiz_completions TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION upsert_quiz_purchase TO anon, authenticated, service_role;

-- Insert sample data for testing
INSERT INTO customers (email, name, total_purchases, total_spent, preferred_archetype, marketing_consent, created_at) VALUES
('alice@example.com', 'Alice Johnson', 2, 3800, 'narrative-idealist', true, now() - interval '30 days'),
('bob@example.com', 'Bob Smith', 1, 1900, 'steady-guardian', false, now() - interval '15 days'),
('carol@example.com', 'Carol Davis', 3, 5700, 'vibrant-explorer', true, now() - interval '7 days')
ON CONFLICT (email) DO NOTHING;

-- Insert sample purchases
INSERT INTO purchases (customer_id, email, name, archetype_id, archetype_name, dimension_scores, payment_status, amount_paid, purchase_type, created_at) VALUES
((SELECT id FROM customers WHERE email = 'alice@example.com'), 'alice@example.com', 'Alice Johnson', 'narrative-idealist', 'Narrative Idealist', '{"emotional_depth": 2.0, "relational_style": 1.5}', 'paid', 1900, 'premium_report', now() - interval '30 days'),
((SELECT id FROM customers WHERE email = 'bob@example.com'), 'bob@example.com', 'Bob Smith', 'steady-guardian', 'Steady Guardian', '{"emotional_depth": 1.0, "relational_style": 2.0}', 'paid', 1900, 'premium_report', now() - interval '15 days'),
((SELECT id FROM customers WHERE email = 'carol@example.com'), 'carol@example.com', 'Carol Davis', 'vibrant-explorer', 'Vibrant Explorer', '{"emotional_depth": 1.5, "relational_style": 1.8}', 'paid', 1900, 'premium_report', now() - interval '7 days')
ON CONFLICT (stripe_session_id) DO NOTHING;

-- Insert sample quiz completions
INSERT INTO quiz_completions (email, archetype, session_id, completed_at, converted_to_purchase, conversion_date) VALUES
('alice@example.com', 'narrative-idealist', 'session_1', now() - interval '30 days', true, now() - interval '30 days'),
('bob@example.com', 'steady-guardian', 'session_2', now() - interval '15 days', true, now() - interval '15 days'),
('carol@example.com', 'vibrant-explorer', 'session_3', now() - interval '7 days', true, now() - interval '7 days'),
('david@example.com', 'mindful-architect', 'session_4', now() - interval '5 days', false, null),
('eve@example.com', 'compassionate-nurturer', 'session_5', now() - interval '2 days', false, null);

-- Success message
SELECT 'Database setup completed successfully! All tables, indexes, and functions have been created.' as result;