import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Database, 
  Key,
  Globe,
  Shield,
  RefreshCw
} from 'lucide-react';
import { initializeSupabaseWithCredentials, testSupabaseConnection, getSupabaseConfig } from '../../lib/supabase';
import Button from './Button';
import Card from './Card';

interface CredentialVerifierProps {
  className?: string;
}

const CredentialVerifier: React.FC<CredentialVerifierProps> = ({ className = '' }) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<any>(null);

  const testCredentials = async () => {
    setIsVerifying(true);
    setVerificationResult(null);

    const url = 'https://cbmglgcolscecxseorap.supabase.co';
    const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNibWdsZ2NvbHNjZWN4c2VvcmFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg3ODYxNzksImV4cCI6MjA2NDM2MjE3OX0.gvGvkiDBG2EVB0XdWpnHoZE3vr8-HZSy9w7jj7uHWDo';

    try {
      console.log('🔍 [CREDENTIAL VERIFIER] Testing provided credentials...');
      
      // Step 1: Validate URL format
      const urlTest = {
        valid: url.includes('supabase.com') || url.includes('supabase.co'),
        message: url.includes('supabase.co') ? 'Valid Supabase URL format' : 
                 (url.includes('supabase.com') || url.includes('supabase.co')) ? 'Valid Supabase URL format' : 'Invalid URL format'
      };

      // Step 2: Validate JWT token format
      const jwtTest = {
        valid: anonKey.startsWith('eyJ'),
        message: anonKey.startsWith('eyJ') ? 'Valid JWT token format' : 'Invalid JWT token format'
      };

      // Step 3: Try to decode JWT (basic validation)
      let jwtPayload = null;
      try {
        const base64Payload = anonKey.split('.')[1];
        jwtPayload = JSON.parse(atob(base64Payload));
      } catch (e) {
        console.warn('Could not decode JWT payload');
      }

      // Step 4: Initialize Supabase client
      console.log('🔄 [CREDENTIAL VERIFIER] Initializing Supabase client...');
      const client = initializeSupabaseWithCredentials(url, anonKey);
      
      // Step 5: Test connection
      console.log('🧪 [CREDENTIAL VERIFIER] Testing connection...');
      const connectionTest = await testSupabaseConnection();

      // Step 6: Get current config
      const config = getSupabaseConfig();

      setVerificationResult({
        success: connectionTest,
        tests: {
          urlFormat: urlTest,
          jwtFormat: jwtTest,
          jwtPayload,
          initialization: {
            valid: !!client,
            message: client ? 'Client initialized successfully' : 'Failed to initialize client'
          },
          connection: {
            valid: connectionTest,
            message: connectionTest ? 'Connection successful' : 'Connection failed - may need database setup'
          }
        },
        config,
        timestamp: new Date().toISOString()
      });

    } catch (error: any) {
      console.error('❌ [CREDENTIAL VERIFIER] Verification failed:', error);
      setVerificationResult({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <Card>
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Credential Verification
          </h2>
          <p className="text-gray-600">
            Testing your Supabase credentials for proper initialization
          </p>
        </div>

        {/* Provided Credentials */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-800 mb-3">Credentials to Test:</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-600" />
              <span className="text-blue-700">URL:</span>
              <code className="text-blue-800 bg-blue-100 px-2 py-1 rounded text-xs">
                https://cbmglgcolscecxseorap.supabase.co
              </code>
            </div>
            <div className="flex items-center gap-2">
              <Key className="w-4 h-4 text-blue-600" />
              <span className="text-blue-700">Anon Key:</span>
              <code className="text-blue-800 bg-blue-100 px-2 py-1 rounded text-xs">
                eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
              </code>
            </div>
          </div>
        </div>

        {/* Test Button */}
        <div className="text-center mb-6">
          <Button
            onClick={testCredentials}
            disabled={isVerifying}
            size="lg"
            className="w-full"
          >
            {isVerifying ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Verifying Credentials...
              </>
            ) : (
              <>
                <Database className="w-5 h-5 mr-2" />
                Test Credentials
              </>
            )}
          </Button>
        </div>

        {/* Results */}
        {verificationResult && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Overall Status */}
            <div className={`p-4 rounded-lg border ${
              verificationResult.success 
                ? 'bg-green-50 border-green-200' 
                : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-center gap-3 mb-2">
                {verificationResult.success ? (
                  <CheckCircle2 className="w-6 h-6 text-green-500" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-red-500" />
                )}
                <h3 className={`font-semibold ${
                  verificationResult.success ? 'text-green-800' : 'text-red-800'
                }`}>
                  {verificationResult.success ? 'Credentials Verified Successfully!' : 'Credential Verification Failed'}
                </h3>
              </div>
              
              {verificationResult.error && (
                <p className="text-red-700 text-sm">
                  Error: {verificationResult.error}
                </p>
              )}
            </div>

            {/* Detailed Test Results */}
            {verificationResult.tests && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-3">Detailed Test Results:</h4>
                <div className="space-y-3">
                  {Object.entries(verificationResult.tests).map(([testName, result]: [string, any]) => (
                    <div key={testName} className="flex items-center justify-between p-2 bg-white rounded border">
                      <div className="flex items-center gap-2">
                        {result.valid ? (
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-red-500" />
                        )}
                        <span className="text-sm font-medium capitalize">
                          {testName.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                      </div>
                      <span className={`text-xs ${
                        result.valid ? 'text-green-700' : 'text-red-700'
                      }`}>
                        {result.message}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* JWT Payload Info */}
            {verificationResult.tests?.jwtPayload && (
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-3">JWT Token Information:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-blue-700 font-medium">Issuer:</span>
                    <span className="ml-2 text-blue-800">{verificationResult.tests.jwtPayload.iss}</span>
                  </div>
                  <div>
                    <span className="text-blue-700 font-medium">Role:</span>
                    <span className="ml-2 text-blue-800">{verificationResult.tests.jwtPayload.role}</span>
                  </div>
                  <div>
                    <span className="text-blue-700 font-medium">Project Ref:</span>
                    <span className="ml-2 text-blue-800">{verificationResult.tests.jwtPayload.ref}</span>
                  </div>
                  <div>
                    <span className="text-blue-700 font-medium">Expires:</span>
                    <span className="ml-2 text-blue-800">
                      {new Date(verificationResult.tests.jwtPayload.exp * 1000).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Current Configuration */}
            {verificationResult.config && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-3">Current Configuration:</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">URL:</span>
                    <span className="text-gray-800 font-mono text-xs">
                      {verificationResult.config.url || 'Not set'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Has Anon Key:</span>
                    <span className={`font-medium ${
                      verificationResult.config.hasAnonKey ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {verificationResult.config.hasAnonKey ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Initialized:</span>
                    <span className={`font-medium ${
                      verificationResult.config.isInitialized ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {verificationResult.config.isInitialized ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Next Steps */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-800 mb-2">Next Steps:</h4>
              {verificationResult.success ? (
                <div className="text-yellow-700 text-sm space-y-1">
                  <p>✅ Your credentials are working correctly!</p>
                  <p>• Go to the admin dashboard to set up your database tables</p>
                  <p>• Test the full application flow</p>
                  <p>• Configure your Stripe integration</p>
                </div>
              ) : (
                <div className="text-yellow-700 text-sm space-y-1">
                  <p>❌ Credentials need attention:</p>
                  <p>• Verify your Supabase project is active</p>
                  <p>• Check that the anon key hasn't expired</p>
                  <p>• Ensure your project URL is correct</p>
                  <p>• Try regenerating your anon key in Supabase dashboard</p>
                </div>
              )}
            </div>

            <div className="text-center">
              <Button
                onClick={testCredentials}
                variant="outline"
                size="sm"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Test Again
              </Button>
            </div>
          </motion.div>
        )}
      </Card>
    </div>
  );
};

export default CredentialVerifier;