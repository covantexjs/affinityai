import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Loader2, Shield, CheckCircle2 } from 'lucide-react';
import { initiateCheckout } from '../../lib/stripe';
import { products } from '../../stripe-config';
import Button from './Button';

interface StripePaymentButtonProps {
  customerEmail?: string;
  customerName?: string;
  testMode?: boolean;
  onSuccess?: () => void;
  onError?: (error: string) => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'outline';
}

const StripePaymentButton: React.FC<StripePaymentButtonProps> = ({
  customerEmail,
  customerName,
  testMode = true,
  onSuccess,
  onError,
  className = '',
  size = 'lg',
  variant = 'primary'
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  
  const product = products[0]; // Get the premium product

  const handlePayment = async () => {
    console.log('💳 [STRIPE BUTTON] Payment initiated with checkout session');
    
    try {
      setIsLoading(true);
      setLoadingMessage('Creating checkout session...');
      
      // Brief delay for better UX
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setLoadingMessage('Redirecting to secure payment...');
      
      await initiateCheckout({
        customerEmail,
        customerName,
        testMode
      });
      
      // If we reach here, something went wrong (should have redirected)
      setLoadingMessage('Opening payment form...');
      
      if (onSuccess) {
        onSuccess();
      }
      
    } catch (error: any) {
      console.error('💥 [STRIPE BUTTON] Payment failed:', error);
      const errorMessage = error.message || 'Payment failed. Please try again.';
      
      if (onError) {
        onError(errorMessage);
      }
      
      setIsLoading(false);
      setLoadingMessage('');
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Main Payment Button */}
      <Button
        onClick={handlePayment}
        disabled={isLoading}
        size={size}
        variant={variant}
        className={`w-full transition-all duration-200 hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed ${
          isLoading ? 'opacity-80' : ''
        }`}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            {loadingMessage || 'Processing...'}
          </>
        ) : (
          <>
            <CreditCard className="w-5 h-5 mr-2" />
            Buy Premium Report - ${product.price}
          </>
        )}
      </Button>

      {/* Security & Features Info */}
      <div className="space-y-3">
        <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
          <Shield className="w-4 h-4 text-green-500" />
          <span>Secure payment powered by Stripe</span>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-gray-500">
          <div className="flex items-center justify-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-green-500" />
            <span>One-time payment</span>
          </div>
          <div className="flex items-center justify-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-green-500" />
            <span>Instant delivery</span>
          </div>
          <div className="flex items-center justify-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-green-500" />
            <span>30-day guarantee</span>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-50 border border-blue-200 rounded-lg p-3"
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-blue-800">Secure Stripe Checkout</span>
          </div>
          <p className="text-xs text-blue-700 text-center">
            Secure payment processing with test card: 4242424242424242
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default StripePaymentButton;