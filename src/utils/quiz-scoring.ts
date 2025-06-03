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
        break;
      case 2: // Likert scale for emotional expression
        vector.communication_style += (answer as number - 3) * 0.4;
        vector.emotional_depth += (answer as number - 3) * 0.3;
        break;
      // Add more cases based on your questions
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
    // Add vectors for other archetypes
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