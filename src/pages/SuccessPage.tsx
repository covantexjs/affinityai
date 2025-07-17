import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, Download, Share2, User, Mail, Loader2, AlertCircle, Heart, Calendar, CreditCard, FileText, BookOpen } from 'lucide-react';
import { useQuizStore } from '../store/quizStore';
import { getQuizPurchaseBySessionId, storeQuizPurchase, testSupabaseConnection } from '../lib/supabase';
import { isValidSessionId, isTestSession, formatCurrency, formatDate } from '../lib/stripe-session';

const SUPPORT_EMAIL = 'support@affinityai.me';

import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import GradientText from '../components/ui/GradientText';
import SupabaseStatusIndicator from '../components/ui/SupabaseStatusIndicator';
import EnhancedLoveBlueprint from '../components/pdf/EnhancedLoveBlueprint';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 }
  }
};

export default function Success() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessionData, setSessionData] = useState<any>(null);
  const [supabaseConnected, setSupabaseConnected] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [reportGenerationProgress, setReportGenerationProgress] = useState(0);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { result, setTestMode } = useQuizStore();

  // Store payment data in localStorage for persistent access
  const storePaymentData = (sessionData: any, quizResult: any) => {
    const paymentData = {
      sessionId: sessionData.session_id || searchParams.get('session_id'),
      email: sessionData.customer_email || sessionData.email,
      name: sessionData.customer_name || sessionData.name,
      archetype: quizResult.archetype,
      answers: quizResult.answers,
      paymentVerified: true,
      timestamp: Date.now()
    };
    
    try {
      localStorage.setItem('affinityai_payment_data', JSON.stringify(paymentData));
      console.log('💾 [SUCCESS] Payment data stored in localStorage');
    } catch (error) {
      console.error('Failed to store payment data:', error);
    }
  };
  
  useEffect(() => {
    if (!result) {
      setTestMode();
    }
  }, [result, setTestMode]);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    
    if (!sessionId) {
      setError('No session ID found. Please contact support.');
      setIsLoading(false);
      return;
    }

    const verifyPayment = async () => {
      try {
        console.log('🔍 [SUCCESS] Verifying payment for session:', sessionId);
        
        setIsGeneratingReport(true);
        
        // Start showing report generation progress
        const progressInterval = setInterval(() => {
          setReportGenerationProgress(prev => {
            if (prev >= 90) {
              clearInterval(progressInterval);
              return prev;
            }
            return prev + 10;
          });
        }, 500);
        
        // Test Supabase connection
        const isConnected = await testSupabaseConnection();
        setSupabaseConnected(isConnected);
        
        // Fetch session data from Stripe
        const response = await fetch(`/.netlify/functions/get-session-data?session_id=${sessionId}`);
        
        if (!response.ok) {
          throw new Error('Failed to verify payment');
        }
        
        const data = await response.json();
        
        if (!data.success) {
          throw new Error(data.message || 'Payment verification failed');
        }
        
        console.log('✅ [SUCCESS] Payment verified:', data);
        setSessionData(data);
        
        // Store payment data in localStorage for persistent access
        if (result) {
          storePaymentData(data, result);
        }
        
        // Store purchase data if Supabase is connected
        if (isConnected && result) {
          try {
            await storeQuizPurchase({
              email: data.email,
              name: data.name,
              archetype_id: result.archetype.id,
              archetype_name: result.archetype.name,
              dimension_scores: {
                emotional_depth: 1.5,
                relational_style: 0.8,
                values_alignment: 2.0,
                communication_style: 1.2
              },
              stripe_session_id: sessionId,
              payment_status: 'paid',
              amount_paid: data.amount_total,
              currency: data.currency
            });
            console.log('✅ [SUCCESS] Purchase data stored in database');
          } catch (storeError) {
            console.warn('⚠️ [SUCCESS] Failed to store purchase data:', storeError);
          }
        }
        
        setReportGenerationProgress(100);
        
      } catch (err: any) {
        console.error('❌ [SUCCESS] Payment verification failed:', err);
        setError(err.message || 'Payment verification failed');
      } finally {
        setIsLoading(false);
      }
    };

    // Add a delay to show the processing state
    const timer = setTimeout(() => {
      verifyPayment();
    }, 2000);

    return () => clearTimeout(timer);
  }, [searchParams, result, supabaseConnected]);

  const goToPremiumReport = () => {
    const sessionId = searchParams.get('session_id');
    navigate(`/premium-report?session_id=${sessionId}&paid=true`);
  };

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500" />
      </div>
    );
  }

  const { archetype } = result;
  const sessionId = searchParams.get('session_id');
  const isTestSessionId = sessionId ? isTestSession(sessionId) : false;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md mx-auto"
        >
          <Card className="bg-white/90 backdrop-blur-sm border-primary-200 shadow-xl p-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
            >
              <Heart className="w-10 h-10 text-white fill-current" />
            </motion.div>
            
            <h2 className="text-2xl font-bold mb-4 text-primary-600">Processing Your Payment</h2>
            <p className="mb-6 text-gray-600">Please wait while we confirm your payment and prepare your premium report...</p>
            
            <div className="flex items-center justify-center gap-2 mb-6">
              <Loader2 className="w-5 h-5 animate-spin text-primary-500" />
              <span className="text-primary-600 font-medium">Verifying payment...</span>
            </div>
            
            {/* AI Report Generation Progress */}
            {isGeneratingReport && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-6"
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
                    animate={{ width: `${reportGenerationProgress}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                
                <p className="text-xs text-blue-600 text-center">
                  {reportGenerationProgress < 100 
                    ? 'Creating your AI-enhanced Love Blueprint...' 
                    : 'Your personalized report is ready!'}
                </p>
              </motion.div>
            )}
            
            {isTestSessionId && (
              <div className="p-3 bg-blue-100 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800 font-medium">
                  🧪 Test Mode - No real charges were made
                </p>
              </div>
            )}
          </Card>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md mx-auto"
        >
          <Card className="border-red-200 bg-red-50 p-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold mb-4 text-red-600">Something Went Wrong</h2>
            <p className="mb-6 text-red-700">{error}</p>
            
            {!supabaseConnected && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <Database className="w-5 h-5 text-yellow-600" />
                  <span className="font-medium text-yellow-800">Database Connection Issue</span>
                </div>
                <p className="text-yellow-800 text-sm">
                  Our database is temporarily unavailable, but your payment was likely processed successfully.
                </p>
              </div>
            )}
            
            <div className="flex gap-4">
              <Button 
                onClick={() => navigate('/premium')}
                variant="outline"
                className="flex-1"
              >
                Try Again
              </Button>
              <Button 
                onClick={() => navigate('/')}
                className="flex-1"
              >
                Return Home
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-lg mx-auto px-4"
      >
      <Card className="bg-white/90 backdrop-blur-sm border-primary-200 shadow-xl p-8">
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle2 className="w-12 h-12 text-green-500" />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-3xl font-bold mb-4">
              <GradientText>Payment Successful!</GradientText>
            </h2>
            <p className="text-gray-600 mb-6 text-lg">
              Thank you for your purchase. Your premium <strong>{archetype.name}</strong> Love Blueprint is now ready.
            </p>
          </motion.div>

          {/* Customer Info */}
          {sessionData && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg p-4 mb-6"
            >
              <h3 className="font-semibold text-gray-800 mb-3">
                {isTestSessionId ? 'Test Order Confirmation' : 'Order Confirmation'}
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-primary-500" />
                  <div>
                    <p className="font-medium text-gray-800">{sessionData.name}</p>
                    <p className="text-gray-600">Customer</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-primary-500" />
                  <div>
                    <p className="font-medium text-gray-800">{sessionData.email}</p>
                    <p className="text-gray-600">Email</p>
                  </div>
                </div>
                
                {sessionData.amount_total && (
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-primary-500" />
                    <div>
                      <p className="font-medium text-gray-800">
                        {formatCurrency(sessionData.amount_total, sessionData.currency || 'usd')}
                      </p>
                      <p className="text-gray-600">Amount Paid</p>
                    </div>
                  </div>
                )}
                
                {sessionData.created && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary-500" />
                    <div>
                      <p className="font-medium text-gray-800">
                        {formatDate(sessionData.created)}
                      </p>
                      <p className="text-gray-600">Purchase Date</p>
                    </div>
                  </div>
                )}
              </div>
              
              <p className="text-xs text-gray-500 mt-4">
                {isTestSessionId ? 'Test receipt generated' : 'Receipt sent to your email'}
              </p>
              
              {isTestSessionId && (
                <div className="mt-3 p-2 bg-blue-100 rounded border border-blue-200">
                  <p className="text-xs text-blue-800">
                    🧪 Test Mode - No real charges were made
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="space-y-4"
          >
            <Button 
              onClick={goToPremiumReport}
              size="lg"
              className="w-full transition-all duration-200 hover:scale-105 py-4 text-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white"
            >
              <BookOpen className="w-5 h-5 mr-2" />
              View & Download Your AI Report
            </Button>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800 font-medium mb-2">
                Your AI-Enhanced Report is Ready!
              </p>
              <p className="text-xs text-blue-700">
                Your personalized AI report has been generated and is ready for you to download.
              </p>
            </div>
            
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => navigate('/share')}
                className="flex-1"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share Results
              </Button>
              
              <Button
                variant="outline"
                onClick={() => navigate('/')}
                className="flex-1"
              >
                Return Home
              </Button>
            </div>
          </motion.div>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="mt-6 text-sm text-gray-500"
          >
            <p>
              Need help? Contact our support team at{' '}
              <a href={`mailto:${SUPPORT_EMAIL}`} className="text-primary-500 hover:text-primary-600">
                {SUPPORT_EMAIL}
              </a>
            </p>
          </motion.div>
        </Card>
      </motion.div>
    </div>
  );
}