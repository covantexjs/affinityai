import { Handler } from '@netlify/functions';

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

    // Return the HTML directly with PDF content type
    // This is a fallback approach that will allow the client to handle the PDF generation
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/html',
      },
      body: body.html,
    };
  } catch (error) {
    console.error('Error processing HTML:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to process HTML', details: error.message }),
    };
  }
};

export { handler };

