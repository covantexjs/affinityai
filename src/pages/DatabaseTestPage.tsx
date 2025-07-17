import React from 'react';
import Layout from '../components/layout/Layout';
import { SupabaseConnectionTest } from '../components/ui/SupabaseConnectionTest';
import StripeConnectionTest from '../components/ui/StripeConnectionTest';
import DatabaseSetupHelper from '../components/ui/DatabaseSetupHelper';
import ConnectionStatus from '../components/ui/ConnectionStatus';
import { isSupabaseReady } from '../lib/supabase';

export default function DatabaseTestPage() {
  const supabaseReady = isSupabaseReady();

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Database & API Connection Status
            </h1>
            <p className="text-gray-600">
              Monitor your Supabase database and Stripe API connections
            </p>
            
            <div className="mt-4 flex justify-center">
              <div className="bg-white rounded-lg border px-4 py-2">
                <ConnectionStatus showDetails={true} />
              </div>
            </div>
          </div>

          {/* Database Setup Helper - Only show if Supabase is ready but needs setup */}
          <div className="mb-8">
            <DatabaseSetupHelper />
          </div>
          
          {/* Connection Tests */}
          <div className="space-y-8">
            <SupabaseConnectionTest />
            <StripeConnectionTest />
          </div>

          {/* Status Summary */}
          <div className="mt-8 p-6 bg-white rounded-lg shadow-md border">
            <h2 className="text-xl font-semibold mb-4">Connection Summary</h2>
            <div className="space-y-4 text-sm text-gray-700">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">Supabase Database:</span>
                <div className="flex items-center gap-2">
                  <ConnectionStatus compact={true} />
                  <span className="text-xs text-gray-500">
                    {supabaseReady ? 'Configured' : 'Not Configured'}
                  </span>
                </div>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-2">How it works:</h3>
                <ul className="text-blue-700 space-y-1 text-sm">
                  <li>• Your Supabase credentials are configured via environment variables</li>
                  <li>• The database setup helper guides you through creating the required tables</li>
                  <li>• Connection tests verify that everything is working properly</li>
                  <li>• Once setup is complete, all features will work seamlessly</li>
                </ul>
              </div>

              {supabaseReady && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-semibold text-green-800 mb-2">✅ Ready to go!</h3>
                  <p className="text-green-700 text-sm">
                    Your Supabase connection is configured. If the connection test passes and you've run the database setup script, 
                    you're all set to use the full application.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export { DatabaseTestPage }