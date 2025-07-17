import { Handler } from '@netlify/functions';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json'
};

interface FreeTextResponse {
  question: string;
  response: string;
}

interface UserVector {
  emotional_depth: number;
  relational_style: number;
  values_alignment: number;
  communication_style: number;
}

const handler: Handler = async (req) => {
  if (req.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: corsHeaders,
      body: ''
    };
  }

  if (req.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { freeTextResponses, userVector } = JSON.parse(req.body || '{}');

    if (!Array.isArray(freeTextResponses) || !userVector) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Invalid request body' })
      };
    }

    // Return mock data for testing
    const mockResponse = {
      enhancedVector: {
        emotional_depth: userVector.emotional_depth + 0.5,
        relational_style: userVector.relational_style + 0.3,
        values_alignment: userVector.values_alignment + 0.2,
        communication_style: userVector.communication_style + 0.4
      },
      insights: freeTextResponses.map(response => ({
        question: response.question,
        response: response.response,
        analysis: {
          emotional_depth: {
            analysis: "Shows moderate emotional awareness",
            adjustment: 0.5,
            confidence: "medium"
          },
          relational_style: {
            analysis: "Balanced approach to relationships",
            adjustment: 0.3,
            confidence: "medium"
          },
          values_alignment: {
            analysis: "Clear personal values expressed",
            adjustment: 0.2,
            confidence: "medium"
          },
          communication_style: {
            analysis: "Direct and thoughtful communication",
            adjustment: 0.4,
            confidence: "medium"
          }
        }
      }))
    };

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify(mockResponse)
    };

  } catch (error: any) {
    console.error('Error processing LLM response:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        error: error.message || 'Error processing LLM response'
      })
    };
  }
};

export default handler;