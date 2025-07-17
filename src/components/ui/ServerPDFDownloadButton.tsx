import React, { useState } from 'react';
import { Download, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { generateAndDownloadPDF } from '../../lib/pdf-generation';
import Button from './Button';

interface ServerPDFDownloadButtonProps {
  archetype: any;
  customerName?: string;
  sessionId?: string;
  filename?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'outline';
  children?: React.ReactNode;
}

const ServerPDFDownloadButton: React.FC<ServerPDFDownloadButtonProps> = ({
  archetype,
  customerName,
  sessionId,
  filename,
  className = '',
  size = 'lg',
  variant = 'primary',
  children
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const defaultFilename = filename || `${archetype.name.toLowerCase().replace(/\s+/g, '-')}-love-blueprint.pdf`;

  const handleDownload = async () => {
    setIsGenerating(true);
    setStatus('idle');
    setError(null);
    setProgress(0);

    console.log('📥 [BEAUTIFUL PDF] Starting download for:', archetype.name);

    // Simulate progress updates
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + 10;
      });
    }, 500);

    try {
      const success = await generateAndDownloadPDF(
        {
          archetype,
          customerName,
          sessionId
        },
        defaultFilename
      );

      clearInterval(progressInterval);
      setProgress(100);

      if (success) {
        setStatus('success');
        console.log('✅ [BEAUTIFUL PDF] Download completed successfully');
        
        // Reset status after 3 seconds
        setTimeout(() => {
          setStatus('idle');
        }, 3000);
      } else {
        throw new Error('PDF generation failed');
      }
    } catch (err: any) {
      clearInterval(progressInterval);
      console.error('💥 [BEAUTIFUL PDF] Download failed:', err);
      setStatus('error');
      setError(err.message || 'Download failed');
      
      // Reset status after 5 seconds
      setTimeout(() => {
        setStatus('idle');
        setError(null);
      }, 5000);
    } finally {
      setIsGenerating(false);
    }
  };

  const getButtonContent = () => {
    if (isGenerating) {
      return (
        <>
          <Loader2 className="w-5 h-5 animate-spin mr-2" />
          <div className="flex flex-col items-start">
            <span>Creating Your Beautiful Report...</span>
            <span className="text-xs opacity-75">{progress}% complete</span>
          </div>
        </>
      );
    }

    if (status === 'success') {
      return (
        <>
          <CheckCircle2 className="w-5 h-5 mr-2" />
          Download Complete!
        </>
      );
    }

    if (status === 'error') {
      return (
        <>
          <AlertCircle className="w-5 h-5 mr-2" />
          Try Again
        </>
      );
    }

    if (children) {
      return children;
    }

    return (
      <>
        <Download className="w-5 h-5 mr-2" />
        Download Your Premium Love Blueprint
      </>
    );
  };

  return (
    <div className={className}>
      <Button
        onClick={handleDownload}
        disabled={isGenerating}
        size="lg"
        className="w-full text-lg py-4 transition-all duration-200 hover:scale-105 bg-gradient-primary text-white"
      >
        {getButtonContent()}
      </Button>
      
      {/* Progress Bar */}
      {isGenerating && (
        <div className="w-full mt-4">
          <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-primary-500 to-secondary-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-gray-600 mt-1 text-center">
            Creating your beautiful, detailed report... This may take a moment.
          </p>
        </div>
      )}
      
      {error && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500" />
            <span className="text-sm font-medium text-red-700">Generation Failed</span>
          </div>
          <p className="text-xs text-red-600 mt-1">{error}</p>
        </div>
      )}
      
      {status === 'success' && (
        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-500" />
            <span className="text-sm font-medium text-green-700">Download Complete!</span>
          </div>
          <p className="text-xs text-green-600 mt-1">
            Your comprehensive Love Blueprint has been downloaded to your device.
          </p>
        </div>
      )}
    </div>
  );
};

export default ServerPDFDownloadButton;