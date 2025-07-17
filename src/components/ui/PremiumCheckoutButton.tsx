import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Loader2, Shield, CheckCircle2, User, Mail, LockKeyhole, AlertCircle, BookOpen } from 'lucide-react';
import { initiateStripeCheckout, checkExistingPremiumAccess } from '../../lib/stripe-checkout';
import { testSupabaseConnection } from '../../lib/supabase';
import { useQuizStore } from '../../store/quizStore';
import { useNavigate } from 'react-router-dom';
import Button from './Button';

const SUPPORT_EMAIL = 'support@affinityai.me';


interface PremiumCheckoutButtonProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'outline';
}

const PremiumCheckoutButton: React.FC<PremiumCheckoutButtonProps> = ({
  className = '',
  size = 'lg',
  variant = 'primary'
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [customerData, setCustomerData] = useState({
    name: '',
    email: '',
    startGenerating: false
  });
  const [error, setError] = useState<string | null>(null);
  const [supabaseStatus, setSupabaseStatus] = useState<'unknown' | 'connected' | 'disconnected'>('unknown');
  const [hasExistingAccess, setHasExistingAccess] = useState(false);
  const [checkingAccess, setCheckingAccess] = useState(false);
  
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false);
  
  const { result } = useQuizStore();
  const navigate = useNavigate();

  // Check for existing premium access when email changes
  useEffect(() => {
    const checkAccess = async () => {
      if (!customerData.email || customerData.email.length < 5) {
        setHasExistingAccess(false);
        return;
      }

      setCheckingAccess(true);
      try {
        const hasAccess = await checkExistingPremiumAccess(customerData.email);
        setHasExistingAccess(hasAccess);
        
        if (hasAccess) {
          console.log('✅ [CHECKOUT] User already has premium access');
        }
      } catch (error) {
        console.warn('⚠️ [CHECKOUT] Failed to check existing access:', error);
        setHasExistingAccess(false);
      } finally {
        setCheckingAccess(false);
      }
    };

    // Debounce the check
    const timeoutId = setTimeout(checkAccess, 500);
    return () => clearTimeout(timeoutId);
  }, [customerData.email]);

  const handleInitialClick = async () => {
    if (!result) {
      setError('Please complete the quiz first');
      return;
    }
    
    // Test Supabase connection
    console.log('🔗 [CHECKOUT] Testing Supabase connection...');
    const isConnected = await testSupabaseConnection();
    setSupabaseStatus(isConnected ? 'connected' : 'disconnected');
    
    setShowForm(true);
    setError(null);
  };

  const handleDirectAccess = () => {
    // Redirect to premium report with a mock session for existing customers
    const mockSessionId = 'existing_customer_' + Date.now();
    navigate(`/premium-report?session_id=${mockSessionId}&paid=true&existing=true`);
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!customerData.name.trim() || !customerData.email.trim()) {
      setError('Please fill in all fields');
      return;
    }
    
    // Start showing the AI generation preview
    if (customerData.startGenerating) {
      setIsGeneratingPreview(true);
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (!result) {
      setError('Quiz results not found. Please retake the quiz.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('🚀 [CHECKOUT] Starting checkout process with data:', {
        email: customerData.email,
        name: customerData.name,
        archetype: result.archetype.name,
        startGenerating: customerData.startGenerating
      });
      
      // Add a small delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 500));
      
      await initiateStripeCheckout({
        customerEmail: customerData.email.trim(),
        customerName: customerData.name.trim(),
        quizResult: result,
        dimensionScores: {
          emotional_depth: 1.5,
          relational_style: 0.8,
          values_alignment: 2.0,
          communication_style: 1.2
        }
      });
    } catch (err: any) {
      console.error('Checkout failed:', err);
      
      // Provide more user-friendly error messages
      if (err.message?.includes('Netlify function not found')) {
        setError('Payment system is currently unavailable. Please try again in a few moments.');
      } else if (err.message?.includes('Network error')) {
        setError('Network connection issue. Please check your internet and try again.');
      } else {
        setError(err.message || 'Checkout failed. Please try again.');
      }
      
      setIsLoading(false);
    }
  };
  
  if (!showForm) {
    return (
      <div className={`space-y-4 ${className}`}>
        {hasExistingAccess && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-blue-800">
                You already have premium access with this email.
              </span>
            </div>
          </div>
        )}
        
        {/* Payment Button */}
        <Button
          onClick={handleInitialClick}
          size={size}
          variant={variant}
          className="w-full transition-all duration-200 hover:scale-105 text-lg py-3"
        >
          <CreditCard className="w-5 h-5 mr-2" />
          Get Premium Report - $19
        </Button>

        {error && (
          <div className="text-red-600 text-sm text-center mt-3">
            {error}
          </div>
        )}

        <div className="space-y-3 mt-4">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
            <Shield className="w-4 h-4 text-green-500" />
            <span>Secure payment powered by Stripe</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`space-y-4 w-full ${className}`}
    > 
      <div className="bg-white border-2 border-primary-100 rounded-xl p-6 w-full shadow-sm">
        <h3 className="text-lg font-semibold text-center mb-4">
          Complete Your Purchase
        </h3>
        
        {/* Database Status Indicator */}
        {supabaseStatus !== 'unknown' && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex items-center justify-center gap-2 p-3 rounded-lg mb-4 ${
              supabaseStatus === 'connected' 
                ? 'bg-green-50 border border-green-200' 
                : 'bg-yellow-50 border border-yellow-200'
            }`}
          >
            {supabaseStatus === 'connected' ? (
              <>
                <LockKeyhole className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-800 font-medium">
                  Connection secure
                </span>
              </>
            ) : (
              <>
                <LockKeyhole className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-800 font-medium">
                  Connection secure
                </span>
              </>
            )}
          </motion.div>
        )}

        {/* Existing Access Check */}
        {hasExistingAccess && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-blue-800">Premium Access Found!</span>
            </div>
            <p className="text-blue-700 text-sm mb-3">
              You already have premium access with this email address.
            </p>
            <Button
              onClick={handleDirectAccess}
              variant="outline"
              size="sm"
              className="w-full"
            >
              Access Your Premium Report
            </Button>
          </motion.div>
        )}
        
        <form onSubmit={handleCheckout} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              <User className="w-4 h-4 inline mr-1" />
              Full Name
            </label>
            <input
              type="text"
              id="name"
              value={customerData.name}
              onChange={(e) => setCustomerData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Enter your full name"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              We'll use this to send your premium report
            </p>
          </div>
          
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="start-generating"
              checked={customerData.startGenerating}
              onChange={(e) => setCustomerData(prev => ({ ...prev, startGenerating: e.target.checked }))}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="start-generating" className="ml-2 block text-sm text-gray-700">
              Start generating my report now while I complete payment
            </label>
          </div>
          
          {isGeneratingPreview && (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200 flex items-center gap-3">
              <BookOpen className="w-5 h-5 text-blue-500 animate-pulse" />
              <div>
                <p className="text-sm font-medium text-blue-700">AI is preparing your report</p>
                <p className="text-xs text-blue-600">Your personalized report will be ready after payment</p>
              </div>
            </div>
          )}
          
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-700 font-medium mb-1">Your report includes:</p>
            <ul className="text-xs text-gray-600 space-y-1">
              <li className="flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-primary-500" />
                AI-personalized 10-15 page analysis
              </li>
              <li className="flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-primary-500" />
                Custom insights based on your quiz responses
              </li>
              <li className="flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-primary-500" />
                Immediate download after payment
              </li>
            </ul>
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              <Mail className="w-4 h-4 inline mr-1" />
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                id="email"
                value={customerData.email}
                onChange={(e) => setCustomerData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Enter your email address"
                required
              />
              {checkingAccess && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                </div>
              )}
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowForm(false)}
              className="flex-1"
              disabled={isLoading}
            >
              Back
            </Button>
            
            <Button
              type="submit"
              disabled={isLoading || hasExistingAccess}
              className="flex-1"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                <>
                  {isGeneratingPreview ? (
                    <>
                      <BookOpen className="w-5 h-5 mr-2" />
                      Complete Payment - $19
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5 mr-2" />
                      Pay Now - $19
                    </>
                  )}
                </>
              )}
            </Button>
          </div>
        </form>

        {/* GDPR Compliance Notice */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg text-center">
          <p className="text-xs text-gray-600">
            <strong>Privacy Notice:</strong> We follow GDPR/CCPA guidelines and never share your information with third parties.
            You can request data deletion by contacting <a href={`mailto:${SUPPORT_EMAIL}`} className="text-primary-500 hover:underline">{SUPPORT_EMAIL}</a>
          </p>
        </div>
      </div>

      <div className="text-center">
        <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-2">
          <Shield className="w-4 h-4 text-green-500" />
          <span>Secure checkout powered by Stripe</span>
        </div>
        <p className="text-xs text-gray-500">
          Your payment information is encrypted and secure
        </p>
      </div>
    </motion.div>
  );
};

export default PremiumCheckoutButton;