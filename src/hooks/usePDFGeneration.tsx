import { useState, useCallback } from 'react';
import { pdf } from '@react-pdf/renderer';
import { Archetype } from '../types/quiz';
import EnhancedLoveBlueprint from '../components/pdf/EnhancedLoveBlueprint';

interface PDFGenerationOptions {
  archetype: Archetype;
  customerName?: string;
  purchaseData?: any;
}

export const usePDFGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const generatePDF = useCallback(async (options: PDFGenerationOptions) => {
    setIsGenerating(true);
    setError(null);
    setProgress(0);
    let progressInterval: NodeJS.Timeout;

    try {
      progressInterval = setInterval(() => {
        setProgress(prev => (prev >= 90 ? prev : prev + 10));
      }, 300);

      const doc = <EnhancedLoveBlueprint {...options} />;
      const blob = await pdf(doc).toBlob();
      const url = URL.createObjectURL(blob);

      setDownloadUrl(prev => {
        if (prev) URL.revokeObjectURL(prev);
        return url;
      });

      setProgress(100);
      return url;
    } catch (error: any) {
      console.error('PDF generation failed:', error);
      setError(error.message || 'Failed to generate PDF');
      setProgress(0);
      return null;
    } finally {
      clearInterval(progressInterval);
      setIsGenerating(false);
    }
  }, []);

  const downloadPDF = useCallback((url: string | null, filename: string): void => {
    if (!url) {
      setError('No PDF URL available');
      return;
    }

    try {
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error: any) {
      console.error('Download failed:', error);
      setError(error.message || 'Failed to download PDF');
    }
  }, []);

  return {
    isGenerating,
    error,
    downloadUrl,
    progress,
    generatePDF,
    downloadPDF
  };
};