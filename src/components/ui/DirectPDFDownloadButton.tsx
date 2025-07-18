import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { pdf } from '@react-pdf/renderer';
import { Archetype } from '../../types/quiz';
import EnhancedLoveBlueprint from '../pdf/EnhancedLoveBlueprint';
import Button from './Button';

interface DirectPDFDownloadButtonProps {
  archetype: Archetype;
  customerName?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'outline';
}

const DirectPDFDownloadButton: React.FC<DirectPDFDownloadButtonProps> = ({
  archetype,
  customerName,
  className = '',
  size = 'lg',
  variant = 'primary'
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [downloadComplete, setDownloadComplete] = useState(false);
  
  const filename = `${archetype.name.toLowerCase().replace(/\\s+/g, '-')}-love-blueprint-${Date.now()}.pdf`;

  const handleClick = async () => {
    setIsGenerating(true);
    setError(null);
    
    try {
      console.log('🔄 [DIRECT PDF] Starting direct PDF generation...');
      
      // Generate PDF directly without caching
      const doc = <EnhancedLoveBlueprint 
        archetype={archetype}
        customerName={customerName}
        isAIGenerated={true}
      />;
      
      const blob = await pdf(doc).toBlob();
      const url = URL.createObjectURL(blob);
      
      // Create download link and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up URL object
      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 1000);
      
      setDownloadComplete(true);
      console.log('✅ [DIRECT PDF] PDF generated and download triggered');
      
    } catch (err: any) {
      console.error('💥 [DIRECT PDF] Generation failed:', err);
      setError(err.message || 'Failed to generate PDF');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <Button
        disabled={isGenerating}
        size={size}
        variant={variant}
        onClick={handleClick}
        className="w-full text-lg py-4 transition-all duration-200 hover:scale-105"
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            <div className="flex flex-col items-start">
              <span>Generating Your Report...</span>
              <span className="text-xs opacity-75">Please wait...</span>
            </div>
          </>
        ) : error ? (
          <>
            <AlertCircle className="w-5 h-5 mr-2" />
            Try Download Again
          </>
        ) : downloadComplete ? (
          <>
            <CheckCircle2 className="w-5 h-5 mr-2" />
            Download Your Report Again
          </>
        ) : (
          <>
            <Download className="w-5 h-5 mr-2" />
            Download Your Love Blueprint (Direct)
          </>
        )}
      </Button>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 rounded-lg p-3"
        >
          <div className="flex items-center gap-2 text-red-700">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm font-medium">Error Generating PDF</span>
          </div>
          <p className="text-red-600 text-xs mt-1">
            {error}. Please try again or use a different browser.
          </p>
        </motion.div>
      )}
      
      {/* Success Message */}
      {downloadComplete && !error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 border border-green-200 rounded-lg p-3"
        >
          <div className="flex items-center gap-2 text-green-700">
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-sm font-medium">Report Generated Successfully!</span>
          </div>
          <p className="text-green-600 text-xs mt-1">
            Your personalized Love Blueprint has been downloaded to your device.
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default DirectPDFDownloadButton;

