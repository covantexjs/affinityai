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
  Download
} from 'lucide-react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { useQuizStore } from '../../store/quizStore';
import { initiateCheckout } from '../../lib/stripe';
import { products } from '../../stripe-config';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import GradientText from '../../components/ui/GradientText';
import EnhancedLoveBlueprint from '../../components/pdf/EnhancedLoveBlueprint';

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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  
  useEffect(() => {
    if (!result) {
      setTestMode();
    }
  }, [result, setTestMode]);
  
  if (!result) {
    return null;
  }
  
  const { archetype } = result;
  const product = products[0]; // We only have one product
  
  const handlePurchase = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await initiateCheckout();
    } catch (err: any) {
      setError(err.message || 'Unable to process payment. Please try again later.');
      setIsLoading(false);
    }
  };

  const handlePreview = () => {
    setShowPreview(true);
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
        
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div variants={fadeIn}>
            <Card className="mb-8">
              <h2 className="text-2xl font-bold mb-6">Your Premium Report Includes:</h2>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <FileText className="w-8 h-8 text-primary-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">10-15 Page Personalized Report</h3>
                    <p className="text-gray-600">
                      Detailed insights into your {archetype.name} archetype, including communication patterns, emotional triggers, and growth areas.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <Users className="w-8 h-8 text-primary-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Compatibility Radar</h3>
                    <p className="text-gray-600">
                      Detailed compatibility insights with all archetypes, plus the ability to invite a partner to generate a personalized compatibility report.
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
                      Personalized prompts to help you navigate difficult conversations and deepen your connections, based on your unique archetype.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 relative">
                <div className="bg-gray-50 p-4 rounded-lg text-gray-700 text-sm">
                  <p>Your {archetype.name} archetype reveals a natural tendency toward deep emotional processing and meaningful connection. Unlike other archetypes, you approach relationships with a blend of...</p>
                  <div className="mt-4">
                    <h4 className="font-semibold">Key Growth Opportunities:</h4>
                    <ul className="mt-2 space-y-1">
                      <li>• Learning to balance emotional depth with practical...</li>
                      <li>• Developing strategies for communicating your needs...</li>
                      <li>• Recognizing when your idealism may be creating...</li>
                    </ul>
                  </div>
                </div>
                
                <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center rounded-lg">
                  <div className="flex items-center gap-2 text-primary-500 font-medium">
                    <Lock className="w-5 h-5" />
                    <span>Unlock to view full content</span>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
          
          <motion.div variants={fadeIn}>
            <Card className="bg-gradient-primary text-white">
              <div className="flex flex-col sm:flex-row gap-6 items-center">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-2">{product.name}</h3>
                  <p className="opacity-90 mb-4">
                    {product.description}
                  </p>
                  <ul className="mb-6 space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                      <span>One-time purchase, lifetime access</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                      <span>30-day money-back guarantee</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                      <span>Instant digital delivery</span>
                    </li>
                  </ul>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">${product.price}</div>
                  <div className="space-y-2">
                    <Button
                      className="bg-white text-primary-500 hover:bg-gray-100 disabled:bg-gray-200 disabled:cursor-not-allowed min-w-[200px]"
                      onClick={handlePurchase}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin mr-2" />
                          Processing...
                        </>
                      ) : (
                        'Get Your Full Report'
                      )}
                    </Button>

                    {!showPreview && (
                      <Button
                        variant="ghost"
                        className="bg-white/10 text-white hover:bg-white/20 min-w-[200px]"
                        onClick={handlePreview}
                      >
                        Preview Sample
                      </Button>
                    )}

                    {showPreview && (
                      <PDFDownloadLink
                        document={<EnhancedLoveBlueprint archetype={archetype} />}
                        fileName={`${archetype.name.toLowerCase().replace(/\s+/g, '-')}-preview.pdf`}
                      >
                        {({ loading }) => (
                          <Button
                            variant="ghost"
                            className="bg-white/10 text-white hover:bg-white/20 min-w-[200px]"
                            disabled={loading}
                          >
                            {loading ? (
                              <>
                                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                Preparing...
                              </>
                            ) : (
                              <>
                                <Download className="w-5 h-5 mr-2" />
                                Download Preview
                              </>
                            )}
                          </Button>
                        )}
                      </PDFDownloadLink>
                    )}
                  </div>
                  
                  {error && (
                    <p className="text-sm text-red-200 mt-2">
                      {error}
                    </p>
                  )}
                  
                  <p className="text-sm mt-4 opacity-90">
                    Secure payment powered by Stripe
                  </p>
                </div>
              </div>
            </Card>
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

export default PremiumPage;