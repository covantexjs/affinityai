import { create } from 'zustand';
import { QuizAnswers, QuizResult } from '../types/quiz';
import { quizQuestions } from '../data/questions';
import { archetypes } from '../data/archetypes';
import { calculateInitialUserVector, determineArchetypeFromVector } from '../utils/quiz-scoring';

type QuizStore = {
  currentQuestionId: number;
  answers: QuizAnswers;
  result: QuizResult | null;
  previewMode: boolean;
  setAnswer: (questionId: number, answer: string | number) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  calculateResults: () => Promise<void>;
  resetQuiz: () => void;
  setTestMode: () => void;
  setPreviewMode: (enabled: boolean) => void;
};

export const useQuizStore = create<QuizStore>((set, get) => ({
  currentQuestionId: 1,
  answers: {},
  result: null,
  previewMode: false,
  
  setAnswer: (questionId: number, answer: string | number) => {
    set((state) => ({
      answers: { ...state.answers, [questionId]: answer }
    }));
  },
  
  nextQuestion: () => {
    const { currentQuestionId } = get();
    if (currentQuestionId < quizQuestions.length) {
      set({ currentQuestionId: currentQuestionId + 1 });
    } else {
      get().calculateResults();
    }
  },
  
  prevQuestion: () => {
    const { currentQuestionId } = get();
    if (currentQuestionId > 1) {
      set({ currentQuestionId: currentQuestionId - 1 });
    }
  },
  
  calculateResults: async () => {
    const { answers } = get();
    
    try {
      // Calculate initial vector from multiple choice answers
      const initialVector = calculateInitialUserVector(answers);
      
      // Extract free text responses
      const freeTextResponses = quizQuestions
        .filter(q => q.type === 'free-text')
        .map(q => ({
          question: q.text,
          response: answers[q.id] as string
        }))
        .filter(r => r.response);

      // Only attempt LLM processing if we have free text responses
      if (freeTextResponses.length > 0) {
        try {
          const response = await fetch('/.netlify/functions/process-llm-response', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              freeTextResponses,
              userVector: initialVector
            })
          });

          if (!response.ok) {
            // If LLM processing fails, fall back to basic vector calculation
            throw new Error('LLM processing unavailable');
          }

          const { enhancedVector, insights } = await response.json();
          
          // Determine archetype based on enhanced vector
          const archetype = determineArchetypeFromVector(enhancedVector);
          const compatibleArchetypes = archetypes.filter(a => 
            archetype.compatibleWith.includes(a.id)
          );

          set({
            result: {
              archetype,
              compatibilityDetails: {
                mostCompatible: compatibleArchetypes,
                leastCompatible: []
              },
              llmInsights: insights
            }
          });
          return;
        } catch (error) {
          console.warn('LLM processing failed, falling back to basic calculation:', error);
          // Continue to basic calculation below
        }
      }

      // Basic calculation without LLM enhancement
      const archetype = determineArchetypeFromVector(initialVector);
      const compatibleArchetypes = archetypes.filter(a => 
        archetype.compatibleWith.includes(a.id)
      );

      set({
        result: {
          answers: get().answers,
          compatibilityDetails: {
            mostCompatible: compatibleArchetypes,
            leastCompatible: []
          }
        }
      });
      
    } catch (error) {
      console.error('Error calculating results:', error);
      // Fallback to test mode if there's an error in basic calculation
      get().setTestMode();
    }
  },

  resetQuiz: () => {
    set({
      currentQuestionId: 1,
      answers: {},
      result: null,
      previewMode: false
    });
  },

  setTestMode: () => {
    const archetype = archetypes.find(a => a.id === 'narrative-idealist')!;
    const compatibleArchetypes = archetypes.filter(a => 
      archetype.compatibleWith.includes(a.id)
    );
    
    set({
      result: {
        archetype,
        answers: {},
        compatibilityDetails: {
          mostCompatible: compatibleArchetypes,
          leastCompatible: []
        }
      }
    });
  },

  setPreviewMode: (enabled: boolean) => {
    if (enabled) {
      const archetype = archetypes.find(a => a.id === 'narrative-idealist')!;
      const compatibleArchetypes = archetypes.filter(a => 
        archetype.compatibleWith.includes(a.id)
      );
      
      set({
        previewMode: true,
        result: {
          archetype,
          answers: {},
          compatibilityDetails: {
            mostCompatible: compatibleArchetypes,
            leastCompatible: []
          }
        }
      });
    } else {
      set({
        previewMode: false,
        result: null,
        currentQuestionId: 1,
        answers: {}
      });
    }
  }
}));