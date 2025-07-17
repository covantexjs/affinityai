import { QuizAnswers, Archetype } from '../types/quiz';
import { archetypes } from '../data/archetypes';

export interface UserVector {
  emotional_depth: number;
  relational_style: number;
  values_alignment: number;
  communication_style: number;
}

export function calculateInitialUserVector(answers: QuizAnswers): UserVector {
  const vector: UserVector = {
    emotional_depth: 0,
    relational_style: 0,
    values_alignment: 0,
    communication_style: 0
  };

  // Process multiple choice and Likert answers
  Object.entries(answers).forEach(([questionId, answer]) => {
    const qId = parseInt(questionId);
    
    // Example scoring logic - customize based on your questions
    switch (qId) {
      case 1: // "When I'm in love, I tend to feel things..."
        if (answer === 'Deeply' || answer === 'Intensely') {
          vector.emotional_depth += 1;
        }
        if (answer === 'Constantly') {
          vector.emotional_depth += 0.8;
          vector.relational_style -= 0.3;
        }
        if (answer === 'Intellectually') {
          vector.emotional_depth -= 0.5;
          vector.communication_style += 0.5;
        }
        if (answer === 'Lightly') {
          vector.emotional_depth -= 0.8;
          vector.relational_style += 0.5;
        }
        break;
      case 2: // Likert scale for emotional expression
        vector.communication_style += (answer as number - 3) * 0.4;
        vector.emotional_depth += (answer as number - 3) * 0.3;
        break;
      case 3: // "My ideal romantic moment involves..."
        if (answer === 'A long conversation under the stars') {
          vector.emotional_depth += 0.8;
          vector.communication_style += 0.5;
        }
        if (answer === 'A spontaneous weekend adventure') {
          vector.relational_style -= 0.5;
          vector.values_alignment -= 0.3;
        }
        if (answer === 'Finishing a shared project or goal') {
          vector.values_alignment += 0.8;
          vector.relational_style += 0.5;
        }
        if (answer === 'Something small, safe, and thoughtful') {
          vector.relational_style += 0.8;
          vector.emotional_depth += 0.3;
        }
        break;
      case 4: // "When I feel emotionally overwhelmed in a relationship, I usually..."
        if (answer === 'Withdraw to think') {
          vector.communication_style -= 0.5;
          vector.emotional_depth += 0.3;
        }
        if (answer === 'Talk it out immediately') {
          vector.communication_style += 0.8;
        }
        if (answer === 'Write or process solo') {
          vector.emotional_depth += 0.5;
          vector.communication_style -= 0.3;
        }
        if (answer === 'Avoid it and hope it passes') {
          vector.emotional_depth -= 0.5;
          vector.communication_style -= 0.8;
        }
        if (answer === 'Become more needy or anxious') {
          vector.emotional_depth += 0.5;
          vector.relational_style -= 0.5;
        }
        break;
      case 5: // "I feel most secure in a relationship when..."
        if (answer === 'We have constant closeness') {
          vector.relational_style -= 0.8;
          vector.emotional_depth += 0.5;
        }
        if (answer === 'We balance connection and independence') {
          vector.relational_style += 0.3;
          vector.values_alignment += 0.5;
        }
        if (answer === "There's consistency, even if we're not expressive") {
          vector.relational_style += 0.8;
          vector.communication_style -= 0.3;
        }
        if (answer === 'I know where I stand but have full autonomy') {
          vector.relational_style -= 0.5;
          vector.values_alignment += 0.3;
        }
        break;
      // Add more cases for remaining questions
      case 6:
      case 7:
      case 8:
      case 9:
      case 10:
      case 11:
      case 12:
      case 13:
        // These would be implemented with similar logic to the above
        // For now, we'll use a simplified approach that still works
        vector.values_alignment += 0.2;
        vector.communication_style += 0.1;
        break;
    }
  });

  // Normalize values to be between -2 and 2
  Object.keys(vector).forEach((key) => {
    const value = vector[key as keyof UserVector];
    vector[key as keyof UserVector] = Math.max(-2, Math.min(2, value));
  });

  return vector;
}

export function determineArchetypeFromVector(vector: UserVector): Archetype {
  // Define ideal vectors for each archetype
  const archetypeVectors: Record<string, UserVector> = {
    'narrative-idealist': {
      emotional_depth: 2,
      relational_style: 1,
      values_alignment: 2,
      communication_style: 1.5
    },
    'steady-guardian': {
      emotional_depth: 0.5,
      relational_style: 2,
      values_alignment: 1.5,
      communication_style: 0
    },
    'vibrant-explorer': {
      emotional_depth: 1.0,
      relational_style: 0.5,
      values_alignment: 1.0,
      communication_style: 2.0
    },
    'mindful-architect': {
      emotional_depth: 1.0,
      relational_style: 1.5,
      values_alignment: 2.0,
      communication_style: 1.0
    },
    'compassionate-nurturer': {
      emotional_depth: 2.0,
      relational_style: 1.0,
      values_alignment: 1.5,
      communication_style: 1.0
    }
  };

  // Calculate distance to each archetype vector
  const distances = Object.entries(archetypeVectors).map(([id, idealVector]) => {
    const distance = calculateVectorDistance(vector, idealVector);
    return { id, distance };
  });

  // Find the closest match
  const closestMatch = distances.reduce((prev, curr) => 
    curr.distance < prev.distance ? curr : prev
  );

  return archetypes.find(a => a.id === closestMatch.id)!;
}

function calculateVectorDistance(v1: UserVector, v2: UserVector): number {
  return Math.sqrt(
    Math.pow(v1.emotional_depth - v2.emotional_depth, 2) +
    Math.pow(v1.relational_style - v2.relational_style, 2) +
    Math.pow(v1.values_alignment - v2.values_alignment, 2) +
    Math.pow(v1.communication_style - v2.communication_style, 2)
  );
}