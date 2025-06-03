import { Handler } from '@netlify/functions';
import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY is not configured');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const headers = {
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

const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers,
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { freeTextResponses, userVector } = JSON.parse(event.body || '{}');

    if (!Array.isArray(freeTextResponses) || !userVector) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid request body' })
      };
    }

    const enhancedVector = { ...userVector };
    const insights = [];

    for (const response of freeTextResponses) {
      const prompt = generatePrompt(response.question, response.response, userVector);

      const completion = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 500
      });

      const analysis = completion.choices[0]?.message?.content;
      if (!analysis) continue;

      try {
        const parsedAnalysis = JSON.parse(analysis);
        applyAdjustments(enhancedVector, parsedAnalysis);
        insights.push({
          question: response.question,
          response: response.response,
          analysis: parsedAnalysis
        });
      } catch (error) {
        console.error('Error parsing GPT response:', error);
      }
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        enhancedVector,
        insights
      })
    };
  } catch (error: any) {
    console.error('Error processing LLM response:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: error.message || 'Error processing LLM response'
      })
    };
  }
};

function generatePrompt(question: string, response: string, userVector: UserVector): string {
  return `Analyze this response to a romantic archetype quiz question:

Question: "${question}"
Response: "${response}"

Current dimension scores:
- Emotional Depth: ${userVector.emotional_depth}
- Relational Style: ${userVector.relational_style}
- Values Alignment: ${userVector.values_alignment}
- Communication Style: ${userVector.communication_style}

Analyze the response and provide adjustments to these dimensions based on the content.
Return your analysis in JSON format with the following structure:

{
  "emotional_depth": {
    "analysis": "Brief explanation of emotional depth indicators",
    "adjustment": [-2 to 2],
    "confidence": "low|medium|high"
  },
  "relational_style": {
    "analysis": "Brief explanation of relational style indicators",
    "adjustment": [-2 to 2],
    "confidence": "low|medium|high"
  },
  "values_alignment": {
    "analysis": "Brief explanation of values alignment indicators",
    "adjustment": [-2 to 2],
    "confidence": "low|medium|high"
  },
  "communication_style": {
    "analysis": "Brief explanation of communication style indicators",
    "adjustment": [-2 to 2],
    "confidence": "low|medium|high"
  }
}`;
}

function applyAdjustments(vector: UserVector, analysis: any) {
  const confidenceWeights = {
    low: 0.3,
    medium: 0.6,
    high: 1.0
  };

  for (const [dimension, data] of Object.entries(analysis)) {
    if (dimension in vector) {
      const weight = confidenceWeights[data.confidence as keyof typeof confidenceWeights] || 0.5;
      vector[dimension as keyof UserVector] += data.adjustment * weight;
    }
  }
}

export default handler;