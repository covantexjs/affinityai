import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuizStore } from '../../store/quizStore';
import ShareableCard from '../../components/share/ShareableCard';

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

export const SharePage = () => {
  const navigate = useNavigate();
  const { result, previewMode, setPreviewMode } = useQuizStore();
  
  useEffect(() => {
    if (!result && !previewMode) {
      navigate('/quiz');
    }
  }, [result, previewMode, navigate]);
  
  if (!result) {
    return null;
  }
  
  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-20 px-4">
      <div className="container mx-auto">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="text-center mb-10"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Share Your Results
          </h1>
          <p className="text-lg text-gray-600">
            Let others discover their romantic archetype too
          </p>
        </motion.div>
        
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          <ShareableCard archetype={result.archetype} />
        </motion.div>
      </div>
    </div>
  );
};