import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { Archetype } from '../../types/quiz';

const styles = StyleSheet.create({
  page: {
    padding: 35,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff'
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
    fontSize: 42,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 24,
    color: '#6c5ce7',
    textAlign: 'center'
  },
  coverSubtitle: {
    fontSize: 22,
    marginBottom: 50,
    color: '#6c5ce7',
    textAlign: 'center'
  },
  coverArchetype: {
    fontSize: 32,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 24,
    color: '#fd79a8',
    textAlign: 'center'
  },
  coverTagline: {
    fontSize: 18,
    fontStyle: 'italic',
    marginBottom: 60,
    color: '#6c5ce7',
    textAlign: 'center'
  },
  coverCustomer: {
    fontSize: 16,
    marginTop: 60,
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
    marginBottom: 30
  },
  sectionTitle: {
    fontSize: 22,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 16,
    color: '#6c5ce7',
    paddingBottom: 8,
    borderBottom: '1 solid #e2e8f0'
  },
  subSectionTitle: {
    fontSize: 16,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 10,
    marginTop: 20,
    color: '#4a5568'
  },
  text: {
    fontSize: 11,
    marginBottom: 12,
    lineHeight: 1.6,
    color: '#2d3748'
  },
  list: {
    marginLeft: 20,
    marginTop: 10,
    marginBottom: 16
  },
  listItem: {
    fontSize: 11,
    marginBottom: 8,
    lineHeight: 1.4
  },
  bulletPoint: {
    width: 4,
    height: 4,
    marginRight: 6,
    marginTop: 4
  },
  highlight: {
    backgroundColor: '#f8f9ff',
    padding: 12,
    marginVertical: 16,
    borderLeft: '3 solid #6c5ce7'
  },
  highlightText: {
    fontSize: 11,
    color: '#4a5568',
    fontStyle: 'italic'
  },
  compatibilityBox: {
    backgroundColor: '#f0fff4',
    padding: 12,
    marginVertical: 16,
    borderRadius: 8,
    borderLeft: '3 solid #38a169'
  },
  compatibilityTitle: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    color: '#2f855a',
    marginBottom: 8
  },
  radarContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
    height: 180
  },
  compatibilityText: {
    fontSize: 11,
    color: '#2f855a'
  },
  pageNumber: {
    position: 'absolute',
    bottom: 30,
    right: 50,
    fontSize: 10,
    color: '#a0aec0'
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 50,
    textAlign: 'center',
    fontSize: 10,
    color: '#a0aec0'
  }
});

interface LoveBlueprintProps {
  archetype: Archetype;
  customerName?: string;
}

const LoveBlueprint = ({ archetype, customerName }: LoveBlueprintProps) => (
  <Document>
    {/* Cover Page */}
    <Page size="A4" style={styles.page}>
      <View style={styles.coverPage}>
        <Text style={styles.coverArchetype}>{archetype.name}: The Love Blueprint</Text>
        <Text style={styles.coverTagline}>"Co-authoring your love story with clarity and heart."</Text>
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

      <Text style={styles.footer}>
        Generated by Affinity AI - Your guide to deeper connections
      </Text>
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

      <View style={styles.section}>
        <Text style={styles.subSectionTitle}>Love Languages That Resonate</Text>
        <View style={styles.list}>
          <Text style={styles.listItem}>• Words of Affirmation: Poetic expressions of love and deep appreciation</Text>
          <Text style={styles.listItem}>• Quality Time: Meaningful conversations and shared emotional experiences</Text>
          <Text style={styles.listItem}>• Physical Touch: Affectionate gestures that convey emotional connection</Text>
          <Text style={styles.listItem}>• Acts of Service: Thoughtful gestures that show understanding of your inner world</Text>
          <Text style={styles.listItem}>• Receiving Gifts: Meaningful tokens that symbolize your unique connection</Text>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Compatibility Visualization</Text>
        <Text style={styles.text}>
          Your compatibility with other archetypes is represented visually below. The further the point extends outward, the stronger the compatibility.
        </Text>
        
        <View style={styles.radarContainer}>
          {/* Simplified radar visualization */}
          <View style={{
            width: 150,
            height: 150,
            borderRadius: 75,
            backgroundColor: '#f0e6ff',
            position: 'relative'
          }}>
            <Text style={{
              position: 'absolute',
              top: 65,
              left: 30,
              fontSize: 12,
              fontFamily: 'Helvetica-Bold',
              color: '#6c5ce7'
            }}>
              {archetype.name}
            </Text>
          </View>
        </View>
        
        <Text style={styles.text}>
          You have particularly strong compatibility with {archetype.compatibleWith.join(' and ')}, as shown in the visualization above.
        </Text>
      </View>
        
      <View style={{
        backgroundColor: '#f0e6ff',
        padding: 12,
        marginVertical: 16, 
        borderRadius: 8,
        borderLeft: '3 solid #805ad5'
      }}>
        <Text style={{
          fontSize: 14,
          fontFamily: 'Helvetica-Bold',
          color: '#553c9a',
          marginBottom: 8
        }}>Want to compare this with your partner's archetype?</Text>
        <Text style={{
          fontSize: 11,
          color: '#553c9a'
        }}>
          Try Couples Mode to discover how your archetypes interact and get personalized insights for your relationship. Visit <a href="https://affinityai.me/couples">affinityai.me/couples</a> to get started.
        </Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Compatibility Visualization</Text>
        <Text style={styles.text}>
          Your compatibility with other archetypes is represented visually below. The further the point extends outward, the stronger the compatibility.
        </Text>
        
        <View style={styles.radarContainer}>
          {/* Simplified radar visualization */}
          <View style={{
            width: 150,
            height: 150,
            borderRadius: 75,
            backgroundColor: '#f0e6ff',
            position: 'relative'
          }}>
            <Text style={{
              position: 'absolute',
              top: 65,
              left: 30,
              fontSize: 12,
              fontFamily: 'Helvetica-Bold',
              color: '#6c5ce7'
            }}>
              {archetype.name}
            </Text>
          </View>
        </View>
        
        <Text style={styles.text}>
          You have particularly strong compatibility with {archetype.compatibleWith.join(' and ')}, as shown in the visualization above.
        </Text>
      </View>
        
      <View style={{
        backgroundColor: '#f0e6ff',
        padding: 12,
        marginVertical: 16, 
        borderRadius: 8,
        borderLeft: '3 solid #805ad5'
      }}>
        <Text style={{
          fontSize: 14,
          fontFamily: 'Helvetica-Bold',
          color: '#553c9a',
          marginBottom: 8
        }}>Want to compare this with your partner's archetype?</Text>
        <Text style={{
          fontSize: 11,
          color: '#553c9a'
        }}>
          Try Couples Mode to discover how your archetypes interact and get personalized insights for your relationship. Visit <a href="https://affinityai.me/couples">affinityai.me/couples</a> to get started.
        </Text>
      </View>

      <Text style={styles.footer}>
        Generated by Affinity AI - Your guide to deeper connections
      </Text>
      <Text style={styles.pageNumber}>4</Text>
    </Page>
  </Document>
);

export default LoveBlueprint;