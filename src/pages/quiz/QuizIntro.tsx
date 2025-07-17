import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Clock, Shield, Heart } from 'lucide-react';
import { useQuizStore } from '../../store/quizStore';
import Button from '../../components/ui/Button';
import GradientText from '../../components/ui/GradientText';
import Card from '../../components/ui/Card';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
    },
  },
};

export const QuizIntro = () => {
  const navigate = useNavigate();
  const { setPreviewMode } = useQuizStore();

  const handlePreviewClick = () => {
    setPreviewMode(true);
    navigate('/results');
  };
  
  return (
    <div className="min-h-screen pt-32 pb-20 px-4">
      <div className="container mx-auto max-w-3xl">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="text-center mb-10"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Discover Your <GradientText>Romantic Archetype</GradientText>
          </h1>
          
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Answer 15 questions to uncover how you love, connect, and relate in relationships
          </p>
        </motion.div>
        
        <Card className="mb-8">
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="mt-1">
                <Clock className="w-6 h-6 text-primary-500" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Takes about 5 minutes</h3>
                <p className="text-gray-600">
                  The quiz is quick but insightful. Answer thoughtfully for the most accurate results.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="mt-1">
                <Shield className="w-6 h-6 text-primary-500" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Your privacy is protected</h3>
                <p className="text-gray-600">
                  We don't store your personal information. Your responses are used only to generate your results.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="mt-1">
                <Heart className="w-6 h-6 text-primary-500" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Scientifically informed</h3>
                <p className="text-gray-600">
                  Our assessment is based on relationship research and psychological principles.
                </p>
              </div>
            </div>
          </div>
        </Card>
        
        <div className="text-center space-y-4">
          <Link to="/quiz/questions">
            <Button size="lg">
              Begin the Quiz
            </Button>
          </Link>

          <div>
            <button 
              onClick={handlePreviewClick}
              className="text-primary-500 hover:text-primary-600 text-sm font-medium"
            >
              Preview Results
            </button>
          </div>
          
          <p className="mt-4 text-sm text-gray-500">
            No sign-up required. Your results will be available immediately.
          </p>
        </div>
      </div>
    </div>
  );
};