import React from 'react';
import { motion } from 'framer-motion';

interface StripeBuyButtonProps {
  className?: string;
  buyButtonId?: string;
  publishableKey?: string;
}

// Declare the custom element type for TypeScript
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'stripe-buy-button': {
        'buy-button-id': string;
        'publishable-key': string;
        children?: React.ReactNode;
      };
    }
  }
}

const StripeBuyButton: React.FC<StripeBuyButtonProps> = ({ 
  className = '',
  buyButtonId = 'buy_btn_1RXdpU2KAIDrdKmPqmTUjEoO',
  publishableKey = 'pk_test_51RWxUF2KAIDrdKmPjc2M8o6Cye57TcNo6PLw4UkRxIzHqZGGioDqwVGIledzAhAgw8X7G7P0FPCUyGJQ64bGlxQm008ubcR7Tm'
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`w-full ${className}`}
    >
      <stripe-buy-button
        buy-button-id={buyButtonId}
        publishable-key={publishableKey}
      />
    </motion.div>
  );
};

export default StripeBuyButton;