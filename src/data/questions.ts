import { QuizQuestion } from '../types/quiz';

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    text: "When I'm in love, I tend to feel things...",
    type: 'multiple-choice',
    options: [
      'Lightly',
      'Intellectually',
      'Deeply',
      'Intensely',
      'Constantly'
    ]
  },
  {
    id: 2,
    text: "I find it easy to express my emotions in a relationship.",
    type: 'likert',
    likertLabels: {
      min: 'Not at all',
      max: 'Always'
    }
  },
  {
    id: 3,
    text: "My ideal romantic moment involves...",
    type: 'multiple-choice',
    options: [
      'A long conversation under the stars',
      'A spontaneous weekend adventure',
      'Finishing a shared project or goal',
      'Something small, safe, and thoughtful'
    ]
  },
  {
    id: 4,
    text: "When I feel emotionally overwhelmed in a relationship, I usually...",
    type: 'multiple-choice',
    options: [
      'Withdraw to think',
      'Talk it out immediately',
      'Write or process solo',
      'Avoid it and hope it passes',
      'Become more needy or anxious'
    ]
  },
  {
    id: 5,
    text: "I feel most secure in a relationship when...",
    type: 'multiple-choice',
    options: [
      'We have constant closeness',
      'We balance connection and independence',
      "There's consistency, even if we're not expressive",
      'I know where I stand but have full autonomy'
    ]
  },
  {
    id: 6,
    text: "My communication style in relationships is best described as...",
    type: 'multiple-choice',
    options: [
      'Direct and open',
      'Playful and witty',
      'Reserved but intentional',
      'Deep and philosophical',
      'Practical and supportive'
    ]
  },
  {
    id: 7,
    text: "When texting a romantic interest, I prefer...",
    type: 'multiple-choice',
    options: [
      'Short and efficient updates',
      'Voice notes and memes',
      'Long-form texts with feelings and thoughts',
      'Short convos but frequent check-ins'
    ]
  },
  {
    id: 8,
    text: "Love is...",
    type: 'multiple-choice',
    options: [
      'A sacred bond',
      'A partnership built over time',
      'A chaotic force I try to understand',
      'A process of healing and growth',
      'Something best when it\'s simple and steady'
    ]
  },
  {
    id: 9,
    text: "Which of these matters most in a partner?",
    type: 'multiple-choice',
    options: [
      'Emotional intelligence',
      'Shared sense of adventure',
      'Long-term commitment',
      'Clear boundaries',
      'Deep curiosity'
    ]
  },
  {
    id: 10,
    text: "I tend to make dating decisions based on...",
    type: 'multiple-choice',
    options: [
      'Gut feeling',
      'Emotional energy',
      'Long-term fit',
      'Logic and planning',
      'Mutual attraction and lifestyle fit'
    ]
  },
  {
    id: 11,
    text: "What's your biggest strength in relationships?",
    type: 'multiple-choice',
    options: [
      'I hold space for others',
      'I bring excitement and movement',
      'I commit fully when I trust',
      'I offer clarity and structure',
      'I help people grow emotionally'
    ]
  },
  {
    id: 12,
    text: "What's your biggest challenge?",
    type: 'multiple-choice',
    options: [
      'Overthinking or emotional walls',
      'Commitment fears or boredom',
      'Getting too emotionally invested',
      'Needing control or consistency',
      'Avoiding vulnerability'
    ]
  },
  {
    id: 13,
    text: "People often describe me as...",
    type: 'multiple-choice',
    options: [
      'Intense and soulful',
      'Steady and reliable',
      'Analytical and quiet',
      'Warm and emotionally fluent',
      'Playful and spontaneous'
    ]
  },
  {
    id: 14,
    text: "When I fall for someone, I…",
    type: 'free-text'
  },
  {
    id: 15,
    text: "A perfect partner for me would…",
    type: 'free-text'
  }
];