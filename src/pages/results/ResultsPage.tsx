import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Share2, ArrowRight, CheckCircle2, Lock, Users } from 'lucide-react';
import { useQuizStore } from '../../store/quizStore';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import GradientText from '../../components/ui/GradientText';

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

export const ResultsPage = () => {
  const navigate = useNavigate();
  const { result, resetQuiz, setPreviewMode, previewMode } = useQuizStore();
  
  useEffect(() => {
    if (!result && !previewMode) {
      navigate('/quiz');
    }
  }, [result, previewMode, navigate]);
  
  if (!result) {
    return null;
  }
  
  const { archetype } = result;
  
  const handleReset = () => {
    if (previewMode) {
      setPreviewMode(false);
      navigate('/quiz');
    } else {
      resetQuiz();
      navigate('/quiz');
    }
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
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Your Romantic Archetype
            </h1>
            <p className="text-lg text-gray-600">
              Discover how you love, connect, and relate
            </p>
          </motion.div>
        </motion.div>
        
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          {/* Free Result Section */}
          <motion.div variants={fadeIn}>
            <Card className="mb-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-primary"></div>
              
              <div className="text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-primary-500 mb-3">
                  {archetype.name}
                </h2>
                <p className="text-xl italic text-secondary-500 mb-8">
                  "{archetype.tagline}"
                </p>
                
                <div className="flex flex-wrap justify-center gap-3 mb-8">
                  {archetype.keywords.map((keyword, index) => (
                    <span 
                      key={index}
                      className="px-4 py-2 bg-gray-100 text-gray-800 rounded-full text-sm font-medium"
                    >
                      {keyword.text} {keyword.emoji}
                    </span>
                  ))}
                </div>
                
                <p className="text-gray-700 text-lg max-w-2xl mx-auto mb-8">
                  {archetype.description}
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-6 mb-8">
                <h3 className="font-semibold text-xl text-primary-500 mb-3">
                  Your Top Matches
                </h3>
                <div className="flex flex-wrap justify-center gap-3">
                  {archetype.compatibleWith.map((match, index) => (
                    <span 
                      key={index}
                      className="px-4 py-2 bg-white shadow-sm rounded-full text-gray-800"
                    >
                      {match}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/share"
                  className="flex-1"
                >
                  <Button 
                    variant="outline"
                    className="w-full"
                  >
                    <Share2 className="w-4 h-4 mr-2" /> Share Your Results
                  </Button>
                </Link>
                
                <Button 
                  variant="outline"
                  className="flex-1"
                  onClick={handleReset}
                >
                  {previewMode ? 'Take Quiz Now' : 'Take Quiz Again'}
                </Button>
              </div>
            </Card>
          </motion.div>
          
          {/* Premium Teaser Section */}
          <motion.div variants={fadeIn}>
            <Card className="relative border-2 border-dashed border-primary-200 bg-gradient-to-br from-primary-50 to-secondary-50">
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold mb-3">
                  <GradientText>Unlock Your Complete Love Blueprint</GradientText>
                </h2>
                <p className="text-gray-600">
                  Discover the full depth of your {archetype.name} archetype with our premium insights.
                </p>
              </div>
              
              <div className="space-y-6 mb-8">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-primary-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">10-15 Page Personalized Report</h3>
                    <p className="text-gray-600">
                      Detailed insights into your relationship patterns, communication style, and growth areas.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-primary-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Compatibility Radar</h3>
                    <p className="text-gray-600">
                      Invite a partner to see how you align across 5 key dimensions.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-primary-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">AI-Generated Conversation Starters</h3>
                    <p className="text-gray-600">
                      Tailored prompts for deeper connection with potential matches.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Preview Section */}
              <div className="bg-white rounded-xl p-6 mb-8 relative">
                <p className="text-gray-700 mb-4">
                  Here's a glimpse of what your full report includes:
                </p>
                <div className="text-gray-600 space-y-4">
                  <p>
                    As a {archetype.name}, your greatest strength is your ability to see the poetry in everyday moments. You create meaning through storytelling and shared experiences, which makes you an incredibly engaging and emotionally intelligent partner. However, your tendency to romanticize can sometimes lead to...
                  </p>
                  <div>
                    <h4 className="font-semibold mb-2">Key Growth Opportunities:</h4>
                    <ul className="space-y-1 text-gray-500">
                      <li>• Learning to balance emotional depth with practical...</li>
                      <li>• Developing strategies for communicating your needs...</li>
                      <li>• Recognizing when your idealism may be creating...</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="text-center mb-8">
                <p className="text-2xl mb-2">
                  One-time purchase: <span className="font-bold text-primary-500">$19</span>
                </p>
                <p className="text-gray-500 text-sm">
                  Satisfaction guaranteed or your money back
                </p>
                <p className="text-sm text-primary-600 mt-2">
                  <span className="font-medium">NEW!</span> Invite your partner to take the quiz and get a <span className="font-medium">free Couples Compatibility Report</span>
                </p>
               <p className="text-sm text-primary-600 mt-2">
                 <span className="font-medium">NEW!</span> Invite your partner to take the quiz and get a <span className="font-medium">free Couples Compatibility Report</span>
               </p>
              </div>
              
              <Link to="/premium">
                <Button className="w-full" size="lg">
                  Get Your Full Report <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              
              <Link 
                to="/compatibility"
                className="flex-1"
              >
                <Button 
                  variant="outline"
                  className="w-full"
                >
                  <Users className="w-4 h-4 mr-2" /> Couples Mode
                </Button>
              </Link>
              
              <Link 
                to="/compatibility"
                className="flex-1"
              >
                <Button 
                  variant="outline"
                  className="w-full"
                >
                  <Users className="w-4 h-4 mr-2" /> Couples Mode
                </Button>
              </Link>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};