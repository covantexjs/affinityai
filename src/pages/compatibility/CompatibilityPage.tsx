import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Heart, ArrowRight, Mail, User, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import GradientText from '../../components/ui/GradientText';
import { useQuizStore } from '../../store/quizStore';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 }
  }
};

const CompatibilityPage = () => {
  const { result } = useQuizStore();
  const navigate = useNavigate();
  const [partnerEmail, setPartnerEmail] = useState('');
  const [partnerName, setPartnerName] = useState('');
  const [inviteSent, setInviteSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!partnerEmail || !partnerName) {
      setError('Please fill in all fields');
      return;
    }
    
    setIsSubmitting(true);
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(partnerEmail)) {
      setError('Please enter a valid email address');
      return;
    }
    
    // In a real implementation, this would send an email invitation
    // For now, we'll just simulate success
    console.log('Sending invite to:', { name: partnerName, email: partnerEmail });
    
    setTimeout(() => {
      setInviteSent(true);
      setError(null);
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <Layout>
      <div className="min-h-screen pt-32 pb-20 px-4 bg-gradient-to-br from-primary-50 to-secondary-50">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="text-center mb-10"
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              <GradientText>Couples Compatibility</GradientText>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover how your romantic archetype aligns with your partner's and get personalized insights for your relationship
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <Card className="mb-8">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold mb-4">Unlock Your Couples Report</h2>
                <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                  Invite your partner to take the quiz and receive a comprehensive compatibility analysis tailored to your specific relationship dynamic.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4">What You'll Receive:</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Heart className="w-3 h-3 text-primary-600" />
                      </div>
                      <span className="text-gray-700">Comprehensive compatibility analysis between your archetypes</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Heart className="w-3 h-3 text-primary-600" />
                      </div>
                      <span className="text-gray-700">Personalized communication strategies for your specific pairing</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Heart className="w-3 h-3 text-primary-600" />
                      </div>
                      <span className="text-gray-700">Potential growth areas and challenges in your relationship</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Heart className="w-3 h-3 text-primary-600" />
                      </div>
                      <span className="text-gray-700">Custom exercises designed for your unique partnership</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Sparkles className="w-3 h-3 text-primary-600" />
                      </div>
                      <span className="text-gray-700">AI-generated insights about your specific relationship dynamic</span>
                    </li>
                  </ul>
                </div>

                {!inviteSent ? (
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Invite Your Partner</h3>
                    <form onSubmit={handleSendInvite} className="space-y-4">
                      <div>
                        <label htmlFor="partner-name" className="block text-sm font-medium text-gray-700 mb-1">
                          <User className="w-4 h-4 inline mr-1" />
                          Partner's Name
                        </label>
                        <input
                          type="text"
                          id="partner-name"
                          value={partnerName}
                          onChange={(e) => setPartnerName(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          placeholder="Enter your partner's name"
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="partner-email" className="block text-sm font-medium text-gray-700 mb-1">
                          <Mail className="w-4 h-4 inline mr-1" />
                          Partner's Email
                        </label>
                        <input
                          type="email"
                          id="partner-email"
                          value={partnerEmail}
                          onChange={(e) => setPartnerEmail(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          placeholder="Enter your partner's email"
                          required
                        />
                      </div>

                      {error && (
                        <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                          {error}
                        </div>
                      )}

                      <Button 
                        type="submit" 
                        className="w-full"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>Sending Invitation...</>
                        ) : (
                          <>Send Invitation <ArrowRight className="w-4 h-4 ml-2" /></>
                        )}
                      </Button>
                    </form>
                  </div>
                ) : (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Heart className="w-6 h-6 text-green-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-green-800 text-center mb-2">Invitation Sent!</h3>
                    <p className="text-green-700 text-center mb-4">
                      We've sent an invitation to {partnerName} at {partnerEmail}
                    </p>
                    <p className="text-sm text-green-600 text-center">
                      Once they complete the quiz, you'll both receive your compatibility report.
                    </p>
                  </div>
                )}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="font-semibold text-blue-800 mb-3">How It Works</h3>
                <ol className="space-y-2 text-blue-700">
                  <li className="flex items-start gap-2">
                    <span className="font-bold">1.</span>
                    <span>Your partner receives an email invitation to take the quiz</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold">2.</span>
                    <span>They complete the quiz to discover their own archetype</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold">3.</span>
                    <span>Our AI analyzes both archetypes and generates a personalized compatibility report</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold">4.</span>
                    <span>You both receive the report via email and can access it anytime</span>
                  </li>
                </ol>
              </div>
            </Card>

            <div className="text-center">
              <Link to="/results">
                <Button variant="outline">
                  Return to My Results
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default CompatibilityPage;