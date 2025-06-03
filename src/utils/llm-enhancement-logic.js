/**
 * Affinity AI - LLM Enhancement Logic for Quiz Responses
 * 
 * This module implements the GPT-powered analysis of free-text responses
 * to enhance the accuracy and personalization of archetype matching.
 */

/**
 * Generate a prompt for GPT to analyze a free-text response
 * @param {string} questionText - The question that was asked
 * @param {string} responseText - User's free-text response
 * @param {Object} userVector - Current user dimension vector
 * @returns {string} Formatted prompt for GPT
 */
function generateGptPrompt(questionText, responseText, userVector) {
  return `
You are analyzing a response to a romantic archetype quiz question. 
Your task is to identify emotional patterns, communication styles, and relationship values in the text.

Question: "${questionText}"
User's Response: "${responseText}"

Current dimension scores:
- Emotional Depth: ${userVector.emotional_depth}
- Relational Style: ${userVector.relational_style}
- Values Alignment: ${userVector.values_alignment}
- Communication Style: ${userVector.communication_style}

Based solely on this response, analyze the following dimensions:

1. Emotional Depth: Is the response emotionally rich or reserved? Does it show vulnerability or guardedness?
2. Relational Style: Does it indicate secure attachment, avoidance, or anxious tendencies?
3. Values Alignment: What relationship values are prioritized? (e.g., growth, stability, passion, autonomy)
4. Communication Style: Is the communication direct, philosophical, playful, or practical?

For each dimension, provide:
- A brief analysis (1-2 sentences)
- A suggested adjustment to the dimension score (-2 to +2)
- Confidence level in your assessment (low, medium, high)

Format your response as JSON:
{
  "emotional_depth": {
    "analysis": "...",
    "adjustment": 1,
    "confidence": "high"
  },
  "relational_style": {
    "analysis": "...",
    "adjustment": -1,
    "confidence": "medium"
  },
  "values_alignment": {
    "analysis": "...",
    "adjustment": 0,
    "confidence": "low"
  },
  "communication_style": {
    "analysis": "...",
    "adjustment": 2,
    "confidence": "high"
  }
}
`;
}

/**
 * Parse GPT response and extract dimension adjustments
 * @param {string} gptResponse - Raw response from GPT
 * @returns {Object} Parsed dimension adjustments
 */
function parseGptResponse(gptResponse) {
  try {
    // Extract JSON from GPT response (in case there's additional text)
    const jsonMatch = gptResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No valid JSON found in GPT response");
    }
    
    const jsonStr = jsonMatch[0];
    const parsed = JSON.parse(jsonStr);
    
    // Validate the structure
    const dimensions = ["emotional_depth", "relational_style", "values_alignment", "communication_style"];
    dimensions.forEach(dim => {
      if (!parsed[dim] || typeof parsed[dim].adjustment !== 'number') {
        throw new Error(`Invalid or missing adjustment for ${dim}`);
      }
    });
    
    return {
      emotional_depth: {
        adjustment: parsed.emotional_depth.adjustment,
        confidence: parsed.emotional_depth.confidence,
        analysis: parsed.emotional_depth.analysis
      },
      relational_style: {
        adjustment: parsed.relational_style.adjustment,
        confidence: parsed.relational_style.confidence,
        analysis: parsed.relational_style.analysis
      },
      values_alignment: {
        adjustment: parsed.values_alignment.adjustment,
        confidence: parsed.values_alignment.confidence,
        analysis: parsed.values_alignment.analysis
      },
      communication_style: {
        adjustment: parsed.communication_style.adjustment,
        confidence: parsed.communication_style.confidence,
        analysis: parsed.communication_style.analysis
      }
    };
  } catch (error) {
    console.error("Error parsing GPT response:", error);
    // Return zero adjustments as fallback
    return {
      emotional_depth: { adjustment: 0, confidence: "low", analysis: "Error in analysis" },
      relational_style: { adjustment: 0, confidence: "low", analysis: "Error in analysis" },
      values_alignment: { adjustment: 0, confidence: "low", analysis: "Error in analysis" },
      communication_style: { adjustment: 0, confidence: "low", analysis: "Error in analysis" }
    };
  }
}

/**
 * Apply weighted adjustments to user vector based on GPT analysis
 * @param {Object} userVector - Current user dimension vector
 * @param {Object} adjustments - Dimension adjustments from GPT
 * @returns {Object} Updated user vector
 */
function applyAdjustments(userVector, adjustments) {
  const confidenceWeights = {
    "low": 0.3,
    "medium": 0.6,
    "high": 1.0
  };
  
  const updatedVector = { ...userVector };
  
  // Apply weighted adjustments to each dimension
  Object.entries(adjustments).forEach(([dimension, data]) => {
    const weight = confidenceWeights[data.confidence.toLowerCase()] || 0.5;
    updatedVector[dimension] += data.adjustment * weight;
  });
  
  return updatedVector;
}

/**
 * Process free-text responses with GPT and enhance user vector
 * @param {Object} userVector - Current user dimension vector
 * @param {Array} freeTextResponses - Array of {question, response} objects
 * @param {Function} gptApiCall - Function to call GPT API
 * @returns {Promise<Object>} Enhanced user vector and analysis insights
 */
async function enhanceWithLLM(userVector, freeTextResponses, gptApiCall) {
  const enhancedVector = { ...userVector };
  const insights = [];
  
  // Process each free-text response
  for (const item of freeTextResponses) {
    const prompt = generateGptPrompt(item.question, item.response, enhancedVector);
    
    try {
      // Call GPT API
      const gptResponse = await gptApiCall(prompt);
      
      // Parse response and extract adjustments
      const adjustments = parseGptResponse(gptResponse);
      
      // Apply adjustments to vector
      Object.entries(adjustments).forEach(([dimension, data]) => {
        const weight = data.confidence === "high" ? 1.0 : 
                      data.confidence === "medium" ? 0.6 : 0.3;
        enhancedVector[dimension] += data.adjustment * weight;
        
        // Store insights for later use
        insights.push({
          question: item.question,
          response: item.response,
          dimension: dimension,
          analysis: data.analysis,
          adjustment: data.adjustment,
          confidence: data.confidence
        });
      });
    } catch (error) {
      console.error("Error in LLM enhancement:", error);
      // Continue with next response if one fails
    }
  }
  
  return {
    enhancedVector,
    insights
  };
}

/**
 * Mock GPT API call for testing (replace with actual API call in production)
 * @param {string} prompt - Prompt to send to GPT
 * @returns {Promise<string>} GPT response
 */
async function mockGptApiCall(prompt) {
  // This is a mock implementation for testing
  // In production, replace with actual OpenAI API call
  
  console.log("Mock GPT API Call with prompt:", prompt);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Return mock response based on prompt content
  if (prompt.includes("When I fall for someone")) {
    return `{
      "emotional_depth": {
        "analysis": "The response shows high emotional vulnerability and openness.",
        "adjustment": 2,
        "confidence": "high"
      },
      "relational_style": {
        "analysis": "Indicates secure attachment with healthy boundaries.",
        "adjustment": 1,
        "confidence": "medium"
      },
      "values_alignment": {
        "analysis": "Values emotional connection and authenticity.",
        "adjustment": 1,
        "confidence": "high"
      },
      "communication_style": {
        "analysis": "Direct and emotionally articulate communication.",
        "adjustment": 1,
        "confidence": "high"
      }
    }`;
  } else if (prompt.includes("A perfect partner for me")) {
    return `{
      "emotional_depth": {
        "analysis": "Seeks depth and emotional resonance in partnership.",
        "adjustment": 1,
        "confidence": "medium"
      },
      "relational_style": {
        "analysis": "Desires balance between closeness and independence.",
        "adjustment": 0,
        "confidence": "medium"
      },
      "values_alignment": {
        "analysis": "Prioritizes growth, shared values, and mutual support.",
        "adjustment": 2,
        "confidence": "high"
      },
      "communication_style": {
        "analysis": "Values open, honest communication with emotional intelligence.",
        "adjustment": 1,
        "confidence": "high"
      }
    }`;
  } else {
    return `{
      "emotional_depth": {
        "analysis": "Neutral emotional expression.",
        "adjustment": 0,
        "confidence": "low"
      },
      "relational_style": {
        "analysis": "Insufficient information to determine relational style.",
        "adjustment": 0,
        "confidence": "low"
      },
      "values_alignment": {
        "analysis": "No clear value indicators in this response.",
        "adjustment": 0,
        "confidence": "low"
      },
      "communication_style": {
        "analysis": "Standard communication pattern without distinctive markers.",
        "adjustment": 0,
        "confidence": "low"
      }
    }`;
  }
}

/**
 * Integration function to combine base quiz scoring with LLM enhancement
 * @param {Object} responses - User's quiz responses (question ID -> answer)
 * @param {Object} freeTextResponses - User's free-text responses
 * @param {Function} calculateUserVector - Function to calculate base user vector
 * @param {Function} findMatchingArchetypes - Function to find matching archetypes
 * @param {Function} gptApiCall - Function to call GPT API
 * @returns {Promise<Object>} Enhanced results including user vector and archetype matches
 */
async function processEnhancedQuizResponses(
  responses, 
  freeTextResponses, 
  calculateUserVector, 
  findMatchingArchetypes,
  gptApiCall = mockGptApiCall
) {
  // Calculate base user vector from multiple-choice responses
  const baseUserVector = calculateUserVector(responses);
  
  // Enhance user vector with LLM analysis of free-text responses
  const { enhancedVector, insights } = await enhanceWithLLM(
    baseUserVector, 
    freeTextResponses,
    gptApiCall
  );
  
  // Find matching archetypes using enhanced vector
  const archetypeMatches = findMatchingArchetypes(enhancedVector);
  
  // Return results
  return {
    baseUserVector,
    enhancedVector,
    primaryArchetype: archetypeMatches[0],
    secondaryArchetype: archetypeMatches[1],
    allMatches: archetypeMatches,
    llmInsights: insights
  };
}

// Export functions for use in the application
module.exports = {
  generateGptPrompt,
  parseGptResponse,
  applyAdjustments,
  enhanceWithLLM,
  mockGptApiCall,
  processEnhancedQuizResponses
};
