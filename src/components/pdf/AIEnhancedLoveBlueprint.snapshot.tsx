import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { Archetype } from '../../types/quiz';

// Create styles with enhanced typography and layout
const styles = StyleSheet.create({
  page: {
    padding: 35,
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
    minHeight: '90%',
    backgroundColor: '#f8f9ff',
    padding: 60
  },
  coverTitleMain: {
    fontSize: 36,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 20,
    color: '#6c5ce7',
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
    marginTop: 16,
    color: '#718096',
    textAlign: 'center'
  },
  section: {
    marginBottom: 20
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 10,
    color: '#6c5ce7',
    paddingBottom: 6,
    borderBottom: '1 solid #e2e8f0'
  },
  subSectionTitle: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 6,
    marginTop: 12,
    color: '#4a5568'
  },
  paragraph: {
    fontSize: 11,
    marginBottom: 10,
    lineHeight: 1.4,
    color: '#2d3748'
  },
  list: {
    marginLeft: 15,
    marginTop: 8,
    marginBottom: 10
  },
  listItem: {
    fontSize: 11,
    marginBottom: 6,
    lineHeight: 1.4,
    color: '#2d3748'
  },
  highlightBox: {
    backgroundColor: '#f8f9ff',
    padding: 12,
    marginVertical: 10,
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
    padding: 12,
    marginVertical: 10,
    borderRadius: 6,
    borderLeft: '3 solid #38a169'
  },
  compatibilityTitle: {
    fontSize: 13,
    fontFamily: 'Helvetica-Bold',
    color: '#2f855a',
    marginBottom: 6
  },
  compatibilityText: {
    fontSize: 11,
    color: '#2f855a',
    lineHeight: 1.4
  },
  keywordGrid: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginVertical: 12
  },
  keywordItem: {
    backgroundColor: '#f7fafc',
    padding: '6 10',
    borderRadius: 12,
    fontSize: 10,
    color: '#4a5568',
    border: '1 solid #e2e8f0'
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
    padding: 12,
    marginVertical: 10,
    borderRadius: 6,
    borderLeft: '3 solid #ed8936'
  },
  conversationTitle: {
    fontSize: 13,
    fontFamily: 'Helvetica-Bold',
    color: '#c05621',
    marginBottom: 8
  },
  conversationItem: {
    fontSize: 10,
    color: '#744210',
    fontStyle: 'italic',
    marginBottom: 6,
    paddingLeft: 8
  },
  intimacyBox: {
    backgroundColor: '#fef5f5',
    padding: 12,
    marginVertical: 10,
    borderRadius: 6,
    borderLeft: '3 solid #e53e3e'
  },
  intimacyTitle: {
    fontSize: 13,
    fontFamily: 'Helvetica-Bold',
    color: '#c53030',
    marginBottom: 6
  },
  intimacyText: {
    fontSize: 11,
    color: '#742a2a',
    lineHeight: 1.4
  },
  finalThoughts: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 14,
    color: '#6c5ce7',
    fontFamily: 'Helvetica-Bold'
  },
  couplesBox: {
    backgroundColor: '#f0e6ff',
    padding: 12,
    marginVertical: 10,
    borderRadius: 6,
    borderLeft: '3 solid #805ad5'
  },
  couplesTitle: {
    fontSize: 13,
    fontFamily: 'Helvetica-Bold',
    color: '#553c9a',
    marginBottom: 6
  },
  couplesText: {
    fontSize: 11,
    color: '#553c9a',
    lineHeight: 1.4
  }
});

interface AIEnhancedLoveBlueprintProps {
  archetype: Archetype;
  customerName?: string;
  aiContent?: any;
  isAIGenerated?: boolean;
}

const AIEnhancedLoveBlueprint = ({ 
  archetype, 
  customerName,
  aiContent,
  isAIGenerated = false
}: AIEnhancedLoveBlueprintProps) => {
  // Default content if no AI content is provided
  const content = aiContent || {
    personalizedOverview: `As a ${archetype.name}, you bring a unique perspective to relationships that combines ${archetype.keywords.map(k => k.text.toLowerCase()).join(', ')}. Your approach to love is deeply personal and meaningful.`,
    coreStrengths: [
      "Deep emotional intelligence and empathy in relationships",
      "Ability to create meaningful connections that transcend the superficial",
      "Strong commitment to authentic relationships and genuine expression",
      "Natural communication skills that foster understanding and closeness",
      "Capacity for profound emotional intimacy and vulnerability"
    ],
    growthAreas: [
      "Balancing idealism with practical relationship needs and everyday realities",
      "Managing expectations in romantic situations to avoid disappointment",
      "Developing emotional resilience during relationship challenges",
      "Learning to appreciate imperfect but genuine moments of connection",
      "Setting healthy boundaries while maintaining emotional openness"
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
          <Text style={styles.coverTitleMain}>Love Blueprint</Text>
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
      <Page size="A4" style={styles.page} wrap={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Unique Love Profile</Text>
          <Text style={styles.paragraph}>
            {content.personalizedOverview}
          </Text>
          
          <View style={styles.highlightBox}>
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
            <Text style={styles.compatibilityText} style={{marginTop: 8}}>
              In real-world terms, you'll likely click with people who are spontaneous and adventurous (Vibrant Explorer types) or those who provide stability and reliability (Steady Guardian types). These personalities balance your thoughtful, meaning-focused approach with either exciting new experiences or grounding practicality.
            </Text>
          </View>
        </View>

        <Text style={styles.footer}>Generated by Affinity AI - Your guide to deeper connections</Text>
        <Text style={styles.pageNumber}>2</Text>
      </Page>

      {/* Page 3: Communication Style */}
      <Page size="A4" style={styles.page} wrap={false}>
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

          <View style={styles.highlightBox}>
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
          
          <View style={styles.highlightBox}>
            <Text style={styles.highlightText}>
              Try This: When conflicts arise, start by saying "I hear you and I understand how you feel" to create emotional safety. Then add "Let's figure out a solution together" to move toward resolution. This two-step approach honors both emotional needs and practical problem-solving.
            </Text>
          </View>
        </View>

        <Text style={styles.footer}>Generated by Affinity AI - Your guide to deeper connections</Text>
        <Text style={styles.pageNumber}>3</Text>
      </Page>

      {/* Page 4: Growth Areas */}
      <Page size="A4" style={styles.page} wrap={false}>
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
          
          <Text style={styles.subSectionTitle}>Developing Emotional Resilience</Text>
          <Text style={styles.paragraph}>
            When relationship challenges arise, you might feel them more intensely than others. For example, a small disagreement might feel like it threatens the entire relationship, or a partner needing space might feel like abandonment.
          </Text>
          <Text style={styles.paragraph}>
            Try instead: Create a self-soothing toolkit for relationship stress. This might include journaling your feelings, talking with a trusted friend, or reminding yourself "This is one moment in our relationship, not the whole story."
          </Text>
        </View>

        <Text style={styles.footer}>Generated by Affinity AI - Your guide to deeper connections</Text>
        <Text style={styles.pageNumber}>4</Text>
      </Page>

      {/* Page 5: More Growth Areas & Physical Intimacy */}
      <Page size="A4" style={styles.page} wrap={false}>
        <View style={styles.section}>
          <Text style={styles.subSectionTitle}>Appreciating Imperfect Moments</Text>
          <Text style={styles.paragraph}>
            You might overlook the beauty in ordinary interactions while searching for profound moments. For instance, you might not fully appreciate a simple evening of takeout and TV together because it doesn't feel "special" enough.
          </Text>
          <Text style={styles.paragraph}>
            Try instead: Practice finding meaning in everyday moments. When sharing a simple meal, notice the comfort of routine togetherness. Try saying, "I love these quiet evenings with you" to acknowledge the value of ordinary time together.
          </Text>
          
          <Text style={styles.subSectionTitle}>Setting Healthy Boundaries</Text>
          <Text style={styles.paragraph}>
            Your desire for deep connection might lead you to share too much too soon or neglect your own needs. For example, you might cancel your own plans repeatedly to be available for a new partner, or share very personal stories before trust is established.
          </Text>
          <Text style={styles.paragraph}>
            Try instead: Practice phrases like "I'd love to see you, but I've already committed to my Tuesday yoga class" or "That's something I'd feel more comfortable sharing once we know each other better." Remember that healthy boundaries actually create the safety needed for true intimacy.
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
          
          <Text style={styles.paragraph}>
            To enhance physical connection in your relationships, consider:
          </Text>
          <View style={styles.list}>
            <Text style={styles.listItem}>• Communicating your desire for emotional connection alongside physical intimacy</Text>
            <Text style={styles.listItem}>• Creating rituals that help you transition from daily life to intimate moments</Text>
            <Text style={styles.listItem}>• Expressing appreciation for your partner's physical expressions of love, even simple ones</Text>
            <Text style={styles.listItem}>• Being open about what helps you feel emotionally safe during intimate moments</Text>
          </View>
        </View>

        <Text style={styles.footer}>Generated by Affinity AI - Your guide to deeper connections</Text>
        <Text style={styles.pageNumber}>5</Text>
      </Page>

      {/* Page 6: Conversation Starters */}
      <Page size="A4" style={styles.page} wrap={false}>
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
            {content.conversationStarters.slice(5, 10).map((question: string, index: number) => (
              <Text key={index} style={styles.conversationItem}>"{question}"</Text>
            ))}
          </View>
          
          <Text style={styles.paragraph}>
            These questions align with your natural desire for meaningful connection. They invite the kind of depth and authenticity that you value in relationships. Use them when you want to move beyond surface-level conversation into the territory of real connection.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Relationship Dynamics</Text>
          <Text style={styles.paragraph}>
            Understanding your natural relationship patterns helps you create the conditions for love to thrive and recognize potential challenges before they become problems.
          </Text>
          
          <Text style={styles.subSectionTitle}>Emotional Intimacy (Your Superpower)</Text>
          <Text style={styles.paragraph}>
            You excel at creating deep emotional bonds that go beyond surface-level attraction. Your ideal relationship includes regular heart-to-heart conversations, shared vulnerability, and emotional attunement with your partner.
          </Text>
          <View style={styles.list}>
            <Text style={styles.listItem}>• Daily emotional check-ins like "How are you really feeling today?"</Text>
            <Text style={styles.listItem}>• Shared rituals that create meaning (morning coffee talks, evening walks)</Text>
            <Text style={styles.listItem}>• Celebrating emotional milestones ("Remember when we first said I love you?")</Text>
            <Text style={styles.listItem}>• Creating space for both partners to express vulnerability safely</Text>
          </View>
        </View>

        <Text style={styles.footer}>Generated by Affinity AI - Your guide to deeper connections</Text>
        <Text style={styles.pageNumber}>6</Text>
      </Page>

      {/* Page 7: Love Languages & Ideal Partners */}
      <Page size="A4" style={styles.page} wrap={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Love Languages That Speak to You</Text>
          <View style={styles.list}>
            <Text style={styles.listItem}>• <Text style={{fontFamily: 'Helvetica-Bold'}}>Words of Affirmation:</Text> You treasure heartfelt expressions that show someone really sees you.</Text>
            <Text style={styles.listItem}>• <Text style={{fontFamily: 'Helvetica-Bold'}}>Quality Time:</Text> For you, quality time means meaningful conversations where you both connect deeply.</Text>
            <Text style={styles.listItem}>• <Text style={{fontFamily: 'Helvetica-Bold'}}>Physical Touch:</Text> You value touch that communicates emotional connection and understanding.</Text>
            <Text style={styles.listItem}>• <Text style={{fontFamily: 'Helvetica-Bold'}}>Acts of Service:</Text> You appreciate thoughtful gestures that show someone understands your inner world.</Text>
            <Text style={styles.listItem}>• <Text style={{fontFamily: 'Helvetica-Bold'}}>Receiving Gifts:</Text> Meaningful gifts that tell a story touch you deeply, regardless of price.</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Ideal Partner</Text>
          <Text style={styles.paragraph}>
            While compatibility goes beyond personality types, these qualities tend to complement your {archetype.name} nature particularly well:
          </Text>
          <View style={styles.list}>
            {content.relationshipDynamics.idealPartnerQualities.map((quality: string, index: number) => (
              <Text key={index} style={styles.listItem}>• {quality}</Text>
            ))}
          </View>
          
          <Text style={styles.paragraph}>
            In real-world terms, you'll likely connect well with:
          </Text>
          <View style={styles.list}>
            <Text style={styles.listItem}>• The person who asks thoughtful questions and remembers your stories</Text>
            <Text style={styles.listItem}>• Someone who balances your emotional depth with either grounding stability or refreshing spontaneity</Text>
            <Text style={styles.listItem}>• A partner who appreciates meaningful conversation but can also help you enjoy simple moments</Text>
            <Text style={styles.listItem}>• Someone who has their own emotional depth but might express it differently than you do</Text>
          </View>
          
          <View style={styles.highlightBox}>
            <Text style={styles.highlightText}>
              Remember: No perfect "type" exists. The right person might surprise you by having qualities you didn't expect to value. The most important thing is how you feel in their presence—safe, seen, and inspired to grow.
            </Text>
          </View>
        </View>

        <Text style={styles.footer}>Generated by Affinity AI - Your guide to deeper connections</Text>
        <Text style={styles.pageNumber}>7</Text>
      </Page>

      {/* Page 8: Action Steps */}
      <Page size="A4" style={styles.page} wrap={false}>
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

        <View style={styles.section} wrap={false}>
          <Text style={styles.paragraph}>
            Your {archetype.name} nature gives you a unique lens through which you experience love and connection. By embracing your strengths while working on growth areas, you can create relationships that are both deeply meaningful and practically sustainable.
          </Text>
          
          <View style={styles.highlightBox} wrap={false}>
            <Text style={styles.highlightText}>
              Remember: Your depth and emotional intelligence are gifts. The right person will treasure these qualities, not ask you to diminish them. Trust in your ability to create the meaningful connection you seek.
            </Text>
          </View>
        </View>

        <Text style={{textAlign: 'center', marginTop: 15, fontSize: 13, color: '#6c5ce7', fontFamily: 'Helvetica-Bold'}}>
          Thank you for taking this journey of self-discovery. May your love story be everything you dream it can be.
        </Text>

        <Text style={styles.footer}>Generated by Affinity AI - Your guide to deeper connections</Text>
        <Text style={styles.pageNumber}>8</Text>
      </Page>
    </Document>
  );
};

export default AIEnhancedLoveBlueprint;