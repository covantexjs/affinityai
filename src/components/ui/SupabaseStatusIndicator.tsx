import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Database, Loader2, CheckCircle2, AlertCircle, Wifi, WifiOff, Settings, ExternalLink } from 'lucide-react';
import { getSupabaseStatus, isSupabaseReady } from '../../lib/supabase';

interface SupabaseStatusIndicatorProps {
  className?: string;
  showDetails?: boolean;
  compact?: boolean;
  showSetupButton?: boolean;
  onSetupClick?: () => void;
}

interface StatusData {
  connected: boolean;
  responseTime?: number | null;
  recordCount?: number;
  error?: string;
  needsSetup?: boolean;
}

const SupabaseStatusIndicator: React.FC<SupabaseStatusIndicatorProps> = ({ 
  className = '', 
  showDetails = false,
  compact = false,
  showSetupButton = false,
  onSetupClick
}) => {
  const [status, setStatus] = useState<StatusData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkStatus = async () => {
      setIsLoading(true);
      try {
        if (!isSupabaseReady()) {
          setStatus({
            connected: false,
            needsSetup: true,
            error: 'Not configured'
          });
        } else {
          try {
            const statusData = await getSupabaseStatus();
            setStatus(statusData);
          } catch (networkError: any) {
            console.error('Network error checking Supabase status:', networkError);
            setStatus({
              connected: false,
              error: 'Network error - check your internet connection',
              needsSetup: false
            });
          }
        }
      } catch (error: any) {
        console.error('Status check failed:', error);
        setStatus({
          connected: false,
          error: error.message?.includes('Failed to fetch') 
            ? 'Network error - check your internet connection'
            : error.message || 'Failed to check connection',
          needsSetup: false
        });
      } finally {
        setIsLoading(false);
      }
    };

    checkStatus();
    
    // Recheck status every 60 seconds if connected (reduced frequency to avoid network spam)
    const interval = setInterval(() => {
      if (isSupabaseReady()) {
        checkStatus();
      }
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);

  const handleSetupClick = () => {
    if (onSetupClick) {
      onSetupClick();
    } else {
      // Open setup instructions in a new tab
      window.open('https://supabase.com/dashboard', '_blank');
    }
  };

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`flex items-center gap-2 ${className}`}
      >
        <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
        {!compact && (
          <span className="text-sm text-gray-600">Checking database...</span>
        )}
      </motion.div>
    );
  }

  if (!status) {
    return null;
  }

  const { connected, responseTime, error, needsSetup } = status;

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`flex items-center gap-1 ${className}`}
      >
        {needsSetup ? (
          <Settings className="w-4 h-4 text-orange-500" />
        ) : connected ? (
          <Wifi className="w-4 h-4 text-green-500" />
        ) : (
          <WifiOff className="w-4 h-4 text-red-500" />
        )}
        {showDetails && responseTime && (
          <span className="text-xs text-gray-500">
            {responseTime}ms
          </span>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-center gap-2 ${className}`}
    >
      {needsSetup ? (
        <>
          <Settings className="w-4 h-4 text-orange-500" />
          <span className="text-sm text-orange-700 font-medium">
            Database setup required
          </span>
          {showSetupButton && (
            <button
              onClick={handleSetupClick}
              className="flex items-center gap-1 text-xs text-orange-600 bg-orange-100 px-3 py-1 rounded-full hover:bg-orange-200 transition-colors"
            >
              Setup Now
              <ExternalLink className="w-3 h-3" />
            </button>
          )}
        </>
      ) : connected ? (
        <>
          <CheckCircle2 className="w-4 h-4 text-green-500" />
          <span className="text-sm text-green-700 font-medium">
            Database connected
          </span>
          {showDetails && responseTime && (
            <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
              {responseTime}ms response
            </span>
          )}
        </>
      ) : (
        <>
          <AlertCircle className="w-4 h-4 text-red-500" />
          <span className="text-sm text-red-700 font-medium">
            {error?.includes('setup required') || error?.includes('does not exist') ? 'Setup required' : 'Connection failed'}
          </span>
          {showDetails && error && (
            <span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded-full max-w-xs truncate">
              {error?.includes('does not exist') ? 'Database table missing' : error}
            </span>
          )}
          {showSetupButton && (error?.includes('setup required') || error?.includes('does not exist')) && (
            <button
              onClick={handleSetupClick}
              className="flex items-center gap-1 text-xs text-red-600 bg-red-100 px-3 py-1 rounded-full hover:bg-red-200 transition-colors"
            >
              Setup Now
              <ExternalLink className="w-3 h-3" />
            </button>
          )}
        </>
      )}
    </motion.div>
  );
};

export default SupabaseStatusIndicator;