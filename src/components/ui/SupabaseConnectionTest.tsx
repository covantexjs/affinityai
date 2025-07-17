import React, { useState, useEffect } from 'react';
import Button from './Button';
import { 
  getSupabaseStatus, 
  testSupabaseConnection, 
  isSupabaseReady,
  getSupabaseClient 
} from '../../lib/supabase';

interface ConnectionStatus {
  connected: boolean;
  error?: string;
  responseTime?: number;
  recordCount?: number;
  needsSetup: boolean;
  tableExists?: boolean;
}

export function SupabaseConnectionTest() {
  const [status, setStatus] = useState<ConnectionStatus>({
    connected: false,
    needsSetup: true,
    tableExists: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingTables, setIsCreatingTables] = useState(false);

  const checkConnection = async () => {
    setIsLoading(true);
    try {
      const connectionStatus = await getSupabaseStatus();
      setStatus(connectionStatus);
    } catch (networkError: any) {
      console.error('Network error during connection test:', networkError);
      setStatus({
        connected: false,
        error: networkError.message?.includes('Failed to fetch') 
          ? 'Network error - unable to reach Supabase. Check your internet connection and Supabase URL.'
          : 'Connection test failed',
        needsSetup: false,
        tableExists: false
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createTables = async () => {
    if (!isSupabaseReady()) {
      alert('Please connect to Supabase first using the "Connect to Supabase" button in the top right.');
      return;
    }

    setIsCreatingTables(true);
    try {
      const supabase = getSupabaseClient();
      
      console.log('🔨 [SUPABASE] Creating tables and functions...');

      const setupInstructions = `🔧 SUPABASE DATABASE SETUP REQUIRED

The quiz_purchases table is missing from your database. Follow these steps:

📋 STEP 1: Open Supabase Dashboard
• Go to: https://supabase.com/dashboard
• Select your project: ${supabase?.supabaseUrl?.replace('https://', '').replace('.supabase.co', '') || 'your-project'}

📋 STEP 2: Access SQL Editor
• Click "SQL Editor" in the left sidebar
• Click "New Query" button

📋 STEP 3: Copy & Paste This SQL Code
Copy the ENTIRE code block below and paste it into the SQL editor:

----------------------------------------
-- Create quiz_purchases table and functions
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

-- Enable Row Level Security
ALTER TABLE quiz_purchases ENABLE ROW LEVEL SECURITY;

-- Create policies for data access
CREATE POLICY "Users can view their own purchase data"
  ON quiz_purchases FOR SELECT TO authenticated
  USING (email = auth.jwt() ->> 'email');

CREATE POLICY "Anonymous users can view purchase by email"
  ON quiz_purchases FOR SELECT TO anon
  USING (true);

-- Create the upsert function
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
----------------------------------------

📋 STEP 4: Execute the SQL
• Click the "RUN" button (or press Ctrl+Enter)
• Wait for "Success. No rows returned" message

📋 STEP 5: Verify Setup
• Go to "Table Editor" in the sidebar
• You should see "quiz_purchases" table listed
• Come back here and click "Refresh" button

✅ After completing these steps, your database will be ready!`;

      const userConfirmed = confirm(setupInstructions + '\n\nClick OK to copy the SQL code to your clipboard, then follow the steps above.');
      
      if (userConfirmed) {
        const sqlCode = `-- Create quiz_purchases table and functions
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

-- Enable Row Level Security
ALTER TABLE quiz_purchases ENABLE ROW LEVEL SECURITY;

-- Create policies for data access
CREATE POLICY "Users can view their own purchase data"
  ON quiz_purchases FOR SELECT TO authenticated
  USING (email = auth.jwt() ->> 'email');

CREATE POLICY "Anonymous users can view purchase by email"
  ON quiz_purchases FOR SELECT TO anon
  USING (true);

-- Create the upsert function
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
$$;`;

        try {
          await navigator.clipboard.writeText(sqlCode);
          alert('✅ SQL code copied to clipboard!\n\nNow go to your Supabase dashboard and paste it in the SQL Editor.');
        } catch (err) {
          console.error('Failed to copy to clipboard:', err);
          alert('⚠️ Could not copy to clipboard automatically.\n\nPlease manually copy the SQL code from the previous message.');
        }
      }
      
    } catch (error: any) {
      console.error('❌ [SUPABASE] Failed to create tables:', error);
      alert('❌ Setup process failed. Please follow the manual setup instructions provided.');
    } finally {
      setIsCreatingTables(false);
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

  const getStatusMessage = () => {
    if (status.needsSetup) {
      return 'Please connect to Supabase using the button in the top right corner.';
    }
    
    if (!status.connected && status.error?.includes('does not exist')) {
      return 'The quiz_purchases table does not exist in your database. Click "Create Tables" below to set it up.';
    }
    
    if (!status.connected && status.error?.includes('permission denied')) {
      return 'Permission denied. Please check your RLS policies and table permissions.';
    }
    
    if (!status.connected) {
      return status.error || 'Connection failed';
    }
    
    return 'Connected and ready to use!';
  };

  const showCreateTablesButton = () => {
    return !status.needsSetup && (!status.connected || status.error?.includes('does not exist') || status.tableExists === false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md border p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Supabase Connection Status</h2>
        <Button 
          onClick={checkConnection} 
          disabled={isLoading}
          variant="outline"
          size="sm"
        >
          {isLoading ? 'Checking...' : 'Refresh'}
        </Button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${
            status.connected ? 'bg-green-500' : 'bg-red-500'
          }`} />
          <span className={`font-medium ${
            status.connected ? 'text-green-700' : 'text-red-700'
          }`}>
            {status.connected ? 'Connected' : 'Disconnected'}
          </span>
        </div>

        <div className={`border rounded-md p-3 ${
          status.connected ? 'bg-green-50 border-green-200' : 
          status.needsSetup ? 'bg-yellow-50 border-yellow-200' : 
          'bg-red-50 border-red-200'
        }`}>
          <p className={`text-sm ${
            status.connected ? 'text-green-700' : 
            status.needsSetup ? 'text-yellow-700' : 
            'text-red-700'
          }`}>
            <strong>Status:</strong> {getStatusMessage()}
          </p>
        </div>

        {status.connected && (
          <div className="bg-green-50 border border-green-200 rounded-md p-3">
            <div className="text-green-700 text-sm space-y-1">
              {status.responseTime && (
                <p><strong>Response Time:</strong> {status.responseTime}ms</p>
              )}
              {typeof status.recordCount === 'number' && (
                <p><strong>Records in quiz_purchases:</strong> {status.recordCount}</p>
              )}
            </div>
          </div>
        )}

        {status.error && !status.needsSetup && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <p className="text-red-700 text-sm">
              <strong>Error Details:</strong> {status.error}
            </p>
          </div>
        )}

        {showCreateTablesButton() && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
            <p className="text-blue-700 text-sm mb-3">
              The database tables need to be created. Click the button below to get setup instructions.
            </p>
            <Button 
              onClick={createTables}
              disabled={isCreatingTables}
              variant="primary"
              size="sm"
            >
              {isCreatingTables ? 'Preparing Setup...' : '🔧 Setup Database Tables'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}