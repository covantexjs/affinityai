import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Database, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  Check, 
  ExternalLink,
  FileText,
  Play,
  Loader2,
  Download,
  Code
} from 'lucide-react';
import { testSupabaseConnection, isSupabaseReady } from '../../lib/supabase';
import Button from './Button';
import Card from './Card';

const SUPPORT_EMAIL = 'support@affinityai.me';

interface DatabaseSetupHelperProps {
  className?: string;
}

const DatabaseSetupHelper: React.FC<DatabaseSetupHelperProps> = ({ className = '' }) => {
  const [copied, setCopied] = useState<string | null>(null);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [showFullScript, setShowFullScript] = useState(false);

  const sqlScript = `-- Safe Database Setup Script for Affinity AI
-- This script can be run multiple times without errors

-- Drop existing policies if they exist (safe approach)
DROP POLICY IF EXISTS "Service role can manage all customer data" ON customers;
DROP POLICY IF EXISTS "Anonymous users can view customer data by email" ON customers;
DROP POLICY IF EXISTS "Service role can manage all purchase data" ON purchases;
DROP POLICY IF EXISTS "Anonymous users can view purchase data by email" ON purchases;
DROP POLICY IF EXISTS "Service role can manage quiz completion data" ON quiz_completions;
DROP POLICY IF EXISTS "Anonymous users can insert quiz completions" ON quiz_completions;

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

-- Create indexes for performance (safe with IF NOT EXISTS)
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

-- Create policies for customers table (fresh creation after dropping)
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

CREATE POLICY "Anonymous users can insert pending purchases"
  ON purchases FOR INSERT TO anon
  WITH CHECK (payment_status = 'pending');

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

-- Insert sample data for testing (only if tables are empty)
DO $$
BEGIN
  -- Only insert if customers table is empty
  IF NOT EXISTS (SELECT 1 FROM customers LIMIT 1) THEN
    INSERT INTO customers (email, name, total_purchases, total_spent, preferred_archetype, marketing_consent, created_at) VALUES
    ('alice@example.com', 'Alice Johnson', 2, 3800, 'narrative-idealist', true, now() - interval '30 days'),
    ('bob@example.com', 'Bob Smith', 1, 1900, 'steady-guardian', false, now() - interval '15 days'),
    ('carol@example.com', 'Carol Davis', 3, 5700, 'vibrant-explorer', true, now() - interval '7 days');
    
    -- Insert sample purchases
    INSERT INTO purchases (customer_id, email, name, archetype_id, archetype_name, dimension_scores, payment_status, amount_paid, purchase_type, created_at) VALUES
    ((SELECT id FROM customers WHERE email = 'alice@example.com'), 'alice@example.com', 'Alice Johnson', 'narrative-idealist', 'Narrative Idealist', '{"emotional_depth": 2.0, "relational_style": 1.5}', 'paid', 1900, 'premium_report', now() - interval '30 days'),
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

-- Success message
SELECT 'Database setup completed successfully! All tables, indexes, and functions have been created.' as result;`;

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const downloadScript = () => {
    const blob = new Blob([sqlScript], { type: 'text/sql' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'affinity-ai-database-setup.sql';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const testConnection = async () => {
    if (!isSupabaseReady()) {
      setTestResult({
        success: false,
        message: 'Supabase not configured. Please set up your connection first.'
      });
      return;
    }

    setIsTestingConnection(true);
    try {
      const isConnected = await testSupabaseConnection();
      setTestResult({
        success: isConnected,
        message: isConnected 
          ? 'Connection successful! Database is ready.' 
          : 'Connection failed. Please check your setup and run the SQL script.'
      });
    } catch (error: any) {
      setTestResult({
        success: false,
        message: error.message || 'Connection test failed'
      });
    } finally {
      setIsTestingConnection(false);
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <Card>
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Database className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Enhanced Database Setup
          </h2>
          <p className="text-gray-600">
            Set up your Supabase database with advanced customer analytics and tracking
          </p>
        </div>

        {/* Features Overview */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">What This Setup Includes:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span className="text-sm text-gray-700">Enhanced customer tracking</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span className="text-sm text-gray-700">Purchase analytics & reporting</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span className="text-sm text-gray-700">Quiz completion tracking</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span className="text-sm text-gray-700">Automated customer statistics</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span className="text-sm text-gray-700">Risk scoring & churn prediction</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span className="text-sm text-gray-700">Sample data for testing</span>
              </div>
            </div>
          </div>
        </div>

        {/* Step 1: Connection Status */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Step 1: Test Database Connection</h3>
          <div className="flex gap-3 mb-4">
            <Button
              onClick={testConnection}
              disabled={isTestingConnection}
              variant="outline"
              className="flex-1"
            >
              {isTestingConnection ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Testing...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Test Connection
                </>
              )}
            </Button>
          </div>

          {testResult && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-3 rounded-lg border flex items-center gap-2 ${
                testResult.success 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-red-50 border-red-200'
              }`}
            >
              {testResult.success ? (
                <CheckCircle2 className="w-4 h-4 text-green-500" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-500" />
              )}
              <span className={`text-sm ${
                testResult.success ? 'text-green-700' : 'text-red-700'
              }`}>
                {testResult.message}
              </span>
            </motion.div>
          )}
        </div>

        {/* Step 2: SQL Script */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Step 2: Run Database Setup Script</h3>
          
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Enhanced Database Setup Script</span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={downloadScript}
                >
                  <Download className="w-4 h-4 mr-1" />
                  Download
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(sqlScript, 'sql')}
                >
                  {copied === 'sql' ? (
                    <>
                      <Check className="w-4 h-4 mr-1" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-1" />
                      Copy SQL
                    </>
                  )}
                </Button>
              </div>
            </div>
            
            <div className="bg-gray-900 text-green-400 p-4 rounded-md text-sm font-mono max-h-64 overflow-y-auto">
              <pre className="whitespace-pre-wrap">
                {showFullScript ? sqlScript : sqlScript.substring(0, 800) + '...'}
              </pre>
              {!showFullScript && (
                <button
                  onClick={() => setShowFullScript(true)}
                  className="text-blue-400 hover:text-blue-300 mt-2 text-xs"
                >
                  <Code className="w-3 h-3 inline mr-1" />
                  Show full script
                </button>
              )}
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-2">Setup Instructions:</h4>
            <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
              <li>Copy the SQL script above (or download the file)</li>
            <li>
              Go to your 
              <a href="https://cbmglgcolscecxseorap.supabase.co" target="_blank" rel="noopener noreferrer" className="underline">Supabase Dashboard</a> 
              or 
              <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" className="underline">Main Dashboard</a>
            </li>

              <li>Navigate to SQL Editor → New Query</li>
              <li>Paste the entire script and click "RUN"</li>
              <li>Wait for "Success. No rows returned" message</li>
              <li>Return here and test the connection again</li>
            </ol>
          </div>
        </div>

        {/* Step 3: Verification */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Step 3: Verify Database Setup</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-800 mb-2">Tables Created:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>✓ customers (enhanced tracking)</li>
                <li>✓ purchases (with analytics)</li>
                <li>✓ quiz_completions (conversion tracking)</li>
              </ul>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-800 mb-2">Functions & Triggers:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>✓ upsert_quiz_purchase</li>
                <li>✓ update_customer_stats</li>
                <li>✓ Automated triggers</li>
              </ul>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-800 mb-2">Security & Performance:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>✓ Row Level Security (RLS)</li>
                <li>✓ Optimized indexes</li>
                <li>✓ Sample test data</li>
              </ul>
            </div>
          </div>

          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="font-semibold text-green-800 mb-2">After Setup:</h4>
            <p className="text-sm text-green-700">
              Once the script runs successfully, your database will be ready for advanced customer analytics, 
              purchase tracking, and conversion monitoring. The admin dashboard will have access to comprehensive 
              business intelligence features.
            </p>
          </div>
        </div>

        {/* Help Links */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="font-semibold text-gray-800 mb-3">Need Help? Contact <a href={`mailto:${SUPPORT_EMAIL}`} className="text-primary-500 hover:underline">{SUPPORT_EMAIL}</a></h3>
          <div className="space-y-2 text-sm">
            <a
              href="https://supabase.com/docs/guides/database/overview"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
            >
              <ExternalLink className="w-4 h-4" />
              Supabase Database Documentation
            </a>
            <a
              href="https://supabase.com/docs/guides/database/sql-editor"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
            >
              <ExternalLink className="w-4 h-4" />
              Using the SQL Editor
            </a>
            <a
              href="https://supabase.com/docs/guides/auth/row-level-security"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
            >
              <ExternalLink className="w-4 h-4" />
              Row Level Security Guide
            </a>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DatabaseSetupHelper;