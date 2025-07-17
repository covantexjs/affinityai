import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FileText,
  Users, 
  MessageSquare, 
  CheckCircle2, 
  ArrowLeft, 
  Lock,
  Loader2,
  Download,
  Clock,
  Shield,
  CreditCard
} from 'lucide-react';
import { useQuizStore } from '../../store/quizStore';
import { products } from '../../stripe-config';
import { isSupabaseReady } from '../../lib/supabase';

const SUPPORT_EMAIL = 'support@affinityai.me';

import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import GradientText from '../../components/ui/GradientText';
import PremiumCheckoutButton from '../../components/ui/PremiumCheckoutButton';
import SampleLoveBlueprint from '../../components/pdf/SampleLoveBlueprint'; 

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
    },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const PremiumPage = () => {
  const navigate = useNavigate();
  const { result, setTestMode } = useQuizStore();
  const [showPreview, setShowPreview] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [supabaseStatus, setSupabaseStatus] = useState<boolean>(false);
  
  useEffect(() => {
    if (!result) {
      setTestMode();
    }
    
    // Check Supabase status
    setSupabaseStatus(isSupabaseReady());
  }, [result, setTestMode]);
  
  if (!result) {
    return null;
  }
  
  const { archetype } = result;
  const product = products[0];

  const showTemporarySuccess = (message: string) => {
    console.log(`✅ [SUCCESS] ${message}`);
    setShowSuccessMessage(true);
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 2000);
  };

  const handlePreview = () => {
    console.log('👁️ [PREVIEW DEBUG] Preview initiated');
    setShowPreview(true);
    showTemporarySuccess('Preview ready!');
  };

  const simulateSuccessfulPayment = () => {
    console.log('🎭 [SIMULATION DEBUG] Simulating successful payment...');
    
    setTimeout(() => {
      const mockSessionId = 'cs_test_' + Math.random().toString(36).substr(2, 9);
      const successUrl = `/premium-report?session_id=${mockSessionId}&paid=true`;
      
      console.log('🎭 [SIMULATION DEBUG] Redirecting to:', successUrl);
      showTemporarySuccess('Payment simulation complete!');
      
      setTimeout(() => {
        navigate(successUrl);
      }, 1000);
    }, 1500);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="text-center mb-10"
        >
          <motion.div variants={fadeIn}>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Unlock Your Complete <GradientText>Love Blueprint</GradientText>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Get a comprehensive report with personalized insights to transform your relationships
            </p>
          </motion.div>
        </motion.div>

        {showSuccessMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6"
          >
            <Card className="bg-green-50 border-green-200">
              <div className="flex items-center justify-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-green-500" />
                <span className="text-green-800 font-medium">Success! Processing your request...</span>
              </div>
            </Card>
          </motion.div>
        )}

        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div variants={fadeIn}>
            <Card className="mb-8">
              {/* Product Header - Above Purple Section */}
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-4">Affinity AI Premium Love Blueprint</h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Unlock your complete romantic archetype analysis with a comprehensive 10-15 page personalized report. 
                  Includes detailed insights into your relationship patterns, communication style, and growth opportunities.
                </p>
                <p className="text-sm text-primary-600 mt-2">
                  <span className="font-medium">NEW!</span> Invite your partner to take the quiz and get a <span className="font-medium">free Couples Compatibility Report</span>
                </p>
              </div>
                <p className="text-sm text-primary-600 mt-2">
                  <span className="font-medium">NEW!</span> Invite your partner to take the quiz and get a <span className="font-medium">free Couples Compatibility Report</span>
                </p>
              
              <h2 className="text-2xl font-bold mb-6">Your Premium Report Includes:</h2>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <FileText className="w-8 h-8 text-primary-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">AI-Generated Personalized Report</h3>
                    <p className="text-gray-600">
                      AI analyzes your quiz responses to create a truly personalized 10-15 page report with insights specific to your {archetype.name} archetype, communication patterns, and growth areas.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <MessageSquare className="w-8 h-8 text-primary-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">AI-Generated Conversation Starters</h3>
                    <p className="text-gray-600">
                      Personalized conversation prompts created by AI based on your communication style and relationship goals.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <Users className="w-8 h-8 text-primary-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Personalized Action Plan</h3>
                    <p className="text-gray-600">
                      AI creates a custom roadmap for your relationship growth with specific weekly, monthly, and long-term goals.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 relative">
                <div className="bg-gray-50 p-4 rounded-lg text-gray-700 text-sm">
                  <p>Your {archetype.name} archetype reveals a natural tendency toward deep emotional processing and meaningful connection. Unlike other archetypes, you approach relationships with a blend of...</p>
                  <div className="mt-4">
                    <h4 className="font-semibold">AI-Generated Insights Preview:</h4>
                    <ul className="mt-2 space-y-1">
                      <li>• Personalized communication strategies based on your responses...</li>
                      <li>• Custom relationship advice tailored to your specific patterns...</li>
                      <li>• AI-generated action steps for your unique situation...</li>
                    </ul>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
          
          <motion.div variants={fadeIn}>
            {/* Features Card */}
            <Card className="mb-8">
              <div className="grid md:grid-cols-3 gap-6 mb-6">
                <div className="bg-gradient-to-br from-primary-50 to-primary-100 p-6 rounded-lg shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <CheckCircle2 className="w-5 h-5 text-primary-500" />
                    <h3 className="font-semibold">One-time Purchase</h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    Pay once and get lifetime access to your premium report. No subscriptions or hidden fees.
                  </p>
                </div>
                <div className="bg-gradient-to-br from-primary-50 to-primary-100 p-6 rounded-lg shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <CheckCircle2 className="w-5 h-5 text-primary-500" />
                    <h3 className="font-semibold">Instant Delivery</h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    Get your comprehensive report immediately after purchase. Download and access anytime.
                  </p>
                </div>
                <div className="bg-gradient-to-br from-primary-50 to-primary-100 p-6 rounded-lg shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <Shield className="w-5 h-5 text-primary-500" />
                    <h3 className="font-semibold">Money-back Guarantee</h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    30-day satisfaction guarantee. Contact <a href="mailto:support@affinityai.me" className="text-primary-500 hover:underline">support@affinityai.me</a> if you're not satisfied.
                  </p>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border border-blue-100">
                <h3 className="text-lg font-semibold text-center mb-4">What's Included in Your AI-Enhanced Premium Report</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 mb-1">AI-Personalized 15-Page Report</p>
                      <p className="text-sm text-gray-600">AI analyzes your responses to create unique insights about your relationship patterns and growth areas</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                      <MessageSquare className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 mb-1">AI-Generated Conversation Starters</p>
                      <p className="text-sm text-gray-600">Personalized questions created specifically for your communication style</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0">
                      <Users className="w-4 h-4 text-pink-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 mb-1">Personalized Compatibility Insights</p>
                      <p className="text-sm text-gray-600">AI-enhanced analysis of how you connect with different personality types</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 mb-1">AI-Created Action Plan</p>
                      <p className="text-sm text-gray-600">Custom weekly, monthly, and long-term goals generated specifically for you</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
            
            {/* Checkout Card */}
            <Card className="bg-gradient-primary text-white">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold">AI-Enhanced Love Blueprint</h3>
                <div className="text-3xl font-bold my-2">$19</div>
                <p className="text-sm opacity-90">Instant access • AI-Personalized • One-time payment</p>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-800 text-center">
                  <BookOpen className="w-4 h-4 inline mr-1" />
                  <span className="font-medium">Your report will be generated immediately after payment</span>
                </p>
              </div>
              
              <div className="max-w-xl mx-auto">
                <PremiumCheckoutButton variant="primary" />
              </div>
            </Card>
          </motion.div>
          
          {/* Sample Report Section - Below Purple Section */}
          <motion.div variants={fadeIn}>
            <Card className="text-center">
              <h3 className="text-xl font-semibold mb-4">Want to preview your report?</h3>
              <p className="text-gray-600 mb-6">
                Download a sample report to see the depth and quality of insights you'll receive.
              </p>
              
              <div className="max-w-md mx-auto">
                {!showPreview && (
                  <Button
                    variant="secondary"
                    className="w-full"
                    onClick={handlePreview}
                  >
                    Get Sample Report
                  </Button>
                )}

                {showPreview && (
                  <PDFDownloadLink
                    document={<SampleLoveBlueprint />}
                    fileName={`${archetype.name.toLowerCase().replace(/\s+/g, '-')}-sample-report.pdf`}
                  >
                    {({ loading, error }) => (
                      <Button
                        variant="secondary"
                        className="w-full"
                        disabled={loading}
                        onClick={() => {
                          if (error) {
                            console.error('📥 [SAMPLE PDF] Generation error:', error);
                            showTemporarySuccess('PDF generation failed - please try again');
                          }
                        }}
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin mr-2" />
                            Preparing Sample...
                          </>
                        ) : error ? (
                          <>
                            <AlertCircle className="w-5 h-5 mr-2" />
                            Try Again
                          </>
                        ) : (
                          <>
                            <Download className="w-5 h-5 mr-2" />
                            Download Sample Report
                          </>
                        )}
                      </Button>
                    )}
                  </PDFDownloadLink>
                )}
              </div>
            </Card>
            
            {/* Testing Tools (only visible in development) */}
            {window.location.hostname === 'localhost' && (
              <Card className="mt-4 p-4 border-2 border-yellow-200 bg-yellow-50">
                <h3 className="text-sm font-semibold text-yellow-800 mb-2">Development Testing Tools</h3>
                <div className="flex flex-col gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={simulateSuccessfulPayment}
                    className="text-xs"
                  >
                    Simulate Successful Payment
                  </Button>
                  <div className="text-xs text-yellow-700">
                    Supabase Status: {supabaseStatus ? 'Connected' : 'Not Connected'}
                  </div>
                </div>
              </Card>
            )}
          </motion.div>
          
          <motion.div variants={fadeIn}>
            <div className="flex justify-center mt-8">
              <Button
                variant="ghost"
                onClick={() => navigate('/results')}
                className="flex items-center"
              >
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to My Results
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export { PremiumPage };
export default PremiumPage;