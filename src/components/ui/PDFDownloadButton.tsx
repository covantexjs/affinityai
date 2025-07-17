import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Loader2, CheckCircle2, AlertCircle, FileText } from 'lucide-react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { Archetype } from '../../types/quiz';
import EnhancedLoveBlueprint from '../pdf/EnhancedLoveBlueprint';
import Button from './Button';

interface PDFDownloadButtonProps {
  archetype: Archetype;
  customerName?: string;
  purchaseData?: any;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'outline';
}

const PDFDownloadButton: React.FC<PDFDownloadButtonProps> = ({
  archetype,
  customerName,
  purchaseData,
  className = '',
  size = 'lg',
  variant = 'primary'
}) => {
  const [downloadStarted, setDownloadStarted] = useState(false);
  const [downloadComplete, setDownloadComplete] = useState(false);
  
  const filename = `${archetype.name.toLowerCase().replace(/\s+/g, '-')}-love-blueprint.pdf`;

  const handleDownloadStart = () => {
    console.log('🔄 [PDF] Download started');
    setDownloadStarted(true);
    
    // Reset download complete status after 5 seconds
    setTimeout(() => {
      setDownloadComplete(true);
    }, 3000);
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <PDFDownloadLink
        document={<EnhancedLoveBlueprint archetype={archetype} customerName={customerName} />}
        fileName={filename}
        onClick={handleDownloadStart}
      >
        {({ loading, error }) => (
          <Button
            size={size}
            variant={variant}
            disabled={loading}
            className="w-full text-lg py-4 transition-all duration-200 hover:scale-105"
          >
            {loading ? (
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
                Download Again
              </>
            ) : (
              <>
                <Download className="w-5 h-5 mr-2" />
                Download Your Premium Love Blueprint
              </>
            )}
          </Button>
        )}
      </PDFDownloadLink>

      {/* Processing Info */}
      {downloadStarted && !downloadComplete && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-50 border border-blue-200 rounded-lg p-3"
        >
          <div className="flex items-center gap-2 text-blue-700">
            <FileText className="w-4 h-4" />
            <span className="text-sm font-medium">Preparing Your Download</span>
          </div>
          <p className="text-blue-600 text-xs mt-1">
            Your report is being generated. The download should start automatically in a moment.
          </p>
        </motion.div>
      )}

      {/* Success Message */}
      {downloadComplete && (
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

export default PDFDownloadButton;