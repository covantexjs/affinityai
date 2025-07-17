import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, CheckCircle2, Download, FileText, Users, Star, Shield, CreditCard } from 'lucide-react';
import { fetchSessionData } from '../lib/stripe-session';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const SUPPORT_EMAIL = 'support@affinityai.me';

import GradientText from '../components/ui/GradientText';
import Layout from '../components/layout/Layout';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 }
  }
};

const ProtectedContentPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isVerifying, setIsVerifying] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [customerData, setCustomerData] = useState<any>(null);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    const paid = searchParams.get('paid');

    if (sessionId && paid === 'true') {
      verifyPayment(sessionId);
    }
  }, [searchParams]);

  const verifyPayment = async (sessionId: string) => {
    setIsVerifying(true);
    try {
      const sessionData = await fetchSessionData(sessionId);
      
      if (sessionData.success && sessionData.email) {
        setHasAccess(true);
        setCustomerData(sessionData);
      } else {
        setError('Payment verification failed');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to verify payment');
    } finally {
      setIsVerifying(false);
    }
  };

  const handlePurchaseAccess = async () => {
    try {
      const response = await fetch('/.netlify/functions/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: '',
          name: '',
          priceId: 'price_1RUs9qRuGbBleiQfhYV8HsAo', // Your existing price ID
          successUrl: `${window.location.origin}/protected-content?session_id={CHECKOUT_SESSION_ID}&paid=true`,
          cancelUrl: `${window.location.origin}/protected-content`
        }),
      });

      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError('Failed to create checkout session');
      }
    } catch (err: any) {
      setError(err.message || 'Payment failed');
    }
  };

  if (isVerifying) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <Card className="p-8">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-primary-500 animate-pulse" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Verifying Payment</h2>
              <p className="text-gray-600">Please wait while we confirm your access...</p>
            </Card>
          </motion.div>
        </div>
      </Layout>
    );
  }

  if (hasAccess) {
    return (
      <Layout>
        <div className="min-h-screen pt-32 pb-20 px-4">
          <div className="container mx-auto max-w-4xl">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
            >
              {/* Success Header */}
              <Card className="mb-8 text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-12 h-12 text-green-500" />
                </div>
                
                <h1 className="text-3xl font-bold mb-4">
                  <GradientText>Welcome to Premium Content!</GradientText>
                </h1>
                
                <p className="text-gray-600 mb-6">
                  Thank you for your purchase, {customerData?.name || 'valued customer'}! 
                  You now have access to our exclusive premium content.
                </p>

                {customerData && (
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <div className="flex items-center justify-center gap-4 text-sm">
                      <span className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-primary-500" />
                        Payment Confirmed
                      </span>
                      <span className="text-gray-400">•</span>
                      <span>{customerData.email}</span>
                    </div>
                  </div>
                )}
              </Card>

              {/* Premium Content */}
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <FileText className="w-8 h-8 text-primary-500" />
                    <h3 className="text-xl font-semibold">Exclusive Reports</h3>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Access to detailed industry reports and market analysis that are not available to the public.
                  </p>
                  <Button variant="outline" className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Download Reports
                  </Button>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Users className="w-8 h-8 text-primary-500" />
                    <h3 className="text-xl font-semibold">Community Access</h3>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Join our exclusive community of premium members for networking and discussions.
                  </p>
                  <Button variant="outline" className="w-full">
                    Join Community
                  </Button>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Star className="w-8 h-8 text-primary-500" />
                    <h3 className="text-xl font-semibold">Premium Tools</h3>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Advanced tools and calculators designed specifically for our premium members.
                  </p>
                  <Button variant="outline" className="w-full">
                    Access Tools
                  </Button>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Shield className="w-8 h-8 text-primary-500" />
                    <h3 className="text-xl font-semibold">Priority Support</h3>
                  </div>
                  <p className="text-gray-600 mb-3">
                    Get priority customer support and direct access to our expert team via email.
                  </p>
                  <a href={`mailto:${SUPPORT_EMAIL}`} className="block w-full">
                    <Button variant="outline" className="w-full">
                      Contact Support
                    </Button>
                  </a>
                  <p className="text-xs text-gray-500 mt-2 text-center">{SUPPORT_EMAIL}</p>
                </Card>
              </div>

              {/* Additional Premium Content */}
              <Card className="p-8">
                <h2 className="text-2xl font-bold mb-6 text-center">
                  <GradientText>Premium Content Library</GradientText>
                </h2>
                
                <div className="prose prose-gray max-w-none">
                  <p className="text-lg text-gray-700 mb-6">
                    Welcome to our exclusive content library! As a premium member, you have access to:
                  </p>
                  
                  <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-primary-50 to-secondary-50 p-6 rounded-lg">
                      <h4 className="font-semibold text-primary-600 mb-2">Advanced Tutorials</h4>
                      <p className="text-sm text-gray-600">
                        Step-by-step guides that go beyond the basics, with real-world examples and best practices.
                      </p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-secondary-50 to-primary-50 p-6 rounded-lg">
                      <h4 className="font-semibold text-secondary-600 mb-2">Exclusive Webinars</h4>
                      <p className="text-sm text-gray-600">
                        Monthly live sessions with industry experts, plus access to our complete webinar archive.
                      </p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-primary-50 to-secondary-50 p-6 rounded-lg">
                      <h4 className="font-semibold text-primary-600 mb-2">Premium Templates</h4>
                      <p className="text-sm text-gray-600">
                        Professional templates and resources that you can use in your own projects.
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold mb-4">What's Included in Your Membership:</h3>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                        <span>Unlimited access to all premium content</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                        <span>Monthly exclusive webinars and Q&A sessions</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                        <span>Downloadable resources and templates</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                        <span>Priority email support</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                        <span>Access to premium community forum</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </Layout>
    );
  }

  // Payment required view
  return (
    <Layout>
      <div className="min-h-screen pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-3xl">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="text-center"
          >
            <Card className="p-8">
              <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Lock className="w-10 h-10 text-primary-500" />
              </div>
              
              <h1 className="text-3xl font-bold mb-4">
                <GradientText>Premium Content Access</GradientText>
              </h1>
              
              <p className="text-lg text-gray-600 mb-8">
                This content is reserved for our premium members. Get instant access with a one-time payment.
              </p>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <p className="text-red-700">{error}</p>
                </div>
              )}

              <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-xl p-6 mb-8">
                <h3 className="text-xl font-semibold mb-4">What You'll Get:</h3>
                <div className="grid md:grid-cols-2 gap-4 text-left">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                    <span className="text-sm">Exclusive premium content library</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                    <span className="text-sm">Advanced tutorials and guides</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                    <span className="text-sm">Monthly exclusive webinars</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                    <span className="text-sm">Premium templates and resources</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                    <span className="text-sm">Priority customer support</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                    <span className="text-sm">Community forum access</span>
                  </div>
                </div>
              </div>

              <div className="text-center mb-8">
                <div className="text-3xl font-bold text-primary-500 mb-2">$19</div>
                <p className="text-gray-600">One-time payment • Lifetime access</p>
              </div>

              <Button 
                onClick={handlePurchaseAccess}
                size="lg"
                className="w-full mb-4"
              >
                <CreditCard className="w-5 h-5 mr-2" />
                Get Instant Access
              </Button>

              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <Shield className="w-4 h-4" />
                <span>Secure payment powered by Stripe</span>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default ProtectedContentPage;