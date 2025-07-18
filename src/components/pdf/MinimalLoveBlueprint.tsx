import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { Archetype } from '../../types/quiz';

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    backgroundColor: '#ffffff'
  },
  section: {
    margin: 10,
    padding: 10
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    color: '#ff0000',
    marginBottom: 30
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 10,
    color: '#000000'
  },
  text: {
    fontSize: 12,
    marginBottom: 10
  },
  pageNumber: {
    position: 'absolute',
    fontSize: 12,
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: 'grey'
  }
});

interface MinimalLoveBlueprintProps {
  archetype: Archetype;
  customerName?: string;
}

// Create Document Component
const MinimalLoveBlueprint = ({ archetype, customerName }: MinimalLoveBlueprintProps) => {
  console.log('MinimalLoveBlueprint rendering with:', { archetype, customerName });
  
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.title}>MINIMAL TEST DOCUMENT</Text>
          <Text style={styles.subtitle}>This is page 1</Text>
          <Text style={styles.text}>
            This is a minimal test document to verify PDF generation is working correctly.
            The text on this page should be visible in the PDF.
          </Text>
          <Text style={styles.text}>
            Archetype: {archetype?.name || 'No archetype provided'}
          </Text>
          <Text style={styles.text}>
            Customer: {customerName || 'No customer name provided'}
          </Text>
        </View>
        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
          `${pageNumber} / ${totalPages}`
        )} fixed />
      </Page>
      
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.title}>PAGE 2 TEST</Text>
          <Text style={styles.subtitle}>This is page 2</Text>
          <Text style={styles.text}>
            This is the second page of the test document.
            If you can see this text, then page 2 is rendering correctly.
          </Text>
          <Text style={styles.text}>
            This page should NOT be blank.
          </Text>
        </View>
        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
          `${pageNumber} / ${totalPages}`
        )} fixed />
      </Page>
      
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.title}>COUPLES CTA TEST</Text>
          <Text style={styles.subtitle}>This is page 3 with Couples CTA</Text>
          <View style={{ backgroundColor: '#f0e6ff', padding: 10, marginBottom: 10, borderRadius: 5 }}>
            <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#553c9a', marginBottom: 5 }}>
              Want to compare with your partner?
            </Text>
            <Text style={{ fontSize: 12, color: '#553c9a' }}>
              Try Couples Mode to discover how your archetypes interact and get personalized insights for your relationship.
            </Text>
          </View>
        </View>
        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
          `${pageNumber} / ${totalPages}`
        )} fixed />
      </Page>
      
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.title}>COMPATIBILITY RADAR TEST</Text>
          <Text style={styles.subtitle}>This is page 4 with Compatibility Radar</Text>
          <Text style={styles.text}>
            This page would normally contain the compatibility radar visualization.
            For this test, we're just showing text to verify the page renders.
          </Text>
          <View style={{ backgroundColor: '#e6f7ff', padding: 10, marginBottom: 10, borderRadius: 5 }}>
            <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#0066cc', marginBottom: 5 }}>
              Compatibility Radar
            </Text>
            <Text style={{ fontSize: 12, color: '#0066cc' }}>
              Your compatibility with other archetypes would be shown here.
            </Text>
          </View>
        </View>
        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
          `${pageNumber} / ${totalPages}`
        )} fixed />
      </Page>
    </Document>
  );
};

export default MinimalLoveBlueprint;

