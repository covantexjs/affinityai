import React from 'react';

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
}

const GradientText: React.FC<GradientTextProps> = ({ children, className = '' }) => {
  return (
    <span
      className={`bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-secondary-500 ${className}`}
    >
      {children}
    </span>
  );
};

export default GradientText;