import { Archetype } from '../types/quiz';

export const archetypes: Archetype[] = [
  {
    id: 'narrative-idealist',
    name: 'Narrative Idealist',
    tagline: 'Love is a story I want to co-write.',
    keywords: [
      { text: 'Deep-feeling', emoji: '✨' },
      { text: 'Poetic', emoji: '📝' },
      { text: 'Nostalgic', emoji: '🌙' }
    ],
    description: 'You experience love as a profound story that unfolds over time. You seek meaning in your connections and value emotional depth over casual encounters.',
    compatibleWith: ['vibrant-explorer', 'steady-guardian']
  },
  {
    id: 'steady-guardian',
    name: 'Steady Guardian',
    tagline: 'I create safety in a chaotic world.',
    keywords: [
      { text: 'Reliable', emoji: '🛡️' },
      { text: 'Protective', emoji: '🏠' },
      { text: 'Consistent', emoji: '📊' }
    ],
    description: 'You offer stability and reliability in relationships. Your strength lies in building secure foundations where trust and commitment can flourish.',
    compatibleWith: ['compassionate-nurturer', 'vibrant-explorer']
  },
  {
    id: 'vibrant-explorer',
    name: 'Vibrant Explorer',
    tagline: 'Love should be an adventure we share.',
    keywords: [
      { text: 'Spontaneous', emoji: '🌟' },
      { text: 'Playful', emoji: '🎮' },
      { text: 'Independent', emoji: '🚀' }
    ],
    description: 'You bring energy and novelty to relationships. You value freedom, shared experiences, and keeping the spark alive through new adventures.',
    compatibleWith: ['narrative-idealist', 'mindful-architect']
  },
  {
    id: 'mindful-architect',
    name: 'Mindful Architect',
    tagline: 'I build connections with intention.',
    keywords: [
      { text: 'Thoughtful', emoji: '🧠' },
      { text: 'Strategic', emoji: '🏗️' },
      { text: 'Growth-oriented', emoji: '🌱' }
    ],
    description: 'You approach relationships with careful consideration and planning. You value clear communication and intentional relationship development.',
    compatibleWith: ['vibrant-explorer', 'compassionate-nurturer']
  },
  {
    id: 'compassionate-nurturer',
    name: 'Compassionate Nurturer',
    tagline: 'Connection thrives with care and attention.',
    keywords: [
      { text: 'Empathetic', emoji: '💞' },
      { text: 'Supportive', emoji: '🤲' },
      { text: 'Intuitive', emoji: '🔮' }
    ],
    description: 'You have a natural ability to tune into others\' emotional needs. Your warmth creates a safe space for vulnerability and healing.',
    compatibleWith: ['steady-guardian', 'mindful-architect']
  }
];