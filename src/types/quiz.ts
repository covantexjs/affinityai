export type QuizQuestion = {
  id: number;
  text: string;
  type: 'multiple-choice' | 'likert' | 'free-text';
  options?: string[];
  likertLabels?: {
    min: string;
    max: string;
  };
};

export type QuizAnswers = {
  [key: number]: string | number;
};

export type Archetype = {
  id: string;
  name: string;
  tagline: string;
  keywords: { text: string; emoji: string }[];
  description: string;
  compatibleWith: string[];
};

export type LLMInsight = {
  question: string;
  response: string;
  analysis: {
    emotional_depth: {
      analysis: string;
      adjustment: number;
      confidence: 'low' | 'medium' | 'high';
    };
    relational_style: {
      analysis: string;
      adjustment: number;
      confidence: 'low' | 'medium' | 'high';
    };
    values_alignment: {
      analysis: string;
      adjustment: number;
      confidence: 'low' | 'medium' | 'high';
    };
    communication_style: {
      analysis: string;
      adjustment: number;
      confidence: 'low' | 'medium' | 'high';
    };
  };
};

export type QuizResult = {
  archetype: Archetype;
  answers?: QuizAnswers;
  compatibilityDetails?: {
    mostCompatible: Archetype[];
    leastCompatible: Archetype[];
  };
  llmInsights?: LLMInsight[];
};