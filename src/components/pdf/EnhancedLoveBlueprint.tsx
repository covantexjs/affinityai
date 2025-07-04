import { Page, Text, View, Document, StyleSheet, Font, Image } from '@react-pdf/renderer';
import { Archetype } from '../../types/quiz';

// Register Inter font instead of Montserrat
Font.register({
  family: 'Inter',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2', fontWeight: 400 },
    { src: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYAZ9hiA.woff2', fontWeight: 600 },
    { src: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuFuYAZ9hiA.woff2', fontWeight: 700 }
  ]
});

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Inter'
  },
  coverPage: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    background: 'linear-gradient(135deg, rgba(108, 92, 231, 0.1), rgba(253, 121, 168, 0.1))'
  },
  coverTitle: {
    fontSize: 36,
    fontWeight: 700,
    marginBottom: 20,
    color: '#6c5ce7'
  },
  coverSubtitle: {
    fontSize: 24,
    marginBottom: 40,
    color: '#6c5ce7'
  },
  coverArchetype: {
    fontSize: 28,
    fontWeight: 600,
    marginBottom: 20,
    color: '#fd79a8'
  },
  coverTagline: {
    fontSize: 16,
    fontStyle: 'italic',
    marginBottom: 40,
    color: '#6c5ce7'
  },
  section: {
    marginBottom: 20
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 600,
    marginBottom: 10,
    color: '#6c5ce7'
  },
  text: {
    fontSize: 12,
    marginBottom: 10,
    lineHeight: 1.5
  },
  list: {
    marginLeft: 20
  },
  listItem: {
    fontSize: 12,
    marginBottom: 5
  },
  dimensionBar: {
    width: '100%',
    height: 20,
    backgroundColor: '#f1f2f6',
    borderRadius: 10,
    marginBottom: 20
  },
  dimensionFill: {
    height: '100%',
    borderRadius: 10,
    background: 'linear-gradient(to right, #6c5ce7, #fd79a8)'
  },
  dimensionLabel: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: 5
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 10,
    color: '#666'
  }
});

interface EnhancedLoveBlueprintProps {
  archetype: Archetype;
}

const EnhancedLoveBlueprint = ({ archetype }: EnhancedLoveBlueprintProps) => (
  <Document>
    {/* Cover Page */}
    <Page size="A4" style={styles.page}>
      <View style={styles.coverPage}>
        <Text style={styles.coverTitle}>Love Blueprint</Text>
        <Text style={styles.coverSubtitle}>Your Personalized Relationship Profile</Text>
        <Text style={styles.coverArchetype}>{archetype.name}</Text>
        <Text style={styles.coverTagline}>"{archetype.tagline}"</Text>
      </View>
    </Page>

    {/* Content Pages */}
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Archetype Profile</Text>
        <Text style={styles.text}>{archetype.description}</Text>
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
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Compatibility Analysis</Text>
        <Text style={styles.text}>
          You are most compatible with: {archetype.compatibleWith.join(' & ')}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Communication Style</Text>
        <Text style={styles.text}>
          As a {archetype.name}, your communication approach is characterized by depth and nuance. You excel at:
        </Text>
        <View style={styles.list}>
          <Text style={styles.listItem}>• Expressing emotions with clarity and authenticity</Text>
          <Text style={styles.listItem}>• Active listening and emotional validation</Text>
          <Text style={styles.listItem}>• Creating safe spaces for vulnerable conversations</Text>
          <Text style={styles.listItem}>• Reading between the lines in conversations</Text>
        </View>
      </View>

      <Text style={styles.footer}>
        Generated by Affinity AI - Your guide to deeper connections
      </Text>
    </Page>
  </Document>
);

export default EnhancedLoveBlueprint;