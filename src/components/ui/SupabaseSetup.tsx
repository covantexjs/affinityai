import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Database, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Eye, 
  EyeOff,
  ExternalLink,
  Copy,
  Check,
  Key,
  Globe,
  RefreshCw
} from 'lucide-react';
import { 
  initializeSupabaseWithCredentials, 
  testSupabaseConnection, 
  getSupabaseConfig,
  isSupabaseReady 
} from '../../lib/supabase';
import Button from './Button';
import Card from './Card';

interface SupabaseSetupProps {
  onSetupComplete?: () => void;
  className?: string;
}

const SupabaseSetup: React.FC<SupabaseSetupProps> = ({ onSetupComplete, className = '' }) => {
  const [credentials, setCredentials] = useState({
    url: '',
    anonKey: ''
  });
  const [showAnonKey, setShowAnonKey] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<any>(null);

  useEffect(() => {
    // Check if already configured
    const config = getSupabaseConfig();
    if (config.url) {
      setCredentials(prev => ({ ...prev, url: config.url }));
    }
    if (config.isInitialized) {
      setConnectionStatus('success');
      testConnection();
    }
  }, []);

  const testConnection = async () => {
    setIsConnecting(true);
    setError(null);

    try {
      console.log('🧪 [SUPABASE SETUP] Testing connection...');
      
      // Make sure we have a client
      if (!isSupabaseReady()) {
        throw new Error('Supabase not initialized. Please connect first.');
      }
      
      const isConnected = await testSupabaseConnection();
      
      if (isConnected) {
        setConnectionStatus('success');
        setTestResults({
          connected: true,
          message: 'Successfully connected to Supabase!',
          timestamp: new Date().toISOString()
        });
        
        if (onSetupComplete) {
          onSetupComplete();
        }
      } else {
        setConnectionStatus('error');
        setError('Connection test failed. Please check your credentials and ensure the database tables are set up.');
        setTestResults({
          connected: false,
          message: 'Connection failed - may need database setup',
          timestamp: new Date().toISOString()
        });
      }
    } catch (err: any) {
      setConnectionStatus('error');
      setError(err.message || 'Failed to test connection');
      setTestResults({
        connected: false,
        error: err.message,
        timestamp: new Date().toISOString()
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleConnect = async () => {
    if (!credentials.url || !credentials.anonKey) {
      setError('Please provide both URL and Anon Key');
      return;
    }

    // Validate URL format
    if (!credentials.url.includes('supabase.com') && !credentials.url.includes('supabase.co') && !credentials.url.includes('localhost')) {
      setError('Please enter a valid Supabase URL (should contain supabase.com or supabase.co)');
      return;
    }

    // Validate anon key format
    if (!credentials.anonKey.startsWith('eyJ')) {
      setError('Please enter a valid Supabase anon key (should start with eyJ)');
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      console.log('🔗 [SUPABASE SETUP] Initializing with credentials...');
      
      // Initialize Supabase with provided credentials
      initializeSupabaseWithCredentials(credentials.url, credentials.anonKey);
      
      // Wait a moment for initialization
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Test the connection
      await testConnection();
      
    } catch (err: any) {
      setConnectionStatus('error');
      setError(err.message || 'Failed to connect to Supabase. Please check your credentials.');
      setIsConnecting(false);
    } finally {
      // Don't set loading to false here since testConnection handles it
    }
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const isAlreadySetup = isSupabaseReady();

  return (
    <div className={`space-y-6 ${className}`}>
      <Card>
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Database className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {isAlreadySetup ? 'Supabase Status' : 'Setup Supabase Integration'}
          </h2>
          <p className="text-gray-600">
            {isAlreadySetup 
              ? 'Your database connection status and configuration'
              : 'Connect to your Supabase database to enable all features'
            }
          </p>
        </div>

        {isAlreadySetup ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Connection Status */}
            <div className={`p-4 rounded-lg border ${
              connectionStatus === 'success' 
                ? 'bg-green-50 border-green-200' 
                : connectionStatus === 'error'
                ? 'bg-red-50 border-red-200'
                : 'bg-yellow-50 border-yellow-200'
            }`}>
              <div className="flex items-center gap-3 mb-2">
                {connectionStatus === 'success' ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                ) : connectionStatus === 'error' ? (
                  <AlertCircle className="w-5 h-5 text-red-500" />
                ) : (
                  <Database className="w-5 h-5 text-yellow-500" />
                )}
                <span className={`font-medium ${
                  connectionStatus === 'success' ? 'text-green-800' :
                  connectionStatus === 'error' ? 'text-red-800' : 'text-yellow-800'
                }`}>
                  {connectionStatus === 'success' ? 'Connected Successfully' :
                   connectionStatus === 'error' ? 'Connection Failed' : 'Connection Status Unknown'}
                </span>
              </div>
              
              {testResults && (
                <div className="text-sm">
                  <p className={connectionStatus === 'success' ? 'text-green-700' : 'text-red-700'}>
                    {testResults.message}
                  </p>
                  {testResults.timestamp && (
                    <p className="text-gray-500 text-xs mt-1">
                      Last tested: {new Date(testResults.timestamp).toLocaleString()}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Current Configuration */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                <Key className="w-4 h-4" />
                Current Configuration
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-blue-700">Project URL:</span>
                  <code className="text-blue-800 bg-blue-100 px-2 py-1 rounded text-xs">
                    {getSupabaseConfig().url || 'Not configured'}
                  </code>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-blue-700">Status:</span>
                  <span className="text-blue-800 font-medium">
                    {isSupabaseReady() ? 'Initialized' : 'Not Initialized'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-blue-700">Source:</span>
                  <span className="text-blue-800 font-medium">
                    {typeof window !== 'undefined' && sessionStorage.getItem('supabase_url') ? 'Manual Setup' : 'Environment Variables'}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={testConnection}
                disabled={isConnecting}
                className="flex-1"
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Testing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Test Connection
                  </>
                )}
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => {
                  setConnectionStatus('idle');
                  setCredentials({ url: '', anonKey: '' });
                  setTestResults(null);
                  setError(null);
                }}
                className="flex-1"
              >
                Reconfigure
              </Button>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2"
              >
                <AlertCircle className="w-4 h-4 text-red-500" />
                <span className="text-red-700 text-sm">{error}</span>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <>
            {/* Setup Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-blue-800 mb-2">How to get your credentials:</h3>
              <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
                <li>Go to your <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" className="underline">Supabase Dashboard</a></li>
                <li>Select your project</li>
                <li>Go to Settings → API</li>
                <li>Copy the Project URL and anon/public key</li>
              </ol>
            </div>

            {/* Form */}
            <div className="space-y-4">
              <div>
                <label htmlFor="supabase-url" className="block text-sm font-medium text-gray-700 mb-2">
                  Project URL
                </label>
                <div className="relative">
                  <input
                    id="supabase-url"
                    type="url"
                    value={credentials.url}
                    onChange={(e) => setCredentials(prev => ({ ...prev, url: e.target.value }))}
                    placeholder="https://supabase.affinityai.me"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
                  />
                  {credentials.url && (
                    <button
                      onClick={() => copyToClipboard(credentials.url, 'url')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {copied === 'url' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="supabase-anon-key" className="block text-sm font-medium text-gray-700 mb-2">
                  Anon Key (Public)
                </label>
                <div className="relative">
                  <input
                    id="supabase-anon-key"
                    type={showAnonKey ? 'text' : 'password'}
                    value={credentials.anonKey}
                    onChange={(e) => setCredentials(prev => ({ ...prev, anonKey: e.target.value }))}
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-20"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex gap-2">
                    {credentials.anonKey && (
                      <button
                        onClick={() => copyToClipboard(credentials.anonKey, 'key')}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        {copied === 'key' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </button>
                    )}
                    <button
                      onClick={() => setShowAnonKey(!showAnonKey)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      {showAnonKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  This is safe to use in your frontend application
                </p>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2"
                >
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <span className="text-red-700 text-sm">{error}</span>
                </motion.div>
              )}

              <Button
                onClick={handleConnect}
                disabled={isConnecting || !credentials.url || !credentials.anonKey}
                className="w-full"
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Database className="w-4 h-4 mr-2" />
                    Connect to Supabase
                  </>
                )}
              </Button>
            </div>

            {/* Help Links */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="font-semibold text-gray-800 mb-3">Need help?</h3>
              <div className="space-y-2 text-sm">
                <a
                  href="https://supabase.com/docs/guides/getting-started"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                >
                  <ExternalLink className="w-4 h-4" />
                  Supabase Getting Started Guide
                </a>
                <a
                  href="https://supabase.com/docs/guides/api/api-keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                >
                  <ExternalLink className="w-4 h-4" />
                  Understanding API Keys
                </a>
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

export default SupabaseSetup;