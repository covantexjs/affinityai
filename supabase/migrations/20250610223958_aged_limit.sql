/*
  # Create quiz purchases table and functions

  1. New Tables
    - `quiz_purchases`
      - `id` (uuid, primary key)
      - `email` (text, unique, not null)
      - `name` (text, not null)
      - `archetype_id` (text, not null)
      - `archetype_name` (text, not null)
      - `dimension_scores` (jsonb, stores quiz dimension scores)
      - `stripe_session_id` (text, unique, for Stripe checkout sessions)
      - `stripe_payment_intent_id` (text, for Stripe payment tracking)
      - `payment_status` (text, default 'pending')
      - `amount_paid` (integer, amount in cents)
      - `currency` (text, default 'usd')
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `quiz_purchases` table
    - Add policy for authenticated users to read their own data
    - Add policy for anonymous users to view purchase data by email
    - Add policy for service role to manage all data

  3. Functions
    - `upsert_quiz_purchase` function for inserting/updating purchase records
    - Handles both new purchases and updates to existing ones

  4. Indexes
    - Unique index on email for fast lookups
    - Index on stripe_session_id for webhook processing
*/

-- Create quiz_purchases table
CREATE TABLE IF NOT EXISTS quiz_purchases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
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
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE UNIQUE INDEX IF NOT EXISTS quiz_purchases_email_idx ON quiz_purchases(email);
CREATE INDEX IF NOT EXISTS quiz_purchases_stripe_session_idx ON quiz_purchases(stripe_session_id);
CREATE INDEX IF NOT EXISTS quiz_purchases_payment_status_idx ON quiz_purchases(payment_status);
CREATE INDEX IF NOT EXISTS quiz_purchases_created_at_idx ON quiz_purchases(created_at);

-- Enable Row Level Security
ALTER TABLE quiz_purchases ENABLE ROW LEVEL SECURITY;

-- Create policies for data access
CREATE POLICY "Users can view their own purchase data"
  ON quiz_purchases FOR SELECT TO authenticated
  USING (email = auth.jwt() ->> 'email');

CREATE POLICY "Anonymous users can view purchase by email"
  ON quiz_purchases FOR SELECT TO anon
  USING (true);

CREATE POLICY "Service role can manage all purchase data"
  ON quiz_purchases FOR ALL TO service_role
  USING (true);

-- Create the upsert function for managing purchase records
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
BEGIN
  -- Try to update existing record first
  UPDATE quiz_purchases 
  SET 
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
    INSERT INTO quiz_purchases (
      email, name, archetype_id, archetype_name, dimension_scores,
      stripe_session_id, stripe_payment_intent_id, payment_status,
      amount_paid, currency
    ) VALUES (
      p_email, p_name, p_archetype_id, p_archetype_name, p_dimension_scores,
      p_stripe_session_id, p_stripe_payment_intent_id, p_payment_status,
      p_amount_paid, p_currency
    )
    RETURNING id INTO purchase_id;
  END IF;
  
  RETURN purchase_id;
END;
$$;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON quiz_purchases TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION upsert_quiz_purchase TO anon, authenticated, service_role;