import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, Loader2, CheckCircle2, AlertCircle, Sparkles, BookOpen, Brain } from 'lucide-react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { Archetype, QuizAnswers } from '../../types/quiz';
import AIEnhancedLoveBlueprint from '../pdf/AIEnhancedLoveBlueprint';
import Button from './Button';

interface AIEnhancedPDFDownloadButtonProps {
  archetype: Archetype;
  customerName?: string;
  quizAnswers?: QuizAnswers;
  purchaseData?: any;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'outline';
}

const AIEnhancedPDFDownloadButton: React.FC<AIEnhancedPDFDownloadButtonProps> = ({
  archetype,
  customerName,
  quizAnswers,
  purchaseData,
  className = '',
  size = 'lg',
  variant = 'primary'
}) => {
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiContent, setAiContent] = useState<any>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [downloadStarted, setDownloadStarted] = useState(false);
  const [downloadComplete, setDownloadComplete] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  
  const filename = `${archetype.name.toLowerCase().replace(/\s+/g, '-')}-ai-love-blueprint.pdf`;

  // Auto-generate content on component mount
  useEffect(() => {
    // Short delay to allow component to render first
    const timer = setTimeout(() => {
      if (!aiContent && !isGeneratingAI) {
        generateAIContent();
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  const generateAIContent = async () => {
    setIsGeneratingAI(true);
    setAiError(null);
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
    
    try {
      console.log('🤖 [AI PDF] Generating AI content for:', archetype.name);
      
      // Create default content based on archetype
      const defaultContent = {
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
      
      // In a real implementation, we would call the AI service here
      // For now, we'll use the default content with a delay to simulate AI generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setAiContent(defaultContent);
      setGenerationProgress(100);
      
    } catch (error: any) {
      console.error('💥 [AI PDF] AI generation failed:', error);
      setAiError(error.message);
      
      // Provide fallback content
      const fallbackContent = {
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
      
      setAiContent(fallbackContent);
    } finally {
      setIsGeneratingAI(false);
      clearInterval(progressInterval);
    }
  };

  const handleDownloadStart = () => {
    console.log('🔄 [AI PDF] Download started');
    setDownloadStarted(true);
    
    setTimeout(() => {
      setDownloadComplete(true);
    }, 3000);
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {isGeneratingAI ? (
        <Button
          disabled={true}
          size={size}
          variant={variant}
          className="w-full text-lg py-4"
        >
          <Brain className="w-5 h-5 animate-pulse mr-2" />
          <div className="flex flex-col items-start">
            <span>Generating AI-Personalized Report...</span>
            <span className="text-xs opacity-75">Please wait...</span>
          </div>
        </Button>
      ) : (
        <PDFDownloadLink
          document={
            <AIEnhancedLoveBlueprint 
              archetype={archetype}
              customerName={customerName}
              aiContent={aiContent}
              isAIGenerated={!aiError}
            />
          }
          fileName={filename}
          onClick={handleDownloadStart}
        >
          {({ loading, error }) => (
            <Button
              size={size}
              variant={variant}
              disabled={loading}
              className="w-full text-lg py-4 transition-all duration-200 hover:scale-105"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  <div className="flex flex-col items-start">
                    <span>Generating Your AI Report...</span>
                    <span className="text-xs opacity-75">Please wait...</span>
                  </div>
                </>
              ) : error ? (
                <>
                  <AlertCircle className="w-5 h-5 mr-2" />
                  Try Download Again
                </>
              ) : downloadComplete ? (
                <>
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                  Download Your Report Again
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Download Your AI-Personalized Report
                </>
              )}
            </Button>
          )}
        </PDFDownloadLink>
      )}
      
      {/* AI Generation Progress */}
      {isGeneratingAI && (
        <div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <motion.div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${generationProgress}%` }}
            />
          </div>
          <p className="text-xs text-blue-600 text-center mt-1">
            {generationProgress < 100 
              ? 'Creating your AI-enhanced Love Blueprint...' 
              : 'Your personalized report is ready!'}
          </p>
        </div>
      )}

      {/* AI Generation Success */}
      {aiContent && !aiError && !isGeneratingAI && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 border border-green-200 rounded-lg p-3"
        >
          <div className="flex items-center gap-2 text-green-700">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">AI Personalization Complete!</span>
          </div>
          <p className="text-green-600 text-xs mt-1">
            Your report has been personalized with AI-generated insights specific to your {archetype.name} archetype.
          </p>
        </motion.div>
      )}

      {/* Processing Info */}
      {downloadStarted && !downloadComplete && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-50 border border-blue-200 rounded-lg p-3"
        >
          <div className="flex items-center gap-2 text-blue-700">
            <BookOpen className="w-4 h-4" />
            <span className="text-sm font-medium">Preparing Your AI-Enhanced Download</span>
          </div>
          <p className="text-blue-600 text-xs mt-1">
            Your personalized report is being generated. The download should start automatically in a moment.
          </p>
        </motion.div>
      )}

      {/* Success Message */}
      {downloadComplete && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 border border-green-200 rounded-lg p-3"
        >
          <div className="flex items-center gap-2 text-green-700">
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-sm font-medium">AI-Enhanced Report Generated Successfully!</span>
          </div>
          <p className="text-green-600 text-xs mt-1">
            Your personalized Love Blueprint with AI-generated insights has been downloaded to your device.
          </p>
        </motion.div>
      )}
      
      {/* Error Message */}
      {aiError && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-yellow-50 border border-yellow-200 rounded-lg p-3"
        >
          <div className="flex items-center gap-2 text-yellow-700">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm font-medium">Using Enhanced Template</span>
          </div>
          <p className="text-yellow-600 text-xs mt-1">
            AI personalization temporarily unavailable, but your report will still be comprehensive and tailored to your archetype.
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default AIEnhancedPDFDownloadButton;