import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { Archetype } from '../../types/quiz';

// Create styles with proper spacing and layout
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
  text: {
    fontSize: 11,
    marginBottom: 6,
    lineHeight: 1.5,
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
    lineHeight: 1.4
  },
  highlight: {
    backgroundColor: '#f8f9ff',
    padding: 10,
    marginVertical: 8,
    borderLeft: '3 solid #6c5ce7'
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
  radarContainer: {
    alignItems: 'center',
    marginVertical: 12
  },
  radarImage: {
    width: 400,
    height: 400,
    marginBottom: 12
  },
  radarExplanation: {
    backgroundColor: '#f8f9ff',
    padding: 10,
    marginTop: 8,
    borderRadius: 4,
    borderLeft: '3 solid #6c5ce7'
  },
  scaleTable: {
    marginVertical: 8
  },
  scaleRow: {
    flexDirection: 'row',
    paddingVertical: 3,
    borderBottom: '1 solid #e2e8f0'
  },
  scaleRange: {
    width: '25%',
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#4a5568'
  },
  scaleDescription: {
    width: '75%',
    fontSize: 10,
    color: '#4a5568'
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
      <View wrap={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Archetype: {archetype.name}</Text>
          <Text style={styles.text}>
            {archetype.description}
          </Text>
          
          <View style={styles.highlight}>
            <Text style={styles.highlightText}>
              As a {archetype.name}, you don't just experience love—you create meaningful connections that become the foundation of your personal story and identity.
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Core Characteristics</Text>
          <View style={styles.list}>
            {archetype.keywords.map((keyword, index) => (
              <Text key={index} style={styles.listItem} wrap={false}>
                • {keyword.text} {keyword.emoji}
              </Text>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Compatibility Overview</Text>
          <View style={styles.compatibilityBox}>
            <Text style={styles.compatibilityTitle}>Your Most Compatible Matches</Text>
            <Text style={styles.compatibilityText}>
              You naturally connect well with: {archetype.compatibleWith.join(' & ')}
            </Text>
            <Text style={styles.text}>
              These archetypes complement your {archetype.name} nature by providing balance to your emotional depth while appreciating your unique perspective on love and relationships.
            </Text>
          </View>
        </View>
      </View>

      <Text style={styles.footer}>Generated by Affinity AI - Your guide to deeper connections</Text>
      <Text style={styles.pageNumber}>2</Text>
    </Page>

    {/* Page 2: Communication Style */}
    <Page size="A4" style={styles.page}>
      <View wrap={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Communication Style</Text>
          <Text style={styles.text}>As a {archetype.name}, your communication approach is characterized by depth and nuance. You excel at creating emotional safety and expressing complex feelings.</Text>
          
          <Text style={styles.subSectionTitle}>Your Communication Strengths</Text>
          <View style={styles.list}>
            <Text style={styles.listItem}>• Expressing emotions with poetic clarity and authenticity</Text>
            <Text style={styles.listItem}>• Active listening with genuine empathy and understanding</Text>
            <Text style={styles.listItem}>• Creating safe spaces for vulnerable conversations</Text>
            <Text style={styles.listItem}>• Reading between the lines and understanding emotional subtext</Text>
            <Text style={styles.listItem}>• Sharing personal stories that deepen intimacy</Text>
          </View>
          
          <Text style={styles.subSectionTitle}>Areas for Growth</Text>
          <View style={styles.list}>
            <Text style={styles.listItem}>• Being direct about practical needs and everyday concerns</Text>
            <Text style={styles.listItem}>• Discussing mundane topics without losing interest</Text>
            <Text style={styles.listItem}>• Addressing conflicts before they become emotionally overwhelming</Text>
            <Text style={styles.listItem}>• Balancing emotional expression with logical problem-solving</Text>
          </View>
        </View>
      </View>

      <Text style={styles.footer}>Generated by Affinity AI - Your guide to deeper connections</Text>
      <Text style={styles.pageNumber}>3</Text>
    </Page>

    {/* Page 3: Relationship Dynamics */}
    <Page size="A4" style={styles.page}>
      <View wrap={false}>
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
            <Text style={styles.listItem}>• Daily check-ins about feelings and experiences</Text>
            <Text style={styles.listItem}>• Shared rituals that create meaning (morning coffee talks, evening walks)</Text>
            <Text style={styles.listItem}>• Celebrating emotional milestones and anniversaries</Text>
            <Text style={styles.listItem}>• Creating space for both partners to express vulnerability</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.subSectionTitle}>Conflict Resolution Style</Text>
          <Text style={styles.text}>
            You prefer to address conflicts through emotional processing rather than logical problem-solving. While this creates deep understanding, it's important to balance emotion with practical solutions.
          </Text>
          <View style={styles.highlight}>
            <Text style={styles.highlightText}>
              Tip: Start with emotional validation, then move toward practical solutions together.
            </Text>
          </View>
        </View>
      </View>

      <Text style={styles.footer}>Generated by Affinity AI - Your guide to deeper connections</Text>
      <Text style={styles.pageNumber}>4</Text>
    </Page>

    {/* Page 4: Love Languages */}
    <Page size="A4" style={styles.page}>
      <View wrap={false}>
        <View style={styles.section}>
          <Text style={styles.subSectionTitle}>Love Languages That Resonate</Text>
          <View style={styles.list}>
            <Text style={styles.listItem}>• Words of Affirmation: Poetic expressions of love and appreciation</Text>
            <Text style={styles.listItem}>• Quality Time: Meaningful conversations and shared experiences</Text>
            <Text style={styles.listItem}>• Physical Touch: Affectionate gestures that convey emotional connection</Text>
            <Text style={styles.listItem}>• Acts of Service: Thoughtful gestures that show understanding of your inner world</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Growth Opportunities</Text>
          <Text style={styles.text}>Enhancing your relationship success through targeted development.</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.subSectionTitle}>Balancing Idealism with Reality</Text>
          <Text style={styles.text}>
            Your romantic idealism is beautiful, but learning to appreciate imperfect moments can deepen your relationships and increase satisfaction.
          </Text>
          <View style={styles.list}>
            <Text style={styles.listItem}>• Practice gratitude for ordinary moments with your partner</Text>
            <Text style={styles.listItem}>• Find beauty in practical acts of love (doing dishes, paying bills together)</Text>
            <Text style={styles.listItem}>• Celebrate small gestures, not just grand romantic moments</Text>
            <Text style={styles.listItem}>• Learn to see conflict as part of your love story, not a threat to it</Text>
          </View>
        </View>
      </View>

      <Text style={styles.footer}>Generated by Affinity AI - Your guide to deeper connections</Text>
      <Text style={styles.pageNumber}>5</Text>
    </Page>

    {/* Page 5: More Growth Opportunities */}
    <Page size="A4" style={styles.page}>
      <View wrap={false}>
        <View style={styles.section}>
          <Text style={styles.subSectionTitle}>Developing Emotional Resilience</Text>
          <Text style={styles.text}>
            Your deep feeling nature is a gift, but building resilience helps you navigate relationship challenges without losing your sensitivity.
          </Text>
          <View style={styles.highlight}>
            <Text style={styles.highlightText}>
              Resilience Practice: When facing relationship stress, ask yourself: "How can this challenge become part of our growth story?" This reframes difficulties as opportunities for deeper connection.
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.subSectionTitle}>Setting Healthy Boundaries</Text>
          <Text style={styles.text}>
            Your empathetic nature can sometimes lead to over-giving or losing yourself in relationships. Healthy boundaries actually enhance intimacy by ensuring both partners remain whole individuals.
          </Text>
          <View style={styles.list}>
            <Text style={styles.listItem}>• Maintain individual interests and friendships outside the relationship</Text>
            <Text style={styles.listItem}>• Communicate your needs directly rather than hoping your partner will intuit them</Text>
            <Text style={styles.listItem}>• Take regular time for emotional self-care and personal processing</Text>
            <Text style={styles.listItem}>• Remember that healthy relationships include both togetherness and autonomy</Text>
          </View>
        </View>
      </View>

      <Text style={styles.footer}>Generated by Affinity AI - Your guide to deeper connections</Text>
      <Text style={styles.pageNumber}>6</Text>
    </Page>

    {/* Page 6: Compatibility Radar - Final Section */}
    <Page size="A4" style={styles.page}>
      <View wrap={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Compatibility Radar Analysis</Text>
          <Text style={styles.text}>
            Understanding how you connect with different archetypes can help you build stronger relationships and recognize potential challenges early.
          </Text>
        </View>

        <View style={styles.radarExplanation}>
          <Text style={styles.subSectionTitle}>What the Compatibility Percentages Mean</Text>
          <Text style={styles.text}>
            These percentages represent "relational alignment" scores - a measure of how naturally two archetypes click, complement, or challenge each other. They're based on overlapping core values, complementary styles, and compatible attachment needs.
          </Text>
          
          <View style={styles.scaleTable}>
            <View style={styles.scaleRow}>
              <Text style={styles.scaleRange}>85-100%</Text>
              <Text style={styles.scaleDescription}>Highly aligned - strengths complement with low friction</Text>
            </View>
            <View style={styles.scaleRow}>
              <Text style={styles.scaleRange}>70-84%</Text>
              <Text style={styles.scaleDescription}>Good match - some contrast but shared values bridge it</Text>
            </View>
            <View style={styles.scaleRow}>
              <Text style={styles.scaleRange}>55-69%</Text>
              <Text style={styles.scaleDescription}>Mixed - growth potential but requires conscious communication</Text>
            </View>
            <View style={styles.scaleRow}>
              <Text style={styles.scaleRange}>{"< 55%"}</Text>
              <Text style={styles.scaleDescription}>Friction-prone - misalignment in emotional needs or style</Text>
            </View>
          </View>
        </View>

        <View style={styles.radarContainer}>
          <Text style={styles.subSectionTitle}>Your Compatibility Profile</Text>
          <Text style={styles.text}>
            Based on your {archetype.name} archetype, here's how you align with other types:
          </Text>
          
          <View style={styles.list}>
            <Text style={styles.listItem}>• Vibrant Explorer: 85% - High compatibility, exciting contrast with emotional depth</Text>
            <Text style={styles.listItem}>• Steady Guardian: 75% - A stabilizing force, emotionally grounding</Text>
            <Text style={styles.listItem}>• Compassionate Nurturer: 70% - Shares emotional depth, mutual understanding</Text>
            <Text style={styles.listItem}>• Mindful Architect: 65% - Thoughtful match but may require effort to sync emotional pacing</Text>
          </View>
        </View>
      </View>

      <Text style={styles.footer}>Generated by Affinity AI - Your guide to deeper connections</Text>
      <Text style={styles.pageNumber}>7</Text>
    </Page>
  </Document>
);

export default EnhancedLoveBlueprint;