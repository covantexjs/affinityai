import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Archetype } from '../../types/quiz';
import Button from './Button';

interface ServerPDFDownloadButtonProps {
  archetype: Archetype;
  customerName?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'outline';
}

const ServerPDFDownloadButton: React.FC<ServerPDFDownloadButtonProps> = ({
  archetype,
  customerName,
  className = '',
  size = 'lg',
  variant = 'primary'
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [downloadComplete, setDownloadComplete] = useState(false);
  
  const handleClick = async () => {
    setIsGenerating(true);
    setError(null);
    
    try {
      console.log('🔄 [SERVER PDF] Starting server-side PDF generation...');
      
      // Call the Netlify function to generate the PDF
      const response = await fetch('/.netlify/functions/generate-pdf-server', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          archetype,
          customerName,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate PDF');
      }
      
      // Get the PDF blob from the response
      const pdfBlob = await response.blob();
      
      // Create a URL for the blob
      const url = URL.createObjectURL(pdfBlob);
      
      // Create a link element and trigger the download
      const link = document.createElement('a');
      link.href = url;
      link.download = `${archetype.name.toLowerCase().replace(/\\s+/g, '-')}-love-blueprint-server.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the URL object
      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 1000);
      
      setDownloadComplete(true);
      console.log('✅ [SERVER PDF] PDF generated and download triggered');
      
    } catch (err: any) {
      console.error('💥 [SERVER PDF] Generation failed:', err);
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
            Try Server-side Download Again
          </>
        ) : downloadComplete ? (
          <>
            <CheckCircle2 className="w-5 h-5 mr-2" />
            Download Server-side Report Again
          </>
        ) : (
          <>
            <Download className="w-5 h-5 mr-2" />
            Download Server-generated PDF
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
            {error}. Please try again or contact support.
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

export default ServerPDFDownloadButton;

