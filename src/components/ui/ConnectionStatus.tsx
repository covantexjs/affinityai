import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wifi, WifiOff, Database, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { testSupabaseConnection, isSupabaseReady } from '../../lib/supabase';

interface ConnectionStatusProps {
  className?: string;
  showDetails?: boolean;
}

const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ 
  className = '', 
  showDetails = false 
}) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [supabaseConnected, setSupabaseConnected] = useState<boolean | null>(null);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    const checkSupabase = async () => {
      if (!isOnline || !isSupabaseReady()) {
        setSupabaseConnected(false);
        return;
      }

      try {
        const connected = await testSupabaseConnection();
        setSupabaseConnected(connected);
        setLastChecked(new Date());
      } catch (error) {
        console.error('Supabase connection check failed:', error);
        setSupabaseConnected(false);
        setLastChecked(new Date());
      }
    };

    checkSupabase();

    // Check every 30 seconds if online
    const interval = setInterval(() => {
      if (isOnline) {
        checkSupabase();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [isOnline]);

  const getStatusColor = () => {
    if (!isOnline) return 'text-red-500';
    if (supabaseConnected === null) return 'text-yellow-500';
    if (supabaseConnected) return 'text-green-500';
    return 'text-orange-500';
  };

  const getStatusIcon = () => {
    if (!isOnline) return <WifiOff className="w-4 h-4" />;
    if (supabaseConnected === null) return <AlertTriangle className="w-4 h-4" />;
    if (supabaseConnected) return <CheckCircle2 className="w-4 h-4" />;
    return <Database className="w-4 h-4" />;
  };

  const getStatusText = () => {
    if (!isOnline) return 'Offline';
    if (supabaseConnected === null) return 'Checking...';
    if (supabaseConnected) return 'Connected';
    return 'Database Issue';
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`flex items-center gap-2 ${className}`}
    >
      <div className={`${getStatusColor()}`}>
        {getStatusIcon()}
      </div>
      
      <span className={`text-sm font-medium ${getStatusColor()}`}>
        {getStatusText()}
      </span>

      {showDetails && lastChecked && (
        <span className="text-xs text-gray-500">
          {lastChecked.toLocaleTimeString()}
        </span>
      )}
    </motion.div>
  );
};

export default ConnectionStatus;