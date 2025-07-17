/*
  # Quiz Purchases Schema

  1. New Tables
    - `quiz_purchases`
      - `id` (uuid, primary key)
      - `email` (text, unique index for duplicate prevention)
      - `name` (text)
      - `archetype_id` (text)
      - `archetype_name` (text)
      - `dimension_scores` (jsonb for storing all quiz dimension data)
      - `stripe_session_id` (text, unique)
      - `stripe_payment_intent_id` (text)
      - `payment_status` (text, default 'pending')
      - `amount_paid` (integer, in cents)
      - `currency` (text, default 'usd')
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `quiz_purchases` table
    - Add policy for users to view their own purchase data by email
    - Add indexes for performance

  3. Functions
    - Function to safely upsert purchase data (prevents duplicates)
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

-- Create unique index on email to prevent duplicates
CREATE UNIQUE INDEX IF NOT EXISTS quiz_purchases_email_idx ON quiz_purchases(email);

-- Create index on stripe_session_id for fast lookups
CREATE INDEX IF NOT EXISTS quiz_purchases_stripe_session_idx ON quiz_purchases(stripe_session_id);

-- Enable RLS
ALTER TABLE quiz_purchases ENABLE ROW LEVEL SECURITY;

-- Policy for users to view their own purchase data
CREATE POLICY "Users can view their own purchase data"
  ON quiz_purchases
  FOR SELECT
  TO authenticated
  USING (email = auth.jwt() ->> 'email');

-- Policy for anonymous users to view their purchase by email (for post-payment access)
CREATE POLICY "Anonymous users can view purchase by email"
  ON quiz_purchases
  FOR SELECT
  TO anon
  USING (true);

-- Function to safely upsert purchase data
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
  
  -- If no existing record, insert new one
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