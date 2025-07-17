import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Download, BookOpen, Sparkles, User, Mail, Loader2, ArrowLeft, ArrowRight, RefreshCw } from 'lucide-react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import EnhancedLoveBlueprint from './components/pdf/EnhancedLoveBlueprint';
import AIEnhancedLoveBlueprint from './components/pdf/AIEnhancedLoveBlueprint';
import Button from './components/ui/Button';
import Card from './components/ui/Card';
import { archetypes } from './data/archetypes';

const TestApp = () => {
  const [step, setStep] = useState<'intro' | 'report' | 'download'>('intro');
  const [isLoading, setIsLoading] = useState(false);
  const [customerName, setCustomerName] = useState('Test User');
  const [customerEmail, setCustomerEmail] = useState('test@example.com');
  const [downloadStarted, setDownloadStarted] = useState(false);
  const [downloadComplete, setDownloadComplete] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [aiContent, setAiContent] = useState<any>(null);
  const [currentArchetypeIndex, setCurrentArchetypeIndex] = useState(0);
  
  // Get the current archetype
  const archetype = archetypes[currentArchetypeIndex];
  
  // Function to go to the next archetype
  const nextArchetype = () => {
    setCurrentArchetypeIndex((prevIndex) => (prevIndex + 1) % archetypes.length);
    // Reset AI content when changing archetypes
    setAiContent(null);
    setGenerationProgress(0);
    setDownloadStarted(false);
    setDownloadComplete(false);
  };
  
  // Function to go to the previous archetype
  const prevArchetype = () => {
    setCurrentArchetypeIndex((prevIndex) => (prevIndex - 1 + archetypes.length) % archetypes.length);
    // Reset AI content when changing archetypes
    setAiContent(null);
    setGenerationProgress(0);
    setDownloadStarted(false);
    setDownloadComplete(false);
  };
  
  // Simulate AI content generation
  const generateAIContent = () => {
    setIsGeneratingAI(true);
    setGenerationProgress(0);
    
    // Simulate progress updates
    const progressInterval = setInterval(() => {
      setGenerationProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + 10;
      });
    }, 500);
    
    // Simulate AI generation with a delay
    setTimeout(() => {
      setAiContent({
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
      });
      setIsGeneratingAI(false);
      setGenerationProgress(100);
      clearInterval(progressInterval);
    }, 2000);
  };
  
  // Simulate payment processing
  const handlePayment = () => {
    setIsLoading(true);
    
    // Simulate payment processing with a delay
    setTimeout(() => {
      setIsLoading(false);
      setStep('report');
      // Start AI generation automatically
      generateAIContent();
    }, 1500);
  };
  
  const handleDownloadStart = () => {
    console.log('Download started');
    setDownloadStarted(true);
    
    // Reset download complete status after 3 seconds
    setTimeout(() => {
      setDownloadComplete(true);
    }, 2000);
  };
  
  // Auto-start the app in report mode
  useEffect(() => {
    setStep('report');
    generateAIContent();
  }, []);
  
  // Render different steps
  const renderStep = () => {
    switch (step) {
      case 'intro':
        return (
          <Card className="max-w-xl mx-auto">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold mb-2">Test Premium Report App</h1>
              <p className="text-gray-600">
                This is a simplified test app to debug the premium report generation flow.
              </p>
            </div>
            
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-3">Your Test Archetype:</h2>
              <div className="bg-primary-50 p-4 rounded-lg">
                <h3 className="font-bold text-primary-600">{archetype.name}</h3>
                <p className="italic text-primary-500">"{archetype.tagline}"</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {archetype.keywords.map((keyword, index) => (
                    <span key={index} className="px-2 py-1 bg-primary-100 text-primary-700 rounded-full text-xs">
                      {keyword.text} {keyword.emoji}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="space-y-4 mb-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  <User className="w-4 h-4 inline mr-1" />
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter your name"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  <Mail className="w-4 h-4 inline mr-1" />
                  Your Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter your email"
                />
              </div>
            </div>
            
            <Button 
              onClick={handlePayment} 
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Processing Payment...
                </>
              ) : (
                <>
                  Simulate Successful Payment
                </>
              )}
            </Button>
          </Card>
        );
        
      case 'report':
        return (
          <Card className="max-w-2xl mx-auto">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-500" />
              </div>
              <h1 className="text-2xl font-bold mb-2">Testing Archetype Reports</h1>
              <p className="text-gray-600 mb-4">
                Currently viewing: <span className="font-semibold text-primary-600">{archetype.name}</span>
              </p>
              
              <div className="flex justify-center gap-4 mb-6">
                <Button variant="outline" onClick={prevArchetype}>
                  <ArrowLeft className="w-4 h-4 mr-2" /> Previous Archetype
                </Button>
                <Button variant="outline" onClick={nextArchetype}>
                  Next Archetype <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
              
              <div className="bg-primary-50 p-4 rounded-lg mb-6">
                <h3 className="font-bold text-primary-600">{archetype.name}</h3>
                <p className="italic text-primary-500 mb-2">"{archetype.tagline}"</p>
                <div className="flex flex-wrap justify-center gap-2 mt-2">
                  {archetype.keywords.map((keyword, index) => (
                    <span key={index} className="px-2 py-1 bg-primary-100 text-primary-700 rounded-full text-xs">
                      {keyword.text} {keyword.emoji}
                    </span>
                  ))}
                </div>
                <p className="text-sm text-gray-600 mt-3">{archetype.description}</p>
              </div>
            </div>
            
            <div className="space-y-4 mb-6">
              {/* AI Generation Progress */}
              {isGeneratingAI && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-blue-500 animate-pulse" />
                      <span className="text-sm font-medium text-blue-700">
                        AI is creating your personalized report
                      </span>
                    </div>
                    <span className="text-xs text-blue-600">{generationProgress}%</span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <motion.div
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                      initial={{ width: '0%' }}
                      animate={{ width: `${generationProgress}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  
                  <p className="text-xs text-blue-600 text-center">
                    {generationProgress < 100 
                      ? 'Creating your AI-enhanced Love Blueprint...' 
                      : 'Your personalized report is ready!'}
                  </p>
                </div>
              )}
              
              {/* Download Buttons */}
              {aiContent && (
                <div className="space-y-4">
                  <PDFDownloadLink
                    document={<AIEnhancedLoveBlueprint archetype={archetype} customerName={customerName} aiContent={aiContent} />}
                    fileName={`${archetype.name.toLowerCase().replace(/\s+/g, '-')}-ai-love-blueprint.pdf`}
                    onClick={handleDownloadStart}
                  >
                    {({ loading, error }) => (
                      <Button
                        className="w-full"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin mr-2" />
                            Generating AI Report...
                          </>
                        ) : error ? (
                          <>
                            <AlertCircle className="w-5 h-5 mr-2" />
                            Try Again
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-5 h-5 mr-2" />
                            Download AI-Enhanced Report
                          </>
                        )}
                      </Button>
                    )}
                  </PDFDownloadLink>
                  
                  <PDFDownloadLink
                    document={<EnhancedLoveBlueprint archetype={archetype} customerName={customerName} />}
                    fileName={`${archetype.name.toLowerCase().replace(/\s+/g, '-')}-love-blueprint.pdf`}
                  >
                    {({ loading, error }) => (
                      <Button
                        variant="outline"
                        className="w-full"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin mr-2" />
                            Generating Report...
                          </>
                        ) : error ? (
                          <>
                            <AlertCircle className="w-5 h-5 mr-2" />
                            Try Again
                          </>
                        ) : (
                          <>
                            <Download className="w-5 h-5 mr-2" />
                            Download Standard Report
                          </>
                        )}
                      </Button>
                    )}
                  </PDFDownloadLink>
                </div>
              )}
              
              {/* Success Message */}
              {downloadComplete && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span className="font-medium text-green-800">Download Complete!</span>
                  </div>
                  <p className="text-sm text-green-700">
                    Your personalized Love Blueprint has been downloaded to your device.
                  </p>
                </div>
              )}
              
              {/* Regenerate Button */}
              {!isGeneratingAI && (
                <Button 
                  variant="outline"
                  onClick={generateAIContent}
                  className="w-full"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Regenerate AI Content
                </Button>
              )}
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <h3 className="font-semibold text-blue-800 mb-2">Testing Instructions</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Use the navigation buttons to cycle through all archetypes</li>
                <li>• Download both report types to compare formatting and content</li>
                <li>• Check for any formatting issues or duplicate sections</li>
                <li>• Verify that each archetype's specific details are correctly displayed</li>
              </ul>
            </div>
            
            <div className="text-center text-sm text-gray-500">
              <p>Testing {currentArchetypeIndex + 1} of {archetypes.length} archetypes</p>
              <p className="mt-1">Current archetype: {archetype.name}</p>
            </div>
          </Card>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      {renderStep()}
    </div>
  );
};

export default TestApp;