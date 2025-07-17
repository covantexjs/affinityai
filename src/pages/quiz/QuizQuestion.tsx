import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useQuizStore } from '../../store/quizStore';
import { quizQuestions } from '../../data/questions';
import Button from '../../components/ui/Button';
import QuestionCard from '../../components/quiz/QuestionCard';
import ProgressBar from '../../components/quiz/ProgressBar';

export const QuizQuestion = () => {
  const navigate = useNavigate();
  const { questionIndex } = useParams();
  const { 
    currentQuestionId, 
    answers, 
    setAnswer, 
    nextQuestion, 
    prevQuestion,
    result,
    previewMode
  } = useQuizStore();
  
  // Redirect to results if in preview mode
  useEffect(() => {
    if (previewMode) {
      navigate('/results');
    }
  }, [previewMode, navigate]);
  
  // If the quiz is completed and we have results, go to the results page
  useEffect(() => {
    if (result) {
      navigate('/results');
    }
  }, [result, navigate]);
  
  const currentQuestion = quizQuestions.find(q => q.id === currentQuestionId);
  const currentAnswer = answers[currentQuestionId];
  const isLastQuestion = currentQuestionId === quizQuestions.length;
  const isFirstQuestion = currentQuestionId === 1;
  
  // If we somehow don't have a current question, go back to the intro
  if (!currentQuestion) {
    navigate('/quiz');
    return null;
  }
  
  const handleNextClick = () => {
    if (isLastQuestion) {
      // If this is the last question, calculate results
      nextQuestion();
    } else {
      // Otherwise, just go to the next question
      nextQuestion();
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 pt-16 pb-20 px-4">
      <div className="container mx-auto max-w-3xl">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2 text-sm">
            <span className="text-gray-500">Question {currentQuestionId} of {quizQuestions.length}</span>
            <span className="font-medium text-primary-500">{Math.round((currentQuestionId / quizQuestions.length) * 100)}%</span>
          </div>
          <ProgressBar current={currentQuestionId} total={quizQuestions.length} />
        </div>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionId}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <QuestionCard
              question={currentQuestion}
              value={currentAnswer}
              onChange={(value) => setAnswer(currentQuestionId, value)}
            />
          </motion.div>
        </AnimatePresence>
        
        <div className="mt-8 flex justify-between">
          <Button
            variant="outline"
            onClick={prevQuestion}
            disabled={isFirstQuestion}
            className={isFirstQuestion ? 'opacity-0 pointer-events-none' : ''}
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Previous
          </Button>
          
          <Button
            onClick={handleNextClick}
            disabled={!currentAnswer}
          >
            {isLastQuestion ? 'See Results' : 'Next'} <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuizQuestion;