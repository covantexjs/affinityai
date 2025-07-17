/*
  # Fix RLS Policies for Anonymous Users

  1. Updates
    - Add policy for anonymous users to insert into purchases table with payment_status='pending'
    - This allows the checkout flow to work properly without requiring authentication
    - Maintains security by only allowing pending purchases to be created

  2. Security
    - Maintains existing RLS policies
    - Adds targeted policy for checkout flow
*/

-- Add policy for anonymous users to insert pending purchases
CREATE POLICY "Anonymous users can insert pending purchases"
  ON purchases FOR INSERT TO anon
  WITH CHECK (payment_status = 'pending');

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON purchases TO anon, authenticated, service_role;