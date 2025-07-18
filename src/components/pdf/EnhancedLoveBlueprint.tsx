import { Page, Text, View, Document, StyleSheet, Svg, Circle, Line, Polygon, Path, G } from '@react-pdf/renderer';
import { Archetype } from '../../types/quiz';

// Create styles using built-in fonts for reliability
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
    fontSize: 11,
    lineHeight: 1.4
  },
  coverPage: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    backgroundColor: '#f8f9ff',
    padding: 60
  },
  coverTitle: {
    fontSize: 48,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 20,
    color: '#ff0000',
    textAlign: 'center'
  },
  coverSubtitle: {
    fontSize: 20,
    marginBottom: 40,
    color: '#6c5ce7',
    textAlign: 'center'
  },
  coverArchetype: {
    fontSize: 32,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 20,
    color: '#fd79a8',
    textAlign: 'center'
  },
  coverTagline: {
    fontSize: 16,
    fontStyle: 'italic',
    marginBottom: 50,
    color: '#6c5ce7',
    textAlign: 'center'
  },
  coverCustomer: {
    fontSize: 14,
    marginTop: 50,
    color: '#4a5568',
    textAlign: 'center'
  },
  coverDate: {
    fontSize: 12,
    marginTop: 14,
    color: '#718096',
    textAlign: 'center'
  },
  section: {
    marginBottom: 16
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 8,
    color: '#6c5ce7',
    paddingBottom: 4,
    borderBottom: '1 solid #e2e8f0'
  },
  subSectionTitle: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 4,
    marginTop: 8,
    color: '#4a5568'
  },
  paragraph: {
    fontSize: 11,
    marginBottom: 6,
    lineHeight: 1.4,
    color: '#2d3748'
  },
  text: {
    fontSize: 11,
    marginBottom: 6,
    lineHeight: 1.4,
    color: '#2d3748'
  },
  list: {
    marginLeft: 15,
    marginTop: 4,
    marginBottom: 8
  },
  listItem: {
    fontSize: 11,
    marginBottom: 4,
    lineHeight: 1.4,
    color: '#2d3748'
  },
  highlight: {
    backgroundColor: '#f8f9ff',
    padding: 10,
    marginVertical: 8,
    borderLeft: '3 solid #6c5ce7',
    borderRadius: 4
  },
  highlightText: {
    fontSize: 11,
    color: '#4a5568',
    fontStyle: 'italic',
    lineHeight: 1.4
  },
  compatibilityBox: {
    backgroundColor: '#f0fff4',
    padding: 10,
    marginVertical: 8,
    borderRadius: 4,
    borderLeft: '3 solid #38a169'
  },
  compatibilityTitle: {
    fontSize: 13,
    fontFamily: 'Helvetica-Bold',
    color: '#2f855a',
    marginBottom: 4
  },
  compatibilityText: {
    fontSize: 11,
    color: '#2f855a',
    lineHeight: 1.4
  },
  radarContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 12,
    height: 200
  },
  ctaBox: {
    backgroundColor: '#f0e6ff',
    padding: 10,
    marginVertical: 8,
    borderRadius: 4,
    borderLeft: '3 solid #805ad5'
  },
  ctaTitle: {
    fontSize: 13,
    fontFamily: 'Helvetica-Bold',
    color: '#553c9a',
    marginBottom: 4
  },
  ctaText: {
    fontSize: 11,
    color: '#553c9a',
    lineHeight: 1.4
  },
  pageNumber: {
    position: 'absolute',
    bottom: 30,
    right: 40,
    fontSize: 10,
    color: '#a0aec0'
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 9,
    color: '#a0aec0'
  },
  conversationBox: {
    backgroundColor: '#fffaf0',
    padding: 10,
    marginVertical: 8,
    borderRadius: 4,
    borderLeft: '3 solid #ed8936'
  },
  conversationTitle: {
    fontSize: 13,
    fontFamily: 'Helvetica-Bold',
    color: '#c05621',
    marginBottom: 4
  },
  conversationItem: {
    fontSize: 10,
    color: '#744210',
    fontStyle: 'italic',
    marginBottom: 4,
    paddingLeft: 8
  },
  intimacyBox: {
    backgroundColor: '#fef5f5',
    padding: 10,
    marginVertical: 8,
    borderRadius: 4,
    borderLeft: '3 solid #e53e3e'
  },
  intimacyTitle: {
    fontSize: 13,
    fontFamily: 'Helvetica-Bold',
    color: '#c53030',
    marginBottom: 4
  },
  intimacyText: {
    fontSize: 11,
    color: '#742a2a',
    lineHeight: 1.4
  },
  finalThoughts: {
    textAlign: 'center',
    marginTop: 16,
    fontSize: 14,
    color: '#6c5ce7',
    fontFamily: 'Helvetica-Bold'
  }
});

// Compatibility radar data for each archetype
const compatibilityData = {
  'narrative-idealist': {
    'vibrant-explorer': 85,
    'steady-guardian': 75,
    'mindful-architect': 65,
    'compassionate-nurturer': 70
  },
  'steady-guardian': {
    'compassionate-nurturer': 90,
    'vibrant-explorer': 70,
    'mindful-architect': 80,
    'narrative-idealist': 75
  },
  'vibrant-explorer': {
    'narrative-idealist': 85,
    'mindful-architect': 80,
    'steady-guardian': 70,
    'compassionate-nurturer': 65
  },
  'mindful-architect': {
    'vibrant-explorer': 80,
    'compassionate-nurturer': 85,
    'steady-guardian': 80,
    'narrative-idealist': 65
  },
  'compassionate-nurturer': {
    'steady-guardian': 90,
    'mindful-architect': 85,
    'narrative-idealist': 70,
    'vibrant-explorer': 65
  }
};

const archetypeNames = {
  'narrative-idealist': 'Narrative Idealist',
  'steady-guardian': 'Steady Guardian',
  'vibrant-explorer': 'Vibrant Explorer',
  'mindful-architect': 'Mindful Architect',
  'compassionate-nurturer': 'Compassionate Nurturer'
};

// Couples CTA Component
const CouplesCTA = () => (
  <View style={styles.ctaBox}>
    <Text style={styles.ctaTitle}>Want to compare this with your partner's archetype?</Text>
    <Text style={styles.ctaText}>
      Try Couples Mode to discover how your archetypes interact and get personalized insights for your relationship. Visit affinityai.me/couples to get started.
    </Text>
  </View>
);

// Compatibility radar chart component
const CompatibilityRadar = ({ archetype }: { archetype: Archetype }) => {
  const data = compatibilityData[archetype.id as keyof typeof compatibilityData] || {};
  const center = 100;
  const maxRadius = 80;
  
  // Define the archetypes to display on the radar
  const archetypes = [
    'steady-guardian',
    'mindful-architect', 
    'compassionate-nurturer',
    'vibrant-explorer'
  ];
  
  // Calculate angles for each archetype (in radians, starting from top)
  const angles = [0, Math.PI/2, Math.PI, Math.PI*3/2];
  
  // Convert polar coordinates to cartesian
  const getPoint = (angle: number, radius: number) => {
    return {
      x: center + radius * Math.sin(angle),
      y: center - radius * Math.cos(angle)
    };
  };

  // Generate grid circles
  const gridCircles = [20, 40, 60, 80].map((radius, index) => (
    <Circle
      key={`circle-${index}`}
      cx={center}
      cy={center}
      r={radius}
      stroke="#e2e8f0"
      strokeWidth={1}
      fill="none"
    />
  ));

  // Generate grid lines
  const gridLines = angles.map((angle, index) => {
    const point = getPoint(angle, maxRadius);
    return (
      <Line
        key={`line-${index}`}
        x1={center}
        y1={center}
        x2={point.x}
        y2={point.y}
        stroke="#e2e8f0"
        strokeWidth={1}
      />
    );
  });

  // Generate data points
  const dataPoints = archetypes.map((archetypeId, index) => {
    const value = data[archetypeId] || 0;
    const radius = (value / 100) * maxRadius;
    const point = getPoint(angles[index], radius);
    return point;
  });

  // Create polygon points string
  const polygonPoints = dataPoints.map(p => `${p.x},${p.y}`).join(' ');

  return (
    <View style={styles.radarContainer}>
      <Svg width={200} height={200} viewBox="0 0 200 200">
        {/* Grid */}
        {gridCircles}
        {gridLines}
        
        {/* Data polygon */}
        <Polygon
          points={polygonPoints}
          fill="#6c5ce7"
          fillOpacity={0.2}
          stroke="#6c5ce7"
          strokeWidth={2}
        />
        
        {/* Data points */}
        {dataPoints.map((point, index) => (
          <Circle
            key={`point-${index}`}
            cx={point.x}
            cy={point.y}
            r={3}
            fill="#6c5ce7"
          />
        ))}
        
        {/* Labels */}
        <Text x={center} y={center - maxRadius - 15} style={{ fontSize: 8, textAnchor: 'middle', fontFamily: 'Helvetica-Bold' }}>
          Steady Guardian
        </Text>
        <Text x={center + maxRadius + 15} y={center} style={{ fontSize: 8, textAnchor: 'middle', fontFamily: 'Helvetica-Bold' }}>
          Mindful Architect
        </Text>
        <Text x={center} y={center + maxRadius + 15} style={{ fontSize: 8, textAnchor: 'middle', fontFamily: 'Helvetica-Bold' }}>
          Compassionate Nurturer
        </Text>
        <Text x={center - maxRadius - 15} y={center} style={{ fontSize: 8, textAnchor: 'middle', fontFamily: 'Helvetica-Bold' }}>
          Vibrant Explorer
        </Text>
        
        {/* Percentage scale */}
        <Text x={center + 50} y={center - 50} style={{ fontSize: 6, textAnchor: 'middle', fontFamily: 'Helvetica' }}>50</Text>
        <Text x={center + 60} y={center - 60} style={{ fontSize: 6, textAnchor: 'middle', fontFamily: 'Helvetica' }}>60</Text>
        <Text x={center + 70} y={center - 70} style={{ fontSize: 6, textAnchor: 'middle', fontFamily: 'Helvetica' }}>70</Text>
        <Text x={center + 80} y={center - 80} style={{ fontSize: 6, textAnchor: 'middle', fontFamily: 'Helvetica' }}>80</Text>
      </Svg>
      
      {/* Legend */}
      <View style={{ marginTop: 8 }}>
        <Text style={{ fontSize: 9, color: '#4a5568', textAlign: 'center', marginBottom: 4 }}>
          Compatibility Percentages:
        </Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
          {archetypes.map((archetypeId, index) => (
            <Text key={`legend-${index}`} style={{ fontSize: 8, color: '#4a5568' }}>
              {archetypeNames[archetypeId as keyof typeof archetypeNames]}: {data[archetypeId]}%
            </Text>
          ))}
        </View>
      </View>
    </View>
  );
};

interface EnhancedLoveBlueprintProps {
  archetype: Archetype;
  customerName?: string;
  aiContent?: any;
  isAIGenerated?: boolean;
}

const EnhancedLoveBlueprint = ({ 
  archetype, 
  customerName,
  aiContent,
  isAIGenerated = true
}: EnhancedLoveBlueprintProps) => {
  // Default content if no AI content is provided
  const content = aiContent || {
    personalizedOverview: `As a ${archetype.name}, you bring a unique perspective to relationships that combines ${archetype.keywords.map(k => k.text.toLowerCase()).join(', ')}. Your approach to love is deeply personal and meaningful.`,
    coreStrengths: [
      "Deep emotional intelligence and empathy",
      "Ability to create meaningful connections",
      "Strong commitment to authentic relationships",
      "Natural storytelling ability that enriches relationships",
      "Capacity for profound emotional intimacy"
    ],
    growthAreas: [
      "Balancing idealism with practical relationship needs",
      "Managing expectations in romantic situations",
      "Developing resilience during relationship challenges",
      "Learning to appreciate imperfect but genuine connections"
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

  return (
    <Document>
      {/* Cover Page */}
      <Page size="A4" style={styles.page}>
        <View style={styles.coverPage}>
          <Text style={styles.coverTitle}>Love Blueprint</Text>
          <Text style={styles.coverSubtitle}>Your AI-Enhanced Relationship Profile</Text>
          <Text style={styles.coverArchetype}>{archetype.name}</Text>
          <Text style={styles.coverTagline}>"{archetype.tagline}"</Text>
          {customerName && (
            <Text style={styles.coverCustomer}>Prepared for {customerName}</Text>
          )}
          <Text style={styles.coverDate}>
            {new Date().toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </Text>
        </View>
        <Text style={styles.pageNumber}>1</Text>
      </Page>

      {/* Page 2: Personalized Overview */}
      <Page size="A4" style={styles.page}>
        <View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Unique Love Profile</Text>
            <Text style={styles.paragraph}>
              {content.personalizedOverview}
            </Text>
            
            <View style={styles.highlight}>
              <Text style={styles.highlightText}>
                As a {archetype.name}, you don't just experience love—you create meaningful connections that become the foundation of your personal story and identity. Your approach to relationships is both deeply personal and universally resonant.
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Relationship Strengths</Text>
            <Text style={styles.paragraph}>
              These key strengths define how you show up in relationships and what makes you a valuable partner:
            </Text>
            <View style={styles.list}>
              {content.coreStrengths.map((strength: string, index: number) => (
                <Text key={index} style={styles.listItem}>• {strength}</Text>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Compatibility Overview</Text>
            <View style={styles.compatibilityBox}>
              <Text style={styles.compatibilityTitle}>Your Perfect Match</Text>
              <Text style={styles.compatibilityText}>
                You naturally connect well with: {archetype.compatibleWith.join(' & ')}
              </Text>
              <Text style={styles.compatibilityText} style={{marginTop: 4}}>
                In real-world terms, you'll likely click with people who are spontaneous and adventurous (Vibrant Explorer types) or those who provide stability and reliability (Steady Guardian types). These personalities balance your thoughtful, meaning-focused approach with either exciting new experiences or grounding practicality.
              </Text>
            </View>
          </View>
          
          {/* Couples CTA - Added to Page 2 */}
          <CouplesCTA />
        </View>

        <Text style={styles.footer}>Generated by Affinity AI - Your guide to deeper connections</Text>
        <Text style={styles.pageNumber}>2</Text>
      </Page>

      {/* Page 3: Communication Style */}
      <Page size="A4" style={styles.page}>
        <View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Communication Style</Text>
            <Text style={styles.paragraph}>
              As a {archetype.name}, your way of talking and listening is unique. You naturally go beyond small talk to create meaningful conversations that build real connection.
            </Text>
            
            <Text style={styles.subSectionTitle}>Your Communication Superpowers</Text>
            <View style={styles.list}>
              {content.communicationStyle.strengths.map((strength: string, index: number) => (
                <Text key={index} style={styles.listItem}>• {strength}</Text>
              ))}
            </View>
            
            <Text style={styles.subSectionTitle}>Communication Blind Spots</Text>
            <View style={styles.list}>
              {content.communicationStyle.challenges.map((challenge: string, index: number) => (
                <Text key={index} style={styles.listItem}>• {challenge}</Text>
              ))}
            </View>

            <View style={styles.highlight}>
              <Text style={styles.highlightText}>
                Pro Tip: Your depth of communication is a gift. When you need something practical (like deciding where to eat or setting a schedule), try being direct and specific rather than hoping your partner will sense what you need. Save the poetic language for the emotional moments where it truly shines.
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Conflict Style</Text>
            <Text style={styles.paragraph}>
              When disagreements happen, you tend to focus on feelings first. Instead of jumping to solutions, you want to make sure everyone feels heard and understood.
            </Text>
            
            <Text style={styles.paragraph}>
              This approach has real benefits - it creates emotional safety and deeper understanding. But sometimes it can leave practical problems unsolved or drag conflicts out longer than necessary.
            </Text>
            
            <View style={styles.highlight}>
              <Text style={styles.highlightText}>
                Try This: When conflicts arise, start by saying "I hear you and I understand how you feel" to create emotional safety. Then add "Let's figure out a solution together" to move toward resolution. This two-step approach honors both emotional needs and practical problem-solving.
              </Text>
            </View>
          </View>
        </View>

        <Text style={styles.footer}>Generated by Affinity AI - Your guide to deeper connections</Text>
        <Text style={styles.pageNumber}>3</Text>
      </Page>

      {/* Page 4: Growth Areas */}
      <Page size="A4" style={styles.page}>
        <View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Growth Areas & Development</Text>
            <Text style={styles.paragraph}>
              Every archetype has areas where growth can lead to even more fulfilling relationships. Here are yours, with practical examples:
            </Text>
            
            <Text style={styles.subSectionTitle}>Balancing Idealism with Reality</Text>
            <Text style={styles.paragraph}>
              You might imagine perfect romantic scenarios, then feel disappointed when reality doesn't match up. For example, you might plan an elaborate anniversary celebration in your mind without communicating these expectations, then feel let down when your partner plans something simpler.
            </Text>
            <Text style={styles.paragraph}>
              Try instead: Share your romantic visions with your partner beforehand. Say something like, "I'd love to make our anniversary special - I was thinking about a picnic at sunset. What do you think?" This brings your partner into your vision rather than expecting them to read your mind.
            </Text>
            
            <Text style={styles.subSectionTitle}>Managing Expectations</Text>
            <Text style={styles.paragraph}>
              You might build up new relationships quickly in your mind, imagining deep connection before it's had time to develop naturally. For instance, after one great date, you might start planning future trips together or imagining introducing them to your family.
            </Text>
            <Text style={styles.paragraph}>
              Try instead: Enjoy each moment for what it is without fast-forwarding. When you notice yourself planning far ahead, gently bring yourself back to the present with a thought like, "This is a great connection right now, and I'll let it unfold naturally."
            </Text>
          </View>
          
          {/* Couples CTA - Added to Page 4 */}
          <CouplesCTA />
        </View>

        <Text style={styles.footer}>Generated by Affinity AI - Your guide to deeper connections</Text>
        <Text style={styles.pageNumber}>4</Text>
      </Page>

      {/* Page 5: More Growth Areas & Physical Intimacy */}
      <Page size="A4" style={styles.page}>
        <View>
          <View style={styles.section}>
            <Text style={styles.subSectionTitle}>Developing Emotional Resilience</Text>
            <Text style={styles.paragraph}>
              When relationship challenges arise, you might feel them more intensely than others. For example, a small disagreement might feel like it threatens the entire relationship, or a partner needing space might feel like abandonment.
            </Text>
            <Text style={styles.paragraph}>
              Try instead: Create a self-soothing toolkit for relationship stress. This might include journaling your feelings, talking with a trusted friend, or reminding yourself "This is one moment in our relationship, not the whole story."
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Physical Intimacy & Attraction</Text>
            <View style={styles.intimacyBox}>
              <Text style={styles.intimacyTitle}>Your Approach to Physical Connection</Text>
              <Text style={styles.intimacyText}>
                For you, physical intimacy is most meaningful when it's an extension of emotional connection. You value the story behind each touch and the meaning behind physical expressions of love. While others might separate physical and emotional attraction, for you they're deeply intertwined.
              </Text>
            </View>
            
            <Text style={styles.paragraph}>
              Your physical intimacy style tends to be:
            </Text>
            <View style={styles.list}>
              <Text style={styles.listItem}>• Emotionally present and fully engaged in the moment</Text>
              <Text style={styles.listItem}>• Focused on the meaning and connection behind physical touch</Text>
              <Text style={styles.listItem}>• Appreciative of sensual experiences that engage all senses</Text>
              <Text style={styles.listItem}>• Drawn to partners who can verbalize their feelings during intimate moments</Text>
              <Text style={styles.listItem}>• Most comfortable when trust and emotional safety are established first</Text>
            </View>
          </View>
        </View>

        <Text style={styles.footer}>Generated by Affinity AI - Your guide to deeper connections</Text>
        <Text style={styles.pageNumber}>5</Text>
      </Page>

      {/* Page 6: Compatibility Radar - NEW PAGE */}
      <Page size="A4" style={styles.page}>
        <View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Compatibility Radar</Text>
            <Text style={styles.paragraph}>
              This visualization shows your natural compatibility with different relationship archetypes. The further the point extends outward on each axis, the stronger the compatibility.
            </Text>
            
            {/* Compatibility Radar Chart - Added to Page 6 */}
            <CompatibilityRadar archetype={archetype} />
            
            <Text style={styles.paragraph}>
              Understanding your compatibility patterns can help you recognize potential strengths and challenges in different relationships. Remember that compatibility is just one factor in relationship success - growth, communication, and shared values are equally important.
            </Text>
            
            <View style={styles.highlight}>
              <Text style={styles.highlightText}>
                The most fulfilling relationships often involve complementary differences, not just similarities. Look for partners who share your core values but bring different strengths to balance your natural tendencies.
              </Text>
            </View>
          </View>
          
          {/* Couples CTA - Added to Page 6 */}
          <CouplesCTA />
        </View>

        <Text style={styles.footer}>Generated by Affinity AI - Your guide to deeper connections</Text>
        <Text style={styles.pageNumber}>6</Text>
      </Page>

      {/* Page 7: Conversation Starters */}
      <Page size="A4" style={styles.page}>
        <View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Conversation Starters for Deeper Connection</Text>
            <Text style={styles.paragraph}>
              These questions are designed specifically for your communication style. Use them to create meaningful conversations with potential partners or deepen existing relationships.
            </Text>
            
            <View style={styles.conversationBox}>
              <Text style={styles.conversationTitle}>Questions to Ask Your Partner</Text>
              {content.conversationStarters.slice(0, 5).map((question: string, index: number) => (
                <Text key={index} style={styles.conversationItem}>"{question}"</Text>
              ))}
            </View>
            
            <View style={styles.conversationBox}>
              <Text style={styles.conversationTitle}>Questions for Established Relationships</Text>
              {content.conversationStarters.slice(5, 8).map((question: string, index: number) => (
                <Text key={index} style={styles.conversationItem}>"{question}"</Text>
              ))}
            </View>
            
            <Text style={styles.paragraph}>
              These questions align with your natural desire for meaningful connection. They invite the kind of depth and authenticity that you value in relationships. Use them when you want to move beyond surface-level conversation into the territory of real connection.
            </Text>
          </View>
        </View>

        <Text style={styles.footer}>Generated by Affinity AI - Your guide to deeper connections</Text>
        <Text style={styles.pageNumber}>7</Text>
      </Page>

      {/* Page 8: Action Steps */}
      <Page size="A4" style={styles.page}>
        <View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Action Plan</Text>
            <Text style={styles.paragraph}>
              Putting these insights into action will help you create the meaningful relationships you desire. Here are practical steps you can take:
            </Text>

            <Text style={styles.subSectionTitle}>This Week: Quick Wins</Text>
            <View style={styles.list}>
              {content.actionSteps.thisWeek.map((step: string, index: number) => (
                <Text key={index} style={styles.listItem}>• {step}</Text>
              ))}
            </View>

            <Text style={styles.subSectionTitle}>This Month: Building New Patterns</Text>
            <View style={styles.list}>
              {content.actionSteps.thisMonth.map((step: string, index: number) => (
                <Text key={index} style={styles.listItem}>• {step}</Text>
              ))}
            </View>

            <Text style={styles.subSectionTitle}>Long-term: Sustained Growth</Text>
            <View style={styles.list}>
              {content.actionSteps.longTerm.map((step: string, index: number) => (
                <Text key={index} style={styles.listItem}>• {step}</Text>
              ))}
            </View>
          </View>

          <View style={styles.highlight}>
            <Text style={styles.highlightText}>
              Remember: Your depth and emotional intelligence are gifts. The right person will treasure these qualities, not ask you to diminish them. Trust in your ability to create the meaningful connection you seek.
            </Text>
          </View>

          {/* Final Couples CTA - Added to Page 8 */}
          <CouplesCTA />

          <Text style={{textAlign: 'center', marginTop: 12, fontSize: 13, color: '#6c5ce7', fontFamily: 'Helvetica-Bold'}}>
            Thank you for taking this journey of self-discovery. May your love story be everything you dream it can be.
          </Text>
        </View>

        <Text style={styles.footer}>Generated by Affinity AI - Your guide to deeper connections</Text>
        <Text style={styles.pageNumber}>8</Text>
      </Page>
    </Document>
  );
};

export default EnhancedLoveBlueprint;

