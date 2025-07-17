/**
 * Client-side PDF generation utilities
 */
import { pdf } from '@react-pdf/renderer';
import EnhancedLoveBlueprint from '../components/pdf/EnhancedLoveBlueprint';
import { Archetype } from '../types/quiz';

interface PDFGenerationOptions {
  archetype: Archetype;
  customerName?: string;
  purchaseData?: any;
}

/**
 * Generate and download PDF in one step
 */
export const generateAndDownloadPDF = async (
  options: PDFGenerationOptions,
  filename: string
): Promise<boolean> => {
  try {
    console.log('🔄 [PDF] Starting PDF generation for:', options.archetype.name);
    
    // Create the PDF document
    const document = <EnhancedLoveBlueprint 
      archetype={options.archetype}
      customerName={options.customerName}
    />;
    
    // Generate PDF blob
    const blob = await pdf(document).toBlob();
    
    // Create download URL
    const url = URL.createObjectURL(blob);
    
    // Create download link
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    
    // Trigger download
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    
    console.log('✅ [PDF] PDF generated and download initiated');
    return true;
  } catch (error) {
    console.error('💥 [PDF] Generation failed:', error);
    return false;
  }
};

/**
 * Generate PDF and return blob URL
 */
export const generatePDFUrl = async (options: PDFGenerationOptions): Promise<string | null> => {
  try {
    console.log('🔄 [PDF] Generating PDF URL for:', options.archetype.name);
    
    // Create the PDF document
    const document = <EnhancedLoveBlueprint 
      archetype={options.archetype}
      customerName={options.customerName}
    />;
    
    // Generate PDF blob
    const blob = await pdf(document).toBlob();
    
    // Create download URL
    const url = URL.createObjectURL(blob);
    
    console.log('✅ [PDF] PDF URL generated successfully');
    return url;
  } catch (error) {
    console.error('💥 [PDF] URL generation failed:', error);
    return null;
  }
};