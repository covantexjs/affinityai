import { Handler } from '@netlify/functions';
import * as htmlPdf from 'html-pdf-node';

interface RequestBody {
  html: string;
  filename?: string;
}

const handler: Handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    // Parse the request body
    const body: RequestBody = JSON.parse(event.body || '{}');
    
    if (!body.html) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'HTML content is required' }),
      };
    }

    // Set options for PDF generation
    const options = { 
      format: 'A4',
      printBackground: true,
      margin: { top: '0mm', right: '0mm', bottom: '0mm', left: '0mm' },
      preferCSSPageSize: true
    };

    // Create a file object with the HTML content
    const file = { content: body.html };

    // Generate the PDF
    const pdfBuffer = await htmlPdf.generatePdf(file, options);

    // Set the filename
    const filename = body.filename || 'love-blueprint.pdf';

    // Return the PDF as a binary response
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
      body: pdfBuffer.toString('base64'),
      isBase64Encoded: true,
    };
  } catch (error) {
    console.error('Error generating PDF:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to generate PDF', details: error.message }),
    };
  }
};

export { handler };

