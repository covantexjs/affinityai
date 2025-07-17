import { Handler } from '@netlify/functions';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json'
};

interface GenerateContentRequest {
  archetype: {
    id: string;
    name: string;
    tagline: string;
    description: string;
    keywords: Array<{ text: string; emoji: string }>;
    compatibleWith: string[];
  };
  quizAnswers?: Record<string, any>;
  customerName?: string;
}

export const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: corsHeaders,
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    console.log('🤖 [AI CONTENT] Starting AI content generation...');
    
    const { archetype, quizAnswers, customerName }: GenerateContentRequest = JSON.parse(event.body || '{}');

    if (!archetype) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Missing archetype data' }),
      };
    }

    // Create a comprehensive prompt for personalized content generation
    const prompt = `You are an expert relationship psychologist creating a personalized love blueprint report for someone with the "${archetype.name}" romantic archetype.

ARCHETYPE DETAILS:
- Name: ${archetype.name}
- Tagline: "${archetype.tagline}"
- Description: ${archetype.description}
- Key traits: ${archetype.keywords.map(k => k.text).join(', ')}
- Compatible with: ${archetype.compatibleWith.join(', ')}

${quizAnswers ? `QUIZ RESPONSES: ${JSON.stringify(quizAnswers, null, 2)}` : ''}

Generate a comprehensive, personalized relationship report with the following sections. Make it deeply insightful, actionable, and specific to this archetype. Write in a warm, professional tone that feels personal and encouraging.

Please provide a JSON response with the following structure:

{
  "personalizedOverview": "A 2-3 paragraph personalized overview of their romantic nature based on their archetype and any quiz responses",
  "coreStrengths": [
    "List of 5-6 specific relationship strengths for this archetype"
  ],
  "growthAreas": [
    "List of 4-5 specific areas for relationship growth and development"
  ],
  "communicationStyle": {
    "strengths": [
      "List of 4-5 communication strengths specific to this archetype"
    ],
    "challenges": [
      "List of 3-4 communication challenges to be aware of"
    ],
    "tips": [
      "List of 4-5 practical communication tips"
    ]
  },
  "relationshipDynamics": {
    "idealPartnerQualities": [
      "List of 5-6 qualities that would complement this archetype"
    ],
    "conflictResolution": "A paragraph about how this archetype handles conflict and suggestions for improvement",
    "intimacyStyle": "A paragraph about how this archetype approaches emotional and physical intimacy"
  },
  "conversationStarters": [
    "List of 8-10 deep, meaningful conversation starters tailored to this archetype's communication style"
  ],
  "actionSteps": {
    "thisWeek": [
      "List of 4-5 specific actions they can take this week"
    ],
    "thisMonth": [
      "List of 4-5 goals for this month"
    ],
    "longTerm": [
      "List of 4-5 long-term relationship development goals"
    ]
  },
  "personalizedInsights": [
    "List of 3-4 unique insights that go beyond generic advice, specific to their archetype and responses"
  ]
}

Make sure all content is:
- Specific to the ${archetype.name} archetype
- Actionable and practical
- Encouraging and positive
- Professional yet warm in tone
- Avoiding generic relationship advice
- Focused on their unique strengths and growth opportunities`;

    console.log('🤖 [AI CONTENT] Sending request to OpenAI...');

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert relationship psychologist and dating coach. Generate personalized, insightful relationship advice based on romantic archetypes. Always respond with valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 3000,
    });

    const aiResponse = completion.choices[0]?.message?.content;
    
    if (!aiResponse) {
      throw new Error('No response from OpenAI');
    }

    console.log('✅ [AI CONTENT] Received response from OpenAI');

    // Parse the JSON response
    let generatedContent;
    try {
      generatedContent = JSON.parse(aiResponse);
    } catch (parseError) {
      console.error('❌ [AI CONTENT] Failed to parse AI response as JSON:', parseError);
      throw new Error('Invalid JSON response from AI');
    }

    // Validate the response structure
    const requiredFields = [
      'personalizedOverview',
      'coreStrengths',
      'growthAreas',
      'communicationStyle',
      'relationshipDynamics',
      'conversationStarters',
      'actionSteps',
      'personalizedInsights'
    ];

    for (const field of requiredFields) {
      if (!generatedContent[field]) {
        console.warn(`⚠️ [AI CONTENT] Missing field: ${field}`);
      }
    }

    console.log('✅ [AI CONTENT] Content generation completed successfully');

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        success: true,
        content: generatedContent,
        archetype: archetype.name,
        generatedAt: new Date().toISOString()
      }),
    };

  } catch (error: any) {
    console.error('💥 [AI CONTENT] Error:', error);
    
    // Provide fallback content if AI fails
    const fallbackContent = {
      personalizedOverview: `As a ${archetype.name}, you bring a unique perspective to relationships that combines ${archetype.keywords.map(k => k.text.toLowerCase()).join(', ')}. Your approach to love is deeply personal and meaningful, focusing on creating connections that resonate with your core values and emotional needs.`,
      coreStrengths: [
        "Deep emotional intelligence and empathy",
        "Ability to create meaningful connections",
        "Strong commitment to authentic relationships",
        "Natural storytelling and communication skills",
        "Capacity for profound emotional intimacy"
      ],
      growthAreas: [
        "Balancing idealism with practical relationship needs",
        "Managing expectations in romantic situations",
        "Developing resilience during relationship challenges",
        "Learning to appreciate imperfect but genuine moments"
      ],
      communicationStyle: {
        strengths: [
          "Expressing emotions with clarity and authenticity",
          "Active listening with genuine empathy",
          "Creating safe spaces for vulnerable conversations",
          "Understanding emotional subtext and nuance"
        ],
        challenges: [
          "Being direct about practical needs",
          "Discussing mundane topics without losing interest",
          "Addressing conflicts before they escalate"
        ],
        tips: [
          "Practice expressing practical needs directly",
          "Balance emotional expression with logical problem-solving",
          "Set clear boundaries while maintaining openness",
          "Use 'I' statements to express feelings and needs"
        ]
      },
      relationshipDynamics: {
        idealPartnerQualities: [
          "Emotional intelligence and empathy",
          "Appreciation for depth and meaning",
          "Good communication skills",
          "Shared values and life goals",
          "Ability to be vulnerable and authentic"
        ],
        conflictResolution: "You prefer to address conflicts through emotional processing and understanding. Focus on starting with emotional validation, then moving toward practical solutions together.",
        intimacyStyle: "You approach intimacy as a deep emotional and spiritual connection. Physical intimacy is most meaningful when it's accompanied by emotional closeness and mutual understanding."
      },
      conversationStarters: [
        "What's a moment from your childhood that still influences how you love?",
        "If our relationship were a book, what would this chapter be about?",
        "What's something beautiful you noticed about us this week?",
        "How do you imagine we'll look back on this time in our lives?",
        "What's a dream you have for us that you haven't shared yet?",
        "What does emotional safety mean to you in a relationship?",
        "How do you like to celebrate meaningful moments together?",
        "What's your favorite way to show love without using words?"
      ],
      actionSteps: {
        thisWeek: [
          "Share one meaningful story from your past with someone you care about",
          "Practice expressing a practical need directly",
          "Notice and appreciate one 'ordinary' moment of connection",
          "Ask someone a deep conversation starter from this report"
        ],
        thisMonth: [
          "Establish a weekly ritual of connection",
          "Practice setting one small boundary while maintaining openness",
          "Reflect on your relationship patterns",
          "Plan an activity that aligns with your authentic interests"
        ],
        longTerm: [
          "Develop consistent emotional self-care practices",
          "Learn to appreciate practical expressions of love",
          "Build resilience by reframing challenges as growth opportunities",
          "Continue exploring compatibility with different personality types"
        ]
      },
      personalizedInsights: [
        "Your depth of feeling is a gift that creates lasting, meaningful relationships",
        "The right partner will treasure your emotional intelligence, not find it overwhelming",
        "Your ability to find meaning in everyday moments enriches your relationships",
        "Trust in your capacity to create the deep connection you seek"
      ]
    };
    
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        success: true,
        content: fallbackContent,
        archetype: archetype.name,
        generatedAt: new Date().toISOString(),
        fallback: true,
        error: error.message
      }),
    };
  }
};