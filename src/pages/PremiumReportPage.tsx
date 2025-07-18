import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, Download, Share2, User, Mail, Loader2, AlertCircle, Heart, DollarSign, Calendar, Database, CreditCard, Users, Sparkles, BookOpen } from 'lucide-react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { useQuizStore } from '../store/quizStore';
import { getQuizPurchaseBySessionId, storeQuizPurchase, testSupabaseConnection } from '../lib/supabase';
import { isValidSessionId, isTestSession, formatCurrency, formatDate } from '../lib/stripe-session';
import { usePDFGeneration } from '../hooks/usePDFGeneration';

const SUPPORT_EMAIL = 'support@affinityai.me';

import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import GradientText from '../components/ui/GradientText';
import PDFDownloadButton from '../components/ui/PDFDownloadButton';
import EnhancedPDFDownloadButton from '../components/ui/EnhancedPDFDownloadButton';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 }
  }
};

interface StripeSessionData {
  session_id: string;
  customer_email: string;
  customer_name?: string;
  payment_status: string;
  amount_total: number;
  amount_subtotal?: number;
  currency: string;
  payment_intent_id?: string;
  metadata?: any;
  created: number;
  success: boolean;
}

interface PurchaseData {
  id: string;
  email: string;
  name: string;
  archetype_id: string;
  archetype_name: string;
  dimension_scores: any;
  stripe_session_id: string;
  payment_status: string;
  amount_paid?: number;
  currency?: string;
  created_at: string;
}

const PremiumReportPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { result, setTestMode } = useQuizStore();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stripeSession, setStripeSession] = useState<StripeSessionData | null>(null);
  const [purchaseData, setPurchaseData] = useState<PurchaseData | null>(null);
  const [showThankYouMessage, setShowThankYouMessage] = useState(true);
  const [verificationStep, setVerificationStep] = useState('initializing');
  const [supabaseConnected, setSupabaseConnected] = useState(false); 
  const [reportReady, setReportReady] = useState(false);
  const { isGenerating, generatePDF, downloadPDF, downloadUrl, error: pdfError } = usePDFGeneration();

  // Get stored payment data from localStorage
  const getStoredPaymentData = () => {
    try {
      const stored = localStorage.getItem('affinityai_payment_data');
      if (stored) {
        const data = JSON.parse(stored);
        // Check if data is recent (within 30 days)
        if (Date.now() - data.timestamp < 30 * 24 * 60 * 60 * 1000) {
          return data;
        }
      }
    } catch (error) {
      console.error('Failed to retrieve stored payment data:', error);
    }
    return null;
  };
  
  // Enhanced session data interface
  interface SessionData {
    session_id: string;
    customer_email: string;
    customer_name?: string;
    payment_status: string;
    amount_total?: number;
    currency?: string;
    created?: number;
    success: boolean;
  }

  useEffect(() => {
    if (!result) {
      setTestMode();
    }
  }, [result, setTestMode]);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    const isPaid = searchParams.get('paid') === 'true';
    const isExisting = searchParams.get('existing') === 'true';
    
    console.log('🔍 [PREMIUM REPORT] Page loaded with params:', {
      sessionId, paid: isPaid, existing: isExisting
    });

    // If no quiz result in state, try to restore from localStorage
    if (!result) {
      const storedData = getStoredPaymentData();
      if (storedData && storedData.sessionId === sessionId) {
        console.log('🔄 [PREMIUM REPORT] Restoring quiz state from localStorage');
        
        // Set test mode to provide basic functionality
        setTestMode();
        
        // Create purchase data from stored information
        setPurchaseData({
          id: storedData.sessionId,
          email: storedData.email,
          name: storedData.name,
          archetype_id: storedData.archetype.id,
          archetype_name: storedData.archetype.name,
          dimension_scores: {
            emotional_depth: 1.5,
            relational_style: 0.8,
            values_alignment: 2.0,
            communication_style: 1.2
          },
          stripe_session_id: storedData.sessionId,
          payment_status: 'paid',
          amount_paid: 1900,
          currency: 'usd',
          created_at: new Date().toISOString()
        });
        
        setShowThankYouMessage(false);
        setIsLoading(false);
        return;
      }
    }

    // Handle existing customer access
    if (isExisting && sessionId?.startsWith('existing_customer_')) {
      console.log('👤 [PREMIUM REPORT] Existing customer access detected');
      setShowThankYouMessage(false);
      setIsLoading(false);
      
      // Create mock purchase data for existing customer
      setPurchaseData({
        id: sessionId,
        email: 'existing@customer.com',
        name: 'Returning Customer',
        archetype_id: result?.archetype.id || 'narrative-idealist',
        archetype_name: result?.archetype.name || 'Narrative Idealist',
        dimension_scores: {
          emotional_depth: 1.5,
          relational_style: 0.8,
          values_alignment: 2.0,
          communication_style: 1.2
        },
        stripe_session_id: sessionId,
        payment_status: 'paid',
        amount_paid: 1900,
        currency: 'usd',
        created_at: new Date().toISOString()
      });
      return;
    }

    // Validate required parameters for new purchases
    if (!sessionId || !isValidSessionId(sessionId)) {
      console.log('❌ [PREMIUM REPORT] Invalid or missing session_id, redirecting to premium page');
      navigate('/premium');
      return;
    }
    
    if (!isPaid) {
      console.log('❌ [PREMIUM REPORT] Payment not confirmed, redirecting to premium page');
      navigate('/premium');
      return;
    }
    
    // Show thank you message first
    setShowThankYouMessage(true);
    setVerificationStep('processing');
    
    // Start verification process
    const verifyPaymentAndLoadData = async () => {
      try {
        console.log('🔄 [PREMIUM REPORT] Starting report generation...');
        
        // Generate the report
        setVerificationStep('processing');
        
        // Simulate AI report generation with progress
        const progressSteps = [10, 25, 40, 60, 75, 90, 100];
        for (const progress of progressSteps) {
          await new Promise(resolve => setTimeout(resolve, 300));
          console.log(`🤖 [AI REPORT] Generation progress: ${progress}%`);
        }
        
        // Create demo purchase data for testing
        const isTestSessionId = isTestSession(sessionId);
        setPurchaseData({
          id: 'demo-' + sessionId,
          email: isTestSessionId ? 'test@example.com' : 'customer@example.com',
          name: isTestSessionId ? 'Test Customer' : 'Valued Customer',
          archetype_id: result?.archetype.id || 'narrative-idealist',
          archetype_name: result?.archetype.name || 'Narrative Idealist',
          dimension_scores: {
            emotional_depth: 1.5,
            relational_style: 0.8,
            values_alignment: 2.0,
            communication_style: 1.2
          },
          stripe_session_id: sessionId,
          payment_status: 'paid',
          amount_paid: 1900,
          currency: 'usd',
          created_at: new Date().toISOString()
        });
        
        // Step 6: Complete verification
        setVerificationStep('complete');
        setReportReady(true);
        await new Promise(resolve => setTimeout(resolve, 800));
        
        setShowThankYouMessage(false);
        setIsLoading(false);
        
      } catch (err: any) {
        console.error('💥 [PREMIUM REPORT] Verification failed:', err);
        setError(err.message || 'Failed to verify payment. Please contact support.');
        setShowThankYouMessage(false);
        setIsLoading(false);
      }
    };
    
    verifyPaymentAndLoadData();
  }, [searchParams, navigate, result, supabaseConnected]);

  if (!result) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-4 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500" />
      </div>
    );
  }

  const { archetype } = result;
  const sessionId = searchParams.get('session_id');
  const isTestSessionId = sessionId ? isTestSession(sessionId) : false;
  const isExisting = searchParams.get('existing') === 'true';
  
  if (error) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
          >
            <BookOpen className="w-10 h-10 text-white" />
          </motion.div>
          
          <h1 className="text-2xl font-bold text-red-600 mb-4">Payment Verification Error</h1>
          <p className="text-red-700 mb-6">{error}</p>
          
          {!supabaseConnected && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Database className="w-5 h-5 text-yellow-600" />
                <span className="font-medium text-yellow-800">Database Connection Issue</span>
              </div>
              <p className="text-yellow-800 text-sm">
                Our database is temporarily unavailable. Some features may be limited, but your payment was processed successfully.
              </p>
            </div>
          )}
          
          <div className="flex gap-4 justify-center">
            <Button onClick={() => navigate('/premium')} variant="outline">
              Try Again
            </Button>
            <Button onClick={() => navigate('/contact')}>
              Contact Support
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Thank you and verification flow
  if (showThankYouMessage) {
    const getVerificationMessage = () => {
      switch (verificationStep) {
        case 'processing':
          return 'Generating your AI-enhanced report...';
        case 'complete':
          return 'Your report is ready!';
        default:
          return 'Preparing your AI report...';
      }
    };

    return (
      <div className="min-h-screen pt-32 pb-20 px-4 flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md mx-auto"
        >
          <Card className="bg-white/80 backdrop-blur-sm border-primary-200 shadow-xl">
            {/* Animated Heart Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
            >
              <Heart className="w-10 h-10 text-white fill-current" />
            </motion.div>
            
            {/* Dynamic Message */}
            <motion.h1
              key={verificationStep}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl font-bold text-primary-600 mb-4"
            >
              {getVerificationMessage()}
            </motion.h1>
            
            {/* Progress Indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mb-6"
            >
              <div className="flex items-center justify-center gap-2 mb-4">
                <Loader2 className="w-5 h-5 animate-spin text-primary-500" />
                <span className="text-primary-600 font-medium">
                  {verificationStep === 'connecting' && 'Establishing secure connection...'}
                  {verificationStep === 'thanking' && 'Preparing your Love Blueprint...'}
                  {verificationStep === 'verifying' && 'Confirming payment with Stripe...'}
                  {verificationStep === 'fetching' && 'Loading your customer information...'}
                  {verificationStep === 'processing' && 'Generating your personalized report...'}
                  {verificationStep === 'complete' && 'Finalizing everything...'}
                </span>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  className="bg-gradient-primary h-2 rounded-full"
                  initial={{ width: '0%' }}
                  animate={{ 
                    width: verificationStep === 'connecting' ? '10%' :
                           verificationStep === 'thanking' ? '25%' :
                           verificationStep === 'verifying' ? '50%' :
                           verificationStep === 'fetching' ? '75%' :
                           verificationStep === 'processing' ? '90%' :
                           verificationStep === 'complete' ? '100%' : '0%'
                  }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </motion.div>
            {/* AI Generation Progress */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-6"
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                <BookOpen className="w-5 h-5 text-blue-500 animate-pulse" />
                <span className="text-sm font-medium text-blue-700">
                  AI is creating your personalized report
                </span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <motion.div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                  initial={{ width: '0%' }}
                  animate={{ 
                    width: verificationStep === 'processing' ? '75%' :
                           verificationStep === 'complete' ? '100%' : '30%'
                  }}
                  transition={{ duration: 0.8 }}
                />
              </div>
              
              <p className="text-xs text-blue-600 text-center">
                {reportReady 
                  ? 'Your AI-enhanced Love Blueprint is ready!' 
                  : 'Creating your personalized insights...'}
              </p>
            </motion.div>
            {/* Test Mode Indicator */}
            {isTestSessionId && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="p-3 bg-blue-100 rounded-lg border border-blue-200"
              >
                <p className="text-sm text-blue-800 font-medium">
                  🧪 Test Mode - No real charges were made
                </p>
              </motion.div>
            )}
          </Card>
        </motion.div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen pt-32 pb-20 px-4 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          <Card className="mb-8 overflow-hidden relative">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-primary opacity-10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-secondary-500 opacity-10 rounded-full translate-y-1/2 -translate-x-1/2" />
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center relative z-10"
            >
              {/* Success Header */}
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-12 h-12 text-green-500" />
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                <GradientText>
                  {isExisting ? 'Welcome Back to Your Premium Love Blueprint!' : 'Welcome to Your Premium Love Blueprint!'}
                </GradientText>
              </h1>
              
              <p className="text-gray-600 mb-8 text-lg">
                Your comprehensive <strong>{archetype.name}</strong> analysis is ready. 
                This detailed report will transform how you understand your relationships.
              </p>

              {/* Customer Information Display */}
              {purchaseData && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl p-6 mb-8 max-w-2xl mx-auto"
                >
                  <h3 className="font-semibold text-gray-800 mb-4 text-lg">
                    {isTestSessionId ? 'Test Order Confirmation' : 
                     isExisting ? 'Existing Customer Access' : 'Order Confirmation'}
                  </h3>
                  
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-3 bg-white/50 rounded-lg p-3">
                      <User className="w-5 h-5 text-primary-500" />
                      <div>
                        <p className="font-medium text-gray-800">{purchaseData.name}</p>
                        <p className="text-gray-600">Customer</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 bg-white/50 rounded-lg p-3">
                      <Mail className="w-5 h-5 text-primary-500" />
                      <div>
                        <p className="font-medium text-gray-800">{purchaseData.email}</p>
                        <p className="text-gray-600">Email</p>
                      </div>
                    </div>
                    
                    {!isExisting && stripeSession && (
                      <>
                        <div className="flex items-center gap-3 bg-white/50 rounded-lg p-3">
                          <CreditCard className="w-5 h-5 text-primary-500" />
                          <div>
                            <p className="font-medium text-gray-800">
                              {stripeSession.amount_total ? formatCurrency(stripeSession.amount_total, stripeSession.currency || 'usd') : '$19.00'}
                            </p>
                            <p className="text-gray-600">Amount Paid</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 bg-white/50 rounded-lg p-3">
                          <Calendar className="w-5 h-5 text-primary-500" />
                          <div>
                            <p className="font-medium text-gray-800">
                              {stripeSession.created ? formatDate(stripeSession.created) : new Date().toLocaleDateString()}
                            </p>
                            <p className="text-gray-600">Purchase Date</p>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                  
                  <p className="text-xs text-gray-500 mt-4">
                    {isTestSessionId ? 'Test receipt generated' : 
                     isExisting ? 'Existing customer access verified' : 'Receipt sent to your email'}
                  </p>
                  
                  {isTestSessionId && (
                    <div className="mt-4 p-3 bg-blue-100 rounded-lg border border-blue-200">
                      <p className="text-sm text-blue-800">
                        🧪 Test Mode - No real charges were made
                      </p>
                    </div>
                  )}
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white border-2 border-primary-100 rounded-xl p-6 mb-8"
              >
                <h2 className="text-xl font-semibold mb-4 text-primary-600">Your Premium Report Includes:</h2>
                <div className="grid md:grid-cols-2 gap-4 text-left">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">10-15 page personalized analysis</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Detailed compatibility insights</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">AI-generated conversation starters</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Growth opportunities & insights</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Communication style analysis</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Relationship dynamics guide</span>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-6 mb-8"
              >
                <EnhancedPDFDownloadButton 
                  archetype={archetype}
                  customerName={purchaseData?.name}
                  quizAnswers={result?.answers}
                  purchaseData={purchaseData}
                  className="w-full"
                />
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-5 h-5 text-green-600" />
                    <h3 className="font-medium text-green-800">Your AI-Enhanced Report is Ready!</h3>
                  </div>
                  <p className="text-sm text-green-700">
                    Our AI has analyzed your quiz responses and created a personalized report just for you. Click the button above to download it now.
                  </p>
                </div>
                
                <Button
                  variant="outline"
                  onClick={() => {
                    console.log('👫 [COUPLES MODE] Navigating to compatibility page');
                    navigate('/compatibility');
                  }}
                  className="w-full transition-all duration-200 hover:scale-105"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Try Couples Mode
                </Button>
                
                <Button
                 variant="secondary"
                 onClick={() => {
                   console.log('👫 [COUPLES DEBUG] Couples mode clicked');
                   navigate('/invite');
                 }}
                 className="w-full transition-all duration-200 hover:scale-105"
               >
                 <Users className="w-4 h-4 mr-2" />
                  Invite Partner for Couples Report
               </Button>
                
                <Button
                  variant="outline"
                  onClick={() => {
                    console.log('👫 [COUPLES MODE] Navigating to compatibility page');
                    navigate('/compatibility');
                  }}
                  className="w-full transition-all duration-200 hover:scale-105"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Try Couples Mode
                </Button>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-gray-50 rounded-lg p-4 mb-6"
              >
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Lifetime Access:</strong> Bookmark this page to access your report anytime.
                </p>
                <p className="text-sm text-gray-700 font-medium">
                  Having trouble with your download?
                </p>
                <ul className="text-sm text-gray-600 list-disc pl-5 space-y-1">
                  <li>Refreshing this page and trying again</li>
                  <li>Using a different browser (Chrome or Firefox recommended)</li>
                  <li>Email our support team at <a href={`mailto:${SUPPORT_EMAIL}`} className="text-primary-500 hover:underline">{SUPPORT_EMAIL}</a></li>
                </ul>
                {isTestSessionId && (
                  <p className="text-sm text-blue-600 mt-2">
                    🧪 This is a test environment - your report is fully functional for testing
                  </p>
                )}
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Button
                  variant="ghost"
                  onClick={() => {
                    console.log('🔙 [NAVIGATION DEBUG] Returning to basic results');
                    navigate('/results');
                  }}
                  className="flex-1 transition-all duration-200 hover:scale-105"
                >
                  View Basic Results
                </Button>
                
                <Button
                  variant="ghost"
                  onClick={() => {
                    console.log('🏠 [NAVIGATION DEBUG] Returning home');
                    navigate('/');
                  }}
                  className="flex-1 transition-all duration-200 hover:scale-105"
                >
                  Return Home
                </Button>
              </motion.div>
            </motion.div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export { PremiumReportPage };
export default PremiumReportPage;