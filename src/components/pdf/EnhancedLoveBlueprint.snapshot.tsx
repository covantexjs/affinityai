import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { Archetype } from '../../types/quiz';

// Create styles with proper layout to avoid blank pages
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
    minHeight: '90%',
    backgroundColor: '#f8f9ff',
    padding: 60
  },
  coverTitle: {
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
    marginBottom: 25
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
    lineHeight: 1.5,
    color: '#2d3748',
    textAlign: 'justify'
  },
  text: {
    fontSize: 11,
    marginBottom: 10,
    lineHeight: 1.5,
    color: '#2d3748',
    textAlign: 'justify'
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
  }
});

interface EnhancedLoveBlueprintProps {
  archetype: Archetype;
  customerName?: string;
}

const EnhancedLoveBlueprint = ({ archetype, customerName }: EnhancedLoveBlueprintProps) => (
  <Document>
    {/* Cover Page */}
    <Page size="A4" style={styles.page}>
      <View style={styles.coverPage}>
        <Text style={styles.coverTitle}>Love Blueprint</Text>
        <Text style={styles.coverSubtitle}>Your Personalized Relationship Profile</Text>
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

    {/* Page 1: Archetype Overview */}
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Archetype: {archetype.name}</Text>
        <Text style={styles.text}>
          {archetype.description}
        </Text>
        
        <View style={styles.highlightBox}>
          <Text style={styles.highlightText}>
            As a {archetype.name}, you don't just experience love—you create meaningful connections that become the foundation of your personal story and identity. Your approach to relationships is both deeply personal and universally resonant.
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Core Characteristics</Text>
        <View style={styles.list}>
          {archetype.keywords.map((keyword, index) => (
            <Text key={index} style={styles.listItem}>
              • {keyword.text} {keyword.emoji}
            </Text>
          ))}
        </View>  
        <Text style={styles.text}>
          These characteristics work together to create your unique romantic signature. Understanding them helps you recognize your patterns and leverage your natural strengths in relationships.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Compatibility Overview</Text>
        <View style={styles.compatibilityBox}>
          <Text style={styles.compatibilityTitle}>Your Most Compatible Matches</Text>
          <Text style={styles.compatibilityText}>
            You naturally connect well with: {archetype.compatibleWith.join(' & ')}
          </Text>
          <Text style={styles.compatibilityText} style={{marginTop: 8}}>
            These archetypes complement your {archetype.name} nature by providing balance to your emotional depth while appreciating your unique perspective on love and relationships. They understand your need for meaningful connection and can match your intensity in different but complementary ways.
          </Text>
        </View>
      </View>

      <Text style={styles.footer}>Generated by Affinity AI - Your guide to deeper connections</Text>
      <Text style={styles.pageNumber}>2</Text>
    </Page>

    {/* Page 2: Communication Style */}
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Communication Style</Text>
        <Text style={styles.text}>As a {archetype.name}, your communication approach is characterized by depth and nuance. You excel at creating emotional safety and expressing complex feelings.</Text>

        <Text style={styles.subSectionTitle}>Your Communication Strengths</Text>
        <View style={styles.list}>
          <Text style={styles.listItem}>• Expressing emotions with poetic clarity and genuine authenticity</Text>
          <Text style={styles.listItem}>• Active listening with deep empathy and understanding</Text>
          <Text style={styles.listItem}>• Creating safe spaces for vulnerable conversations</Text>
          <Text style={styles.listItem}>• Reading between the lines and understanding emotional subtext</Text>
          <Text style={styles.listItem}>• Sharing personal stories that deepen intimacy and connection</Text>
          <Text style={styles.listItem}>• Using metaphors and imagery to convey complex emotions</Text>
        </View>
        
        <Text style={styles.subSectionTitle}>Areas for Growth</Text>
        <View style={styles.list}>
          <Text style={styles.listItem}>• Being more direct about practical needs and everyday concerns</Text>
          <Text style={styles.listItem}>• Discussing mundane topics without losing interest or engagement</Text>
          <Text style={styles.listItem}>• Addressing conflicts before they become emotionally overwhelming</Text>
          <Text style={styles.listItem}>• Balancing emotional expression with logical problem-solving</Text>
          <Text style={styles.listItem}>• Setting clear boundaries while maintaining emotional openness</Text>
        </View>

        <View style={styles.highlightBox}>
          <Text style={styles.highlightText}>
            Remember: Your depth of communication is a gift. The right partner will appreciate and reciprocate this level of emotional intelligence rather than finding it overwhelming.
          </Text>
        </View>
      </View>

      <Text style={styles.footer}>Generated by Affinity AI - Your guide to deeper connections</Text>
      <Text style={styles.pageNumber}>3</Text>
    </Page>

    {/* Page 3: Relationship Dynamics */}
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Relationship Dynamics</Text>
        <Text style={styles.text}>
          Understanding your natural relationship patterns helps you create the conditions for love to thrive.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.subSectionTitle}>Emotional Intimacy (Your Superpower)</Text>
        <Text style={styles.text}>
          You excel at creating deep emotional bonds. Your ideal relationship includes regular heart-to-heart conversations, shared vulnerability, and emotional attunement with your partner.
        </Text>
        <View style={styles.list}>
          <Text style={styles.listItem}>• Daily emotional check-ins and meaningful conversations</Text>
          <Text style={styles.listItem}>• Shared rituals that create meaning (morning coffee talks, evening walks)</Text>
          <Text style={styles.listItem}>• Celebrating emotional milestones and relationship anniversaries</Text>
          <Text style={styles.listItem}>• Creating space for both partners to express vulnerability safely</Text>
          <Text style={styles.listItem}>• Building traditions that honor your unique love story</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.subSectionTitle}>Conflict Resolution Style</Text>
        <Text style={styles.text}>
          You prefer to address conflicts through emotional processing rather than logical problem-solving. While this creates deep understanding, it's important to balance emotion with practical solutions.
        </Text>
        <View style={styles.highlightBox}>
          <Text style={styles.highlightText}>
            Effective Approach: Start with emotional validation and understanding, then move toward practical solutions together. This honors your emotional nature while ensuring issues get resolved.
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.subSectionTitle}>Love Languages That Resonate</Text>
        <View style={styles.list}>
          <Text style={styles.listItem}>• Words of Affirmation: Poetic expressions of love and appreciation</Text>
          <Text style={styles.listItem}>• Quality Time: Meaningful conversations and shared emotional experiences</Text>
          <Text style={styles.listItem}>• Physical Touch: Affectionate gestures that convey emotional connection</Text>
          <Text style={styles.listItem}>• Acts of Service: Thoughtful gestures that show understanding of your inner world</Text>
          <Text style={styles.listItem}>• Receiving Gifts: Meaningful tokens that symbolize your unique connection</Text>
        </View>
      </View>

      <Text style={styles.footer}>Generated by Affinity AI - Your guide to deeper connections</Text>
      <Text style={styles.pageNumber}>4</Text>
    </Page>

    {/* Page 5: Conversation Starters & Growth */}
    <Page size="A4" style={styles.page} wrap={false}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Conversation Starters for Deeper Connection</Text>
        <Text style={styles.paragraph}>
          These prompts are specifically designed for your {archetype.name} nature to help you create meaningful conversations with potential partners or deepen existing relationships.
        </Text>
        
        <View style={styles.conversationBox}>
          <Text style={styles.conversationTitle}>Questions for New Connections</Text>
          <Text style={styles.conversationItem}>"What's a moment from your childhood that still influences how you love?"</Text>
          <Text style={styles.conversationItem}>"If our relationship were a book, what would this chapter be about?"</Text>
          <Text style={styles.conversationItem}>"What's something beautiful you noticed about us this week?"</Text>
          <Text style={styles.conversationItem}>"How do you imagine we'll look back on this time in our lives?"</Text>
          <Text style={styles.conversationItem}>"What's a dream you have for us that you haven't shared yet?"</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Personal Growth Opportunities</Text>
        <Text style={styles.paragraph}>
          Your romantic idealism is beautiful, but learning to appreciate imperfect moments can deepen your relationships and increase satisfaction.
        </Text>
        
        <Text style={styles.subSectionTitle}>Balancing Idealism with Reality</Text>
        <View style={styles.list}>
          <Text style={styles.listItem}>• Practice gratitude for ordinary moments with your partner</Text>
          <Text style={styles.listItem}>• Find beauty in practical acts of love (doing dishes, paying bills together)</Text>
          <Text style={styles.listItem}>• Celebrate small gestures, not just grand romantic moments</Text>
          <Text style={styles.listItem}>• Learn to see conflict as part of your love story, not a threat to it</Text>
        </View>

        <Text style={styles.subSectionTitle}>Developing Emotional Resilience</Text>
        <View style={styles.list}>
          <Text style={styles.listItem}>• Build coping strategies for relationship stress and uncertainty</Text>
          <Text style={styles.listItem}>• Practice self-soothing techniques during emotional overwhelm</Text>
          <Text style={styles.listItem}>• Develop a support network beyond your romantic relationship</Text>
          <Text style={styles.listItem}>• Learn to communicate needs directly rather than hoping they'll be intuited</Text>
        </View>
      </View>

      <Text style={styles.footer}>Generated by Affinity AI - Your guide to deeper connections</Text>
      <Text style={styles.pageNumber}>5</Text>
    </Page>

    {/* Page 6: Action Steps & Final Thoughts */}
    <Page size="A4" style={styles.page} wrap={false}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Next Steps</Text>
        <Text style={styles.paragraph}>
          Putting these insights into action will help you create the meaningful relationships you desire.
        </Text>

        <Text style={styles.subSectionTitle}>This Week: Immediate Actions</Text>
        <View style={styles.list}>
          <Text style={styles.listItem}>• Share one meaningful story from your past with someone you care about</Text>
          <Text style={styles.listItem}>• Practice expressing a practical need directly rather than hoping it will be intuited</Text>
          <Text style={styles.listItem}>• Notice and appreciate one "ordinary" moment of connection</Text>
          <Text style={styles.listItem}>• Ask someone you're dating or in a relationship with one of the conversation starters from this report</Text>
        </View>

        <Text style={styles.subSectionTitle}>This Month: Building New Patterns</Text>
        <View style={styles.list}>
          <Text style={styles.listItem}>• Establish a weekly ritual of connection with your partner (or plan for future relationships)</Text>
          <Text style={styles.listItem}>• Practice setting one small boundary while maintaining emotional openness</Text>
          <Text style={styles.listItem}>• Reflect on your relationship patterns and identify one area for growth</Text>
          <Text style={styles.listItem}>• Plan a date or activity that aligns with your authentic interests and values</Text>
        </View>

        <Text style={styles.subSectionTitle}>Ongoing: Long-term Growth</Text>
        <View style={styles.list}>
          <Text style={styles.listItem}>• Develop a consistent practice of emotional self-care and processing</Text>
          <Text style={styles.listItem}>• Learn to appreciate the beauty in practical expressions of love</Text>
          <Text style={styles.listItem}>• Build resilience by reframing challenges as part of your growth story</Text>
          <Text style={styles.listItem}>• Continue exploring your compatibility with different personality types</Text>
        </View>
      </View>
      
      <View style={styles.highlightBox} wrap={false}>
        <Text style={styles.highlightText}>
          Remember: Your depth and emotional intelligence are gifts. The right person will treasure these qualities, not ask you to diminish them. Trust in your ability to create the meaningful connection you seek.
        </Text>
      </View>
      
      <Text style={{textAlign: 'center', marginTop: 20, fontSize: 14, color: '#6c5ce7', fontWeight: 500}}>
        Thank you for taking this journey of self-discovery. May your love story be everything you dream it can be.
      </Text>

      <Text style={styles.footer}>Generated by Affinity AI - Your guide to deeper connections</Text>
      <Text style={styles.pageNumber}>6</Text>
    </Page>
  </Document>
);

export default EnhancedLoveBlueprint;