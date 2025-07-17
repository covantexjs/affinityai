/*
  # Enhanced Customer Tracking Schema

  1. New Tables
    - `customers`: Core customer profiles and analytics
      - `id` (uuid, primary key)
      - `email` (text, unique, not null)
      - `name` (text, not null)
      - `first_purchase_date` (timestamptz)
      - `total_purchases` (integer, default 0)
      - `total_spent` (integer, amount in cents)
      - `preferred_archetype` (text)
      - `marketing_consent` (boolean, default false)
      - `last_login` (timestamptz)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())

    - `purchases`: Enhanced purchase tracking
      - `id` (uuid, primary key)
      - `customer_id` (uuid, references customers)
      - `email` (text, not null)
      - `name` (text, not null)
      - `archetype_id` (text, not null)
      - `archetype_name` (text, not null)
      - `dimension_scores` (jsonb)
      - `stripe_session_id` (text, unique)
      - `stripe_payment_intent_id` (text)
      - `payment_status` (text, default 'pending')
      - `amount_paid` (integer, in cents)
      - `currency` (text, default 'usd')
      - `purchase_type` (text, default 'premium_report')
      - `metadata` (jsonb, default '{}')
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())

    - `subscriptions`: Future subscription tracking
      - `id` (uuid, primary key)
      - `customer_id` (uuid, references customers)
      - `stripe_subscription_id` (text, unique)
      - `status` (text, not null)
      - `current_period_start` (timestamptz)
      - `current_period_end` (timestamptz)
      - `cancel_at_period_end` (boolean, default false)
      - `plan_name` (text)
      - `plan_price` (integer, in cents)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())

  2. Security
    - Enable RLS on all tables
    - Policies for authenticated and anonymous access
    - Service role policies for admin operations

  3. Functions
    - Customer analytics functions
    - Purchase tracking functions
    - Subscription management functions

  4. Indexes
    - Performance indexes for common queries
    - Unique constraints for data integrity
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
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create purchases table (enhanced version of quiz_purchases)
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
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create subscriptions table for future use
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES customers(id) NOT NULL,
  stripe_subscription_id text UNIQUE,
  status text NOT NULL,
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean DEFAULT false,
  plan_name text,
  plan_price integer,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS customers_email_idx ON customers(email);
CREATE INDEX IF NOT EXISTS customers_created_at_idx ON customers(created_at);
CREATE INDEX IF NOT EXISTS customers_total_spent_idx ON customers(total_spent);

CREATE INDEX IF NOT EXISTS purchases_customer_id_idx ON purchases(customer_id);
CREATE INDEX IF NOT EXISTS purchases_email_idx ON purchases(email);
CREATE INDEX IF NOT EXISTS purchases_stripe_session_idx ON purchases(stripe_session_id);
CREATE INDEX IF NOT EXISTS purchases_payment_status_idx ON purchases(payment_status);
CREATE INDEX IF NOT EXISTS purchases_created_at_idx ON purchases(created_at);
CREATE INDEX IF NOT EXISTS purchases_purchase_type_idx ON purchases(purchase_type);

CREATE INDEX IF NOT EXISTS subscriptions_customer_id_idx ON subscriptions(customer_id);
CREATE INDEX IF NOT EXISTS subscriptions_stripe_subscription_idx ON subscriptions(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS subscriptions_status_idx ON subscriptions(status);

-- Enable Row Level Security
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

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

-- Function to get customer analytics
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
BEGIN
  -- Get total customers
  SELECT COUNT(*) INTO total_customers FROM customers;
  
  -- Get total revenue
  SELECT COALESCE(SUM(amount_paid), 0) INTO total_revenue 
  FROM purchases WHERE payment_status = 'paid';
  
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
    WHERE payment_status = 'paid'
    GROUP BY archetype_name
    ORDER BY purchase_count DESC
    LIMIT 10
  ) archetype_stats;
  
  -- Build result
  result := jsonb_build_object(
    'total_customers', total_customers,
    'total_revenue', total_revenue,
    'average_order_value', avg_order_value,
    'popular_archetypes', COALESCE(popular_archetypes, '{}'::jsonb)
  );
  
  RETURN result;
END;
$$;

-- Function to update customer stats
CREATE OR REPLACE FUNCTION update_customer_stats()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Update customer statistics when a purchase is made
  IF NEW.payment_status = 'paid' AND (OLD.payment_status IS NULL OR OLD.payment_status != 'paid') THEN
    UPDATE customers 
    SET 
      total_purchases = total_purchases + 1,
      total_spent = total_spent + COALESCE(NEW.amount_paid, 0),
      preferred_archetype = NEW.archetype_id,
      updated_at = now()
    WHERE email = NEW.email;
    
    -- If customer doesn't exist, create them
    IF NOT FOUND THEN
      INSERT INTO customers (
        email, name, first_purchase_date, total_purchases, 
        total_spent, preferred_archetype, created_at, updated_at
      ) VALUES (
        NEW.email, NEW.name, now(), 1, 
        COALESCE(NEW.amount_paid, 0), NEW.archetype_id, now(), now()
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger to automatically update customer stats
CREATE TRIGGER update_customer_stats_trigger
  AFTER INSERT OR UPDATE ON purchases
  FOR EACH ROW
  EXECUTE FUNCTION update_customer_stats();

-- Function for backward compatibility with existing quiz_purchases queries
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
  WHERE email = p_email
  RETURNING id INTO purchase_id;
  
  -- If no record was updated, insert a new one
  IF purchase_id IS NULL THEN
    INSERT INTO purchases (
      customer_id, email, name, archetype_id, archetype_name, dimension_scores,
      stripe_session_id, stripe_payment_intent_id, payment_status,
      amount_paid, currency, purchase_type
    ) VALUES (
      customer_id, p_email, p_name, p_archetype_id, p_archetype_name, p_dimension_scores,
      p_stripe_session_id, p_stripe_payment_intent_id, p_payment_status,
      p_amount_paid, p_currency, 'premium_report'
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
GRANT EXECUTE ON FUNCTION get_customer_analytics TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION upsert_quiz_purchase TO anon, authenticated, service_role;